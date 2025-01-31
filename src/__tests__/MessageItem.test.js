import React from 'react'
import { render, screen } from '@testing-library/react'
import MessageItem from '../components/MessageItem'

describe('MessageItem', () => {
  const currentUserId = 'user1'
  const message = {
    senderId: 'user2',
    messageContent: 'Hello, this is a test message.',
    sendAt: '2024-10-10T14:40:00.000',
  }

  test('renders correctly', () => {
    render(<MessageItem message={message} currentUserId={currentUserId} />)
    expect(
      screen.getByText('Hello, this is a test message.')
    ).toBeInTheDocument()
  })

  test('displays the correct timestamp in UTC', () => {
    render(<MessageItem message={message} currentUserId={currentUserId} />)
    const timestamp = new Date(message.sendAt + 'Z').toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
    expect(screen.getByText(timestamp)).toBeInTheDocument()
  })

  test('applies correct styling based on sender', () => {
    const { rerender } = render(
      <MessageItem message={message} currentUserId={currentUserId} />
    )
    expect(screen.getByText('Hello, this is a test message.')).toHaveClass(
      'bg-gray-200 text-gray-800 self-start'
    )

    const messageFromCurrentUser = { ...message, senderId: currentUserId }
    rerender(
      <MessageItem
        message={messageFromCurrentUser}
        currentUserId={currentUserId}
      />
    )
    expect(screen.getByText('Hello, this is a test message.')).toHaveClass(
      'bg-blue-100 text-blue-900 self-end'
    )
  })
})
