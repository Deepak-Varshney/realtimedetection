"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function ViewTicket({ ticket, triggerText = "View Ticket" }) {
  return (
    <Dialog>
      <DialogTrigger className="underline cursor-pointer">{triggerText}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ticket: {ticket.category}</DialogTitle>
          <DialogDescription>
            {ticket.description}
          </DialogDescription>

          <div className="mt-4 text-sm text-gray-500 space-y-1">
            <p><strong>Subcategory:</strong> {ticket.subcategory}</p>
            <p><strong>Status:</strong> {ticket.status}</p>
            <p><strong>Created By:</strong> {ticket.createdBy}</p>
            <p><strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(ticket.updatedAt).toLocaleString()}</p>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
