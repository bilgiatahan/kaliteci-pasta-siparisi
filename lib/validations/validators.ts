import { VALIDATION_RULES, ERROR_MESSAGES } from "@/constants/order";
import {
  ValidationResult,
  ValidationError,
  OrderFormData,
} from "@/types/order";

// Individual validator functions - Single Responsibility Principle
export const validateEmail = (email: string): ValidationResult => {
  const isValid = VALIDATION_RULES.EMAIL.PATTERN.test(email);

  return {
    isValid,
    errors: isValid
      ? []
      : [{ field: "email", message: ERROR_MESSAGES.INVALID_EMAIL }],
  };
};

export const validatePhone = (phone: string): ValidationResult => {
  const cleanPhone = phone
    .replace(VALIDATION_RULES.PHONE.PREFIX, "")
    .replace(/\s/g, "");
  const isValid = VALIDATION_RULES.PHONE.PATTERN.test(cleanPhone);

  return {
    isValid,
    errors: isValid
      ? []
      : [{ field: "phone", message: ERROR_MESSAGES.INVALID_PHONE }],
  };
};

export const validatePersonCount = (count: number): ValidationResult => {
  const isValid =
    count >= VALIDATION_RULES.PERSON_COUNT.MIN &&
    count <= VALIDATION_RULES.PERSON_COUNT.MAX;

  return {
    isValid,
    errors: isValid
      ? []
      : [
          {
            field: "kisiSayisi",
            message: `Kişi sayısı ${VALIDATION_RULES.PERSON_COUNT.MIN}-${VALIDATION_RULES.PERSON_COUNT.MAX} arasında olmalıdır`,
          },
        ],
  };
};

export const validateRequiredField = (
  value: string | number,
  fieldName: string
): ValidationResult => {
  const isValid = Boolean(value && value.toString().trim());

  return {
    isValid,
    errors: isValid
      ? []
      : [
          {
            field: fieldName,
            message: `${fieldName} alanı zorunludur`,
          },
        ],
  };
};

export const validateDeliveryDate = (date: string): ValidationResult => {
  if (!date) {
    return {
      isValid: false,
      errors: [
        { field: "teslimatTarihi", message: "Teslimat tarihi seçilmelidir" },
      ],
    };
  }

  const selectedDate = new Date(date);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const isValid = selectedDate >= tomorrow;

  return {
    isValid,
    errors: isValid
      ? []
      : [
          {
            field: "teslimatTarihi",
            message: "Teslimat tarihi en az bir gün sonra olmalıdır",
          },
        ],
  };
};

export const validateDeliveryTime = (time: string): ValidationResult => {
  if (!time) {
    return {
      isValid: false,
      errors: [
        { field: "teslimatSaati", message: "Teslimat saati seçilmelidir" },
      ],
    };
  }

  const [hours] = time.split(":").map(Number);
  const isValid = hours >= VALIDATION_RULES.PHONE.PREFIX.length && hours <= 18; // Using business hours

  return {
    isValid,
    errors: isValid
      ? []
      : [
          {
            field: "teslimatSaati",
            message: "Teslimat saati 09:00-18:00 arasında olmalıdır",
          },
        ],
  };
};

export const validateFileSize = (file: File | null): ValidationResult => {
  if (!file) return { isValid: true, errors: [] };

  const maxSizeBytes = 10 * 1024 * 1024; // 10MB
  const isValid = file.size <= maxSizeBytes;

  return {
    isValid,
    errors: isValid
      ? []
      : [
          {
            field: "referansGorsel",
            message: "Dosya boyutu 10MB'dan küçük olmalıdır",
          },
        ],
  };
};

export const validateFileType = (file: File | null): ValidationResult => {
  if (!file) return { isValid: true, errors: [] };

  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  const isValid = allowedTypes.includes(file.type);

  return {
    isValid,
    errors: isValid
      ? []
      : [
          {
            field: "referansGorsel",
            message: "Sadece JPG, PNG ve GIF formatları desteklenir",
          },
        ],
  };
};

// Composite validator for special shape requirement
export const validateSpecialShape = (
  sekil: string,
  ozelSekil: string
): ValidationResult => {
  if (sekil !== "Özel Şekil") return { isValid: true, errors: [] };

  const isValid = Boolean(ozelSekil && ozelSekil.trim());

  return {
    isValid,
    errors: isValid
      ? []
      : [
          {
            field: "ozelSekil",
            message: "Özel şekil seçtiyseniz açıklama yazmalısınız",
          },
        ],
  };
};

// Composite validator for address requirement
export const validateAddress = (
  teslimat: string,
  adres: string
): ValidationResult => {
  if (teslimat !== "Adrese Teslim") return { isValid: true, errors: [] };

  const isValid = Boolean(adres && adres.trim());

  return {
    isValid,
    errors: isValid
      ? []
      : [
          {
            field: "adres",
            message: "Adrese teslim seçtiyseniz adres belirtmelisiniz",
          },
        ],
  };
};
