import { useState, useCallback } from "react";
import { OrderFormData, OrderSubmissionResponse } from "@/types/order";
import {
  API_ENDPOINTS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "@/constants/order";

interface UseOrderSubmissionReturn {
  isSubmitting: boolean;
  submitOrder: (
    data: OrderFormData
  ) => Promise<{ success: boolean; message: string }>;
  lastSubmissionResult: { success: boolean; message: string } | null;
}

// Custom hook for order submission - Single Responsibility: API Communication
export const useOrderSubmission = (): UseOrderSubmissionReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmissionResult, setLastSubmissionResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const submitOrder = useCallback(
    async (
      data: OrderFormData
    ): Promise<{ success: boolean; message: string }> => {
      setIsSubmitting(true);

      try {
        // Prepare FormData for file upload
        const formData = new FormData();

        // Add all form fields to FormData
        Object.entries(data).forEach(([key, value]) => {
          if (key === "referansGorsel") {
            if (value) {
              formData.append("referansGorsel", value as File);
            }
          } else if (key === "icerikler") {
            formData.append("icerikler", JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        });

        // Submit to API
        const response = await fetch(API_ENDPOINTS.ORDERS, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          const successResult = {
            success: true,
            message: SUCCESS_MESSAGES.ORDER_SUBMITTED,
          };
          setLastSubmissionResult(successResult);
          return successResult;
        } else {
          // Handle specific error cases
          let errorMessage: string = ERROR_MESSAGES.SUBMIT_ERROR;

          if (response.status === 429) {
            // Rate limiting error
            errorMessage = result.warning
              ? `${ERROR_MESSAGES.RATE_LIMIT_ERROR}. ${result.warning}`
              : ERROR_MESSAGES.RATE_LIMIT_ERROR;
          } else if (result.error) {
            errorMessage = result.error;
          }

          const errorResult = {
            success: false,
            message: errorMessage,
          };
          setLastSubmissionResult(errorResult);
          return errorResult;
        }
      } catch (error) {
        console.error("Order submission error:", error);
        const errorResult = {
          success: false,
          message: ERROR_MESSAGES.CONNECTION_ERROR,
        };
        setLastSubmissionResult(errorResult);
        return errorResult;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  return {
    isSubmitting,
    submitOrder,
    lastSubmissionResult,
  };
};
