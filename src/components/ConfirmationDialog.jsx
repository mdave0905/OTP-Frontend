import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";
import ActionButton from "./ActionButton";

const ConfirmationDialog = ({
  isOpen,
  setIsOpen,
  title,
  message,
  confirmText = "Confirm",
  onConfirm,
  confirmIcon,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50 focus:outline-none"
    >
      {/* Background Blur Effect */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="max-w-lg w-full font-merriweather_sans bg-gray-900 text-white rounded-2xl p-8 shadow-lg backdrop-blur-2xl transition-all duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0">
          {/* Title */}
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>

          {/* Description */}
          <Description className="text-gray-300">
            This action is{" "}
            <span className="font-semibold text-red-400">permanent</span> and
            cannot be undone.
          </Description>

          <p className="mt-2 text-gray-400">{message}</p>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <ActionButton
              onClick={() => setIsOpen(false)}
              text={"Cancel"}
              design={"neutral"}
              icon={"close"}
            />
            <ActionButton
              onClick={() => {
                onConfirm();
                setIsOpen(false);
              }}
              text={confirmText}
              design={"alert"}
              icon={confirmIcon}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ConfirmationDialog;
