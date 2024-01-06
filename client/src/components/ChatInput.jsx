import axios from 'axios'
import { useState } from 'react'

const ChatInput = ({
  user,
  clickedUser,
  getUserMessages,
  getClickedUserMessages,
}) => {
  const [textArea, setTextArea] = useState(null)
  const userId = user?.user_id
  const clickedUserId = clickedUser?.user_id
  const addMessage = async () => {
    const message = {
      timestamp: new Date().toISOString(),
      from_UserId: userId,
      to_UserId: clickedUserId,
      message: textArea,
    }

    try {
      await axios.post('http://localhost:8000/message', { message })
      getUserMessages()
      getClickedUserMessages()
      setTextArea('')
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <>
      <div className="chat-input">
        <textarea
          value={textArea}
          onChange={(e) => setTextArea(e.target.value)}
        />
        <button className="secondary-button" onClick={addMessage}>
          Submit
        </button>
      </div>
    </>
  )
}

export default ChatInput
