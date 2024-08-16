import React from "react";
import { Event } from "huddlers";
import useFetchAuthorEvents from "../src/useFetchAuthorEvents";
import useFetchFeed from "../src/useFetchFeed";
import useFetchProfile from "../src/useFetchProfile";

export type TestEventsBoxProps = {
  events: Event[];
  profiles: Record<string, Event>;
  loading: boolean;
  error: Error | null;
};

const TestEventsBox = ({
  events,
  profiles,
  loading,
  error,
}: TestEventsBoxProps) => {
  return (
    <div>
      {error ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          {events.map((event) => {
            const pk = event.pubkey;
            const prof = profiles[pk]?.id || "not found";
            return (
              <div
                key={event.id}
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  margin: "8px",
                }}
              >
                <div>Profile event is: {prof}</div>
                <div>Event content is: {event.content}</div>
              </div>
            );
          })}
          {loading ? <div>Loading...</div> : null}
        </div>
      )}
    </div>
  );
};

export const EventsByAuthorTestBox: React.FC<{ pubkey: string }> = ({
  pubkey,
}) => {
  const { events, profiles, loading, error, loadOlderEvents } =
    useFetchAuthorEvents({ pubkey });

  return (
    <>
      <TestEventsBox
        events={events}
        profiles={profiles}
        loading={loading}
        error={error}
      />
      <button
        onClick={() => {
          loadOlderEvents();
        }}
      >
        Load Older Events
      </button>
    </>
  );
};

export const UserFeedTestBox: React.FC<{ pubkey: string }> = ({ pubkey }) => {
  const { events, profiles, loading, error, loadOlderEvents } = useFetchFeed({
    pubkey,
  });

  return (
    <>
      <TestEventsBox
        events={events}
        profiles={profiles}
        loading={loading}
        error={error}
      />
      <button
        onClick={() => {
          loadOlderEvents();
        }}
      >
        Load Older Events
      </button>
    </>
  );
};

export const ShowUserProfile: React.FC<{ pubkey: string }> = ({ pubkey }) => {
  const { profile, loading, error } = useFetchProfile({ pubkey });
  return (
    <>
      {loading ? <div>Loading...</div> : null}
      {error ? <div>Error: {error.message}</div> : null}
      {profile ? <div>Profile: {profile.id}</div> : null}
    </>
  );
};
