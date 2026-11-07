import { Dialog } from "./dialog";
import { Button } from "../buttons/button";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "primary" | "success";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const icon = {
    danger: <AlertTriangle className="w-5 h-5 text-rose-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    primary: <Info className="w-5 h-5 text-[#2087FE]" />,
    success: <CheckCircle2 className="w-5 h-5 text-[#12CF94]" />,
  }[variant];

  const buttonVariant = {
    danger: "danger",
    warning: "amber",
    primary: "primary",
    success: "success",
  }[variant] as "danger" | "amber" | "primary" | "success";

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={buttonVariant}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
          {icon}
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
          {description}
        </p>
      </div>
    </Dialog>
  );
}
