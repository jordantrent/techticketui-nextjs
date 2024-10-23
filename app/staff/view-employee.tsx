import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Maximize2 } from "lucide-react";
import { Employee } from "./columns";
import { Card } from '@/components/ui/card';
import { DataTable } from '../tickets/data-table';
import Page from '../tickets/page';
import EmployeeTable from './employee-table';
import TicketsPage from './employee-table-fetch';



export default function ViewEmployee({ employeeId }) {
    const [employeeData, setEmployeeData] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (employeeId) {
            const fetchData = async () => {
                setLoading(true);
                setError(null);

                try {
                    const response = await fetch(`http://localhost:8080/api/employees/${employeeId}`, {
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
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [employeeId]);


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
                        <Card className="grid grid-cols-3 items-center p-4">
                        <Label className="col-span-1 text-left">First Name</Label>
                        <Input className="col-span-2 w-full" value={employeeData.firstName} readOnly />
                        <Label className="col-span-1 text-left">Last Name</Label>
                        <Input className="col-span-2 w-full" value={employeeData.lastName} readOnly />
                        <Label className="col-span-1 text-left">Position</Label>
                        <Input className="col-span-2 w-full" value={employeeData.position} readOnly />
                        <Label className="col-span-1 text-left">Phone</Label>
                        <Input className="col-span-2 w-full" value={employeeData.phone} readOnly />
                        <Label className="col-span-1 text-left">Email</Label>
                        <Input className="col-span-2 w-full" value={employeeData.email} readOnly />
                        </Card>
                        <img src="https://placehold.co/400" />
                        <span className="col-span-3 w-full"><TicketsPage /></span>
                    </div>
                )}
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
