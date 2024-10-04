import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandList,
} from "@/components/ui/command"

export default function SearchBar() {
    return (
        <Command className="max-w-[350px]">
            <CommandInput placeholder="Type a command or search..." />
        </Command>
    )
}
