import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  id: string;
  name: string;
  icon: LucideIcon;
  description?: string;
  preview?: string;
}

interface CompactSelectProps {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  className?: string;
  showIcons?: boolean;
  showDescriptions?: boolean;
}

export const CompactSelect = ({ 
  options, 
  value, 
  onValueChange, 
  placeholder,
  className,
  showIcons = true,
  showDescriptions = false
}: CompactSelectProps) => {
  const selectedOption = options.find(option => option.id === value);

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn("h-10", className)}>
        <SelectValue placeholder={placeholder}>
          {selectedOption && (
            <div className="flex items-center gap-2">
              {showIcons && <selectedOption.icon className="w-4 h-4" />}
              <span>{selectedOption.name}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[200px]">
        {options.map((option) => {
          const IconComponent = option.icon;
          return (
            <SelectItem key={option.id} value={option.id}>
              <div className="flex items-center gap-2 py-1">
                {showIcons && <IconComponent className="w-4 h-4 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{option.name}</div>
                  {showDescriptions && option.description && (
                    <div className="text-xs text-muted-foreground truncate">
                      {option.description}
                    </div>
                  )}
                </div>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};