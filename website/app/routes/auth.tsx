import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "app/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "app/components/ui/button";
import { Input } from "app/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { createServerFn } from "@tanstack/start";
import auth from "@/foundation/auth";
import { getEvent, setCookie } from "vinxi/http";
import * as v from "valibot";

export const Route = createFileRoute("/auth")({
  component: Index,
  beforeLoad: ({ context }) => {
    if (context.auth?.me) {
      throw redirect({
        to: "/",
      });
    }
  },
});

const signUpSchema = v.pipe(
  v.object({
    email: v.pipe(v.string(), v.nonEmpty(), v.email()),
    password: v.pipe(v.string(), v.minLength(8)),
    verifyPassword: v.pipe(v.string(), v.minLength(8)),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["verifyPassword"]],
      ({ password, verifyPassword }) => password === verifyPassword,
      "The passwords do not match."
    ),
    ["verifyPassword"]
  ),
  v.transform(({ email, password }) => ({ email, password }))
);

export const signUp = createServerFn("POST", async (formData: FormData) => {
  const validation = v.safeParse(
    signUpSchema,
    Object.fromEntries(formData.entries())
  );

  if (!validation.success) {
    return v.flatten<typeof signUpSchema>(validation.issues);
  }

  const cookie = await auth.signUp(validation.output);

  setCookie(getEvent(), cookie.name, cookie.value);

  return true;
});

function Index() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center pt-40 h-full">
      <Tabs defaultValue="sign-in" className="w-96">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sign-in">Sign In</TabsTrigger>
          <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="sign-in">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Connect with friends and explore new conversations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <form
                id="sign-in"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  console.log("formData", formData);
                  const response = await signUp(formData);
                  console.log(response);
                }}
              >
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" form="sign-in">
                Sign In
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="sign-up">
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>
                Connect with friends and explore new conversations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <form
                id="sign-up"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  const response = await signUp(formData);
                  if (response === true) {
                    navigate({
                      to: "/",
                    });
                    return;
                  }

                  console.log(response);
                }}
              >
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="text"
                    defaultValue="asd@asd.com"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    defaultValue="Kissa123"
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="verifyPassword">Repeat password</Label>
                  <Input
                    id="verifyPassword"
                    name="verifyPassword"
                    type="password"
                    defaultValue="Kissa123"
                    autoComplete="new-password"
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" form="sign-up">
                Sign In
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <p className="px-6 pt-1 text-xs text-muted-foreground">
          Using the app you accept the Terms and Conditions and the Privacy
          Policy.
        </p>
      </Tabs>
    </div>
  );
}
