import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { EventsByAuthorTestBox } from "./TestComponents";
import { fetchEventsByAuthor } from "huddlers";

// Mock the huddlers module
jest.mock("huddlers", () => ({
  fetchEventsByAuthor: jest.fn(),
}));

describe("EventsByAuthorTestBox", () => {
  const mockPubkey = "test_pubkey_123";
  const mockEvent = {
    id: "event1",
    pubkey: mockPubkey,
    created_at: 1234567890,
    kind: 1,
    tags: [],
    content: "Test event content",
    sig: "signature",
  };
  const mockProfile = {
    id: "profile1",
    pubkey: mockPubkey,
    created_at: 1234567890,
    kind: 0,
    tags: [],
    content: '{"name": "Test User"}',
    sig: "signature",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render events and profiles", async () => {
    (fetchEventsByAuthor as jest.Mock).mockResolvedValue({
      events: [mockEvent],
      profiles: { [mockPubkey]: mockProfile },
    });

    render(<EventsByAuthorTestBox pubkey={mockPubkey} />);

    await waitFor(() => {
      expect(
        screen.getByText(`Profile event is: ${mockProfile.id}`)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Event content is: ${mockEvent.content}`)
      ).toBeInTheDocument();
    });
  });

  it("should show loading state", async () => {
    (fetchEventsByAuthor as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<EventsByAuthorTestBox pubkey={mockPubkey} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Fetch error");
    (fetchEventsByAuthor as jest.Mock).mockRejectedValue(mockError);

    render(<EventsByAuthorTestBox pubkey={mockPubkey} />);

    await waitFor(() => {
      expect(
        screen.getByText(`Error: ${mockError.message}`)
      ).toBeInTheDocument();
    });
  });

  it("should load older events when button is clicked", async () => {
    const olderEvent = {
      ...mockEvent,
      id: "event2",
      content: "Older event content",
    };
    (fetchEventsByAuthor as jest.Mock)
      .mockResolvedValueOnce({
        events: [mockEvent],
        profiles: { [mockPubkey]: mockProfile },
      })
      .mockResolvedValueOnce({
        events: [olderEvent],
        profiles: {},
      });

    render(<EventsByAuthorTestBox pubkey={mockPubkey} />);

    await waitFor(() => {
      expect(
        screen.getByText(`Event content is: ${mockEvent.content}`)
      ).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Load Older Events"));
    });

    await waitFor(
      () => {
        expect(
          screen.getByText(`Event content is: ${olderEvent.content}`)
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
