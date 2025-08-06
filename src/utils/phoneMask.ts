export const formatPhoneNumber = (value: string): string => {
  // Remove tudo que não é número
  const numbersOnly = value.replace(/\D/g, '');
  
  if (numbersOnly.length === 0) return '';
  
  // Detecta se é número brasileiro (começa com 55) ou internacional
  if (numbersOnly.startsWith('55') && numbersOnly.length >= 13) {
    // Formato brasileiro: +55 (11) 99999-9999
    const ddd = numbersOnly.slice(2, 4);
    const firstPart = numbersOnly.slice(4, 9);
    const secondPart = numbersOnly.slice(9, 13);
    return `+55 (${ddd}) ${firstPart}-${secondPart}`;
  } else if (numbersOnly.length >= 10) {
    // Formato internacional genérico: +XX XXX XXX XXXX
    const countryCode = numbersOnly.slice(0, 2);
    const remaining = numbersOnly.slice(2);
    const formatted = remaining.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    return `+${countryCode} ${formatted}`;
  } else {
    // Número em progresso
    return `+${numbersOnly}`;
  }
};

export const cleanPhoneNumber = (value: string): string => {
  return value.replace(/\D/g, '');
};