import * as v from "valibot";

export const UserSchema = v.object({
  id: v.string(),
  displayName: v.nullable(v.string()),
});

export type User = v.InferOutput<typeof UserSchema>;
