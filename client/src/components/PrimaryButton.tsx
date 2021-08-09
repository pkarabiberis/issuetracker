import { Button, ButtonProps } from '@chakra-ui/react';
import React, { ButtonHTMLAttributes } from 'react';

type PrimaryButtonProps = ButtonProps & {
  buttonText?: string;
  isLoading?: boolean;
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  buttonText,
  isLoading,
  ...props
}) => (
  <Button
    {...props}
    textColor={'#361d32'}
    bgColor={'transparent'}
    border={'1px'}
    fontWeight={'700'}
    isLoading={isLoading}
    borderColor={'#361d32'}
    _hover={{ bgColor: '#f1e8e6' }}
  >
    {buttonText}
  </Button>
);
