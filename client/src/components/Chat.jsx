const Chat = ({ descendingOrderMessages }) => {
  return (
    <>
      <div className="chat-display">
        {descendingOrderMessages.map((message, _index) => (
          <div key={_index}>
            <div className="chat-message-header">
              <div className="img-container">
                <img src={message.image} alt={message.first_name} />
              </div>
              {/* <p>{message.name}</p> */}
            </div>
            <p>{message.message}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default Chat
