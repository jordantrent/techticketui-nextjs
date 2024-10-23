
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Expand, Maximize2Icon, Maximize2 } from "lucide-react";
import { CustomerDetails } from "./components/customer-details-card";
import { TicketImages } from "./components/image-carousel";

export default function ViewTicket({ rowSelect }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon"><Maximize2 className="h-4 w-4"/></Button>
            </DialogTrigger>
            <DialogContent className="max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Ticket #1000</DialogTitle>
                </DialogHeader>
                <div className="flex py-4">
                    <div className="grid grid-cols-4 flex-row gap-4">
                        <div className= " grid grid-rows-2 gap-4 col-span-2">
                            <CustomerDetails className=""/>
                            <CustomerDetails className=""/>
                        </div>
                        <div className="col-span-2">
                            <TicketImages />
                        </div>
                        <CustomerDetails className="col-span-4" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
