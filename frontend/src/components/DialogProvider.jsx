import { useCallback, useEffect, useMemo, useState } from "react";
import { DialogContext } from "../hooks/useDialog";

const DialogProvider = ({ children }) => {
  // Only one pop-up is shown at a time
  const [dialog, setDialog] = useState(null);

  const openDialog = useCallback(
    (options) =>
      new Promise((resolve) => {
        setDialog({ ...options, resolve });
      }),
    [],
  );

  const showAlert = useCallback(
    (message, title = "Notice") =>
      openDialog({ type: "alert", title, message, confirmLabel: "OK" }),
    [openDialog],
  );

  const showConfirm = useCallback(
    ({
      title = "Are you sure?",
      message,
      confirmLabel = "Confirm",
      danger = false,
    }) => openDialog({ type: "confirm", title, message, confirmLabel, danger }),
    [openDialog],
  );

  const close = useCallback(
    (confirmed) => {
      dialog?.resolve(confirmed);
      setDialog(null);
    },
    [dialog],
  );

  useEffect(() => {
    if (!dialog) {
      return;
    }

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        close(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [dialog, close]);

  const value = useMemo(
    () => ({ showAlert, showConfirm }),
    [showAlert, showConfirm],
  );

  return (
    <DialogContext.Provider value={value}>
      {children}

      {dialog && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/30 px-4"
          role="presentation"
          onClick={() => close(false)}
        >
          <div
            className="w-87.5 max-w-full rounded-2xl bg-white p-6 shadow-xl"
            role={dialog.type === "confirm" ? "alertdialog" : "dialog"}
            aria-modal="true"
            aria-labelledby="dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="dialog-title"
              className="text-lg font-semibold text-[#08243f]"
            >
              {dialog.title}
            </h2>

            <p className="mt-2 whitespace-pre-line text-sm text-gray-500">
              {dialog.message}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              {dialog.type === "confirm" && (
                <button
                  type="button"
                  onClick={() => close(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-[#08243f]"
                >
                  Cancel
                </button>
              )}

              <button
                type="button"
                autoFocus
                onClick={() => close(true)}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                  dialog.danger ? "bg-red-500" : "bg-[#08243f]"
                }`}
              >
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
};

export default DialogProvider;
