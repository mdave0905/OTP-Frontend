import { render, screen, fireEvent } from "@testing-library/react";
import CallNotification from "../components/CallNotification";
import { useSocket } from "../services/SocketContext";

jest.mock("../services/SocketContext", () => ({
  useSocket: jest.fn(),
}));

describe("CallNotification", () => {
  test("renders incoming call notification", () => {
    useSocket.mockReturnValue({
      incomingCall: true,
      incomingUserName: "John Doe",
      acceptCall: jest.fn(),
      rejectCall: jest.fn(),
    });

    render(<CallNotification />);

    expect(screen.getByText(/Incoming Call from/i)).toBeInTheDocument();
  });

  test("does not render when there is no incoming call", () => {
    useSocket.mockReturnValue({
      incomingCall: false,
      incomingUserName: "",
      acceptCall: jest.fn(),
      rejectCall: jest.fn(),
    });

    render(<CallNotification />);

    expect(screen.queryByText(/Incoming Call from/i)).not.toBeInTheDocument();
  });

  test("calls acceptCall when accept button is clicked", () => {
    const acceptCallMock = jest.fn();
    useSocket.mockReturnValue({
      incomingCall: true,
      incomingUserName: "John Doe",
      acceptCall: acceptCallMock,
      rejectCall: jest.fn(),
    });

    render(<CallNotification />);

    fireEvent.click(screen.getByText(/Accept/i));
    expect(acceptCallMock).toHaveBeenCalled();
  });

  test("calls rejectCall when reject button is clicked", () => {
    const rejectCallMock = jest.fn();
    useSocket.mockReturnValue({
      incomingCall: true,
      incomingUserName: "John Doe",
      acceptCall: jest.fn(),
      rejectCall: rejectCallMock,
    });

    render(<CallNotification />);

    fireEvent.click(screen.getByText(/Reject/i));
    expect(rejectCallMock).toHaveBeenCalled();
  });
});
