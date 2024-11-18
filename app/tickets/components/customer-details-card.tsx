import * as React from "react"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react";

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
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCustomer() {
            try {
                const response = await fetch(`http://18.171.174.40:8080/api/tickets/customer/${rowSelect}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch customer details");
                }
                const data = await response.json();
                setCustomer(data);
            } catch (err: any) {
                setError(err.message);
            }
        }

        fetchCustomer();
    }, [rowSelect]);

    if (error) {
        return (
            <Card className={className}>
                <CardHeader className="border-b-4 pb-2 py-2">
                    <CardTitle>Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 py-3">
                    <Label className="py-1 text-red-500">Error: {error}</Label>
                </CardContent>
                <CardFooter />
            </Card>
        );
    }

    if (!customer) {
        return (
            <Card className={className}>
                <CardHeader className="border-b-4 pb-2 py-2">
                    <CardTitle>Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 py-3">
                    <Label className="py-1">Loading...</Label>
                </CardContent>
                <CardFooter />
            </Card>
        );
    }

    // Split address into lines
    const addressLines = customer.address.split(", ");

    return (
        <Card className={className}>
            <CardHeader className="border-b-4 pb-2 py-2">
                <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 py-3">
                <Label className="py-1">{customer.name}</Label>
                <Label className="py-1">
                    {addressLines.map((line, index) => (
                        <div key={index}>{line}</div>
                    ))}
                </Label>
                <Label className="py-1">{customer.phone}</Label>
                <Label className="py-1">{customer.email}</Label>
            </CardContent>
            <CardFooter />
        </Card>
    );
}


