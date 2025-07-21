import React from "react";
import { Notification } from "@/hooks/use-notification";

interface NotificationPopupProps {
  notification: Notification;
  isVisible: boolean;
  onClose: () => void;
}

export const NotificationPopup: React.FC<NotificationPopupProps> = ({
  notification,
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null;

  const getNotificationStyles = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return {
          container: "bg-green-50 border-2 border-green-200",
          icon: "✅",
          iconColor: "text-green-500",
          textColor: "text-green-800",
        };
      case "error":
        return {
          container: "bg-red-50 border-2 border-red-200",
          icon: "❌",
          iconColor: "text-red-500",
          textColor: "text-red-800",
        };
      case "warning":
        return {
          container: "bg-yellow-50 border-2 border-yellow-200",
          icon: "⚠️",
          iconColor: "text-yellow-500",
          textColor: "text-yellow-800",
        };
      case "info":
        return {
          container: "bg-blue-50 border-2 border-blue-200",
          icon: "ℹ️",
          iconColor: "text-blue-500",
          textColor: "text-blue-800",
        };
      default:
        return {
          container: "bg-gray-50 border-2 border-gray-200",
          icon: "🔔",
          iconColor: "text-gray-500",
          textColor: "text-gray-800",
        };
    }
  };

  const styles = getNotificationStyles(notification.type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div
        className={`relative max-w-md w-full p-6 rounded-2xl shadow-2xl transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        } ${styles.container}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors"
          aria-label="Close notification"
        >
          ×
        </button>

        <div className="text-center">
          <div className={`text-6xl mb-4 ${styles.iconColor}`}>
            {styles.icon}
          </div>

          <p className={`text-lg font-medium ${styles.textColor}`}>
            {notification.message}
          </p>

          {notification.type === "success" && (
            <p className="text-sm text-green-600 mt-2">
              Bu mesaj 5 saniye sonra otomatik kapanacak
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
