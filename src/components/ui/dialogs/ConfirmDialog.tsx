"use client";

import Button from "../Button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "حذف",
  cancelLabel = "إلغاء",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="nr-modal-backdrop"
      onMouseDown={onCancel}
    >
      <section
        className="nr-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="nr-modal-header">
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>

        <div className="nr-country-form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  );
}