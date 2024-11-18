import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    position: string;
}

interface AssignEmployeesProps {
    className: string;
    rowSelect: number;
}

export function AssignEmployees({ className, rowSelect }: AssignEmployeesProps) {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [assignedEmployees, setAssignedEmployees] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const fetchEmployees = async () => {
        setLoading(true);
        const response = await fetch("http://18.171.174.40:8080/api/employees");
        const data = await response.json();
        const technicians = data.filter((emp: any) => emp.position === "Technician");
        setEmployees(technicians);
        setLoading(false);
    };

    const fetchAssignedEmployees = async () => {
        const response = await fetch(`http://18.171.174.40:8080/api/employee/tickets/${rowSelect}`);
        const data: { id: number }[] = await response.json();
        const assignedIds = new Set(data.map((emp: any) => emp.id));
        setAssignedEmployees(assignedIds);
    };

    useEffect(() => {
        fetchEmployees();
        fetchAssignedEmployees();
    }, [rowSelect]);

    const handleCheckboxChange = (employeeId: number) => {
        setAssignedEmployees((prev) => {
            const updated = new Set(prev);
            if (updated.has(employeeId)) {
                updated.delete(employeeId); 
            } else {
                updated.add(employeeId);
            }
            return updated;
        });
    };

    const saveChanges = async () => {
        const assignedArray = Array.from(assignedEmployees); 
        const payload = {
            employees: assignedArray,
        };

        console.log("Saving changes with payload:", JSON.stringify(payload, null, 2));

        const response = await fetch(`http://18.171.174.40:8080/api/tickets/${rowSelect}`, {
            method: "PUT", 
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log("Changes saved successfully!");
            setDialogOpen(false);
        } else {
            console.error("Failed to save changes");
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className={className} variant="outline" size="sm">
                    Assign Employees
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Assign Employees</DialogTitle>
                    <DialogDescription>
                        Select employees to assign to this ticket.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {loading ? (
                        <p>Loading employees...</p>
                    ) : (
                        <div className="grid gap-2">
                            {employees.map((employee) => (
                                <div key={employee.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`employee-${employee.id}`}
                                        checked={assignedEmployees.has(employee.id)} 
                                        onChange={() => handleCheckboxChange(employee.id)} 
                                        className="mr-2"
                                    />
                                    <Label htmlFor={`employee-${employee.id}`} className="text-sm">
                                        {employee.firstName} {employee.lastName}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button type="button" onClick={saveChanges}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
