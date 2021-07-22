import { Button } from '@chakra-ui/react';
import React, { ButtonHTMLAttributes } from 'react';
import { InputHTMLAttributes } from 'react';

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  buttonText?: string;
  isLoading?: boolean;
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  buttonText,
  isLoading,
  ...props
}) => (
  <Button
    textColor={'#361d32'}
    bgColor={'transparent'}
    border={'1px'}
    fontWeight={'700'}
    isLoading={isLoading}
    {...props}
    borderColor={'#361d32'}
    _hover={{ bgColor: '#f1e8e6' }}
  >
    {buttonText}
  </Button>
);
