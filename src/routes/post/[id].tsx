import { eq } from "drizzle-orm/expressions"
import { For, Show } from "solid-js"
import { FormError, useParams } from "solid-start"
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server"
import { z } from "zod"
import { NotFound } from "~/components/NotFound"
import { db } from "~/db/client"
import { comments, posts } from "~/db/schema"

export default function Post() {
  const { id } = useParams()
  const data = createServerData$(
    async ([, id], { env }) => {
      return db(env)
        .select({
          postId: posts.id,
          postTitle: posts.title,
          postBody: posts.body,
          postCreatedAt: posts.createdAt,
          commentId: comments.id,
          commentBody: comments.body,
          commentCreatedAt: comments.createdAt,
        })
        .from(posts)
        .leftJoin(comments, eq(posts.id, comments.postId))
        .where(eq(posts.id, Number(id)))
    },
    {
      key: ["posts", id],
    }
  )

  const [addingComment, addComment] = createServerAction$(
    async (form: FormData, { env }) => {
      const parsing = z
        .object({
          postId: z.coerce.number().int().positive(),
          body: z.string().min(1, "Body is required"),
        })
        .safeParse(Object.fromEntries(form))

      if (!parsing.success) {
        throw new FormError("", {
          fieldErrors: parsing.error.formErrors.fieldErrors,
        })
      }

      await db(env)
        .insert(comments)
        .values({ ...parsing.data })
      return redirect(`/post/${parsing.data.postId}`)
    },
    {
      invalidate: ["posts", id],
    }
  )

  const [deletingComment, deleteComment] = createServerAction$(
    async (form: FormData, { env }) => {
      const parsing = z
        .object({
          postId: z.coerce.number().int().positive(),
          id: z.coerce.number().int().positive(),
        })
        .safeParse(Object.fromEntries(form))

      if (!parsing.success) {
        throw new FormError("", {
          fieldErrors: parsing.error.formErrors.fieldErrors,
        })
      }

      await db(env).delete(comments).where(eq(comments.id, parsing.data.id))
      return redirect(`/post/${parsing.data.postId}`)
    },
    {
      invalidate: ["posts", id],
    }
  )

  return (
    <Show when={data()} fallback={<PostNotFound />}>
      <header class="space-y-2">
        <h1 class="text-2xl font-semibold text-gray-800">
          {data()?.[0].postTitle}
        </h1>
        <time
          dateTime={String(data()?.[0].postCreatedAt)}
          class="text-sm text-gray-600"
        >
          {new Date(data()?.[0].postCreatedAt ?? "").toDateString()}
        </time>
      </header>
      <p class="whitespace-pre-line">{data()?.[0].postBody}</p>

      <section>
        <h2 class="font-medium">Comments</h2>
        <Show
          when={data()?.[0].commentId}
          fallback={<p class="text-gray-600">No comments yet.</p>}
        >
          <ul class="mt-2 space-y-2">
            <For each={data()}>
              {({ commentBody, commentCreatedAt, postId, commentId }) => (
                <li class="group relative rounded-md bg-gray-50 py-2 px-4">
                  <time
                    dateTime={String(commentCreatedAt)}
                    class="text-xs text-gray-600"
                  >
                    {new Date(commentCreatedAt ?? "").toDateString()}
                  </time>
                  <p class="whitespace-pre-line">{commentBody}</p>
                  <deleteComment.Form class="absolute -top-2 -right-2">
                    <input type="hidden" name="postId" value={postId} />
                    <input type="hidden" name="id" value={commentId ?? ""} />
                    <button
                      type="submit"
                      disabled={deletingComment.pending}
                      class="rounded-full bg-red-400 px-2 py-1 font-mono text-sm text-gray-50 opacity-0 transition-opacity hover:bg-red-500 group-hover:opacity-100"
                    >
                      {deletingComment.pending ? "Deleting..." : "Delete"}
                    </button>
                  </deleteComment.Form>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </section>

      <addComment.Form class="grid gap-y-4">
        <input type="hidden" name="postId" value={id} />
        <textarea
          name="body"
          placeholder="Body"
          classList={{
            "min-h-[160px] rounded-md border border-gray-200 py-1 px-2": true,
            "border-red-500": Boolean(addingComment.error?.fieldErrors?.body),
          }}
        />
        <button
          type="submit"
          disabled={addingComment.pending}
          class="rounded-md bg-gray-800 p-2 font-medium text-gray-50"
        >
          {addingComment.pending ? "Adding..." : "Add Comment"}
        </button>
      </addComment.Form>
    </Show>
  )
}

function PostNotFound() {
  return (
    <NotFound title="404: Post Not Found">
      <p>The post you are looking for doesn't exist or has been moved.</p>
    </NotFound>
  )
}
