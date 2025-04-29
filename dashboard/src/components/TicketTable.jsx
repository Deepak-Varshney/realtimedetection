import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function TicketTable({ tickets, openAssignmentModal }) {
  return (
    <Card className="p-6 space-y-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Tickets</CardTitle>
          <CardDescription>Manage and assign tickets for your team.</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {tickets.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Subcategory</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket._id}>
                  <TableCell>{ticket.category}</TableCell>
                  <TableCell>{ticket.subcategory}</TableCell>
                  <TableCell>{ticket.description}</TableCell>
                  <TableCell>
                    {ticket.assignedTo
                      ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                      : 'Unassigned'}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => openAssignmentModal(ticket._id)}
                      className="text-blue-500 hover:underline"
                    >
                      Assign
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500">No tickets available</p>
        )}
      </CardContent>
    </Card>
  );
}