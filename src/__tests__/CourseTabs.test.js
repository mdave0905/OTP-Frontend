import { render, screen, fireEvent } from "@testing-library/react";
import CourseTabs from "../components/InfoTabs";

jest.mock("../components/Reviews", () => ({ ratings }) => (
  <div>Reviews: {ratings}</div>
));
jest.mock("../components/EnrolledStudents", () => ({ enrolledStudents }) => (
  <div>Enrolled Students: {enrolledStudents}</div>
));
jest.mock("../components/Meetings", () => ({ meetings }) => (
  <div>Meetings: {meetings}</div>
));

describe("CourseTabs", () => {
  const mockRatings = "5 stars";
  const mockEnrolledStudents = 30;
  const mockMeetings = "Meeting 1, Meeting 2";

  const setup = (visibleTabs = ["reviews", "students", "meetings"]) => {
    render(
      <CourseTabs
        visibleTabs={visibleTabs}
        ratings={mockRatings}
        enrolledStudents={mockEnrolledStudents}
        meetings={mockMeetings}
        bookedMeetings={[]}
        fetchStudentBookingStatus={() => {}}
        user={{ name: "Test User" }}
      />,
    );
  };

  it("should render the reviews tab by default", () => {
    setup();

    expect(screen.getByText(/Reviews: 5 stars/i)).toBeInTheDocument();
    expect(screen.queryByText(/Enrolled Students:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Meetings:/i)).not.toBeInTheDocument();
  });

  it("should render the students tab when clicked", () => {
    setup();

    fireEvent.click(screen.getByText(/🧑🏼‍🎓 Students/i));

    expect(screen.queryByText(/Reviews: 5 stars/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Enrolled Students: 30/i)).toBeInTheDocument();
    expect(screen.queryByText(/Meetings:/i)).not.toBeInTheDocument();
  });

  it("should render the meetings tab when clicked", () => {
    setup();

    fireEvent.click(screen.getByText(/📅 Meetings/i));

    expect(screen.queryByText(/Reviews: 5 stars/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Enrolled Students:/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/Meetings: Meeting 1, Meeting 2/i),
    ).toBeInTheDocument();
  });

  it("should update activeTab when visibleTabs changes", () => {
    const { rerender } = render(
      <CourseTabs
        visibleTabs={["reviews", "students"]}
        ratings={mockRatings}
        enrolledStudents={mockEnrolledStudents}
        meetings={mockMeetings}
        bookedMeetings={[]}
        fetchStudentBookingStatus={() => {}}
        user={{ name: "Test User" }}
      />,
    );

    expect(screen.getByText(/Reviews: 5 stars/i)).toBeInTheDocument();

    rerender(
      <CourseTabs
        visibleTabs={["students", "meetings"]}
        ratings={mockRatings}
        enrolledStudents={mockEnrolledStudents}
        meetings={mockMeetings}
        bookedMeetings={[]}
        fetchStudentBookingStatus={() => {}}
        user={{ name: "Test User" }}
      />,
    );

    expect(screen.queryByText(/Reviews: 5 stars/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Enrolled Students: 30/i)).toBeInTheDocument();
  });

  it("should not render meetings tab if it's not in visibleTabs", () => {
    setup(["reviews", "students"]);

    expect(screen.queryByText(/📅 Meetings/i)).not.toBeInTheDocument();
  });
});
