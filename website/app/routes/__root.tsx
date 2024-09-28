import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AuthContext } from "@/auth";
import { Body, Head, Html, Meta, Scripts } from "@tanstack/start";
import appCss from "@/index.css?url";

type RouterContext = {
  auth?: AuthContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
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
      <Outlet />
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
