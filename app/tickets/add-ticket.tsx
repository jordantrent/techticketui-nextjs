import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import React from "react";

interface AddEmployeeProps {
    refetchData: () => Promise<void>;
    setOpen: (open: boolean) => void;
}

export default function AddTicket({ refetchData, setOpen }: AddEmployeeProps) {
    const [customerData, setCustomerData] = useState({
        name: "",
        addressLine1: "",
        addressLine2: "",
        postcode: "",
        phone: "",
        email: "",
    });

    const [ticketData, setTicketData] = useState({
        issueDescription: "",
        status: "Unassigned", 
        customerId: null as number | null,
    });

    const handleCustomerChange = (field: string, value: string) => {
        setCustomerData((prevState) => ({ ...prevState, [field]: value }));
    };

    const handleTicketChange = (field: string, value: string) => {
        setTicketData((prevState) => ({ ...prevState, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            const fullAddress = `${customerData.addressLine1}, ${customerData.addressLine2}, ${customerData.postcode}`;

            const customerResponse = await fetch("http://18.171.174.40:8080/api/customers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: customerData.name,
                    address: fullAddress,
                    phone: customerData.phone,
                    email: customerData.email,
                }),
            });

            const customer = await customerResponse.json();

            const ticketResponse = await fetch("http://18.171.174.40:8080/api/tickets", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    issueDescription: ticketData.issueDescription,
                    status: ticketData.status,
                    customer: { id: customer.id },
                }),
            });

            const ticket = await ticketResponse.json();

          
            await refetchData();
            setOpen(false);  
            console.log("Ticket created successfully", ticket);
        } catch (error) {
            console.error("Error creating customer or ticket", error);
        } finally {
            setOpen(false); 
        }
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Ticket</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-4 gap-4 py-4">
                <Card className="col-span-4 grid grid-cols-3 gap-4 p-4 items-center">
                  
                    <Label className="col-span-2 text-left">Issue Description</Label>
                    <Textarea
                        className="col-span-3 w-full resize-none"
                        rows={10}
                        value={ticketData.issueDescription}
                        onChange={(e) => handleTicketChange("issueDescription", e.target.value)}
                    />

                    <Label className="col-span-1 text-left">Contact Name</Label>
                    <Input
                        className="col-span-2 w-full resize-none"
                        value={customerData.name}
                        onChange={(e) => handleCustomerChange("name", e.target.value)}
                    />

                
                    <Label className="col-span-1 text-left">Address Line 1</Label>
                    <Input
                        className="col-span-2 w-full resize-none"
                        value={customerData.addressLine1}
                        onChange={(e) => handleCustomerChange("addressLine1", e.target.value)}
                    />

                 
                    <Label className="col-span-1 text-left">Address Line 2</Label>
                    <Input
                        className="col-span-2 w-full resize-none"
                        value={customerData.addressLine2}
                        onChange={(e) => handleCustomerChange("addressLine2", e.target.value)}
                    />

               
                    <Label className="col-span-1 text-left">Postcode</Label>
                    <Input
                        className="col-span-2 w-full resize-none"
                        value={customerData.postcode}
                        onChange={(e) => handleCustomerChange("postcode", e.target.value)}
                    />

             
                    <Label className="col-span-1 text-left">Email</Label>
                    <Input
                        className="col-span-2 w-full resize-none"
                        value={customerData.email}
                        onChange={(e) => handleCustomerChange("email", e.target.value)}
                    />

                  
                    <Label className="col-span-1 text-left">Phone</Label>
                    <Input
                        className="col-span-2 w-full resize-none"
                        value={customerData.phone}
                        onChange={(e) => handleCustomerChange("phone", e.target.value)}
                    />
                </Card>
            </div>

            <DialogFooter>
                <Button variant="outline" type="submit" onClick={handleSubmit}>
                    Save changes
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
