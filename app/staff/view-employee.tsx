import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Maximize2 } from "lucide-react";
import { Employee } from "./columns";
import { Card } from '@/components/ui/card';
import TicketsPage from './employee-table-fetch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DeleteEmployee } from './delete-employee';

type ViewEmployeeProps = {
    employeeId: number;
};

type ErrorState = string | null;

export default function ViewEmployee({ employeeId }: ViewEmployeeProps) {
    const [employeeData, setEmployeeData] = useState<Employee | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDialogClose = () => {
        console.log("Dialog will be closed");
        setIsDialogOpen(false);
    }

    function onEditClick() {
        setEditing(true);
    }

    useEffect(() => {
        if (employeeId) {
            const fetchData = async () => {
                setLoading(true);
                setError(null);

                try {
                    const response = await fetch(`http://18.171.174.40:8080/api/employees/${employeeId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch employee data');
                    }

                    const data: Employee = await response.json();
                    setEmployeeData(data);
                } catch (err) {

                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError('Unknown error occurred');
                    }
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [employeeId]);

    const handleInputChange = (field: keyof Employee, value: string) => {
        setEmployeeData((prev) => prev ? { ...prev, [field]: value } : null);
    };

    const handleSave = async () => {
        if (!employeeData) return;

        try {
            const response = await fetch(`http://18.171.174.40:8080/api/employees/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employeeData),
            });

            if (!response.ok) {
                throw new Error('Failed to save changes');
            }

            setEditing(false);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Unknown error occurred');
            }
        }
    };


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon"><Maximize2 className="h-4 w-4" /></Button>
            </DialogTrigger>
            <DialogContent className="min-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Employee Details</DialogTitle>
                </DialogHeader>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-600">{error}</p>}
                {employeeData && (
                    <div className="grid gap-4 grid-cols-2 items-start">
                        <div className="flex flex-col items-end gap-4">
                            <Card className="grid grid-cols-3 items-center p-4">
                                <Label className="col-span-1 text-left">First Name</Label>
                                <Input
                                    disabled={!editing}
                                    className="col-span-2 w-full"
                                    value={employeeData.firstName}
                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                />
                                <Label className="col-span-1 text-left">Last Name</Label>
                                <Input
                                    disabled={!editing}
                                    className="col-span-2 w-full"
                                    value={employeeData.lastName}
                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                />
                                <Label className="col-span-1 text-left">Position</Label>
                                <span className="col-span-2 w-full">
                                    <Select disabled={!editing} onValueChange={(value) => handleInputChange("position", value)}>
                                        <SelectTrigger className="col-span-3 w-full">
                                            <SelectValue placeholder={employeeData.position} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Technician">Technician</SelectItem>
                                            <SelectItem value="Surveyor">Surveyor</SelectItem>
                                            <SelectItem value="Apprentice">Apprentice</SelectItem>
                                            <SelectItem value="Project Manager">Project Manager</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </span>
                                <Label className="col-span-1 text-left">Phone</Label>
                                <Input
                                    disabled={!editing}
                                    className="col-span-2 w-full"
                                    value={employeeData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                />
                                <Label className="col-span-1 text-left">Email</Label>
                                <Input
                                    disabled={!editing}
                                    className="col-span-2 w-full"
                                    value={employeeData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                />
                            </Card>
                            {editing ? (
                                <Button variant="outline" size="sm" className="ml-auto" type="submit" onClick={handleSave}>Save changes</Button>
                            ) : (
                                <Button variant="outline" className="ml-auto" size="sm" onClick={onEditClick}>Edit</Button>
                            )}
                        </div>
                        {editing ? <ImageUpload employeeId={employeeId} setEmployeeData={setEmployeeData} /> : <img src={employeeData.photo} />
                        }
                        <span className="col-span-3 w-full"><TicketsPage employeeId={employeeId} /></span>
                    </div>
                )}
                <DialogFooter className="flex flex-col-2 gap-4">
                    <DeleteEmployee
                        employeeId={employeeId}
                        isDialogOpen={isDialogOpen}
                        setIsDialogOpen={setIsDialogOpen}
                        onDeleteSuccess={handleDialogClose}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

type UploadResponse = {
    uploadURL: string;
    objectKey: string;
};

type ImageUploadProps = {
    employeeId: number;
    setEmployeeData: React.Dispatch<React.SetStateAction<Employee | null>>;
};

const ImageUpload: React.FC<ImageUploadProps> = ({ employeeId, setEmployeeData }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

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

                // Update employee image with new URL
                await updateEmployeeImage(employeeId, objectKey);

                // Optionally, you can directly update employee data in the UI without re-fetching
                setEmployeeData((prev) => prev ? { ...prev, photo: `https://techticket-images.s3.amazonaws.com/${objectKey}` } : null);

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

    const updateEmployeeImage = async (employeeId: number, objectKey: string) => {
        try {
            const photoUrl = `https://techticket-images.s3.amazonaws.com/${objectKey}`;
            const payload = { photo: photoUrl };
            console.log('Payload being sent:', payload);
            console.log('Serialized payload:', JSON.stringify(payload));

            const response = await fetch(`http://18.171.174.40:8080/api/employees/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to update employee image');
            }

            console.log('Employee image updated successfully');
        } catch (err) {
            console.error('Error updating employee image:', err);
        }
    };

    return (
        <div>
            <Label htmlFor="picture">Upload Employee Image</Label>
            <Input type="file" id="picture" onChange={handleFileChange} />
            {uploading && <p>Uploading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>File uploaded successfully!</p>}
            <Button variant="outline" size="sm" className="ml-auto" onClick={handleUpload} disabled={uploading}>Upload</Button>
        </div>
    );
};





