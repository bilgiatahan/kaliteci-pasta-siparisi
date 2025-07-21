import React from "react";
import { SekilType, ShapeOption, ValidationError } from "@/types/order";

interface ShapeSelectorProps {
  label: string;
  options: readonly ShapeOption[];
  value: SekilType;
  onChange: (value: SekilType) => void;
  errors?: ValidationError[];
  required?: boolean;
}

export const ShapeSelector: React.FC<ShapeSelectorProps> = ({
  label,
  options,
  value,
  onChange,
  errors = [],
  required = false,
}) => {
  const hasErrors = errors.length > 0;

  const getShapeStyles = (shape: ShapeOption) => {
    const baseStyles =
      "flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105";

    if (value === shape.value) {
      switch (shape.className) {
        case "shape-heart":
          return `${baseStyles} border-red-400 bg-red-50 text-red-600 shadow-lg`;
        case "shape-circle":
          return `${baseStyles} border-blue-400 bg-blue-50 text-blue-600 shadow-lg`;
        case "shape-star":
          return `${baseStyles} border-yellow-400 bg-yellow-50 text-yellow-600 shadow-lg`;
        case "shape-custom":
          return `${baseStyles} border-purple-400 bg-purple-50 text-purple-600 shadow-lg`;
        default:
          return `${baseStyles} border-pink-500 bg-pink-50 text-pink-600 shadow-lg`;
      }
    }

    return `${baseStyles} border-gray-200 hover:border-gray-300 hover:shadow-md text-gray-600`;
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {options.map((shape) => (
          <div key={shape.value} className="relative">
            <input
              type="radio"
              name="sekil"
              value={shape.value}
              checked={value === shape.value}
              onChange={() => onChange(shape.value)}
              className="sr-only"
              required={required}
              id={`shape-${shape.value}`}
            />
            <label
              htmlFor={`shape-${shape.value}`}
              className={getShapeStyles(shape)}
            >
              <span className="text-4xl mb-2">{shape.emoji}</span>
              <span className="font-semibold text-center">{shape.label}</span>
            </label>
          </div>
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
