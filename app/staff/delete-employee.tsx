import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useState } from 'react';

type DeleteEmployeeProps = {
    employeeId: number;
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onDeleteSuccess: () => void;
};

export function DeleteEmployee({ employeeId, isDialogOpen, setIsDialogOpen, onDeleteSuccess }: DeleteEmployeeProps) {

    const deleteEmployee = async (
        event: React.MouseEvent<HTMLButtonElement>,
        employeeId: number,
    ) => {
        event.preventDefault();

        try {
            const response = await fetch(`http://localhost:8080/api/employees/${employeeId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete the employee');
            }
            console.log(`Employee with ID ${employeeId} deleted successfully`);
            onDeleteSuccess();  // Close the dialog after successful deletion
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    return (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)} variant="destructive">Delete Employee</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(event) => deleteEmployee(event, employeeId)} 
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}