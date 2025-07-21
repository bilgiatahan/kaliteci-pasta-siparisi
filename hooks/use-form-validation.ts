import { useState, useCallback, useMemo } from "react";
import { OrderFormData, ValidationError } from "@/types/order";
import { FormValidator } from "@/lib/validations/form-validator";

interface UseFormValidationReturn {
  errors: ValidationError[];
  isValid: boolean;
  validateForm: (data: OrderFormData) => boolean;
  validateField: (
    field: keyof OrderFormData,
    value: any,
    formData?: Partial<OrderFormData>
  ) => void;
  clearErrors: () => void;
  clearFieldError: (field: keyof OrderFormData) => void;
  getFieldErrors: (field: keyof OrderFormData) => ValidationError[];
  hasFieldError: (field: keyof OrderFormData) => boolean;
}

// Custom hook for form validation - Single Responsibility: Validation Logic
export const useFormValidation = (): UseFormValidationReturn => {
  const [errors, setErrors] = useState<ValidationError[]>([]);

  // Validate entire form
  const validateForm = useCallback((data: OrderFormData): boolean => {
    const result = FormValidator.validateForm(data);
    setErrors(result.errors);
    return result.isValid;
  }, []);

  // Validate single field
  const validateField = useCallback(
    (
      field: keyof OrderFormData,
      value: any,
      formData?: Partial<OrderFormData>
    ) => {
      const result = FormValidator.validateField(field, value, formData);

      // Remove existing errors for this field
      setErrors((prev) => prev.filter((error) => error.field !== field));

      // Add new errors if any
      if (!result.isValid) {
        setErrors((prev) => [...prev, ...result.errors]);
      }
    },
    []
  );

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Clear errors for specific field
  const clearFieldError = useCallback((field: keyof OrderFormData) => {
    setErrors((prev) => prev.filter((error) => error.field !== field));
  }, []);

  // Get errors for specific field
  const getFieldErrors = useCallback(
    (field: keyof OrderFormData): ValidationError[] => {
      return errors.filter((error) => error.field === field);
    },
    [errors]
  );

  // Check if field has errors
  const hasFieldError = useCallback(
    (field: keyof OrderFormData): boolean => {
      return errors.some((error) => error.field === field);
    },
    [errors]
  );

  // Check if form is valid
  const isValid = useMemo(() => errors.length === 0, [errors]);

  return {
    errors,
    isValid,
    validateForm,
    validateField,
    clearErrors,
    clearFieldError,
    getFieldErrors,
    hasFieldError,
  };
};
