import { Event, FetchProfileParams, fetchUserProfile } from "huddlers";
import { useCallback, useEffect, useMemo, useState } from "react";

export type UseFetchProfileParams = {
  pubkey: string;
  url?: string;
};

/**
 * Returns the kind-0 (profile metadata) event for a given pubkey.
 *
 * @param params
 *  - pubkey: The pubkey of the author whose profile to fetch.
 *  - url (optional): The Huddlers API URL to use (defaults to the main api url).
 *
 * @returns
 * - profile: The profile event.
 * - loading: A boolean indicating if the profile is being fetched.
 * - error: An error that occurred while fetching the profile.
 */
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

  const getProfile = useCallback(async (pubkey: string, url?: string) => {
    setLoading(true);
    try {
      const fetchParams: FetchProfileParams = {
        pubkey,
        url,
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
    getProfile(memoizedParams.pubkey, memoizedParams.url);
  }, [clearAll, getProfile]);

  return {
    profile,
    loading,
    error,
  };
};

export default useFetchProfile;
