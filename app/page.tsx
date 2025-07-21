"use client";

import Image from "next/image";
import { useOrderForm } from "@/hooks";
import { OrderFormLayout } from "@/components/forms/order-form-layout";
import { NotificationPopup } from "@/components/ui/notification-popup";

export default function Home() {
  const {
    formData,
    updateField,
    isSubmitting,
    submitForm,
    getFieldErrors,
    hasFieldError,
    validateField,
    notification,
    isNotificationVisible,
    hideNotification,
  } = useOrderForm();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <Image
            src="/logo.jpeg"
            alt="Kaliteci Logo"
            width={200}
            height={100}
            className="m-auto"
          />
          <div className="text-center">
            <p className="text-gray-600">Özel Pasta Sipariş Sistemi</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <OrderFormLayout
              formData={formData}
              updateField={updateField}
              onSubmit={submitForm}
              isSubmitting={isSubmitting}
              getFieldErrors={getFieldErrors}
              hasFieldError={hasFieldError}
              validateField={validateField}
            />
          </div>
        </div>
      </main>

      {/* Notification Popup */}
      {notification && (
        <NotificationPopup
          notification={notification}
          isVisible={isNotificationVisible}
          onClose={hideNotification}
        />
      )}
    </div>
  );
}
