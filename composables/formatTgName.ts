import type { User } from "~/server/model/trpc";

export default function (user: User | undefined) {
  if (!user) {
    return "No DATA";
  }
  return user.username ? `@${user.username}` : `${user.firstName} ${user.lastName}`;
}
