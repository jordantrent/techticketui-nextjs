import { Button } from "@/components/ui/button";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import React from "react";


interface AddEmployeeProps {
    refetchData: () => Promise<void>;
    setOpen: (open: boolean) => void;
}

const formFields = [
    { id: "firstName", label: "First Name", type: "input" },
    { id: "lastName", label: "Last Name", type: "input" },
    { id: "phone", label: "Phone", type: "input" },
    { id: "email", label: "Email", type: "input" },
];

export function AddEmployee({ refetchData, setOpen }: AddEmployeeProps) {
    const [formData, setFormData] = useState({
        id: "",
        firstName: "",
        lastName: "",
        position: "",
        phone: "",
        email: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch("http://18.171.174.40:8080/api/employees", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to add employee");
            }

            console.log("Employee added successfully");
            await refetchData();
            setOpen(false);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Add Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                
                {formFields.map(({ id, label }) => (
                    <div key={id} className="grid grid-cols-1 gap-4 items-center">
                        <Label htmlFor={id} className="col-span-1 text-left">{label}</Label>
                        <Input
                            id={id}
                            className="col-span-3 w-full"
                            value={formData[id as keyof typeof formData]}
                            onChange={handleChange}
                        />
                    </div>
                ))}
                <div className="grid grid-cols-1  gap-4 items-center">
                    <Label htmlFor="position" className="col-span-1 text-left">Position</Label>
                    <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, position: value }))}>
                        <SelectTrigger className="col-span-3 w-full">
                            <SelectValue placeholder="Select a Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Technician">Technician</SelectItem>
                            <SelectItem value="Surveyor">Surveyor</SelectItem>
                            <SelectItem value="Apprentice">Apprentice</SelectItem>
                            <SelectItem value="Project Manager">Project Manager</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" type="submit">Save changes</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    );
}
