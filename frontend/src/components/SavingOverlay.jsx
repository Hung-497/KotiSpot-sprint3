import PageLoader from "./PageLoader";

const SavingOverlay = ({ label = "Saving changes…" }) => (
  <div className="fixed inset-0 z-100 flex flex-col bg-canvas/95" aria-busy="true">
    <PageLoader label={label} fullPage variant="spinner" />
  </div>
);
export default SavingOverlay;
