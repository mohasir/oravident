import type { ComponentProps } from 'react';
import type { VariantProps } from 'class-variance-authority';
import type { buttonVariants } from './button.styles';

type BaseProps = VariantProps<typeof buttonVariants> & {
  asChild?: boolean;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingLabel?: React.ReactNode;
};

export type ButtonProps = ComponentProps<'button'> & BaseProps;
