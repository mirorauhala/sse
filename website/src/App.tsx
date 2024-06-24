import { useState } from "react";
import clsx from "clsx";
import { ArrowUpIcon, SendHorizonalIcon } from "lucide-react";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      timestamp: "2024-06-24T12:00:00",
      body: "Hello! How are you?",
      username: "Alice",
    },
    {
      id: 2,
      timestamp: "2024-06-24T12:05:00",
      body: "I'm doing well, thank you. How about you?",
      username: "Bob",
    },
    {
      id: 3,
      timestamp: "2024-06-24T12:10:00",
      body: "I'm good too. Just working on some projects.",
      username: "Alice",
    },
    {
      id: 4,
      timestamp: "2024-06-24T12:15:00",
      body: "Sounds interesting. What kind of projects?",
      username: "Bob",
    },
    {
      id: 5,
      timestamp: "2024-06-24T12:20:00",
      body: "I'm working on a new website design.",
      username: "Alice",
    },
    {
      id: 6,
      timestamp: "2024-06-24T12:25:00",
      body: "That's cool. Do you need any help with it?",
      username: "Bob",
    },
    {
      id: 7,
      timestamp: "2024-06-24T12:30:00",
      body: "Not at the moment, but I'll let you know if I do.",
      username: "Alice",
    },
    {
      id: 8,
      timestamp: "2024-06-24T12:35:00",
      body: "Sure, just give me a shout when you need assistance.",
      username: "Bob",
    },
    {
      id: 9,
      timestamp: "2024-06-24T12:40:00",
      body: "Thanks, Bob. I appreciate it.",
      username: "Alice",
    },
    {
      id: 10,
      timestamp: "2024-06-24T12:45:00",
      body: "No problem, that's what friends are for.",
      username: "Bob",
    },
    {
      id: 11,
      timestamp: "2024-06-24T12:50:00",
      body: "Hey, have you seen the latest movie release?",
      username: "Alice",
    },
    {
      id: 12,
      timestamp: "2024-06-24T12:55:00",
      body: "Not yet. Is it any good?",
      username: "Bob",
    },
    {
      id: 13,
      timestamp: "2024-06-24T13:00:00",
      body: "I heard it's amazing. We should go watch it together sometime.",
      username: "Alice",
    },
    {
      id: 14,
      timestamp: "2024-06-24T13:05:00",
      body: "That sounds like a plan. Let me know when you're free.",
      username: "Bob",
    },
  ]);

  return (
    <div className="max-w-2xl mx-auto">
      <header className="py-4">
        <h1 className="text-2xl tracking-tight py-1 font-medium">
          Server-Sent-Events with Go
        </h1>
        <p className="text-lg">
          Below is a simple chat app where messages come through SSE, but are
          sent with a normal POST request.
        </p>
      </header>

      <section>
        <div className="h-96 bg-white border-2 border-stone-100 rounded-lg relative overflow-hidden">
          <div className="px-3 pt-4 pb-16 overflow-auto [scrollbar-width:none] h-96">
            <ul className="flex gap-3 flex-col">
              {messages.map((message) => {
                return (
                  <li
                    key={message.id}
                    className={clsx("py-1 px-3.5 rounded-full text-gray-800", {
                      "bg-stone-100 self-start": message.username === "Alice",
                      "bg-blue-600 text-white self-end":
                        message.username !== "Alice",
                    })}
                  >
                    {message.body}
                  </li>
                );
              })}
            </ul>
          </div>

          <form className="w-full h-12 bottom-0 absolute p-2 backdrop-blur-lg bg-white/60 flex gap-2">
            <input
              type="text"
              placeholder="Message"
              className="resize-none h-full w-full px-4 border rounded-full border-stone-200 focus-visible:outline-none bg-transparent focus-visible:bg-white transition-colors placeholder:text-black/40"
              value={message}
              onChange={(e) => setMessage(e.currentTarget.value)}
            />
            {!!(message.length > 0) && (
              <button className="h-6 w-6 bg-blue-500 flex items-center justify-center rounded-full absolute right-3 top-3 p-1">
                <ArrowUpIcon
                  className="h-full aspect-square text-white"
                  strokeWidth="3"
                />
              </button>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;
