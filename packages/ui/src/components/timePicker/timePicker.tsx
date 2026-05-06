import { Input, cn } from '../../index';

interface TimePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string; // Format "HH:mm"
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function TimePicker({
  value,
  onChange,
  className,
  ...props
}: TimePickerProps) {
  return (
    <Input
      type="time"
      value={value}
      onChange={onChange}
      className={cn('w-full px-3 py-2 text-sm uppercase', className)}
      {...props}
    />
  );
}
