import { useState, useCallback } from "react";
import { OrderFormData, ValidationError } from "@/types/order";
import { DEFAULT_FORM_VALUES } from "@/constants/order";

interface UseFormStateReturn {
  formData: OrderFormData;
  updateField: <K extends keyof OrderFormData>(
    field: K,
    value: OrderFormData[K]
  ) => void;
  updateMultipleFields: (updates: Partial<OrderFormData>) => void;
  resetForm: () => void;
  isDirty: boolean;
}

// Custom hook for managing form state - Single Responsibility: Form State Management
export const useFormState = (
  initialData?: Partial<OrderFormData>
): UseFormStateReturn => {
  const [formData, setFormData] = useState<OrderFormData>(
    () =>
      ({
        ...DEFAULT_FORM_VALUES,
        ...initialData,
      } as OrderFormData)
  );

  const [initialFormData] = useState<OrderFormData>(
    () =>
      ({
        ...DEFAULT_FORM_VALUES,
        ...initialData,
      } as OrderFormData)
  );

  // Update a single field
  const updateField = useCallback(
    <K extends keyof OrderFormData>(field: K, value: OrderFormData[K]) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  // Update multiple fields at once
  const updateMultipleFields = useCallback(
    (updates: Partial<OrderFormData>) => {
      setFormData((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    []
  );

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData({
      ...DEFAULT_FORM_VALUES,
      ...initialData,
    } as OrderFormData);
  }, [initialData]);

  // Check if form has been modified
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialFormData);

  return {
    formData,
    updateField,
    updateMultipleFields,
    resetForm,
    isDirty,
  };
};
