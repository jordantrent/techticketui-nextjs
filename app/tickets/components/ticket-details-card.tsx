import * as React from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AssignEmployees } from "./assign-employees";


interface TicketsDetailsProps {
    rowSelect: number;
    className: string;
}

interface Employee {
    firstName: string;
    lastName: string;
}

interface Ticket {
    issueDescription: string;
    createdDate: string;
    status: string;
    resolvedDate?: string | null;
    employees?: Employee[];
}

export function TicketDetails({ className, rowSelect }: TicketsDetailsProps) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [ticketData, setTicketData] = useState<Ticket | null>(null);
    const [editing, setEditing] = useState<boolean>(false);


    const fetchTicketData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${rowSelect}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch ticket data');
            }

            const data: Ticket = await response.json();
            setTicketData(data);
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
            fetchTicketData();
        }
    }, [rowSelect]);

    const handleInputChange = (field: keyof Ticket, value: string) => {
        setTicketData((prev) => prev ? { ...prev, [field]: value } : null);
    };

    function onEditClick() {
        setEditing(true);
    }

    const handleSave = async () => {
        if (!ticketData) return;

        try {
            const sanitizedData = { ...ticketData };
            delete sanitizedData.employees;
            if (sanitizedData.resolvedDate === null) {
                delete sanitizedData.resolvedDate;
            }

            console.log('Sanitized Payload:', JSON.stringify(sanitizedData));

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tickets/${rowSelect}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(sanitizedData),
            });

            if (!response.ok) {
                console.error('Response status:', response.status, 'Response text:', await response.text());
                throw new Error('Failed to save changes');
            }

            setEditing(false);
            fetchTicketData();
        } catch (err) {
            if (err instanceof Error) {
                console.error('Error message:', err.message);
                setError(err.message);
            } else {
                console.error('Unknown error occurred');
                setError('Unknown error occurred');
            }
        }
    };

    return (
        <>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {ticketData && (
                <div className="grid gap-4 items-start">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between w-full">
                            <span className="text-lg font-semibold leading-none tracking-tight text-left">
                                Ticket Details
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
                            <Label className="col-span-2 text-left mb-4">Issue Description</Label>
                            <Textarea
                                disabled={!editing}
                                className="col-span-3 w-full mb-4 resize-none"
                                value={ticketData.issueDescription}
                                rows={10}
                                onChange={(e) => handleInputChange("issueDescription", e.target.value)}
                            />
                            <Label className="col-span-1 text-left">Date Created</Label>
                            <Input
                                disabled
                                className="col-span-2 w-full"
                                value={ticketData.createdDate}
                                onChange={(e) => handleInputChange("createdDate", e.target.value)}
                            />
                            <Label className="col-span-1 text-left">Assigned Employees</Label>
                            {!editing ? (
                                <Textarea
                                    disabled={!editing}
                                    className="col-span-2 resize-none"
                                    value={ticketData.employees?.map(emp => `${emp.firstName} ${emp.lastName}`).join('\n') || ''}
                                    rows={ticketData.employees?.length || 0}
                                />
                            ) : (
                                <AssignEmployees className="col-span-2" rowSelect={rowSelect} />
                            )}

                            <Label className="col-span-1 text-left">Status</Label>
                            <span className="col-span-2 w-full">
                                <Select disabled={!editing} onValueChange={(value) => handleInputChange("status", value)}>
                                    <SelectTrigger className="col-span-3 w-full">
                                        <SelectValue placeholder={ticketData.status} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Unassigned">Unassigned</SelectItem>
                                        <SelectItem value="Assigned">Assigned</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Complete">Complete</SelectItem>
                                    </SelectContent>
                                </Select>
                            </span>
                        </Card>
                    </div>
                </div>
            )}
        </>
    );
}
