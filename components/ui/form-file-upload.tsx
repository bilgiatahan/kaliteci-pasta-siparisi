import React from "react";
import { ValidationError } from "@/types/order";

interface FormFileUploadProps {
  label: string;
  accept?: string;
  file: File | null;
  onChange: (file: File | null) => void;
  errors?: ValidationError[];
  description?: string;
  icon?: string;
  maxSizeMB?: number;
}

export const FormFileUpload: React.FC<FormFileUploadProps> = ({
  label,
  accept = "image/*",
  file,
  onChange,
  errors = [],
  description,
  icon = "🖼️",
  maxSizeMB = 10,
}) => {
  const hasErrors = errors.length > 0;
  const inputId = `file-upload-${label.toLowerCase().replace(/\s+/g, "-")}`;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    onChange(selectedFile);
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </label>

      <div
        className={`
        border-2 border-dashed rounded-lg p-6 text-center 
        hover:border-pink-400 transition-colors cursor-pointer
        ${hasErrors ? "border-red-300" : "border-gray-300"}
      `}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id={inputId}
        />

        <label
          htmlFor={inputId}
          className="cursor-pointer flex flex-col items-center"
        >
          {file ? (
            <div className="text-green-600">
              <div className="text-4xl mb-2">✅</div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Başka dosya seçmek için tıklayın
              </p>
            </div>
          ) : (
            <div className="text-gray-500">
              <div className="text-4xl mb-2">📷</div>
              <p className="font-medium">{description || "Dosya seçin"}</p>
              <p className="text-sm mt-1">Maksimum {maxSizeMB}MB</p>
            </div>
          )}
        </label>
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
