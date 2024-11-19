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

type DeleteTicketProps = {
    rowSelect: number;
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onDeleteSuccess: () => void;
};

export function DeleteTicket({ rowSelect, isDialogOpen, setIsDialogOpen, onDeleteSuccess }: DeleteTicketProps) {

    const deleteTicket = async (
        event: React.MouseEvent<HTMLButtonElement>,
        rowSelect: number,
    ) => {
        event.preventDefault();

        try {
            const response = await fetch(`http://18.171.174.40:8080/api/tickets/${rowSelect}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete the Ticket');
            }
            console.log(`Ticket with ID ${rowSelect} deleted successfully`);
            onDeleteSuccess();
        } catch (error) {
            console.error('Error deleting Ticket:', error);
        }
    };

    return (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)} variant="destructive">Delete Ticket</Button>
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
                        onClick={(event) => deleteTicket(event, rowSelect)}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}