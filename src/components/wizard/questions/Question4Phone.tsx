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
  canSkip: boolean;
}

const countries = [
  { code: 'BR', name: 'Brasil', flag: '🇧🇷', prefix: '+55', mask: '(##) #####-####' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', prefix: '+351', mask: '### ### ###' },
];

export const Question4Phone = ({ onNext, onPrev, canSkip }: QuestionProps) => {
  const { state, updateBusinessData } = useWizard();
  
  const formatPhone = (value: string, country: 'BR' | 'PT') => {
    const numbers = value.replace(/\D/g, '');
    
    if (country === 'BR') {
      // Format: (11) 99999-9999
      return numbers
        .substring(0, 11)
        .replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
        .replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
        .replace(/(\d{2})(\d{0,5})/, '($1) $2');
    } else {
      // Format: 123 456 789
      return numbers
        .substring(0, 9)
        .replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
        .replace(/(\d{3})(\d{3})(\d{0,3})/, '$1 $2 $3')
        .replace(/(\d{3})(\d{0,3})/, '$1 $2');
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
    <div className="p-8 space-y-6">
      {/* Question Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Phone className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Qual é o telefone do seu negócio?
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Seus clientes poderão entrar em contato facilmente
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6 max-w-md mx-auto">
        {/* Country Selector */}
        <div className="space-y-2">
          <Label className="text-base font-medium">País</Label>
          <Select 
            value={state.businessData.country} 
            onValueChange={(value: 'BR' | 'PT') => updateBusinessData({ country: value })}
          >
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <div className="flex items-center gap-2">
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                    <span className="text-muted-foreground">({country.prefix})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Phone Input */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-base font-medium">
            Número de Telefone *
          </Label>
          <div className="relative">
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
              className="h-14 text-lg pl-14"
              autoFocus
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
              {countries.find(c => c.code === state.businessData.country)?.prefix}
            </div>
          </div>
        </div>

        {/* WhatsApp Checkbox */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-4 rounded-lg border bg-muted/30">
            <Checkbox
              id="isWhatsApp"
              checked={state.businessData.isWhatsApp}
              onCheckedChange={(checked) => updateBusinessData({ isWhatsApp: !!checked })}
            />
            <Label htmlFor="isWhatsApp" className="flex items-center gap-2 cursor-pointer">
              <MessageCircle className="w-4 h-4 text-green-600" />
              <span>Este número é WhatsApp Business</span>
            </Label>
          </div>
          {state.businessData.isWhatsApp && (
            <p className="text-sm text-muted-foreground px-4">
              Seus clientes poderão entrar em contato via WhatsApp usando o número: 
              <strong className="text-green-600"> {getFullPhoneNumber()}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};