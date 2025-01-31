import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomDropdown from '../components/CustomDropdown';

describe('CustomDropdown', () => {
  const options = ['Option 1', 'Option 2', 'Option 3'];
  let selectedOption = 'Option 1';
  const setSelectedOption = jest.fn((option) => {
    selectedOption = option;
  });

  test('renders correctly', () => {
    render(
      <CustomDropdown
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        options={options}
      />
    );
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  test('toggles dropdown correctly', () => {
    render(
      <CustomDropdown
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        options={options}
      />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
  });

  test('displays options correctly when dropdown is open', () => {
    render(
      <CustomDropdown
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        options={options}
      />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(options.length);
    options.forEach((option, index) => {
      expect(listItems[index]).toHaveTextContent(option);
    });
  });

  test('calls setSelectedOption with correct option when an option is selected', () => {
    render(
      <CustomDropdown
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        options={options}
      />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    const option = screen.getByText('Option 2');
    fireEvent.click(option);
    expect(setSelectedOption).toHaveBeenCalledWith('Option 2');
  });
});