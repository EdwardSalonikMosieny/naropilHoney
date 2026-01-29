import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className = "", ...props }, ref) => (
  <Dialog.Overlay
    ref={ref}
    className={`sheet-overlay ${className}`.trim()}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  React.ComponentPropsWithoutRef<typeof Dialog.Content>
>(({ className = "", ...props }, ref) => (
  <Dialog.Portal>
    <SheetOverlay />
    <Dialog.Content
      ref={ref}
      className={`sheet-content ${className}`.trim()}
      {...props}
    />
  </Dialog.Portal>
));
SheetContent.displayName = "SheetContent";

export const SheetTitle = Dialog.Title;
