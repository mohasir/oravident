import * as React from 'react';
import { CircleAlert, TriangleAlert } from 'lucide-react';
import {
  AlertPrimitive,
  AlertDescription,
} from '../../ui/alert/alert';
import { type VariantProps } from 'class-variance-authority';
import { alertVariants } from '../../ui/alert/alert.styles';

type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>;

interface AlertProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

function AlertRoot({
  children,
  icon,
  className,
  variant,
}: AlertProps & { variant?: AlertVariant }) {
  return (
    <AlertPrimitive variant={variant} className={className}>
      {icon}
      <AlertDescription>{children}</AlertDescription>
    </AlertPrimitive>
  );
}

function AlertError({ icon = <CircleAlert />, ...props }: AlertProps) {
  return <AlertRoot {...props} icon={icon} variant="destructive" />;
}

function AlertWarning({ icon = <TriangleAlert />, ...props }: AlertProps) {
  return <AlertRoot {...props} icon={icon} variant="warning" />;
}

AlertRoot.displayName = 'Alert';
AlertError.displayName = 'Alert.error';
AlertWarning.displayName = 'Alert.warning';

AlertRoot.error = AlertError;
AlertRoot.warning = AlertWarning;

export { AlertRoot as Alert };
export type { AlertProps };
