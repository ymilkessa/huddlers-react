# huddlers-react

A collection of hooks for safely loading organized events and profiles from the Huddlers API. This acts as a useful React.js wrapper for the [huddlers javascript library](https://www.npmjs.com/package/huddlers).

## Installation

```
npm install huddlers-react
```

## `useFetchProfile`

This hook returns three states:

1. `profile`: The latest available kind-0 (profile metadata) event that corresponds to the given public key.
2. `loading`: A boolean that indicates whether the hook is currently fetching the profile.
3. `error`: An error object that contains the error message if the hook fails to fetch the profile.

Here is an example.

```tsx
import React from "react";
import { useFetchProfile } from "huddlers-react";

export const ShowUserProfile = () => {
  const { profile, loading, error } = useFetchProfile({
    pubkey: "some-public-key",
  });

  return (
    <>
      {loading ? <div>Loading...</div> : null}
      {error ? <div>Error: {error.message}</div> : null}
      {profile ? <div>Profile: {profile.id}</div> : null}
    </>
  );
};
```

## `useAuthorEvents`

Fetches the events authored by a given public key.

It returns the following states:

1. `events`: An array of events authored by the given public key, in reverse chronological order.
2. `profiles`: A map of public keys to their corresponding profile metadata events. This contains the profile of specified pubkey, as well as the author profiles of events reposted by the specified pubkey.
3. `loading`: A boolean that indicates whether the hook is currently fetching more events.
4. `error`: An error object that contains the error message if the hook fails to fetch the events.

Here is an example.

```tsx
import React from "react";
import { useAuthorEvents } from "huddlers-react";

export const ShowAuthorEvents = () => {
  const { events, profiles, loading, error } = useAuthorEvents({
    pubkey: "some-public-key",
  });

  return (
    <>
      {loading ? <div>Loading...</div> : null}
      {error ? <div>Error: {error.message}</div> : null}
      {events.map((event) => (
        <div key={event.id}>
          <div>Event: {event.id}</div>
          <div>Profile Event: {profiles[event.pubkey]?.id}</div>
          <div>Content: {event.content}</div>
        </div>
      ))}
    </>
  );
};
```

## `useFetchFeed`

This hook loads the feed for logged-in users. The main argument for this hook is a user public key.

It returns the same states as the `useAuthorEvents` hook:

1. `events`
2. `profiles`
3. `loading`
4. `error`

This uses [fetchUserFeed](https://github.com/ymilkessa/huddlers-js#fetchuserfeed) function, which calls the `/feed` endpoint of the Huddlers API.

## Optional Arguments

All three hooks can receive an optional `url` argument, which specifies the URL to use for interfacing with the cache. The default url is the same one used in the [huddlers js library](https://www.npmjs.com/package/huddlers).

Meanwhile, both `useFetchFeed` and `useAuthorEvents` can accept the following optional arguments:

- `kinds`: An array of event kinds to fetch. An empty array means the API should return all kinds. The default is an empty array.
- `limit`: The maximum number of events to fetch. The default is 20.
- `until`: The timestamp of the last event fetched. This is useful for pagination.
