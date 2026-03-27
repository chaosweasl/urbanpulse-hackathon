"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger" | "warning" | "success";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    success: "bg-green-600 text-white hover:bg-green-700",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Content */}
      <div className="relative z-10 w-full max-w-md scale-100 rounded-2xl border bg-card p-6 shadow-2xl transition-all animate-in zoom-in-95 duration-200">
        <div className="mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            className={cn(variantStyles[variant])}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
