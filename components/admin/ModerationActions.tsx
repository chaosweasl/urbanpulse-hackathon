"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { CheckCircle, XCircle, AlertTriangle, UserX } from "lucide-react";

interface ModerationActionsProps {
  userId: string;
  onActionComplete?: (action: string) => void;
}

export function ModerationActions({ userId, onActionComplete }: ModerationActionsProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleActionClick = (action: string) => {
    setActiveAction(action);
    setIsConfirming(true);
  };

  const handleConfirmAction = async () => {
    if (!activeAction) return;

    try {
      const response = await fetch(`/api/users/${userId}/moderate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: activeAction }),
      });

      if (response.ok) {
        onActionComplete?.(activeAction);
      } else {
        const err = await response.json();
        alert(`Error: ${err.error || 'Failed to perform action'}`);
      }
    } catch (error) {
      console.error(`Failed to ${activeAction} user:`, error);
      alert(`Network error: Failed to ${activeAction} user`);
    } finally {
      setIsConfirming(false);
      setActiveAction(null);
    }
  };

  const actionConfigs: Record<string, {
    title: string;
    message: string;
    variant: "default" | "danger" | "warning" | "success";
    icon: React.ElementType;
    color: string;
  }> = {
    approve: {
      title: "Approve User",
      message: "Are you sure you want to approve this user? This will mark them as verified.",
      variant: "success",
      icon: CheckCircle,
      color: "text-green-600 hover:bg-green-50 hover:text-green-700",
    },
    reject: {
      title: "Reject User",
      message: "Are you sure you want to reject this user's application?",
      variant: "danger",
      icon: XCircle,
      color: "text-red-600 hover:bg-red-50 hover:text-red-700",
    },
    warn: {
      title: "Warn User",
      message: "Are you sure you want to send a warning to this user?",
      variant: "warning",
      icon: AlertTriangle,
      color: "text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700",
    },
    ban: {
      title: "Ban User",
      message: "Are you sure you want to permanently ban this user? This action cannot be undone.",
      variant: "danger",
      icon: UserX,
      color: "text-red-800 hover:bg-red-100 hover:text-red-900",
    },
  };

  const currentConfig = activeAction ? actionConfigs[activeAction] : null;

  return (
    <div className="flex gap-2">
      {Object.entries(actionConfigs).map(([key, config]) => {
        const Icon = config.icon;
        return (
          <Button
            key={key}
            variant="ghost"
            size="sm"
            className={config.color}
            onClick={() => handleActionClick(key)}
          >
            <Icon size={18} className="mr-1.5" />
            <span className="capitalize">{key}</span>
          </Button>
        );
      })}

      {currentConfig && (
        <ConfirmDialog
          isOpen={isConfirming}
          onClose={() => setIsConfirming(false)}
          onConfirm={handleConfirmAction}
          title={currentConfig.title}
          message={currentConfig.message}
          variant={currentConfig.variant}
          confirmLabel={`Yes, ${activeAction}`}
        />
      )}
    </div>
  );
}
