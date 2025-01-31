import React from "react";
import { render, screen } from "@testing-library/react";
import EnrolledStudentItem from '../components/EnrolledStudentItem';

describe("EnrolledStudentItem Component", () => {
    test("renders the fullName and email of the student", () => {
        const student = { fullName: "John Doe", email: "john.doe@example.com" };

        render(<EnrolledStudentItem result={student} />);

        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
        expect(screen.getByText(/john.doe@example.com/i)).toBeInTheDocument();
    });

    test("has the correct styling applied", () => {
        const student = { fullName: "Jane Doe", email: "jane.doe@example.com" };

        const { container } = render(<EnrolledStudentItem result={student} />);

        const studentItem = container.firstChild;
        expect(studentItem).toHaveClass("text-sm");
        expect(studentItem).toHaveClass("text-gray-100");
        expect(studentItem).toHaveClass("mt-1.5");
        expect(studentItem).toHaveClass("bg-gray-800");
        expect(studentItem).toHaveClass("p-4");
        expect(studentItem).toHaveClass("rounded-xl");
    });
});
