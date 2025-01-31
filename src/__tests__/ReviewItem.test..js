import React from "react";
import { render, screen } from "@testing-library/react";
import ReviewItem from '../components/ReviewItem';

jest.mock("@smastrom/react-rating", () => ({
    Rating: (props) => (
        <div data-testid="rating-component">
            Rating Component - value: {props.value}, readOnly: {props.readOnly ? "true" : "false"}
        </div>
    ),
}));

describe("ReviewItem Component", () => {
    const mockResult = {
        studentName: "Jane Doe",
        points: 4.5,
        review: "Great tutor! Very helpful and patient.",
    };

    test("renders the student name, review, and rating component", () => {
        // Act
        render(<ReviewItem result={mockResult} index={0} />);

        // Assert
        expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
        expect(
            screen.getByText(/Great tutor! Very helpful and patient./i)
        ).toBeInTheDocument();
        expect(screen.getByTestId("rating-component")).toBeInTheDocument();
    });

    test("passes the correct props to the Rating component", () => {
        render(<ReviewItem result={mockResult} index={0} />);

        const ratingElement = screen.getByTestId("rating-component");
        expect(ratingElement).toHaveTextContent("value: 4.5");
        expect(ratingElement).toHaveTextContent("readOnly: true");
    });

    test("has the correct styling applied", () => {
        const { container } = render(<ReviewItem result={mockResult} index={0} />);

        const reviewItem = container.firstChild;
        expect(reviewItem).toHaveClass("bg-gray-800");
        expect(reviewItem).toHaveClass("mt-1");
        expect(reviewItem).toHaveClass("rounded-xl");
        expect(reviewItem).toHaveClass("py-3");
        expect(reviewItem).toHaveClass("px-5");
    });
});
