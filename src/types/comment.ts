import { AppRouter } from "../server/trpc/router/_app";
import type { inferProcedureOutput } from "@trpc/server";
export type Comment = inferProcedureOutput<
  AppRouter["comment"]["allComments"]
>[number];
export type CommentWithChildren = Comment & {
  children: CommentWithChildren[];
};
