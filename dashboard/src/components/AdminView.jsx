'use client';
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import AssignmentModal from './AssignmentModal';
import ReusableModal from './ReusableModal';
import useAdminData from '../hooks/useAdminData';
import { createEvent } from '@/utils/api';
import axios from 'axios';
import { toast } from 'sonner';
export default function AdminView() {
  const {
    supervisors,
    tickets,
    filteredTickets,
    events,
    selectedTicket,
    selectedSupervisor,
    showAssignmentModal,
    expenses,
    setEvents,
    setSelectedSupervisor,
    handleAssign,
    openAssignmentModal,
    closeAssignmentModal,
    filterTickets,
  } = useAdminData();

  const [filter, setFilter] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // State for the selected announcement
  const [currentUser, setCurrentUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    clerkId: '',
    role: '',
  });
  const user = useUser();
  useEffect(() => {
    if (user.user) {
      setCurrentUser({
        firstName: user.user.firstName,
        lastName: user.user.lastName,
        email: user.user.emailAddresses[0].emailAddress,
        clerkId: user.user.id,
        role: user.user.publicMetadata.role,
      });
    }
  }, [user.isLoaded]);

  // Filter tickets when the filter input changes
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    filterTickets(value);
  };
  const deleteEvenet = async (eventId) => {
    try {
      await axios.delete(`/api/events?id=${eventId}`);
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
      toast.success('Event deleted successfully');
    }
    catch (err) {
      toast.error('Failed to delete event');
    }
  };
  const ticketColumns = [
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'subcategory', header: 'Subcategory' },
    { accessorKey: 'description', header: 'Description' },
    {
      accessorKey: 'assignedTo',
      header: 'Assigned To',
      cell: ({ row }) =>
        row.original.assignedTo
          ? `${row.original.assignedTo.firstName} ${row.original.assignedTo.lastName}`
          : 'Unassigned',
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          onClick={() => openAssignmentModal(row.original._id)}

        >
          Assign
        </Button>
      ),
    },
  ];

  const eventColumns = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'description', header: 'Description' },
    {
      accessorKey: 'createdAt',
      header: 'Posted On',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
    {
      accessorKey: 'readBy',
      header: 'Read By',
      cell: ({ row }) => `${row.original.readBy.length} users`,
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          onClick={() => deleteEvenet(row.original._id)}
          variant="destructive"
        >
          Delete
        </Button>
      ),
    },
  ];

  // Calculate ticket statistics
  const totalTickets = tickets.length;
  const assignedTickets = tickets.filter(ticket => ticket.assignedTo).length;
  const unassignedTickets = totalTickets - assignedTickets;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalTickets}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Assigned Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{assignedTickets}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unassigned Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{unassignedTickets}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Events, Tickets, and Expenses */}
      <Tabs defaultValue="events" className="space-y-6">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card className="p-6 space-y-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Announcements</CardTitle>
                <Button variant="default" size="sm" onClick={() => setSelectedEvent({ isNew: true })}>
                  New Announcement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={eventColumns}
                data={events}
                onRowClick={(row) => setSelectedEvent(row.original)} // Open modal on row click
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tickets Tab */}
        <TabsContent value="tickets">
          <Card className="p-6 space-y-6">
            <CardHeader>
              <CardTitle>Tickets</CardTitle>
              <CardContent>Manage and assign tickets for your team.</CardContent>
            </CardHeader>
            <CardContent>
              <DataTable columns={ticketColumns} data={filteredTickets} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses">
          <Card className="p-6 space-y-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Expenses</CardTitle>
                <Button variant="default" size="sm" onClick={() => setSelectedEvent({ isNew: true })}>
                  New Expense
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              Expense Data
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assignment Modal */}
      <AssignmentModal
        show={showAssignmentModal}
        supervisors={supervisors}
        selectedSupervisor={selectedSupervisor}
        setSelectedSupervisor={setSelectedSupervisor}
        handleAssign={handleAssign}
        closeModal={closeAssignmentModal}
      />

      {/* Reusable Modal for Announcements */}
      {selectedEvent && (
        <ReusableModal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.isNew ? 'New Announcement' : selectedEvent.title}
          description={
            selectedEvent.isNew
              ? 'Fill in the details to create a new announcement.'
              : selectedEvent.description
          }
          extraContent={
            selectedEvent.isNew ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createEvent(selectedEvent.title, selectedEvent.description, currentUser);
                  setSelectedEvent(null);
                }}
                className="space-y-4"
              >
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full border rounded p-2"
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
                />
                <textarea
                  placeholder="Description"
                  className="w-full border rounded p-2"
                  rows="4"
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
                />
                <Button type="submit">Create</Button>
              </form>
            ) : (
              <div>
                <p>
                  <strong>Posted On:</strong> {new Date(selectedEvent.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Read By:</strong> {selectedEvent.readBy.length} users
                </p>
              </div>
            )
          }
        />
      )}
    </div>
  );
}