import {
  MutationFunction,
  MutationOptions,
  QueryFunction,
  useMutation,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import clsx from "clsx";
import { ArrowUpIcon } from "lucide-react";
import { useEffect, useRef } from "react";

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

export const Route = createFileRoute("/_chat/chat/$chatId")({
  component: ChatId,
});

function ChatId() {
  const chatId = useParams({
    from: "/_chat/chat/$chatId",
    select: ({ chatId }) => chatId,
  });
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
    <div className="flex flex-col w-full h-full relative overflow-hidden">
      <div className="absolute flex gap-2 backdrop-blur-md bg-white/60 dark:bg-neutral-800/60 dark:text-white p-2 py-3 border-b border-black/10 dark:border-white/10 w-full h-12">
        Hello asdasds {chatId}!
      </div>
      <div className="absolute font-mono text-xs font uppercase flex flex-col bg-white/80 dark:bg-black/80 dark:text-white/60 top-12">
        <p>scrollHeight: {messageArea?.current?.scrollHeight}</p>
        <p>scrollTop: {messageArea?.current?.scrollTop}</p>
        <p>clientHeight: {messageArea?.current?.clientHeight}</p>
      </div>
      <div
        className="px-3 pt-4 pb-16 overflow-auto [scrollbar-width:none] overscroll-contain h-full"
        ref={messageArea}
      >
        <ul className="flex gap-2 flex-col">
          {messages &&
            messages.length > 0 &&
            messages.map((message) => {
              return (
                <li
                  key={message.Id}
                  className={clsx("py-1 px-3.5 rounded-full text-gray-800", {
                    "bg-stone-100 dark:bg-stone-800 dark:text-white/80   self-start":
                      message.Username === "Alice",
                    "bg-blue-600 text-white self-end":
                      message.Username !== "Alice",
                  })}
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
  );
}
