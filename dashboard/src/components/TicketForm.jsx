import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

// Import the flattened options array
import { flattenedOptions } from "@/utils/ticketOptions";

export default function TicketForm() {
    const form = useForm();

    // Watch the category to update subcategories dynamically
    const selectedCategory = form.watch("category");
    const createTicket = async (category, description, subcategory) => {
        try {
            const res = await axios.post('/api/tickets', { category, description, subcategory });
            console.log("Ticket creation response:", res); // Log the response
            toast.success('Ticket created successfully');
        } catch (error) {
            console.error("Error in creating ticket:", error); // Log the error
            toast.error('Failed to create ticket');
        }
    };

    async function onSubmit(values) {
        try {
            console.log("Form values:", values);
            await createTicket(values.category, values.description, values.subcategory);
        } catch (error) {
            console.error("Form submission error", error); // Log any form submission error
            toast.error("Failed to submit the form. Please try again.");
        }
    }

    // Filter the flattened options based on selected category
    const filteredSubcategories = flattenedOptions.filter(option => option.category === selectedCategory);

    // Get unique categories for the category select dropdown
    const categories = [...new Set(flattenedOptions.map(option => option.category))];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl className="w-80">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                        </FormControl>
                                          <SelectContent className="w-80">
                                            {/* Dynamically render category options */}
                                            {categories.map((category, index) => (
                                                <SelectItem key={index} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Select The Category of Issue</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="subcategory"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sub Category</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!selectedCategory}  // This disables the subcategory select until a category is chosen
                            >
                                <FormControl className="w-80">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Subcategory" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="w-80">
                                    {/* Dynamically render subcategory options based on selected category */}
                                    {filteredSubcategories.map(option => (
                                        <SelectItem key={option.id} value={option.subcategory}>
                                            {option.subcategory}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>Provide Sub Category</FormDescription>
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
                                    placeholder="Instructions for us"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>Provide additional info on issue</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
