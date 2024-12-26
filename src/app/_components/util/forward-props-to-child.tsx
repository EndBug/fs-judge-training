import { Slot } from "@radix-ui/react-slot";
import { cloneElement, forwardRef } from "react";

interface ForwardPropsToChildProps {
  children: React.ReactElement<{ children: React.ReactNode }>;
}

/**
 * This cna be useful in some cases where Radix UI primitives are combined, like
 * if a Tooltip is wrapping a Button.
 *
 * @see https://github.com/radix-ui/primitives/discussions/560
 */
export const ForwardPropsToChild = forwardRef<
  HTMLElement,
  ForwardPropsToChildProps
>(function ForwardPropsToChild({ children, ...props }, ref) {
  return cloneElement(
    children,
    undefined,
    // Slot used so that callbacks, className, style, etc. are composed together instead of replaced.
    <Slot ref={ref} {...props}>
      {children.props.children}
    </Slot>,
  );
});
