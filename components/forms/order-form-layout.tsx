import React from "react";
import { OrderFormData, ValidationError } from "@/types/order";
import {
  PANDISPANYA_OPTIONS,
  KREMA_OPTIONS,
  ICERIK_OPTIONS,
  SEKIL_OPTIONS,
  TESLIMAT_OPTIONS,
  KAT_SAYISI_OPTIONS,
  VALIDATION_RULES,
} from "@/constants/order";
import {
  FormInput,
  FormRadio,
  FormCheckbox,
  FormTextarea,
  FormFileUpload,
  ShapeSelector,
} from "@/components/ui";
import { CustomerInfoSection } from "./customer-info-section";
import { CakeSpecsSection } from "./cake-specs-section";
import { DeliverySection } from "./delivery-section";
import { SubmitButton } from "./submit-button";

interface OrderFormLayoutProps {
  formData: OrderFormData;
  updateField: <K extends keyof OrderFormData>(
    field: K,
    value: OrderFormData[K]
  ) => void;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  getFieldErrors: (field: keyof OrderFormData) => ValidationError[];
  hasFieldError: (field: keyof OrderFormData) => boolean;
  validateField: (
    field: keyof OrderFormData,
    value: any,
    formData?: Partial<OrderFormData>
  ) => void;
}

export const OrderFormLayout: React.FC<OrderFormLayoutProps> = ({
  formData,
  updateField,
  onSubmit,
  isSubmitting,
  getFieldErrors,
  hasFieldError,
  validateField,
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information Section */}
      <CustomerInfoSection
        formData={formData}
        updateField={updateField}
        getFieldErrors={getFieldErrors}
        validateField={validateField}
      />

      <hr />

      {/* Cake Specifications Section */}
      <CakeSpecsSection
        formData={formData}
        updateField={updateField}
        getFieldErrors={getFieldErrors}
        validateField={validateField}
      />

      <hr />

      {/* Delivery Information Section */}
      <DeliverySection
        formData={formData}
        updateField={updateField}
        getFieldErrors={getFieldErrors}
        validateField={validateField}
      />

      <hr />

      {/* Special Notes Section */}
      <FormTextarea
        label="Özel Notlarınız"
        icon="📝"
        rows={4}
        value={formData.ozelNotlar || ""}
        onChange={(e) => updateField("ozelNotlar", e.target.value)}
        placeholder="Pastanız ile ilgili özel isteklerinizi yazın..."
        errors={getFieldErrors("ozelNotlar")}
      />

      {/* Reference Image Section */}
      <FormFileUpload
        label="Referans Görsel (İsteğe Bağlı)"
        description="İstediğiniz pasta modelinin fotoğrafını yükleyin"
        file={formData.referansGorsel || null}
        onChange={(file) => updateField("referansGorsel", file)}
        errors={getFieldErrors("referansGorsel")}
        maxSizeMB={10}
      />

      {/* Submit Button */}
      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
};
