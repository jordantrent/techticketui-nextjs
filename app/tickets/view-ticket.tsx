
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Maximize2 } from "lucide-react";
import { CustomerDetails } from "./components/customer-details-card";
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { useState, useEffect } from 'react';
import { Ticket } from "./columns";
import { TicketDetails } from "./components/ticket-details-card";
import { DeleteTicket } from "./components/delete-ticket";

interface ViewTicketProps {
    rowSelect: number;
}

export default function ViewTicket({ rowSelect }: ViewTicketProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogClose = () => {
        console.log("Dialog will be closed");
        setIsDialogOpen(false);
    }
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon"><Maximize2 className="h-4 w-4"/></Button>
            </DialogTrigger>
            <DialogContent className="max-w-[800px] max-h-[800px] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Ticket #{rowSelect}</DialogTitle>
                </DialogHeader>
                <div className="flex py-4">
                    <div className="grid grid-cols-4 flex-row gap-4">
                        <div className= "grid grid-rows-2 gap-4 col-span-2">
                            <TicketDetails rowSelect={rowSelect} className="" />
                        </div>
                        <div className="col-span-2">
                            <TicketImages rowSelect={rowSelect} />
                            <CustomerDetails rowSelect={rowSelect} className="" />
                            <div className="justify-self-end mt-4">
                            <DeleteTicket
                                rowSelect={rowSelect}
                                isDialogOpen={isDialogOpen}
                                setIsDialogOpen={setIsDialogOpen}
                                    onDeleteSuccess={handleDialogClose}
                                    
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function TicketImages({ rowSelect }: ViewTicketProps) {
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    useEffect(() => {
        const fetchTicketImages = async () => {
            try {
                const response = await fetch(`http://18.171.174.40:8080/api/tickets/${rowSelect}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch ticket data');
                }
                const ticketData = await response.json();
                const imagePaths = ticketData.imagePath ? ticketData.imagePath.split(',') : [];
                setImageUrls(imagePaths);
            } catch (error) {
                console.error('Error fetching ticket data:', error);
            }
        };

        if (rowSelect) {
            fetchTicketImages();
        }
    }, [rowSelect]); 

    return (
        <Carousel>
            <CarouselContent>
                {imageUrls.length > 0 ? (
                    imageUrls.map((url, index) => (
                        <CarouselItem key={index}>
                            <div className="p-1">
                                <img src={url} alt={`Ticket Image ${index + 1}`} className="aspect-square w-full h-full object-cover" />
                            </div>
                        </CarouselItem>
                    ))
                ) : (
                    <CarouselItem>
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <span className="text-4xl font-semibold">No images available</span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}

