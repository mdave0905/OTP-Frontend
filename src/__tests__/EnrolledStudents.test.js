import React from "react";
import { render, screen } from "@testing-library/react";
import EnrolledStudents from '../components/EnrolledStudents';

jest.mock("../components/EnrolledStudentItem", () => ({ result }) => (
    <div data-testid="enrolled-student-item">{result.fullName}</div>
));

jest.mock("../assets/empty_students.svg", () => "mocked-empty-students.svg");

describe("EnrolledStudents Component", () => {
    test("renders enrolled student items when the list is populated", () => {
        const mockEnrolledStudents = [
            { fullName: "John Doe", email: "john@example.com" },
            { fullName: "Jane Smith", email: "jane@example.com" },
        ];

        render(<EnrolledStudents enrolledStudents={mockEnrolledStudents} />);

        const items = screen.getAllByTestId("enrolled-student-item");
        expect(items).toHaveLength(mockEnrolledStudents.length);

        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    test("renders an empty state image when there are no students", () => {
        render(<EnrolledStudents enrolledStudents={[]} />);

        const emptyStateImage = screen.getByAltText("No meetings yet");
        expect(emptyStateImage).toBeInTheDocument();
        expect(emptyStateImage).toHaveAttribute("src", "mocked-empty-students.svg");
    });

    test("handles undefined enrolledStudents gracefully", () => {
        render(<EnrolledStudents enrolledStudents={undefined} />);

        const emptyStateImage = screen.getByAltText("No meetings yet");
        expect(emptyStateImage).toBeInTheDocument();
        expect(emptyStateImage).toHaveAttribute("src", "mocked-empty-students.svg");
    });
});
