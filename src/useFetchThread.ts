import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchThread, Event, ThreadParams } from "huddlers";

export type UseFetchThreadParams = {
  id: string;
  url?: string;
};

/**
 * Custom hook to fetch the reply events under a given Nostr event.
 *
 * @param params - The parameters for fetching the thread.
 *  - id: The ID of the event to fetch the thread for.
 *  - url (optional): The URL to use for interfacing with the cache (defaults to the main API URL).
 *
 * @returns An object containing:
 *  - events: An array of reply events.
 * - profiles: The profiles of the authors of the fetched reply events, keyed by pubkey.
 *  - loading: A boolean indicating if the thread is being fetched.
 *  - error: An error that occurred while fetching the thread.
 */
const useFetchThread = (params: UseFetchThreadParams) => {
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

  const getThread = useCallback(async (id: string, url: string | undefined) => {
    setLoading(true);
    try {
      const fetchParams: ThreadParams = {
        id,
        url,
      };
      const { events, profiles } = await fetchThread(fetchParams);
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
    getThread(memoizedParams.id, memoizedParams.url);
  }, [clearAll, getThread, memoizedParams]);

  return {
    events,
    profiles,
    loading,
    error,
  };
};

export default useFetchThread;
