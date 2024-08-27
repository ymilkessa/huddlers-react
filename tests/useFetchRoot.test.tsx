import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ShowRootChain } from "./TestComponents";
import { fetchRoot } from "huddlers";
import { eventChainResponse } from "./testUtils";

// Mock the huddlers module
jest.mock("huddlers", () => ({
  fetchRoot: jest.fn(),
}));

describe("useFetchRoot", () => {
  const mockId = "test_id_123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render a root chain", async () => {
    (fetchRoot as jest.Mock).mockResolvedValue({
      events: eventChainResponse.events,
      profiles: eventChainResponse.profiles,
    });

    render(<ShowRootChain id={mockId} />);

    await waitFor(() => {
      expect(
        screen.getByText(`Root event: ${eventChainResponse.events[0].id}`)
      ).toBeInTheDocument();
      expect(
        screen.getByText(`Total events: ${eventChainResponse.events.length}`)
      ).toBeInTheDocument();
    });
  });

  it("should show loading state", async () => {
    (fetchRoot as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<ShowRootChain id={mockId} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Fetch error");
    (fetchRoot as jest.Mock).mockRejectedValue(mockError);

    render(<ShowRootChain id={mockId} />);

    await waitFor(() => {
      expect(
        screen.getByText(`Error: ${mockError.message}`)
      ).toBeInTheDocument();
    });
  });
});
