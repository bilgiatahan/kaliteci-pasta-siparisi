import React from "react";
import { ValidationError } from "@/types/order";

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  errors?: ValidationError[];
  required?: boolean;
  description?: string;
  icon?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  errors = [],
  required = false,
  description,
  icon,
  className = "",
  ...textareaProps
}) => {
  const hasErrors = errors.length > 0;
  const textareaId =
    textareaProps.id || `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={textareaId}
        className="block text-sm font-medium text-gray-700"
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <textarea
        {...textareaProps}
        id={textareaId}
        className={`
          w-full px-4 py-3 border rounded-lg 
          focus:ring-2 focus:ring-pink-500 focus:border-transparent
          transition-all duration-200 resize-vertical
          ${hasErrors ? "border-red-500" : "border-gray-300"}
          ${className}
        `}
        aria-invalid={hasErrors}
        aria-describedby={description ? `${textareaId}-description` : undefined}
      />

      {description && (
        <p id={`${textareaId}-description`} className="text-xs text-gray-500">
          {description}
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
