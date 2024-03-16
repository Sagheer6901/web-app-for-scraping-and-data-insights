import { useEffect, useState, useRef } from "react";
import { FaRegCommentDots } from "react-icons/fa";

const ChatComponent = ({ authorId, chatFunc, chat }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const chatRef = useRef(null);

  useEffect(() => {}, [authorId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch("http://localhost:8000/reqChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ author_id: authorId, text: text }),
      });

      if (result.ok) {
        const data = await result.json();
        setChatMessages([
          ...chatMessages,
          { sender: "me", text: text },
          { sender: "bot", text: data },
        ]);
        chatFunc(chatMessages);
        setText("");
      } else {
        chatRef.current.style.borderColor = "red";
        console.log("An error occurred while fetching search results.");
      }
    } catch (error) {
      chatRef.current.style.borderColor = "red";
      console.log(
        "An unexpected error occurred. Please try again later.",
        error.message
      );
    }
  };

  return (
<div className="fixed bottom-0 right-0 m-4">
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="p-2 rounded-full bg-blue-500 text-white"
  >
    <FaRegCommentDots size={35} />
  </button>
  {isOpen && (
    <div className="absolute bottom-full mb-2 right-10 w-64 p-4 bg-white rounded shadow-md">
      <h2 className="text-lg font-bold mb-2">Chat</h2>
      <div className="border-b-2 border-gray-200 mb-2"></div>
      <div
        className="mb-4 overflow-y-auto"
        style={{ maxHeight: "200px", overflowX: "hidden" }}
      >
        {/* Display chat messages */}
        {chat &&
          chat.map((message, index) => (
            <p
              key={index}
              className={`text-sm ${
                message.sender === "me" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              {message.text}
            </p>
          ))}
      </div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          onChange={(event) => setText(event.target.value)}
          value={text}
          className="w-full p-2 border rounded"
          placeholder="Type your message..."
          ref={chatRef}
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded mt-2"
        >
          Send
        </button>
      </form>
    </div>
  )}
</div>


  );
};

export default ChatComponent;
