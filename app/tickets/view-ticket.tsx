
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
            <DialogContent className="max-w-[800px] max-h-[900px] flex flex-col">
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
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${rowSelect}`);
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
        <>
            
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
            <ImageUpload rowSelect={rowSelect} />
            </>
    );
}

type UploadResponse = {
    uploadURL: string;
    objectKey: string;
};

type ImageUploadProps = {
    rowSelect: number;

};

const ImageUpload: React.FC<ImageUploadProps> = ({ rowSelect }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [ticketData, setTicketData] = useState<Ticket | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        setFile(selectedFile);
        setSuccess(false);
        setError(null);
    };


    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        try {
            setUploading(true);
            console.log('Starting the upload process');

            const apiUrl = 'https://majhdtduxl.execute-api.eu-west-2.amazonaws.com/getUploadUrl';
            console.log(`Requesting pre-signed URL from: ${apiUrl}?filename=${file.name}`);

            const response = await fetch(`${apiUrl}?filename=${file.name}&contentType=${file.type}`, { method: 'GET' });

            if (!response.ok) {
                console.error('Failed to get pre-signed URL:', response.statusText);
                throw new Error('Failed to get upload URL');
            }

            const data: UploadResponse = await response.json();
            console.log('Received pre-signed URL:', data);
            const { uploadURL, objectKey } = data;

            console.log(`Uploading file to S3 with object key: ${objectKey}`);

            const fileType = file.type || 'application/octet-stream';
            console.log('Selected file type:', fileType);

            const uploadResponse = await fetch(uploadURL, {
                method: 'PUT',
                headers: {
                    'Content-Type': fileType,
                },
                body: file,
            });

            if (uploadResponse.ok) {
                setSuccess(true);
                setFile(null);


                await updateTicketImages(rowSelect, objectKey);


                setTicketData((prev) => prev ? { ...prev, photo: `https://techticket-images.s3.amazonaws.com/${objectKey}` } : null);

            } else {
                console.error('File upload failed:', uploadResponse.statusText);
                throw new Error('File upload failed.');
            }
        } catch (err) {
            console.error('Error during file upload:', err);
            setError('Error during file upload.');
        } finally {
            setUploading(false);
        }
    };

    const updateTicketImages = async (rowSelect: number, objectKey: string) => {
        try {
            const photoUrl = `https://techticket-images.s3.amazonaws.com/${objectKey}`;
            console.log('New photo URL:', photoUrl);

            const ticketResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${rowSelect}`, {
                method: 'GET',
            });

            if (!ticketResponse.ok) {
                throw new Error('Failed to fetch current ticket data');
            }

            const ticketData = await ticketResponse.json();
            console.log('Current ticket data:', ticketData);

            const updatedPhoto = ticketData.imagePath
                ? `${ticketData.imagePath},${photoUrl}` 
                : photoUrl;

            console.log('Updated photo field:', updatedPhoto);

            const payload = { imagePath: updatedPhoto };
            console.log('Payload being sent:', payload);

            const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${rowSelect}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!updateResponse.ok) {
                throw new Error('Failed to update ticket image');
            }

            console.log('Ticket image updated successfully');
        } catch (err) {
            console.error('Error updating ticket image:', err);
        }
    };
    return (
        <div>
            <Label htmlFor="picture">Upload Ticket Images</Label>
            <Input type="file" id="picture" onChange={handleFileChange} />
            {uploading && <p>Uploading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>File uploaded successfully!</p>}
            <Button variant="outline" size="sm" className="ml-auto" onClick={handleUpload} disabled={uploading}>Upload</Button>
        </div>
    );
};

