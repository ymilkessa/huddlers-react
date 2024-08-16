import { Event, FeedParams, fetchUserFeed } from "huddlers";
import { useCallback, useEffect, useMemo, useState } from "react";

export type UseFetchFeedParams = {
  pubkey: string;
  url?: string;
  kinds?: number[];
  until?: number;
  initialLimit?: number;
};

const useFetchFeed = (params: UseFetchFeedParams) => {
  const memoizedParams = useMemo(
    () => ({
      pubkey: params.pubkey,
      url: params.url,
      kinds: params.kinds,
      until: params.until,
      initialLimit: params.initialLimit,
    }),
    [params.pubkey, params.url, params.kinds, params.until, params.initialLimit]
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
  }, [setEvents, setProfiles, setLoading, setError]);

  const _getMoreEvents = useCallback(
    async (
      currEvents: Event[],
      limit: number = memoizedParams.initialLimit || 20
    ) => {
      setLoading(true);
      try {
        const fetchParams: FeedParams = {
          pubkey: memoizedParams.pubkey,
          url: memoizedParams.url,
          kinds: memoizedParams.kinds,
          limit,
        };
        if (currEvents.length > 0) {
          fetchParams.until = currEvents[currEvents.length - 1].created_at;
        } else if (memoizedParams.until) {
          fetchParams.until = memoizedParams.until;
        }

        const excludeIds = new Set<string>();
        if (fetchParams.until) {
          for (let i = currEvents.length - 1; i >= 0; i--) {
            if (currEvents[i].created_at === fetchParams.until) {
              excludeIds.add(currEvents[i].id);
            }
          }
        }

        let { events: fetchedEvents, profiles: fetchedProfiles } =
          await fetchUserFeed(fetchParams);
        if (fetchParams.until) {
          for (let i = 0; i < fetchedEvents.length; i++) {
            if (fetchedEvents[i].created_at < fetchParams.until) {
              fetchedEvents = fetchedEvents.slice(i);
              break;
            } else if (
              fetchedEvents[i].created_at === fetchParams.until &&
              !excludeIds.has(fetchedEvents[i].id)
            ) {
              fetchedEvents = fetchedEvents.slice(i);
              break;
            }
          }
        }
        setEvents([...currEvents, ...fetchedEvents]);
        setProfiles((oldProfiles) => ({ ...oldProfiles, ...fetchedProfiles }));
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    },
    [memoizedParams, setEvents, setProfiles, setLoading, setError]
  );

  const loadOlderEvents = useCallback(
    (limit: number = 20) => {
      _getMoreEvents(events, limit);
    },
    [_getMoreEvents, events]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  useEffect(() => {
    clearAll();
    _getMoreEvents([]);
  }, [clearAll, _getMoreEvents]);

  return {
    events,
    profiles,
    loading,
    error,
    clearError,
    clearAll,
    loadOlderEvents,
  };
};

export default useFetchFeed;
