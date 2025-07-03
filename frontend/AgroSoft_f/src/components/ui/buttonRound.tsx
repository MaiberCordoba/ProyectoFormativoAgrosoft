import React from 'react';
import { Button } from '@heroui/react'; 
import type { ButtonProps } from '@heroui/react'; 

interface RoundIconButtonProps extends ButtonProps {
  icon: React.ReactNode; 
  children?: React.ReactNode; 
}

export const RoundIconButton = ({ 
  icon, 
  children, 
  className, 
  ...props 
}: RoundIconButtonProps) => {
  return (
    <Button
      className={`w-8 h-8 min-w-8 min-h-8 p-0 rounded-full flex items-center justify-center ${className || ''}`}
      {...props} 
    >
      {icon}
      {children} 
    </Button>
  );
};