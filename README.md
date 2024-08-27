# huddlers-react

[![npm version](https://badge.fury.io/js/huddlers-react.svg)](https://badge.fury.io/js/huddlers-react)

A collection of React hooks for safely loading Nostr events using the Huddlers API.

## Installation

```
npm install huddlers-react
```

## Available Hooks

### useFetchProfile

Fetches the profile metadata for a given public key.

#### Parameters

- `pubkey`: The public key of the user whose profile to fetch.
- `url` (optional): The URL to use for interfacing with the cache.

#### Returns

- `profile`: The latest available kind-0 (profile metadata) event.
- `loading`: A boolean indicating if the fetch is in progress.
- `error`: An error object if the fetch fails.

#### Example

```tsx
import { useFetchProfile } from "huddlers-react";

const ProfileComponent = ({ pubkey }) => {
  const { profile, loading, error } = useFetchProfile({ pubkey });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (profile) return <div>Profile: {profile.id}</div>;
  return null;
};
```

### useFetchEventsByAuthor

Fetches events authored by a given public key.

#### Parameters

- `pubkey`: The public key of the author.
- `url` (optional): The URL to use for interfacing with the cache.
- `kinds` (optional): An array of event kinds to fetch.
- `limit` (optional): The maximum number of events to fetch (default: 20).
- `until` (optional): The timestamp of the last event fetched.

#### Returns

- `events`: An array of events authored by the given public key.
- `profiles`: A map of public keys to their corresponding profile metadata events.
- `loading`: A boolean indicating if the fetch is in progress.
- `error`: An error object if the fetch fails.
- `loadOlderEvents`: A function to fetch events older than the last event that was fetched.

#### Example

```tsx
import { useFetchEventsByAuthor } from "huddlers-react";

const AuthorEventsComponent = ({ pubkey }) => {
  const { events, profiles, loading, error, loadOlderEvents } =
    useFetchEventsByAuthor({ pubkey });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {events.map((event) => (
        <div key={event.id}>
          <div>Event: {event.id}</div>
          <div>Author Metadata: {profiles[event.pubkey]?.content}</div>
          <div>Content: {event.content}</div>
        </div>
      ))}
      <button onClick={() => loadOlderEvents()}>Load More</button>
    </div>
  );
};
```

### useFetchFeed

Loads the feed for any Nostr user.

#### Parameters

- `pubkey`: The public key of the logged-in user.
- `url` (optional): The URL to use for interfacing with the cache.
- `kinds` (optional): An array of event kinds to fetch.
- `limit` (optional): The maximum number of events to fetch (default: 20).
- `until` (optional): The timestamp of the last event fetched.

#### Returns

- `events`: An array of events in the user's feed.
- `profiles`: A map of public keys to their corresponding profile metadata events.
- `loading`: A boolean indicating if the fetch is in progress.
- `error`: An error object if the fetch fails.
- `loadOlderEvents`: A function to fetch older events.

#### Example

```tsx
import { useFetchFeed } from "huddlers-react";

const FeedComponent = ({ userPubkey }) => {
  const { events, profiles, loading, error, loadOlderEvents } = useFetchFeed({
    pubkey: userPubkey,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {events.map((event) => (
        <div key={event.id}>
          <div>Event: {event.id}</div>
          <div>Author Metadata: {profiles[event.pubkey]?.content}</div>
          <div>Content: {event.content}</div>
        </div>
      ))}
      <button onClick={() => loadOlderEvents()}>Load More</button>
    </div>
  );
};
```

### useFetchThread

Fetches the reply events under a given Nostr event.

#### Parameters

- `id`: The ID of the event to fetch the thread for.
- `url` (optional): The URL to use for interfacing with the cache.

#### Returns

- `events`: An array of reply events.
- `profiles`: The profiles of the authors of the fetched reply events, keyed by pubkey.
- `loading`: A boolean indicating if the fetch is in progress.
- `error`: An error object if the fetch fails.

#### Example

```tsx
import { useFetchThread } from "huddlers-react";

const ThreadComponent = ({ eventId }) => {
  const { events, profiles, loading, error } = useFetchThread({ id: eventId });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div>Total replies: {events.length}</div>
      {events.map((event) => (
        <div key={event.id}>
          <div>Reply: {event.id}</div>
          <div>Author Metadata: {profiles[event.pubkey]?.content}</div>
          <div>Content: {event.content}</div>
        </div>
      ))}
    </div>
  );
};
```

### useFetchRoot

Fetches the chain of events in a reply thread up to a given event.

#### Parameters

- `id`: The ID of the event whose ancestor events to fetch.
- `url` (optional): The URL to use for interfacing with the cache.

#### Returns

- `events`: An ordered array of ancestor events, starting with the root event.
- `profiles`: The profiles of the authors of the fetched events, keyed by pubkey.
- `loading`: A boolean indicating if the fetch is in progress.
- `error`: An error object if the fetch fails.

#### Example

```tsx
import { useFetchRoot } from "huddlers-react";

const RootChainComponent = ({ eventId }) => {
  const { events, profiles, loading, error } = useFetchRoot({ id: eventId });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div>Root event: {events[0]?.id}</div>
      <div>Total events in chain: {events.length}</div>
    </div>
  );
};
```

### useFetchEvent

Fetches a single event by its ID.

#### Parameters

- `id`: The ID of the event to fetch.
- `url` (optional): The URL to use for interfacing with the cache.

#### Returns

- `event`: The fetched event.
- `loading`: A boolean indicating if the fetch is in progress.
- `error`: An error object if the fetch fails.

#### Example

```tsx
import { useFetchEvent } from "huddlers-react";

const SingleEventComponent = ({ eventId }) => {
  const { event, loading, error } = useFetchEvent({ id: eventId });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div>
      <div>Event ID: {event.id}</div>
      <div>Content: {event.content}</div>
    </div>
  );
};
```

## Optional Arguments

All hooks can receive an optional `url` argument, which specifies the URL to use for interfacing with the cache. The default URL is the same one used in the [huddlers js library](https://www.npmjs.com/package/huddlers).

`useFetchFeed` and `useFetchEventsByAuthor` accept additional optional arguments:

- `kinds`: An array of event kinds to fetch. An empty array means the API should return all kinds. The default is an empty array.
- `limit`: The maximum number of events to fetch. The default is 20.
- `until`: The timestamp of the last event fetched. This is useful for pagination.

## loadOlderEvents Function

The `loadOlderEvents` function is available in `useFetchFeed` and `useFetchEventsByAuthor`. It updates the `events` and `profiles` states by fetching and adding the events that came before the last event in the `events` array.

Parameter:

- `limit`: The maximum number of events to fetch. The default is 20.

## Example Usage

A demo of these hooks is available on the [Huddlers website](https://huddlers.dev/profile/82341f882b6eabcd2ba7f1ef90aad961cf074af15b9ef44a09f9d2a8fbfbe6a2). This page uses the `useFetchEventsByAuthor` hook to retrieve events by Jack Dorsey. The "Load More" button at the bottom of the page invokes the `loadOlderEvents` function when clicked.

## License

This project is licensed under the ISC License.
