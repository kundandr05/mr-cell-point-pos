"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SearchInput({ placeholder = "Search...", value, onChange, className = "" }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 300);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-muted-foreground" />
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        className="pl-10 pr-10 bg-background/50 backdrop-blur-sm border-[#D4A017]/20 focus-visible:ring-[#D4A017]/50"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
      {localValue && (
        <button
          onClick={() => setLocalValue("")}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
