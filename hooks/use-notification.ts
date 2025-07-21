import { useState, useCallback, useEffect } from "react";
import { UI_CONSTANTS } from "@/constants/order";

export interface Notification {
  message: string;
  type: "success" | "error" | "info" | "warning";
  id: string;
}

interface UseNotificationReturn {
  notification: Notification | null;
  showNotification: (
    message: string,
    type: "success" | "error" | "info" | "warning"
  ) => void;
  hideNotification: () => void;
  isVisible: boolean;
}

// Custom hook for notification management - Single Responsibility: UI Notifications
export const useNotification = (
  autoDismissDelay = UI_CONSTANTS.POPUP_AUTO_CLOSE_DELAY
): UseNotificationReturn => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showNotification = useCallback(
    (message: string, type: "success" | "error" | "info" | "warning") => {
      const newNotification: Notification = {
        message,
        type,
        id: Date.now().toString(),
      };

      setNotification(newNotification);
      setIsVisible(true);
    },
    []
  );

  const hideNotification = useCallback(() => {
    setIsVisible(false);
    // Wait for animation to complete before clearing notification
    setTimeout(() => {
      setNotification(null);
    }, 300);
  }, []);

  // Auto-dismiss notification after delay
  useEffect(() => {
    if (notification && isVisible) {
      const timer = setTimeout(() => {
        hideNotification();
      }, autoDismissDelay);

      return () => clearTimeout(timer);
    }
  }, [notification, isVisible, autoDismissDelay, hideNotification]);

  return {
    notification,
    showNotification,
    hideNotification,
    isVisible,
  };
};
