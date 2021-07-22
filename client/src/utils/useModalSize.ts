import { useBreakpointValue } from '@chakra-ui/react';

export const useModalSize = () => {
  const modalSize = useBreakpointValue({
    base: 'sm',
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
    '2xl': 'xl',
  });

  return modalSize;
};
