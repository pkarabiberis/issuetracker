import { useState } from 'react';
import { useEffect } from 'react';

export const useToggleUserList = (users: any) => {
  const [showUserList, setShowUserList] = useState(false);

  useEffect(() => {
    if (!users.length) {
      setShowUserList(false);
    }
  }, [users]);

  return [showUserList, setShowUserList];
};
