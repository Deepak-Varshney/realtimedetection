"use client"

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import axios from "axios"
import { flattenedOptions } from "@/utils/ticketOptions"

export function TicketFormAlertDialog({ triggerText = "Create Ticket", onTicketCreated }) {
  const form = useForm()
  const selectedCategory = form.watch("category")

  const categories = [...new Set(flattenedOptions.map(opt => opt.category))]
  const filteredSubcategories = flattenedOptions.filter(
    opt => opt.category === selectedCategory
  )

  const createTicket = async (data) => {
    try {
      const res = await axios.post("/api/tickets", data)
      if (onTicketCreated) onTicketCreated(res)
      toast.success("Ticket created successfully")
    } catch (error) {
      console.error("Ticket creation error:", error)
      toast.error("Failed to create ticket")
      throw error // re-throw to prevent dialog auto-close
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="cursor-pointer">{triggerText}</button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Create a New Ticket</AlertDialogTitle>
          <AlertDialogDescription>
            Fill out the following information to submit a ticket.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              try {
                await createTicket(values)
              } catch {
                // prevent dialog from closing
                throw new Error("Submission failed")
              }
            })}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat, i) => (
                        <SelectItem key={i} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedCategory}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subcategory" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredSubcategories.map(opt => (
                        <SelectItem key={opt.id} value={opt.subcategory}>
                          {opt.subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Info</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide more details..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction type="submit">Submit</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
