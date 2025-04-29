import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AssignmentModal({
  show,
  supervisors,
  selectedSupervisor,
  setSelectedSupervisor,
  handleAssign,
  closeModal,
}) {
  if (!show) return null;

  return (
    <AlertDialog open={show} onOpenChange={closeModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Assign Ticket</AlertDialogTitle>
          <AlertDialogDescription>
            Select a supervisor to assign the ticket.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Supervisor
          </label>
          <select
            value={selectedSupervisor?._id || ''}
            onChange={(e) => {
              const selected = supervisors.find(sup => sup._id === e.target.value);
              setSelectedSupervisor(selected || '');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">-- Select Supervisor --</option>
            {supervisors.map(sup => (
              <option key={sup._id} value={sup._id}>
                {sup.firstName} {sup.lastName}
              </option>
            ))}
          </select>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeModal}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              handleAssign();
              closeModal();
            }}
            disabled={!selectedSupervisor}
          >
            Assign
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}