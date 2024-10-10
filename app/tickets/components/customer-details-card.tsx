import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function CustomerDetails({ className }: React.HTMLAttributes<HTMLDivElement>) {

    return (
        <Card className={className}>
            <CardHeader className="border-b-4 pb-2 py-2">
                <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 py-3">
                <Label className="py-1">Jordan Trent</Label>
                <Label className="py-1">22 Sutton Road <br /> Bournemouth <br /> BH9 1RN</Label>
                <Label className="py-1">07833678239</Label>
                <Label className="py-1">jordan.trent@gmail.com</Label>

            </CardContent>
            <CardFooter>
            
            </CardFooter>
        </Card>
    )
}
