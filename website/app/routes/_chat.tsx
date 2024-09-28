import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Navigation } from "@/components/navigation";

export const Route = createFileRoute("/_chat")({
  component: Index,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.me) {
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
  return (
    <div className="flex h-dvh">
      <Navigation />

      <main className="w-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
