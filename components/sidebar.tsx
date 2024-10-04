"use client"

import {
    LayoutGrid,
    Ticket,
    UsersRound,
    ChartColumn,
    Settings,
    CircleHelp,
} from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

import UserItem from "./ui/userItem";
import DarkMode from "./ui/darkmode";
import Link from "next/link";

export default function Sidebar() {

    const menuList = [
        {
            group: "General",
            items: [
                {
                    link: "/dashboard",
                    text: "Overview",
                    icon: <LayoutGrid />
                },
                {
                    link: "/tickets",
                    text: "Tickets",
                    icon: <Ticket />
                },
                {
                    link: "/staff",
                    text: "Staff" ,
                    icon: <UsersRound />
                },
                {
                    link: "/analytics",
                    text: "Analytics",
                    icon: <ChartColumn />
                },
            ]
        },
             {
            group: "Admin",
            items: [
                {
                    link: "/admin/settings",
                    text: "Settings",
                    icon: <Settings />
                },
                {
                    link: "/admin/help",
                    text: "Help",
                    icon: <CircleHelp />
                },
            ]
        }
    ]


    return <div className="fixed flex flex-col gap-4 w-[300px] min-w-[300px] border-r min-h-screen p-4">

        <div>
            <UserItem />
        </div>
        <div className="grow">
            <Command style={{ overflow:'visible' }}>
                <CommandList style={{ overflow: 'visible' }}>
                {menuList.map((menu: any, key: number) =>
                (<CommandGroup key={key} heading={menu.group}>
                    {menu.items.map((option: any, optionKey: number) => <CommandItem key={optionKey} className="flex cursor-pointer">
                        <Link className="flex-1 flex items-center gap-2" href={option.link}>{option.icon}
                        {option.text}</Link>
                    </CommandItem>)}
                </CommandGroup>
                ))}
            </CommandList>
        </Command>
        </div>
        <div>
            <DarkMode/>
        </div>



    </div>
}