import React from "react";
import { ValidationError, FormOption } from "@/types/order";

interface FormRadioProps<T> {
  label: string;
  name: string;
  options: readonly FormOption<T>[];
  value: T;
  onChange: (value: T) => void;
  errors?: ValidationError[];
  required?: boolean;
  className?: string;
}

export const FormRadio = <T,>({
  label,
  name,
  options,
  value,
  onChange,
  errors = [],
  required = false,
  className = "",
}: FormRadioProps<T>) => {
  const hasErrors = errors.length > 0;

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <label
            key={index}
            className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <input
              type="radio"
              name={name}
              value={String(option.value)}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="mr-3 text-pink-500 focus:ring-pink-400"
              required={required}
            />
            <span className="font-medium">{option.label}</span>
          </label>
        ))}
      </div>

      {hasErrors && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p
              key={index}
              className="text-xs text-red-500 flex items-center"
              role="alert"
            >
              ❌ {error.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
