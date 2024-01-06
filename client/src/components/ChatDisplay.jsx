/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios'
import Chat from './Chat'
import ChatInput from './ChatInput'
import { useEffect, useState } from 'react'

const ChatDisplay = ({ user, clickedUser }) => {
  const userId = user?.user_id
  const clickedUserId = clickedUser?.user_id
  const [userMessages, setUserMessages] = useState(null)
  const [clickedUserMessages, setClickedUserMessages] = useState(null)

  const getUserMessages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/messages', {
        params: { userId: userId, correspondingUserId: clickedUserId },
      })

      setUserMessages(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  const getClickedUserMessages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/messages', {
        params: { userId: clickedUserId, correspondingUserId: userId },
      })

      setClickedUserMessages(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getUserMessages()
      getClickedUserMessages()
    }, 2000)
    return () => clearInterval(interval)
  }, [userMessages, clickedUserMessages])

  // console.log(userMessages)
  const messages = []

  userMessages?.forEach((message) => {
    const formattedMessage = {}
    formattedMessage['name'] = user?.first_name
    formattedMessage['image'] = user?.url
    formattedMessage['message'] = message.message
    formattedMessage['timestamp'] = message.timestamp
    messages.push(formattedMessage)
  })

  clickedUserMessages?.forEach((message) => {
    const formattedMessage = {}
    formattedMessage['name'] = clickedUser?.first_name
    formattedMessage['image'] = clickedUser?.url
    formattedMessage['message'] = message.message
    formattedMessage['timestamp'] = message.timestamp
    messages.push(formattedMessage)
  })

  const descendingOrderMessages = messages?.sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  )

  return (
    <>
      <Chat descendingOrderMessages={descendingOrderMessages} />
      <ChatInput
        user={user}
        clickedUser={clickedUser}
        getUserMessages={getUserMessages}
        getClickedUserMessages={getClickedUserMessages}
      />{' '}
    </>
  )
}

export default ChatDisplay
