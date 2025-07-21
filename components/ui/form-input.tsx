import React from "react";
import { ValidationError } from "@/types/order";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errors?: ValidationError[];
  required?: boolean;
  description?: string;
  icon?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  errors = [],
  required = false,
  description,
  icon,
  className = "",
  ...inputProps
}) => {
  const hasErrors = errors.length > 0;
  const inputId =
    inputProps.id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        {...inputProps}
        id={inputId}
        className={`
          w-full px-4 py-3 border rounded-lg 
          focus:ring-2 focus:ring-pink-500 focus:border-transparent
          transition-all duration-200
          ${hasErrors ? "border-red-500" : "border-gray-300"}
          ${className}
        `}
        aria-invalid={hasErrors}
        aria-describedby={description ? `${inputId}-description` : undefined}
      />

      {description && (
        <p
          id={`${inputId}-description`}
          className="text-xs text-gray-500 flex items-center"
        >
          ✅ {description}
        </p>
      )}

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
