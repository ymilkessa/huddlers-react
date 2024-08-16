import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ShowUserProfile } from "./TestComponents";
import { fetchUserProfile } from "huddlers";

// Mock the huddlers module
jest.mock("huddlers", () => ({
  fetchUserProfile: jest.fn(),
}));

describe("useFetchProfile", () => {
  const mockPubkey = "test_pubkey_123";
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

  it("should render a profile", async () => {
    (fetchUserProfile as jest.Mock).mockResolvedValue({
      profile: mockProfile,
    });

    render(<ShowUserProfile pubkey={mockPubkey} />);

    await waitFor(() => {
      expect(
        screen.getByText(`Profile: ${mockProfile.id}`)
      ).toBeInTheDocument();
    });
  });

  it("should show loading state", async () => {
    (fetchUserProfile as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<ShowUserProfile pubkey={mockPubkey} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  it("should handle errors", async () => {
    const mockError = new Error("Fetch error");
    (fetchUserProfile as jest.Mock).mockRejectedValue(mockError);

    render(<ShowUserProfile pubkey={mockPubkey} />);

    await waitFor(() => {
      expect(
        screen.getByText(`Error: ${mockError.message}`)
      ).toBeInTheDocument();
    });
  });
});
