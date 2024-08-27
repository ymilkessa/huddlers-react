import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ShowThreadOfEvents } from "./TestComponents";
import { fetchThread } from "huddlers";
import { eventChainResponse } from "./testUtils";

// Mock the huddlers module
jest.mock("huddlers", () => ({
  fetchThread: jest.fn(),
}));

describe("useFetchThread", () => {
  const mockId = "test_id_123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render thread replies", async () => {
    (fetchThread as jest.Mock).mockResolvedValue({
      events: eventChainResponse.events,
      profiles: eventChainResponse.profiles,
    });

    render(<ShowThreadOfEvents id={mockId} />);

    await waitFor(() => {
      expect(
        screen.getByText(`Total replies: ${eventChainResponse.events.length}`)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`First reply: ${eventChainResponse.events[0].id}`)
      ).toBeInTheDocument();
    });
  });

  it("should show loading state", async () => {
    (fetchThread as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<ShowThreadOfEvents id={mockId} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Fetch error");
    (fetchThread as jest.Mock).mockRejectedValue(mockError);

    render(<ShowThreadOfEvents id={mockId} />);

    await waitFor(() => {
      expect(
        screen.getByText(`Error: ${mockError.message}`)
      ).toBeInTheDocument();
    });
  });
});
