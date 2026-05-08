"use client";
import { useState } from "react";

interface SmartTimeInputProps {
  name: string;
  defaultValue?: string;
  className?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClick?: (e: React.MouseEvent) => void;
}

export function SmartTimeInput({
  name,
  defaultValue = "",
  className = "",
  onBlur,
  onClick,
}: SmartTimeInputProps) {
  const [value, setValue] = useState(defaultValue);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, "");
    
    if (val.length > 0) {
      if (val.length === 1 || val.length === 2) {
        val = val.padStart(2, "0") + ":00";
      } else if (val.length === 3) {
        val = "0" + val[0] + ":" + val.slice(1);
      } else if (val.length === 4) {
        val = val.slice(0, 2) + ":" + val.slice(2);
      } else {
        val = defaultValue; // Fallback
      }

      // Validação básica de hora
      const [h, m] = val.split(":");
      if (Number(h) >= 0 && Number(h) <= 23 && Number(m) >= 0 && Number(m) <= 59) {
        setValue(val);
        e.target.value = val;
      } else {
        setValue(defaultValue);
        e.target.value = defaultValue;
      }
    }

    if (onBlur) {
      // Pequeno timeout para o state atualizar antes do form submeter (no onBlur do form)
      setTimeout(() => onBlur(e), 50);
    }
  };

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <input
        type="text"
        placeholder="00:00"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onClick={onClick}
        className={className}
        maxLength={5}
      />
    </>
  );
}
