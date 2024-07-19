import type { User, RefUser } from "~/server/lib/schema";

export default function (user: User | RefUser | undefined) {
  if (!user) {
    return "No DATA";
  }
  return user.username ? `@${user.username}` : `${user.firstName ?? ""} ${user.lastName ?? ""}`;
}
