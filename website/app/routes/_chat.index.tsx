import { logOut } from "@/server/log-out";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_chat/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  return (
    <>
      <button
        onClick={async () => {
          console.log("Logging out");
          await logOut();
          navigate({ to: "/auth" });
        }}
        className="w-6 h-6 bg-neutral-500 rounded-full absolute right-1 top-2"
      ></button>
      <div className="flex justify-center items-center h-full select-none">
        <div className="bg-neutral-50 w-72 p-4 rounded-xl dark:bg-neutral-800">
          <h3 className="text-neutral-600 dark:text-neutral-400 font-medium tracking-tight pb-0.5">
            Start chatting!
          </h3>
          <p className="text-neutral-500 tracking-tight text-sm">
            Select a friend to chat with.
          </p>
        </div>
      </div>
    </>
  );
}
