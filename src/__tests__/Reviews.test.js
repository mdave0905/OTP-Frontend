import { render, screen } from '@testing-library/react';
import Reviews from '../components/Reviews';
import emptyReviews from '../assets/empty_reviews.svg';

jest.mock('../components/ReviewItem', () => ({ result, index }) => (
    <div data-testid={`review-item-${index}`}>{result.comment}</div>
));

describe('Reviews Component', () => {
    it('renders a list of reviews when ratings are provided', () => {
        const mockRatings = [
            { comment: 'Great course!' },
            { comment: 'Very informative.' },
        ];

        render(<Reviews ratings={mockRatings} />);

        expect(screen.getByTestId('review-item-0')).toHaveTextContent('Great course!');
        expect(screen.getByTestId('review-item-1')).toHaveTextContent('Very informative.');
    });

    it('displays the "no reviews" image when there are no ratings', () => {
        render(<Reviews ratings={[]} />);

        const image = screen.getByAltText('No meetings yet');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', emptyReviews);
    });

    it('displays the "no reviews" image when ratings are undefined', () => {
        render(<Reviews ratings={undefined} />);

        const image = screen.getByAltText('No meetings yet');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', emptyReviews);
    });
});
