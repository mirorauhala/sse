import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Conversations } from "@/components/conversations";
import { getMe } from "@/server/get-me";
import { UseQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";

export type Conversation = {
  id: number;
  name: string;
  preview: string;
  date: string;
};

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const getConversations = createServerFn("GET", async () => {
  const conversations: Conversation[] = [];

  for (let index = 1; index < 100; index++) {
    await sleep(50);
    conversations.push({
      id: index,
      name: "Name",
      preview:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo, corporis cum? Sequi numquam, vel earum dolore saepe possimus laboriosam debitis iure illum reiciendis aspernatur modi harum perferendis minus perspiciatis adipisci?",
      date: new Date().toISOString(),
    });
  }
  return conversations;
});

export const conversationQueryOptions = {
  queryKey: ["CONVERSATIONS"] as const,
  queryFn: () => getConversations(),
};

export const Route = createFileRoute("/_chat")({
  component: Index,
  loader: async ({ context }) =>
    context.queryClient.ensureQueryData({
      ...conversationQueryOptions,
    }),
  gcTime: 10_000,
  beforeLoad: async ({ location }) => {
    const result = await getMe();

    if (!result) {
      throw redirect({
        to: "/auth",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function Index() {
  const conversations = Route.useLoaderData();

  return (
    <div className="flex h-dvh">
      <Conversations initialData={conversations} />

      <main className="w-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
