import { OrderFormData, ValidationResult } from "@/types/order";
import { FormValidator } from "@/lib/validations/form-validator";
import { OrderService } from "./order-service";

// Validation service that combines form validation with business rules - Single Responsibility
export class ValidationService {
  // Comprehensive validation including business rules
  static validateOrder(orderData: OrderFormData): ValidationResult {
    // First run standard form validation
    const formValidation = FormValidator.validateForm(orderData);

    // Then check business rules
    const businessValidation = OrderService.validateBusinessRules(orderData);

    // Combine results
    const allErrors = [
      ...formValidation.errors,
      ...businessValidation.errors.map((error) => ({
        field: "business",
        message: error,
      })),
    ];

    return {
      isValid: formValidation.isValid && businessValidation.isValid,
      errors: allErrors,
    };
  }

  // Pre-submission validation (includes rate limiting check)
  static validateForSubmission(
    orderData: OrderFormData
  ): ValidationResult & {
    rateLimitInfo?: import("@/types/order").RateLimitInfo;
  } {
    // Run order validation
    const orderValidation = this.validateOrder(orderData);

    // Check rate limiting
    const rateLimitInfo = OrderService.checkRateLimit(orderData.phone);

    if (!rateLimitInfo.isAllowed) {
      return {
        isValid: false,
        errors: [
          ...orderValidation.errors,
          {
            field: "phone",
            message: `Bu telefon numarası ile çok yakın zamanda sipariş verilmiş. ${
              rateLimitInfo.remainingHours! > 0
                ? `${rateLimitInfo.remainingHours} saat `
                : ""
            }${
              rateLimitInfo.remainingMinutes
            } dakika beklemeniz gerekmektedir.`,
          },
        ],
        rateLimitInfo,
      };
    }

    return {
      ...orderValidation,
      rateLimitInfo,
    };
  }

  // Real-time field validation
  static validateFieldRealtime(
    fieldName: keyof OrderFormData,
    value: any,
    formData?: Partial<OrderFormData>
  ): ValidationResult {
    return FormValidator.validateField(fieldName, value, formData);
  }

  // Check if field is required based on current form state
  static isFieldRequired(
    fieldName: keyof OrderFormData,
    formData: Partial<OrderFormData>
  ): boolean {
    return FormValidator.isFieldRequired(fieldName, formData);
  }
}
