import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InputField from '../components/InputField';

describe('InputField', () => {
  const mockOnChange = jest.fn();

  it('renders correctly', () => {
    render(
      <InputField
        label="Username"
        placeholder="Enter username"
        value=""
        onChange={mockOnChange}
        name="username"
        type="text"
      />
    );

    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  it('displays the correct value', () => {
    render(
      <InputField
        label="Username"
        placeholder="Enter username"
        value="TestUser"
        onChange={mockOnChange}
        name="username"
        type="text"
      />
    );

    expect(screen.getByDisplayValue('TestUser')).toBeInTheDocument();
  });

  it('calls onChange function when value changes', () => {
    render(
      <InputField
        label="Username"
        placeholder="Enter username"
        value=""
        onChange={mockOnChange}
        name="username"
        type="text"
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Enter username'), {
      target: { value: 'NewUser' }
    });

    expect(mockOnChange).toHaveBeenCalled();
  });
});