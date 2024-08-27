import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ShowSingleEvent } from "./TestComponents";
import { fetchEvent } from "huddlers";
import { singleEventResponse } from "./testUtils";

jest.mock("huddlers", () => ({
  fetchEvent: jest.fn(),
}));

describe("useFetchEvent", () => {
  const mockId = "test_id_123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render a single event", async () => {
    (fetchEvent as jest.Mock).mockResolvedValue(singleEventResponse);

    render(<ShowSingleEvent id={mockId} />);

    await waitFor(() => {
      expect(
        screen.getByText(`Event ID: ${singleEventResponse.event.id}`)
      ).toBeInTheDocument();
    });
  });

  it("should show loading state", async () => {
    (fetchEvent as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<ShowSingleEvent id={mockId} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Fetch error");
    (fetchEvent as jest.Mock).mockRejectedValue(mockError);

    render(<ShowSingleEvent id={mockId} />);

    await waitFor(() => {
      expect(
        screen.getByText(`Error: ${mockError.message}`)
      ).toBeInTheDocument();
    });
  });
});
