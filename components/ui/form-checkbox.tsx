import React from "react";
import { ValidationError, FormOption } from "@/types/order";

interface FormCheckboxProps<T> {
  label: string;
  options: readonly FormOption<T>[];
  values: T[];
  onChange: (values: T[]) => void;
  errors?: ValidationError[];
  className?: string;
  gridCols?: string;
}

export const FormCheckbox = <T,>({
  label,
  options,
  values,
  onChange,
  errors = [],
  className = "",
  gridCols = "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
}: FormCheckboxProps<T>) => {
  const hasErrors = errors.length > 0;

  const handleChange = (optionValue: T, checked: boolean) => {
    if (checked) {
      onChange([...values, optionValue]);
    } else {
      onChange(values.filter((v) => v !== optionValue));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      <div className={`grid ${gridCols} gap-3`}>
        {options.map((option, index) => (
          <label
            key={index}
            className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer text-sm transition-colors"
          >
            <input
              type="checkbox"
              checked={values.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              className="mr-2 text-pink-500 focus:ring-pink-400"
            />
            <span>{option.label}</span>
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
