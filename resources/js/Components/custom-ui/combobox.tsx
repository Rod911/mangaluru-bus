import { Check, ChevronsUpDown } from "lucide-react";

import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,
} from "../ui/drawer";

type Option = {
    label: string;
    value: string;
};

export function Combobox({
    options,
    onChange = () => {},
    placeholder = "Select option",
    noResults = "No results found.",
}: {
    options: Option[];
    onChange?: (value: string) => void;
    placeholder?: string;
    noResults?: string;
}) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Option>();
    const display = selected
        ? options.find((option) => option.value === selected.value)?.label
        : placeholder;
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const content = (
        <OptionsList
            setOpen={setOpen}
            setValue={setSelected}
            selected={selected}
            options={options}
            placeholder={placeholder}
            noResults={noResults}
            onChange={onChange}
        />
    );
    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between px-4"
                        size="lg"
                    >
                        {display}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0 -mt-11 bg-white">
                    {content}
                </PopoverContent>
            </Popover>
        );
    }
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    {display}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-white" aria-modal>
                <div className="px-3">
                    <DrawerTitle>Choose an option</DrawerTitle>
                    <DrawerDescription>{""}</DrawerDescription>
                </div>
                <div className="mt-4 border-t">{content}</div>
            </DrawerContent>
        </Drawer>
    );
}

const OptionsList = ({
    setOpen,
    setValue,
    placeholder,
    noResults,
    options,
    onChange = () => {},
    selected,
}: {
    setOpen: (open: boolean) => void;
    setValue: (option?: Option) => void;
    placeholder: string;
    noResults: string;
    options: Option[];
    onChange?: (value: string) => void;
    selected?: Option;
}) => (
    <Command>
        <CommandInput
            placeholder={placeholder}
            className="border-0 focus:ring-0"
        />
        <CommandList>
            <CommandEmpty>{noResults}</CommandEmpty>
            <CommandGroup>
                {options.map((option) => (
                    <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={(value) => {
                            const selectedValue = options.find(
                                (option) => option.label === value
                            );
                            setValue(selectedValue);
                            onChange(option.value);
                            setOpen(false);
                        }}
                        // className="cursor-pointer"
                    >
                        {option.label}
                        <Check
                            className={cn(
                                "ml-auto",
                                selected?.value === option.value
                                    ? "opacity-100"
                                    : "opacity-0"
                            )}
                        />
                    </CommandItem>
                ))}
            </CommandGroup>
        </CommandList>
    </Command>
);
