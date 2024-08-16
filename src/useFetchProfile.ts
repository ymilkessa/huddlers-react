import { Event, FetchProfileParams, fetchUserProfile } from "huddlers";
import { useCallback, useEffect, useMemo, useState } from "react";

export type UseFetchProfileParams = {
  pubkey: string;
  url?: string;
};

const useFetchProfile = (params: UseFetchProfileParams) => {
  const memoizedParams = useMemo(
    () => ({
      pubkey: params.pubkey,
      url: params.url,
    }),
    [params.pubkey, params.url]
  );

  const [profile, setProfile] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clearAll = useCallback(() => {
    setProfile(null);
    setLoading(false);
    setError(null);
  }, [setLoading, setError, setProfile]);

  const getProfile = useCallback(async (pubkey: string) => {
    setLoading(true);
    try {
      const fetchParams: FetchProfileParams = {
        pubkey: memoizedParams.pubkey,
        url: memoizedParams.url,
      };
      let { profile: fetchedProfile } = await fetchUserProfile(fetchParams);
      setProfile(fetchedProfile);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearAll();
    getProfile(memoizedParams.pubkey);
  }, [clearAll, getProfile]);

  return {
    profile,
    loading,
    error,
  };
};

export default useFetchProfile;
