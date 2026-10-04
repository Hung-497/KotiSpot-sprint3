import { createContext, useContext } from "react";

const DialogContext = createContext(null);

// Shows in-page pop-up messages instead of the browser's alert and confirm.
//   await showAlert("Something went wrong");
//   if (await showConfirm({ message: "Delete this listing?" })) { ... }
const useDialog = () => {
  const dialog = useContext(DialogContext);

  if (!dialog) {
    throw new Error("useDialog must be used inside DialogProvider");
  }

  return dialog;
};

export { DialogContext };
export default useDialog;
