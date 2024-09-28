import { useEffect, useRef } from "react";
import clsx from "clsx";
import {
  MutationFunction,
  MutationOptions,
  QueryFunction,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

const MESSAGE_KEY = ["MESSAGE"] as const;
const MESSAGES_KEY = ["MESSAGES"] as const;
type MESSAGES_KEY = typeof MESSAGES_KEY;

const sendMessageFn: MutationFunction<void, Pick<Message, "Body">> = async (
  message
) => {
  await fetch("/api/messages", {
    method: "POST",
    body: JSON.stringify({
      Body: message.Body,
    }),
  });
};

const messageMutationOptions: MutationOptions<
  void,
  void,
  Pick<Message, "Body">,
  void
> = {
  mutationKey: MESSAGE_KEY,
  mutationFn: sendMessageFn,
  onError: (error) => console.error(error),
};

const getMessagesFn: QueryFunction<Message[], MESSAGES_KEY> = async ({
  signal,
}) =>
  await fetch("/api/messages", { signal }).then(
    (res) => res.json() as Promise<Message[]>
  );

const messagesQueryOptions: UseQueryOptions<
  Message[],
  void,
  Message[],
  MESSAGES_KEY
> = {
  queryKey: MESSAGES_KEY,
  queryFn: getMessagesFn,
  staleTime: Infinity,
};

type Message = {
  Id: number;
  Username: string;
  Body: string;
  CreatedAt: string;
};

const useSubscription = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    const sse = new EventSource("/api/subscribe");
    sse.addEventListener("error", () => console.log("error"));
    sse.addEventListener("open", () => console.log("open"));
    sse.addEventListener("message", (event) => {
      console.log(event);
      const data = JSON.parse(event.data);
      queryClient.setQueriesData<Message[]>(
        {
          queryKey: MESSAGES_KEY,
        },
        (oldMessages) => {
          if (!oldMessages) return [data];
          return [...oldMessages, data];
        }
      );
    });

    return () => {
      console.log("closing");

      sse.close();
    };
  }, [queryClient]);
};

export function App() {
  useSubscription();
  const { data: messages } = useQuery(messagesQueryOptions);
  const messageArea = useRef<HTMLDivElement | null>(null);

  const newMessage = useMutation(messageMutationOptions);

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
        <h1 className="text-2xl tracking-tight py-1 font-medium dark:text-white">
          Server-Sent-Events with Go
        </h1>
        <p className="text-lg dark:text-white">
          Below is a simple chat app where messages come through SSE, but are
          sent with a normal POST request.
        </p>
      </header>

      <section>
        <div className="h-96 bg-white dark:bg-black border-2 dark:border-stone-800 border-stone-100 rounded-lg relative overflow-hidden">
          <div className="absolute font-mono text-xs uppercase flex gap-2 bg-white/80 dark:bg-stone-800 dark:text-white/60">
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
                          "bg-stone-100 dark:bg-stone-800 dark:text-white/80   self-start":
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
            className="w-full h-12 bottom-0 absolute p-2 backdrop-blur-lg bg-white/60 dark:bg-stone-900 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              const bodyValue = form.get("body");
              if (typeof bodyValue !== "string") return;

              newMessage.mutate({
                Body: bodyValue,
              });
              scrollToBottom();
            }}
          >
            <input
              type="text"
              placeholder="Message"
              name="body"
              className="resize-none h-full w-full px-4 border rounded-full border-stone-200 dark:border-stone-700 focus-visible:outline-none bg-transparent focus-visible:bg-white dark:focus-visible:bg-stone-800 transition-colors placeholder:text-black/40 dark:placeholder:text-stone-500 dark:text-white"
            />
            {/* {message.length > 0 && (
              <button
                className="h-6 w-6 bg-blue-500 flex items-center justify-center rounded-full absolute right-3 top-3 p-1"
                type="submit"
              >
                <ArrowUpIcon
                  className="h-full aspect-square text-white"
                  strokeWidth="3"
                />
              </button>
            )} */}
          </form>
        </div>
      </section>
    </div>
  );
}
