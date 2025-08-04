import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  label?: string;
  error?: string;
  disabled?: boolean;
}

const OtpInput = React.forwardRef<HTMLDivElement, OtpInputProps>(
  ({ value, onChange, length = 6, label, error, disabled }, ref) => {
    const inputs = React.useRef<(HTMLInputElement | null)[]>([]);
    
    const handleChange = (index: number, digit: string) => {
      if (!/^\d*$/.test(digit)) return;
      
      const newValue = value.split('');
      newValue[index] = digit;
      onChange(newValue.join(''));
      
      // Auto-focus next input
      if (digit && index < length - 1) {
        inputs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && !value[index] && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      onChange(pastedData);
      
      // Focus last filled input or next empty one
      const nextIndex = Math.min(pastedData.length, length - 1);
      inputs.current[nextIndex]?.focus();
    };

    return (
      <div className="space-y-2" ref={ref}>
        {label && <Label>{label}</Label>}
        <div className="flex gap-2 justify-center">
          {Array.from({ length }, (_, index) => (
            <Input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value[index] || ''}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={disabled}
              className={cn(
                "w-12 h-12 text-center text-lg font-semibold",
                error && "border-destructive focus-visible:ring-destructive"
              )}
            />
          ))}
        </div>
        {error && <p className="text-sm text-destructive text-center">{error}</p>}
      </div>
    );
  }
);

OtpInput.displayName = "OtpInput";

export { OtpInput };