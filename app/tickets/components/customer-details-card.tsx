import * as React from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AssignEmployees } from "./assign-employees";
import { StringToBoolean } from "class-variance-authority/types";

interface CustomerDetailsProps {
    rowSelect: number;
    className: string;
}

interface Customer {
    name: string;
    address: string;
    phone: string;
    email: string;
}

export function CustomerDetails({ className, rowSelect }: CustomerDetailsProps) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [customerData, setCustomerData] = useState<Customer | null>(null);
    const [editing, setEditing] = useState<boolean>(false);


    const fetchCustomerData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://18.171.174.40:8080/api/tickets/customer/${rowSelect}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch customer data');
            }

            const data: Customer = await response.json();
            setCustomerData(data);
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

    useEffect(() => {
        if (rowSelect) {
            fetchCustomerData();
        }
    }, [rowSelect]);

    const handleInputChange = (field: keyof Customer, value: string) => {
        setCustomerData((prev) => prev ? { ...prev, [field]: value } : null);
    };

    function onEditClick() {
        setEditing(true);
    }

    const handleSave = async () => {
        // if (!customerData) return;

        //     const response = await fetch(`http://18.171.174.40:8080/api/tickets/customer/${rowSelect}`, {
        //         method: 'PUT',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(sanitizedData),
        //     });

        //     if (!response.ok) {
        //         console.error('Response status:', response.status, 'Response text:', await response.text());
        //         throw new Error('Failed to save changes');
        //     }

            setEditing(false);
            fetchCustomerData();
        // } catch (err) {
        //     if (err instanceof Error) {
        //         console.error('Error message:', err.message);
        //         setError(err.message);
        //     } else {
        //         console.error('Unknown error occurred');
        //         setError('Unknown error occurred');
        //     }
        // }
    };

     const addressLines = customerData?.address.split(", ") || [];
    
    
    return (
        <>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {customerData && (
                <div className="grid gap-4 items-start">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between w-full mt-4">
                            <span className="text-lg font-semibold leading-none tracking-tight text-left">
                                Customer Details
                            </span>
                            {editing ? (
                                <Button variant="outline" size="sm" type="submit" onClick={handleSave}>
                                    Save changes
                                </Button>
                            ) : (
                                <Button variant="outline" size="sm" onClick={onEditClick}>
                                    Edit
                                </Button>
                            )}
                        </div>
                        <Card className="grid grid-cols-3 items-center p-4">
                            <Label className="col-span-1 text-left mb-4">Contact Name</Label>
                            <Input
                                disabled={!editing}
                                className="col-span-2 w-full  resize-none"
                                value={customerData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                            />
                            <Label className="col-span-1 text-left">Address</Label>
                            <Textarea
                                disabled
                                className="col-span-2 w-full resize-none"
                                value={addressLines.join("\n")}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                rows={3}
                            />
                            <Label className="col-span-1 text-left mb-4">Email</Label>
                            <Input
                                disabled={!editing}
                                className="col-span-2 w-full resize-none"
                                value={customerData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                            />
                            <Label className="col-span-1 text-left mb-4">Phone</Label>
                            <Input
                                disabled={!editing}
                                className="col-span-2 w-full resize-none"
                                value={customerData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                            />
                        </Card>
                    </div>
                </div>
            )}
        </>
    );
}
