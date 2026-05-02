import { cn } from '@/lib/utils';

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  // Ensure two decimal places
  const stringValue = value.toFixed(2);
  // Get the int/float
  const [intValue, floatValue] = stringValue.split('.');

  return (
    <span className={cn('text-2xl', className)}>
      <span className='text-xs align-super'>€</span>
      {intValue}
      <span className='text-xs align-super'>.{floatValue}</span>
    </span>
  );
};

export default ProductPrice;
