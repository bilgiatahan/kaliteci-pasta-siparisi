import { ValidationResult, OrderFormData } from "@/types/order";
import {
  validateEmail,
  validatePhone,
  validatePersonCount,
  validateRequiredField,
  validateDeliveryDate,
  validateDeliveryTime,
  validateFileSize,
  validateFileType,
  validateSpecialShape,
  validateAddress,
} from "./validators";

// Form validation orchestrator - follows Single Responsibility Principle
export class FormValidator {
  // Validate the entire form
  static validateForm(data: OrderFormData): ValidationResult {
    const allErrors = [
      // Customer information validation
      validateRequiredField(data.name, "Ad Soyad"),
      validateEmail(data.email),
      validatePhone(data.phone),

      // Cake specifications validation
      validateRequiredField(data.pandispanya, "Pandispanya"),
      validateRequiredField(data.krema, "Krema"),
      validateRequiredField(data.sekil, "Pasta Şekli"),
      validatePersonCount(data.kisiSayisi),
      validateSpecialShape(data.sekil, data.ozelSekil || ""),

      // Delivery information validation
      validateRequiredField(data.teslimat, "Teslimat Seçeneği"),
      validateDeliveryDate(data.teslimatTarihi),
      validateDeliveryTime(data.teslimatSaati),
      validateAddress(data.teslimat, data.adres || ""),

      // File validation
      validateFileSize(data.referansGorsel || null),
      validateFileType(data.referansGorsel || null),
    ];

    const errors = allErrors.flatMap((result) => result.errors);

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Validate individual field - useful for real-time validation
  static validateField(
    fieldName: keyof OrderFormData,
    value: any,
    formData?: Partial<OrderFormData>
  ): ValidationResult {
    switch (fieldName) {
      case "email":
        return validateEmail(value);

      case "phone":
        return validatePhone(value);

      case "name":
        return validateRequiredField(value, "Ad Soyad");

      case "pandispanya":
        return validateRequiredField(value, "Pandispanya");

      case "krema":
        return validateRequiredField(value, "Krema");

      case "sekil":
        return validateRequiredField(value, "Pasta Şekli");

      case "kisiSayisi":
        return validatePersonCount(Number(value));

      case "ozelSekil":
        return validateSpecialShape(formData?.sekil || "", value);

      case "teslimat":
        return validateRequiredField(value, "Teslimat Seçeneği");

      case "teslimatTarihi":
        return validateDeliveryDate(value);

      case "teslimatSaati":
        return validateDeliveryTime(value);

      case "adres":
        return validateAddress(formData?.teslimat || "", value);

      case "referansGorsel":
        return {
          isValid: true,
          errors: [
            ...validateFileSize(value).errors,
            ...validateFileType(value).errors,
          ],
        };

      default:
        return { isValid: true, errors: [] };
    }
  }

  // Check if specific field is required based on other form values
  static isFieldRequired(
    fieldName: keyof OrderFormData,
    formData: Partial<OrderFormData>
  ): boolean {
    switch (fieldName) {
      case "ozelSekil":
        return formData.sekil === "Özel Şekil";

      case "adres":
        return formData.teslimat === "Adrese Teslim";

      case "name":
      case "email":
      case "phone":
      case "pandispanya":
      case "krema":
      case "sekil":
      case "kisiSayisi":
      case "teslimat":
      case "teslimatTarihi":
      case "teslimatSaati":
        return true;

      default:
        return false;
    }
  }
}
