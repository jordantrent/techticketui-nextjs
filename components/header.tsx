'use client';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { BellIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Breadcrumb from "./breadcrumb";
import { useRouter, usePathname } from 'next/navigation';

    

const Header: React.FC = () => {
    const pathname = usePathname();
    const [breadcrumbs, setBreadcrumbs] = useState<{ label: string; href?: string }[]>([]);

    useEffect(() => {
        
        const pathnames = pathname.split('/').filter((x) => x);
        const breadcrumbList = [
            { label: 'General', href: '/' },
            ...pathnames.map((path, index) => {
                const href = `/${pathnames.slice(0, index + 1).join('/')}`;
                return { label: path, href };
            }),
        ];
        setBreadcrumbs(breadcrumbList);
    }, [pathname]); 


        return <div className="grid grid-cols-2 w-full gap-4 p-4 items-center">
            <div className="flex justify-start">
                {breadcrumbs.length > 0 && <Breadcrumb breadcrumbs={breadcrumbs} />}
            </div>
        </div>;
}
export default Header;
