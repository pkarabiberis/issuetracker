import { useRouter } from 'next/dist/client/router';
import { useEffect } from 'react';
import { useCurrentUserQuery } from '../generated/graphql';

export const useIsAuth = () => {
  const { data, loading } = useCurrentUserQuery();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !data?.currentUser) {
      router.replace('/login?next=' + '/');
    }
  }, [loading, data, router]);
};
