import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TextareaField from '../components/TextareaField';

describe('TextareaField', () => {
  const mockOnChange = jest.fn();

  it('renders correctly', () => {
    render(
      <TextareaField
        label="Description"
        placeholder="Enter description"
        value=""
        onChange={mockOnChange}
        name="description"
        rows="4"
      />
    );

    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
  });

  it('displays the correct value', () => {
    render(
      <TextareaField
        label="Description"
        placeholder="Enter description"
        value="Test value"
        onChange={mockOnChange}
        name="description"
        rows="4"
      />
    );

    expect(screen.getByDisplayValue('Test value')).toBeInTheDocument();
  });

  it('calls onChange function when value changes', () => {
    render(
      <TextareaField
        label="Description"
        placeholder="Enter description"
        value=""
        onChange={mockOnChange}
        name="description"
        rows="4"
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Enter description'), {
      target: { value: 'New value' }
    });

    expect(mockOnChange).toHaveBeenCalled();
  });
});