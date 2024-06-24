import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ArrowUpIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Message = {
  Id: number;
  Username: string;
  Body: string;
  CreatedAt: string;
};

export function App() {
  const [message, setMessage] = useState("");
  const { data: messages, isLoading } = useQuery({
    queryKey: ["MESSAGES"],
    queryFn: () =>
      fetch("/api/messages").then((res) => res.json() as Promise<Message[]>),
  });
  const messageArea = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const newMessage = useMutation({
    mutationKey: ["MESSAGES"],
    mutationFn: () =>
      fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({
          Message: message,
        }),
      }),
    onMutate: () => {
      const prev = queryClient.getQueryData(["MESSAGES"]);
      queryClient.setQueryData(["MESSAGES"], (data) => {
        const optimisticMessage = {
          Id: Math.random() * 100,
          Body: message,
          Username: Math.random() > 0.5 ? "Miro" : "Alice",
          CreatedAt: new Date().toISOString(),
        };
        if (!data) return [optimisticMessage] satisfies Message[];

        return [...(data as Message[]), optimisticMessage];
      });
      return { prev };
    },
    onError: (prev) => {
      queryClient.setQueryData(["MESSAGES"], prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["MESSAGES"],
      });
    },
  });

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messageArea.current) {
        messageArea.current.scrollTop = messageArea.current.scrollHeight + 48;
      }
    }, 1);
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

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
          <div className="absolute font-mono text-xs uppercase flex gap-2 bg-white opacity-80">
            <p>scrollHeight: {messageArea?.current?.scrollHeight}</p>
            <p>scrollTop: {messageArea?.current?.scrollTop}</p>
            <p>clientHeight: {messageArea?.current?.clientHeight}</p>
          </div>
          <div
            className="px-3 pt-4 pb-16 overflow-auto [scrollbar-width:none] overscroll-contain h-96"
            ref={messageArea}
          >
            <ul className="flex gap-3 flex-col">
              {messages &&
                messages.length > 0 &&
                messages.map((message) => {
                  return (
                    <li
                      key={message.Id}
                      className={clsx(
                        "py-1 px-3.5 rounded-full text-gray-800",
                        {
                          "bg-stone-100 self-start":
                            message.Username === "Alice",
                          "bg-blue-600 text-white self-end":
                            message.Username !== "Alice",
                        }
                      )}
                    >
                      {message.Body}
                    </li>
                  );
                })}
            </ul>
          </div>

          <form
            className="w-full h-12 bottom-0 absolute p-2 backdrop-blur-lg bg-white/60 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              newMessage.mutate();

              setMessage("");
              scrollToBottom();
            }}
          >
            <input
              type="text"
              placeholder="Message"
              className="resize-none h-full w-full px-4 border rounded-full border-stone-200 focus-visible:outline-none bg-transparent focus-visible:bg-white transition-colors placeholder:text-black/40"
              value={message}
              onChange={(e) => setMessage(e.currentTarget.value)}
            />
            {message.length > 0 && (
              <button
                className="h-6 w-6 bg-blue-500 flex items-center justify-center rounded-full absolute right-3 top-3 p-1"
                type="submit"
              >
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
