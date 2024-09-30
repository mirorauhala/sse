import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";
import appCss from "@/index.css?url";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type RouteContext = {
  queryClient: QueryClient;
};

export const queryClient = new QueryClient();

export const Route = createRootRouteWithContext<RouteContext>()({
  meta: () => [
    {
      charSet: "utf-8",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
    {
      title: "Server-Sent-Events with Go",
    },
  ],
  links: () => [{ rel: "stylesheet", href: appCss }],
  component: RootComponent,
  notFoundComponent: () => <p>404 Not Found</p>,
});

function RootComponent() {
  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <TanStackRouterDevtools />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body className="min-h-dvh">
        {children}
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  );
}
