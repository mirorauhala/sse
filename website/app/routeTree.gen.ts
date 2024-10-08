/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from "./routes/__root";
import { Route as AuthImport } from "./routes/auth";
import { Route as ChatImport } from "./routes/_chat";
import { Route as ChatIndexImport } from "./routes/_chat.index";
import { Route as ChatChatChatIdImport } from "./routes/_chat.chat.$chatId";

// Create/Update Routes

const AuthRoute = AuthImport.update({
  path: "/auth",
  getParentRoute: () => rootRoute,
} as any);

const ChatRoute = ChatImport.update({
  id: "/_chat",
  getParentRoute: () => rootRoute,
} as any);

const ChatIndexRoute = ChatIndexImport.update({
  path: "/",
  getParentRoute: () => ChatRoute,
} as any);

const ChatChatChatIdRoute = ChatChatChatIdImport.update({
  path: "/chat/$chatId",
  getParentRoute: () => ChatRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/_chat": {
      id: "/_chat";
      path: "";
      fullPath: "";
      preLoaderRoute: typeof ChatImport;
      parentRoute: typeof rootRoute;
    };
    "/auth": {
      id: "/auth";
      path: "/auth";
      fullPath: "/auth";
      preLoaderRoute: typeof AuthImport;
      parentRoute: typeof rootRoute;
    };
    "/_chat/": {
      id: "/_chat/";
      path: "/";
      fullPath: "/";
      preLoaderRoute: typeof ChatIndexImport;
      parentRoute: typeof ChatImport;
    };
    "/_chat/chat/$chatId": {
      id: "/_chat/chat/$chatId";
      path: "/chat/$chatId";
      fullPath: "/chat/$chatId";
      preLoaderRoute: typeof ChatChatChatIdImport;
      parentRoute: typeof ChatImport;
    };
  }
}

// Create and export the route tree

interface ChatRouteChildren {
  ChatIndexRoute: typeof ChatIndexRoute;
  ChatChatChatIdRoute: typeof ChatChatChatIdRoute;
}

const ChatRouteChildren: ChatRouteChildren = {
  ChatIndexRoute: ChatIndexRoute,
  ChatChatChatIdRoute: ChatChatChatIdRoute,
};

const ChatRouteWithChildren = ChatRoute._addFileChildren(ChatRouteChildren);

export interface FileRoutesByFullPath {
  "": typeof ChatRouteWithChildren;
  "/auth": typeof AuthRoute;
  "/": typeof ChatIndexRoute;
  "/chat/$chatId": typeof ChatChatChatIdRoute;
}

export interface FileRoutesByTo {
  "/auth": typeof AuthRoute;
  "/": typeof ChatIndexRoute;
  "/chat/$chatId": typeof ChatChatChatIdRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  "/_chat": typeof ChatRouteWithChildren;
  "/auth": typeof AuthRoute;
  "/_chat/": typeof ChatIndexRoute;
  "/_chat/chat/$chatId": typeof ChatChatChatIdRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths: "" | "/auth" | "/" | "/chat/$chatId";
  fileRoutesByTo: FileRoutesByTo;
  to: "/auth" | "/" | "/chat/$chatId";
  id: "__root__" | "/_chat" | "/auth" | "/_chat/" | "/_chat/chat/$chatId";
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  ChatRoute: typeof ChatRouteWithChildren;
  AuthRoute: typeof AuthRoute;
}

const rootRouteChildren: RootRouteChildren = {
  ChatRoute: ChatRouteWithChildren,
  AuthRoute: AuthRoute,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_chat",
        "/auth"
      ]
    },
    "/_chat": {
      "filePath": "_chat.tsx",
      "children": [
        "/_chat/",
        "/_chat/chat/$chatId"
      ]
    },
    "/auth": {
      "filePath": "auth.tsx"
    },
    "/_chat/": {
      "filePath": "_chat.index.tsx",
      "parent": "/_chat"
    },
    "/_chat/chat/$chatId": {
      "filePath": "_chat.chat.$chatId.tsx",
      "parent": "/_chat"
    }
  }
}
ROUTE_MANIFEST_END */
