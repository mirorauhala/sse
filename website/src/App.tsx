import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ArrowUpIcon } from "lucide-react";
import {
  MutationFunction,
  QueryFunction,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

type Message = {
  Id: number;
  Username: string;
  Body: string;
  CreatedAt: string;
};

const messageQueryKey = ["messages"] as const;
type MessageQueryKey = typeof messageQueryKey;

const getMessages: QueryFunction<Message[], MessageQueryKey> = () =>
  fetch("/api/messages").then((res) => res.json() as Promise<Message[]>);

const messageOptions = (): UseQueryOptions<
  Message[],
  void,
  Message[],
  MessageQueryKey
> => ({
  queryKey: messageQueryKey,
  queryFn: getMessages,
});

const messageMutationKey = ["messages"] as const;

type MessageVariables = {
  Username: string;
  Body: string;
};

const sendMessage: MutationFunction<Response, MessageVariables> = (variables) =>
  fetch("/api/messages", {
    method: "POST",
    body: JSON.stringify(variables),
  });

const messageMutationOptions = (): UseMutationOptions<
  Response,
  void,
  MessageVariables
> => ({
  mutationKey: messageMutationKey,
  mutationFn: sendMessage,
});

const ReadyStateClosed = 2;

const getName = () => window.localStorage.getItem("chat-name");

export function App() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [start, setStart] = useState(() => !!getName() || false);
  const { data: messages, isLoading } = useQuery(messageOptions());
  const messageArea = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();
  const eventSource = useRef<EventSource | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      eventSource.current === undefined ||
      eventSource.current.readyState === ReadyStateClosed
    ) {
      console.log("Init");
      const sse = new EventSource("/api/subscribe");
      sse.addEventListener("message", (e) => {
        try {
          const message = JSON.parse(e.data) as Message;
          console.log("Recieved", message);
          queryClient.setQueryData<Message[]>(messageQueryKey, (data) => {
            return [...(data || []), message];
          });
        } catch (e) {
          console.error(e);
        }
      });
      sse.addEventListener("open", (e) => {
        console.log("open", e);
      });
      sse.addEventListener("error", (e) => {
        console.log("error", e);
      });
      eventSource.current = sse;
    }

    return () => {
      if (eventSource.current) {
        console.log("Close");

        eventSource.current.close();
      }
    };
  }, [queryClient]);

  const newMessage = useMutation({
    ...messageMutationOptions(),
  });

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView();
      }
    }, 1);
  };

  useEffect(() => {
    if (!isLoading && messages && messages.length > 0) {
      scrollToBottom();
    }
  }, [isLoading, messages]);

  return (
    <div className="max-w-2xl mx-auto pt-20">
      <section>
        <div className=" font-mono text-xs uppercase flex gap-2 bg-white opacity-80 p-0.5 rounded-br-lg">
          <p>scrollHeight: {messageArea?.current?.scrollHeight}</p>
          <p>scrollTop: {messageArea?.current?.scrollTop}</p>
          <p>clientHeight: {messageArea?.current?.clientHeight}</p>
          <p>NAME: {getName()!}</p>
        </div>
        <div className="relative h-96 bg-white border-2 border-stone-100 rounded-lg overflow-hidden">
          {start && (
            <div className="h-full">
              <div
                className="px-3 pt-4 pb-16 overflow-auto [scrollbar-width:none] overscroll-contain h-full"
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
                                message.Username !== getName()!,
                              "bg-blue-600 text-white self-end":
                                message.Username === getName()!,
                            }
                          )}
                        >
                          {message.Body}
                        </li>
                      );
                    })}
                </ul>
                <div ref={scrollRef} aria-hidden />
              </div>

              <form
                className="w-full h-12 bottom-0 absolute p-2 backdrop-blur-lg bg-white/60 flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  newMessage.mutate({
                    Username: getName()!,
                    Body: message,
                  });

                  setMessage("");
                  scrollToBottom();
                }}
              >
                <input
                  type="text"
                  placeholder="Message"
                  className="h-full w-full px-4 border rounded-full border-stone-200 focus-visible:outline-none bg-transparent focus-visible:bg-white transition-colors placeholder:text-black/40 placeholder:select-none"
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
          )}
          {!start && (
            <div className="w-full h-full px-4 pt-16 rounded-lg flex  flex-col">
              <div className="pb-4 px-2">
                <h1 className="text-xl font-bold">What is your name?</h1>
                <p>Enter your name to start chatting.</p>
              </div>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = new FormData(e.currentTarget);
                  const name = form.get("name");
                  if (typeof name !== "string" || name.trim().length < 3)
                    return;

                  window.localStorage.setItem("chat-name", name);
                  setName(name);
                  setStart(true);
                }}
              >
                <input
                  type="text"
                  placeholder="My name is..."
                  autoComplete="off"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value.trim())}
                  className="h-8 px-4 border rounded-full border-stone-200 focus-visible:outline-none bg-transparent focus-visible:bg-white transition-colors placeholder:text-black/40 w-2/3"
                  data-1p-ignore
                />
                <button
                  className="h-8 text-nowrap text-white px-3 font-medium bg-blue-500 flex items-center justify-center rounded-full active:bg-blue-400 disabled:bg-gray-400"
                  disabled={name.length < 3}
                >
                  Start
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
