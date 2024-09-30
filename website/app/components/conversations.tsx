import { Conversation, conversationQueryOptions } from "@/routes/_chat";
import { useQuery } from "@tanstack/react-query";
import { useMatchRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Conversations = ({
  initialData,
}: {
  initialData: Conversation[];
}) => {
  const { data: conversations } = useQuery({
    ...conversationQueryOptions,
    initialData,
  });
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();

  return (
    <nav className="w-96 border-r dark:border-neutral-800 relative flex flex-col gap-2">
      <div className="px-2 h-12 flex justify-between items-center shrink-0">
        <button
          onClick={() => navigate({ to: "/" })}
          className="inline-block px-2 py-1 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors dark:text-white "
        >
          Server-Sent-Events with Go
        </button>

        <button className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-1">
          <Plus
            width="18"
            height="18"
            className="text-neutral-600 dark:text-neutral-400"
          />
        </button>
      </div>

      <div className="px-2">
        <input
          type="text"
          placeholder="Search"
          className="px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 w-full text-sm placeholder:text-neutral-600 dark:placeholder:text-neutral-400 dark:text-white"
        />
      </div>

      <ul className="flex flex-col gap-1 overflow-auto [scrollbar-width:none]">
        {conversations.map((convo) => {
          const active =
            typeof matchRoute({
              to: "/chat/$chatId",
              params: { chatId: convo.id.toString() },
            }) === "object";

          return (
            <li className="px-2" key={convo.id}>
              <button
                onClick={() => {
                  navigate({
                    to: "/chat/$chatId",
                    params: { chatId: convo.id.toString() },
                  });
                }}
                data-active={active}
                className="flex flex-col w-full text-left px-2 py-1 hover:bg-neutral-100 focus-visible:bg-neutral-100 rounded-lg dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800 select-none data-[active=true]:bg-blue-600 dark:data-[active=true]:hover:bg-blue-600 group"
              >
                <div className="flex justify-between items-end w-full">
                  <p className="text-sm font-medium dark:text-white group-data-[active=true]:text-secondary">
                    {convo.name}
                  </p>
                  <p className="text-sm text-neutral-500 group-data-[active=true]:text-white/60">
                    {convo.date}
                  </p>
                </div>
                <div className="w-full">
                  <p className="text-ellipsis line-clamp-3 text-sm text-neutral-500 group-data-[active=true]:text-white/60">
                    {convo.preview}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
