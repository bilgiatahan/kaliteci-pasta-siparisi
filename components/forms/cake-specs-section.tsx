import React from "react";
import { OrderFormData, ValidationError } from "@/types/order";
import {
  FormInput,
  FormRadio,
  FormCheckbox,
  ShapeSelector,
} from "@/components/ui";
import {
  PANDISPANYA_OPTIONS,
  KREMA_OPTIONS,
  ICERIK_OPTIONS,
  SEKIL_OPTIONS,
  KAT_SAYISI_OPTIONS,
  VALIDATION_RULES,
} from "@/constants/order";

interface CakeSpecsSectionProps {
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

export const CakeSpecsSection: React.FC<CakeSpecsSectionProps> = ({
  formData,
  updateField,
  getFieldErrors,
  validateField,
}) => {
  return (
    <div className="space-y-6">
      {/* Person Count */}
      <FormInput
        label="Kaç Kişilik? (1-50 arası)"
        type="number"
        min={VALIDATION_RULES.PERSON_COUNT.MIN}
        max={VALIDATION_RULES.PERSON_COUNT.MAX}
        required
        value={formData.kisiSayisi.toString()}
        onChange={(e) =>
          updateField("kisiSayisi", parseInt(e.target.value) || 0)
        }
        onBlur={() => validateField("kisiSayisi", formData.kisiSayisi)}
        placeholder="Kişi sayısı"
        errors={getFieldErrors("kisiSayisi")}
      />

      {/* Layer Count (for 10+ people) */}
      {formData.kisiSayisi >=
        VALIDATION_RULES.PERSON_COUNT.MULTI_LAYER_THRESHOLD && (
        <FormRadio
          label="Kat Sayısı"
          name="katSayisi"
          options={KAT_SAYISI_OPTIONS}
          value={formData.katSayisi}
          onChange={(value) => updateField("katSayisi", value)}
          errors={getFieldErrors("katSayisi")}
        />
      )}

      {/* Pandispanya Type */}
      <FormRadio
        label="Pandispanya Türü"
        name="pandispanya"
        options={PANDISPANYA_OPTIONS}
        value={formData.pandispanya}
        onChange={(value) => updateField("pandispanya", value)}
        required
        errors={getFieldErrors("pandispanya")}
      />

      {/* Cream Type */}
      <FormRadio
        label="Krema Türü"
        name="krema"
        options={KREMA_OPTIONS}
        value={formData.krema}
        onChange={(value) => updateField("krema", value)}
        required
        errors={getFieldErrors("krema")}
      />

      {/* Ingredients */}
      <FormCheckbox
        label="İçerik Seçenekleri (Birden fazla seçebilirsiniz)"
        options={ICERIK_OPTIONS}
        values={formData.icerikler}
        onChange={(values) => updateField("icerikler", values)}
        errors={getFieldErrors("icerikler")}
      />

      {/* Shape Selection */}
      <ShapeSelector
        label="Pasta Şekli"
        options={SEKIL_OPTIONS}
        value={formData.sekil}
        onChange={(value) => updateField("sekil", value)}
        required
        errors={getFieldErrors("sekil")}
      />

      {/* Custom Shape Description */}
      {formData.sekil === "Özel Şekil" && (
        <FormInput
          label="Özel Şekil Açıklaması"
          value={formData.ozelSekil || ""}
          onChange={(e) => updateField("ozelSekil", e.target.value)}
          onBlur={() =>
            validateField("ozelSekil", formData.ozelSekil, formData)
          }
          placeholder="Özel şekil talebinizi yazın..."
          required
          errors={getFieldErrors("ozelSekil")}
        />
      )}
    </div>
  );
};
