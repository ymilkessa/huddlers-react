import { Event, fetchEvent, FetchEventParams } from "huddlers";
import { useCallback, useEffect, useMemo, useState } from "react";

export type UseFetchEventParams = {
  id: string;
  url?: string;
};

/**
 * Fetches a Nostr event by its ID, along with the profiles of the event's author
 * and all authors mentioned in the event.
 *
 * @param params - An object containing:
 *  - id: The ID of the event to fetch.
 *  - url (optional): The URL to use for interfacing with the cache (defaults to the main Huddlers API URL).
 *
 * @returns An object containing:
 *  - event: The fetched event.
 *  - profiles: A record of profiles, including the event's author and mentioned authors.
 *  - loading: A boolean indicating if the event is being fetched.
 *  - error: Any error that occurred while fetching the event.
 */
const useFetchEvent = (params: UseFetchEventParams) => {
  const memoizedParams = useMemo(
    () => ({
      id: params.id,
      url: params.url,
    }),
    [params.id, params.url]
  );

  const [event, setEvent] = useState<Event | null>(null);
  const [profiles, setProfiles] = useState<Record<string, Event>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clearAll = useCallback(() => {
    setProfiles({});
    setEvent(null);
    setLoading(false);
    setError(null);
  }, [setLoading, setError, setProfiles, setEvent]);

  const getEvent = useCallback(async (id: string, url?: string) => {
    setLoading(true);
    try {
      const fetchParams: FetchEventParams = {
        id,
        url,
      };
      let { event, profiles } = await fetchEvent(fetchParams);
      setEvent(event);
      setProfiles(profiles);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearAll();
    getEvent(memoizedParams.id, memoizedParams.url);
  }, [clearAll, getEvent, memoizedParams]);

  return {
    event,
    profiles,
    loading,
    error,
  };
};

export default useFetchEvent;
