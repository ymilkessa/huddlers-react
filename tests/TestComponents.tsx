import React from "react";
import { Event } from "huddlers";
import useFetchEventsByAuthor from "../src/useFetchEventsByAuthor";
import useFetchFeed from "../src/useFetchFeed";
import useFetchProfile from "../src/useFetchProfile";
import useFetchRoot from "../src/useFetchRoot";
import useFetchThread from "../src/useFetchThread";
import useFetchEvent from "../src/useFetchEvent";

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
    useFetchEventsByAuthor({ pubkey });

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

export const ShowRootChain: React.FC<{ id: string }> = ({ id }) => {
  const { events, loading, error } = useFetchRoot({ id });
  return (
    <>
      {loading ? <div>Loading...</div> : null}
      {error ? <div>Error: {error.message}</div> : null}
      {events.length > 0 ? (
        <>
          <div>Root event: {events[0].id}</div>
          <div>Total events: {events.length}</div>
        </>
      ) : null}
    </>
  );
};

export const ShowThreadOfEvents: React.FC<{ id: string }> = ({ id }) => {
  const { events, loading, error } = useFetchThread({ id });
  return (
    <>
      {loading ? <div>Loading...</div> : null}
      {error ? <div>Error: {error.message}</div> : null}
      {events.length > 0 ? (
        <>
          <div>Total replies: {events.length}</div>
          <div>First reply: {events[0].id}</div>
        </>
      ) : null}
    </>
  );
};

export const ShowSingleEvent: React.FC<{ id: string }> = ({ id }) => {
  const { event, loading, error } = useFetchEvent({ id });
  return (
    <>
      {loading ? <div>Loading...</div> : null}
      {error ? <div>Error: {error.message}</div> : null}
      {event ? (
        <>
          <div>Event ID: {event.id}</div>
          <div>Content: {event.content}</div>
        </>
      ) : null}
    </>
  );
};
