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
            console.log(`Initiating deletion process for Employee ID: ${employeeId}`);

            console.log(`Calling unassign-tickets API for Employee ID: ${employeeId}`);
            const unassignResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/employees/${employeeId}/unassign-tickets`,
                { method: 'PUT' }
            );

            if (!unassignResponse.ok) {
                const errorDetails = await unassignResponse.text();
                console.error(`Unassign Tickets API Failed: ${errorDetails}`);
                throw new Error(`Failed to unassign tickets: ${errorDetails}`);
            }
            console.log('Tickets successfully unassigned.');

        
            console.log(`Calling delete API for Employee ID: ${employeeId}`);
            const deleteResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/employees/${employeeId}`,
                { method: 'DELETE' }
            );

            if (!deleteResponse.ok) {
                const errorDetails = await deleteResponse.text();
                console.error(`Delete Employee API Failed: ${errorDetails}`);
                throw new Error(`Failed to delete employee: ${errorDetails}`);
            }

            console.log(`Employee with ID ${employeeId} deleted successfully`);
            onDeleteSuccess();
        } catch (error) {
    
            console.error(`Error during employee deletion: ${error}`);
            alert(`Error: ${error.message}`);
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