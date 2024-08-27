import { useCallback, useEffect, useMemo, useState } from "react";
import { Event, fetchRoot, RootParams } from "huddlers";

export type UseFetchRootParams = {
  id: string;
  url?: string;
};

/**
 * Custom hook to fetch the chain of ancestor events in a reply thread that led to a given event.
 *
 * @param params:
 *  - id: The ID of the event whose ancestor events to fetch.
 *  - url (optional): The URL to use for interfacing with the cache (defaults to the Huddlers API URL).
 *
 * @returns An object containing:
 *  - events: An ordered array of ancestor events, starting with the root event.
 * - profiles: The profiles of the authors of the fetched events, keyed by pubkey.
 *  - loading: A boolean indicating if the fetching is in progress.
 *  - error: An error that occurred while fetching the events.
 */
const useFetchRoot = (params: UseFetchRootParams) => {
  const memoizedParams = useMemo(
    () => ({
      id: params.id,
      url: params.url,
    }),
    [params.id, params.url]
  );

  const [events, setEvents] = useState<Event[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Event>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clearAll = useCallback(() => {
    setEvents([]);
    setProfiles({});
    setLoading(false);
    setError(null);
  }, [setLoading, setError, setEvents, setProfiles]);

  const getRoot = useCallback(async (id: string, url: string | undefined) => {
    setLoading(true);
    try {
      const fetchParams: RootParams = {
        id,
        url,
      };
      const { events, profiles } = await fetchRoot(fetchParams);
      setEvents(events);
      setProfiles(profiles);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearAll();
    getRoot(memoizedParams.id, memoizedParams.url);
  }, [clearAll, getRoot, memoizedParams]);

  return {
    events,
    profiles,
    loading,
    error,
  };
};

export default useFetchRoot;
