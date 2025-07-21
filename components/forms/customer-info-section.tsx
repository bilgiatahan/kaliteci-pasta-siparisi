import React from "react";
import { OrderFormData, ValidationError } from "@/types/order";
import { FormInput } from "@/components/ui";
import { VALIDATION_RULES } from "@/constants/order";

interface CustomerInfoSectionProps {
  formData: OrderFormData;
  updateField: <K extends keyof OrderFormData>(
    field: K,
    value: OrderFormData[K]
  ) => void;
  getFieldErrors: (field: keyof OrderFormData) => ValidationError[];
  validateField: (
    field: keyof OrderFormData,
    value: any,
    formData?: Partial<OrderFormData>
  ) => void;
}

export const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = ({
  formData,
  updateField,
  getFieldErrors,
  validateField,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormInput
        label="Adınız Soyadınız"
        required
        value={formData.name}
        onChange={(e) => updateField("name", e.target.value)}
        onBlur={() => validateField("name", formData.name)}
        placeholder="Adınız ve soyadınız"
        errors={getFieldErrors("name")}
      />

      <FormInput
        label="Telefon Numaranız"
        icon="📱"
        type="tel"
        required
        value={formData.phone.replace(VALIDATION_RULES.PHONE.PREFIX, "")}
        onChange={(e) => {
          let value = e.target.value.replace(/\D/g, "");
          if (value.length <= 10) {
            updateField("phone", VALIDATION_RULES.PHONE.PREFIX + value);
          }
        }}
        onBlur={() => validateField("phone", formData.phone)}
        placeholder="532 123 45 67"
        maxLength={10}
        description="5XX XXX XX XX formatında 10 haneli numara girin"
        errors={getFieldErrors("phone")}
      />

      <div className="md:col-span-2">
        <FormInput
          label="E-mail Adresiniz"
          type="email"
          required
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          onBlur={() => validateField("email", formData.email)}
          placeholder="ornek@email.com"
          errors={getFieldErrors("email")}
        />
      </div>
    </div>
  );
};
