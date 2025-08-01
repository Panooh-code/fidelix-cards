import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWizard } from "../WizardContext";
import { Phone, MessageCircle } from "lucide-react";

interface QuestionProps {
  onNext: () => void;
  onPrev: () => void;
}

const countries = [
  { code: 'BR', name: 'Brasil', flag: '🇧🇷', prefix: '+55', mask: '(##) #####-####' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', prefix: '+351', mask: '### ### ###' },
];

export const Question4Phone = ({ onNext, onPrev }: QuestionProps) => {
  const { state, updateBusinessData } = useWizard();
  
  const formatPhone = (value: string, country: 'BR' | 'PT') => {
    const digits = value.replace(/\D/g, '');
    
    if (country === 'BR') {
      if (digits.length <= 10) {
        // Formato: (11) 3333-3333
        return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else {
        // Formato: (11) 9 9999-9999
        return digits.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
      }
    } else {
      return digits.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value, state.businessData.country);
    updateBusinessData({ phone: formatted });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && state.businessData.phone) {
      onNext();
    }
  };

  const getFullPhoneNumber = () => {
    const selectedCountry = countries.find(c => c.code === state.businessData.country);
    const numbers = state.businessData.phone.replace(/\D/g, '');
    return `${selectedCountry?.prefix}${numbers}`;
  };

  return (
    <div className="p-4 space-y-3 h-full flex flex-col justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Telefone *
        </h2>
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        <div className="flex gap-2">
          <Select 
            value={state.businessData.country} 
            onValueChange={(value: 'BR' | 'PT') => updateBusinessData({ country: value })}
          >
            <SelectTrigger className="h-10 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.flag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="relative flex-1">
            <Input
              id="phone"
              type="tel"
              placeholder={
                state.businessData.country === 'BR' 
                  ? "(11) 99999-9999" 
                  : "123 456 789"
              }
              value={state.businessData.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-10 pl-12"
              
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
              {countries.find(c => c.code === state.businessData.country)?.prefix}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isWhatsApp"
            checked={state.businessData.isWhatsApp}
            onCheckedChange={(checked) => updateBusinessData({ isWhatsApp: !!checked })}
          />
          <Label htmlFor="isWhatsApp" className="text-sm cursor-pointer">
            É WhatsApp
          </Label>
        </div>
      </div>
    </div>
  );
};