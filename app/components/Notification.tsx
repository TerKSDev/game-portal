"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoWarning,
  IoInformationCircle,
  IoClose,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationData {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
}

interface ConfirmationOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface NotificationContextType {
  showSuccess: (message: string, title?: string, duration?: number) => void;
  showError: (message: string, title?: string, duration?: number) => void;
  showWarning: (message: string, title?: string, duration?: number) => void;
  showInfo: (message: string, title?: string, duration?: number) => void;
  showConfirmation: (options: ConfirmationOptions) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [confirmation, setConfirmation] = useState<ConfirmationOptions | null>(
    null,
  );

  const addNotification = useCallback(
    (
      type: NotificationType,
      message: string,
      title?: string,
      duration = 5000,
    ) => {
      const id = Math.random().toString(36).substring(2, 9);
      const notification: NotificationData = {
        id,
        type,
        message,
        title,
        duration,
      };

      setNotifications((prev) => [...prev, notification]);

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    [],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message: string, title?: string, duration?: number) => {
      addNotification("success", message, title, duration);
    },
    [addNotification],
  );

  const showError = useCallback(
    (message: string, title?: string, duration?: number) => {
      addNotification("error", message, title, duration);
    },
    [addNotification],
  );

  const showWarning = useCallback(
    (message: string, title?: string, duration?: number) => {
      addNotification("warning", message, title, duration);
    },
    [addNotification],
  );

  const showInfo = useCallback(
    (message: string, title?: string, duration?: number) => {
      addNotification("info", message, title, duration);
    },
    [addNotification],
  );

  const showConfirmation = useCallback((options: ConfirmationOptions) => {
    setConfirmation(options);
  }, []);

  const handleConfirm = async () => {
    if (confirmation?.onConfirm) {
      await confirmation.onConfirm();
    }
    setConfirmation(null);
  };

  const handleCancel = () => {
    if (confirmation?.onCancel) {
      confirmation.onCancel();
    }
    setConfirmation(null);
  };

  const getNotificationStyles = (type: NotificationType) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-emerald-900/90 border-emerald-700",
          icon: <IoCheckmarkCircle className="text-emerald-400" size={24} />,
          iconBg: "bg-emerald-500/20",
        };
      case "error":
        return {
          bg: "bg-red-900/90 border-red-700",
          icon: <IoCloseCircle className="text-red-400" size={24} />,
          iconBg: "bg-red-500/20",
        };
      case "warning":
        return {
          bg: "bg-amber-900/90 border-amber-700",
          icon: <IoWarning className="text-amber-400" size={24} />,
          iconBg: "bg-amber-500/20",
        };
      case "info":
        return {
          bg: "bg-blue-900/90 border-blue-700",
          icon: <IoInformationCircle className="text-blue-400" size={24} />,
          iconBg: "bg-blue-500/20",
        };
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showConfirmation,
      }}
    >
      {children}

      {/* Notifications Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-3 max-w-md">
        <AnimatePresence>
          {notifications.map((notification) => {
            const styles = getNotificationStyles(notification.type);
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 100, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`${styles.bg} border backdrop-blur-md rounded-xl p-4 shadow-2xl flex items-start gap-3`}
              >
                <div
                  className={`${styles.iconBg} rounded-lg p-2 flex-shrink-0`}
                >
                  {styles.icon}
                </div>
                <div className="flex-1 min-w-0">
                  {notification.title && (
                    <h4 className="font-bold text-white text-sm mb-1">
                      {notification.title}
                    </h4>
                  )}
                  <p className="text-zinc-200 text-sm">
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="text-zinc-400 hover:text-white transition-colors flex-shrink-0"
                >
                  <IoClose size={20} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-amber-500/20 rounded-lg p-2 flex-shrink-0">
                  <IoWarning className="text-amber-400" size={24} />
                </div>
                <div className="flex-1">
                  {confirmation.title && (
                    <h3 className="text-xl font-bold text-white mb-2">
                      {confirmation.title}
                    </h3>
                  )}
                  <p className="text-zinc-300 text-sm">
                    {confirmation.message}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
                >
                  {confirmation.cancelText || "Cancel"}
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                >
                  {confirmation.confirmText || "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
}
