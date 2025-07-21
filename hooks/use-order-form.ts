import { useCallback } from "react";
import { OrderFormData } from "@/types/order";
import { useFormState } from "./use-form-state";
import { useFormValidation } from "./use-form-validation";
import { useOrderSubmission } from "./use-order-submission";
import { useNotification, type Notification } from "./use-notification";

interface UseOrderFormReturn {
  // Form state
  formData: OrderFormData;
  updateField: <K extends keyof OrderFormData>(
    field: K,
    value: OrderFormData[K]
  ) => void;
  updateMultipleFields: (updates: Partial<OrderFormData>) => void;
  resetForm: () => void;
  isDirty: boolean;

  // Validation
  errors: import("@/types/order").ValidationError[];
  isValid: boolean;
  getFieldErrors: (
    field: keyof OrderFormData
  ) => import("@/types/order").ValidationError[];
  hasFieldError: (field: keyof OrderFormData) => boolean;
  validateField: (
    field: keyof OrderFormData,
    value: any,
    formData?: Partial<OrderFormData>
  ) => void;

  // Submission
  isSubmitting: boolean;
  submitForm: () => Promise<void>;

  // Notifications
  notification: Notification | null;
  isNotificationVisible: boolean;
  hideNotification: () => void;
}

// Composite hook that combines all form functionality - Facade Pattern
export const useOrderForm = (
  initialData?: Partial<OrderFormData>
): UseOrderFormReturn => {
  const { formData, updateField, updateMultipleFields, resetForm, isDirty } =
    useFormState(initialData);

  const {
    errors,
    isValid,
    validateForm,
    validateField,
    getFieldErrors,
    hasFieldError,
    clearErrors,
  } = useFormValidation();

  const { isSubmitting, submitOrder } = useOrderSubmission();

  const {
    notification,
    isVisible: isNotificationVisible,
    showNotification,
    hideNotification,
  } = useNotification();

  // Submit form with validation and notification
  const submitForm = useCallback(async () => {
    // Validate form before submission
    const isFormValid = validateForm(formData);

    if (!isFormValid) {
      showNotification("Lütfen form hatalarını düzeltin", "error");
      return;
    }

    try {
      const result = await submitOrder(formData);

      if (result.success) {
        showNotification(result.message, "success");
        resetForm();
        clearErrors();
      } else {
        showNotification(result.message, "error");
      }
    } catch (error) {
      showNotification("Beklenmeyen bir hata oluştu", "error");
    }
  }, [
    formData,
    validateForm,
    submitOrder,
    showNotification,
    resetForm,
    clearErrors,
  ]);

  return {
    // Form state
    formData,
    updateField,
    updateMultipleFields,
    resetForm,
    isDirty,

    // Validation
    errors,
    isValid,
    getFieldErrors,
    hasFieldError,
    validateField,

    // Submission
    isSubmitting,
    submitForm,

    // Notifications
    notification,
    isNotificationVisible,
    hideNotification,
  };
};
