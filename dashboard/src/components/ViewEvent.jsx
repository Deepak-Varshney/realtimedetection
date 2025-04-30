"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function EventDialog({ event, triggerText = "View Details" }) {
  return (
    <Dialog>
      <DialogTrigger className="underline cursor-pointer">{triggerText}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          <DialogDescription>
            {event.description}
          </DialogDescription>

          <div className="mt-4 text-sm text-gray-500">
            <p><strong>Created By:</strong> {event.createdBy.firstName} {event.createdBy.lastName} ({event.createdBy.email})</p>
            <p><strong>Created At:</strong> {new Date(event.createdAt).toLocaleString()}</p>
          </div>

        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
