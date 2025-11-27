"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerInputProps = {
  id?: string;
  onchange: (date: Date | undefined) => void;
  defaultDate?: Date | undefined;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
};
export function DatePickerInput({
  id,
  onchange,
  defaultDate,
  disabled,
  onKeyDown
}: DatePickerInputProps) {
  const [date, setDate] = React.useState<Date | undefined>(defaultDate);
  const [open, setOpen] = React.useState(false);

  const handleChangeDate = (date: Date | undefined) => {
    setDate(date);
    onchange(date);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setOpen(false);
    }
    onKeyDown?.(e);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild id={id}>
        <Button
          variant={"outline"}
          onKeyDown={onKeyDown}
          className={cn(
            " w-full h-8 justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "dd/MM/yyyy") : <span>Pick a date</span>} {/* Updated format */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" onKeyDown={handleKeyDown} tabIndex={0}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleChangeDate}
          onDayKeyDown={(day, modifiers, e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleChangeDate(day); 
            }
          }}
          initialFocus
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
