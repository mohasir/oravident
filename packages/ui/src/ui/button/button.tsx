import { cn } from '@repo/ui/utils';
import { Slot } from 'radix-ui';
import { ButtonProps } from './button.helpers';
import { buttonVariants } from './button.styles';

import { Spinner } from '../spinner';

function Button({
  className,
  variant = 'default',
  size = 'default',
  fullWidth = false,
  asChild = false,
  isLoading = false,
  loadingLabel,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={isLoading || disabled}
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {isLoading && <Spinner className="mr-2" data-icon="inline-start" />}
          {isLoading ? (loadingLabel ?? children) : children}
        </>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
