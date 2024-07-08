import type { User, UsersListItem } from "~/server/model/trpc";

export default function (user: User | UsersListItem | undefined) {
  if (!user) {
    return "No DATA";
  }
  return user.username ? `@${user.username}` : `${user.firstName ?? ""} ${user.lastName ?? ""}`;
}
