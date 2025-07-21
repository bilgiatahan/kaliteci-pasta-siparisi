import React from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { tr } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { OrderFormData, ValidationError } from "@/types/order";
import { FormRadio, FormTextarea } from "@/components/ui";
import {
  TESLIMAT_OPTIONS,
  UI_CONSTANTS,
  DELIVERY_CONSTRAINTS,
} from "@/constants/order";

registerLocale("tr", tr);

interface DeliverySectionProps {
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

export const DeliverySection: React.FC<DeliverySectionProps> = ({
  formData,
  updateField,
  getFieldErrors,
  validateField,
}) => {
  return (
    <div className="space-y-6">
      {/* Delivery Option */}
      <FormRadio
        label="Teslimat Seçeneği"
        name="teslimat"
        options={TESLIMAT_OPTIONS}
        value={formData.teslimat}
        onChange={(value) => updateField("teslimat", value)}
        required
        errors={getFieldErrors("teslimat")}
      />

      {/* Address (if home delivery) */}
      {formData.teslimat === "Adrese Teslim" && (
        <FormTextarea
          label="Teslimat Adresi"
          icon="🏠"
          required
          value={formData.adres || ""}
          onChange={(e) => updateField("adres", e.target.value)}
          onBlur={() => validateField("adres", formData.adres, formData)}
          rows={4}
          placeholder="Tam adresinizi yazın..."
          errors={getFieldErrors("adres")}
        />
      )}

      {/* Delivery Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            📅 Teslimat Tarihi *
          </label>
          <DatePicker
            selected={
              formData.teslimatTarihi ? new Date(formData.teslimatTarihi) : null
            }
            onChange={(date: Date | null) => {
              const dateString = date ? date.toISOString().split("T")[0] : "";
              updateField("teslimatTarihi", dateString);
              validateField("teslimatTarihi", dateString);
            }}
            minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
            dateFormat={UI_CONSTANTS.DATE_FORMAT}
            locale={UI_CONSTANTS.LOCALE}
            placeholderText="Tarih seçin"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
            required
          />
          {getFieldErrors("teslimatTarihi").map((error, index) => (
            <p
              key={index}
              className="text-xs text-red-500 flex items-center"
              role="alert"
            >
              ❌ {error.message}
            </p>
          ))}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            ⏰ Teslimat Saati *
          </label>
          <DatePicker
            selected={
              formData.teslimatSaati
                ? new Date(`2024-01-01 ${formData.teslimatSaati}`)
                : null
            }
            onChange={(time: Date | null) => {
              if (time) {
                const hours = time.getHours().toString().padStart(2, "0");
                const minutes = time.getMinutes().toString().padStart(2, "0");
                const timeString = `${hours}:${minutes}`;
                updateField("teslimatSaati", timeString);
                validateField("teslimatSaati", timeString);
              }
            }}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={DELIVERY_CONSTRAINTS.TIME_INTERVAL_MINUTES}
            timeCaption="Saat"
            dateFormat={UI_CONSTANTS.TIME_FORMAT}
            placeholderText="Saat seçin"
            minTime={
              new Date(
                new Date().setHours(
                  DELIVERY_CONSTRAINTS.MIN_HOURS_ADVANCE,
                  0,
                  0
                )
              )
            }
            maxTime={
              new Date(
                new Date().setHours(
                  DELIVERY_CONSTRAINTS.MAX_HOURS_ADVANCE,
                  0,
                  0
                )
              )
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
            locale={UI_CONSTANTS.LOCALE}
            required
          />
          {getFieldErrors("teslimatSaati").map((error, index) => (
            <p
              key={index}
              className="text-xs text-red-500 flex items-center"
              role="alert"
            >
              ❌ {error.message}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
