import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import FileUpload from '../components/FileUpload'

describe('FileUpload', () => {
  const mockOnChange = jest.fn()

  it('renders correctly', () => {
    render(
      <FileUpload
        label="Upload Image"
        id="file-upload"
        onChange={mockOnChange}
      />
    )

    expect(screen.getByText('Upload Image')).toBeInTheDocument()
    expect(screen.getByText('Drag & drop an image here or')).toBeInTheDocument()
  })

  it('calls onChange function when a file is selected', () => {
    render(
      <FileUpload
        label="Upload Image"
        id="file-upload"
        onChange={mockOnChange}
      />
    )

    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    })
    const input = screen.getByLabelText('Upload Image')

    fireEvent.change(input, { target: { files: [file] } })

    expect(mockOnChange).toHaveBeenCalledWith(file)
    expect(screen.getByText('Selected file:')).toHaveTextContent('example.png')
  })
})
