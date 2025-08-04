import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, label, error, value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let phone = e.target.value.replace(/\D/g, '');
      
      if (phone.length > 0) {
        if (phone.length <= 2) {
          phone = `(${phone}`;
        } else if (phone.length <= 6) {
          phone = `(${phone.slice(0, 2)}) ${phone.slice(2)}`;
        } else if (phone.length <= 10) {
          phone = `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
        } else {
          phone = `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7, 11)}`;
        }
      }

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: phone,
        },
      };
      
      onChange?.(syntheticEvent);
    };

    const getPlainPhoneNumber = (formattedPhone: string) => {
      return formattedPhone.replace(/\D/g, '');
    };

    return (
      <div className="space-y-2">
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <Input
          type="tel"
          ref={ref}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          value={value}
          onChange={handleChange}
          placeholder="(11) 99999-9999"
          maxLength={15}
          {...props}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
export const getPlainPhoneNumber = (formattedPhone: string) => {
  return formattedPhone.replace(/\D/g, '');
};