import { addToast } from "@heroui/react";

interface ToastOptions {
  title: string;
  description?: string;
  timeout?: number;
  hideIcon?: boolean;
  shouldShowTimeoutProgress?: boolean; // ✅ Nombre corregido
  endContent?: React.ReactNode;
  icon?: React.ReactNode;
  promise?: Promise<any>;
}

const useToast = () => {
  const showToast = (options: ToastOptions) => {
    addToast({
      title: options.title,
      description: options.description,
      timeout: options.timeout,
      hideIcon: options.hideIcon,
      shouldShowTimeoutProgress: options.shouldShowTimeoutProgress, 
      endContent: options.endContent,
      icon: options.icon,
      promise: options.promise,
    });
  };

  return { showToast };
};

export default useToast;
