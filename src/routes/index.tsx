import { eq } from "drizzle-orm/expressions"
import { For, Show } from "solid-js"
import { FormError } from "solid-start"
import {
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server"
import { z } from "zod"
import { db } from "~/db/client"
import { comments, posts } from "~/db/schema"

export default function Home() {
  const data = createServerData$(async (_, { env }) => {
    return db(env).select().from(posts)
  })

  const [addingPost, addPost] = createServerAction$(
    async (form: FormData, { env }) => {
      const parsing = z
        .object({
          title: z.string().min(1, "Title is required"),
          body: z.string().min(1, "Body is required"),
        })
        .safeParse(Object.fromEntries(form))

      if (!parsing.success) {
        throw new FormError("", {
          fieldErrors: parsing.error.formErrors.fieldErrors,
        })
      }

      await db(env)
        .insert(posts)
        .values({ ...parsing.data })
      return redirect("/")
    }
  )

  const [deletingPost, deletePost] = createServerAction$(
    async (form: FormData, { env }) => {
      const parsing = z
        .object({
          id: z.coerce.number().int().positive(),
        })
        .safeParse(Object.fromEntries(form))

      if (!parsing.success) {
        throw new FormError("", {
          fieldErrors: parsing.error.formErrors.fieldErrors,
        })
      }

      await Promise.allSettled([
        db(env).delete(comments).where(eq(comments.postId, parsing.data.id)),
        db(env).delete(posts).where(eq(posts.id, parsing.data.id)),
      ])
      return redirect("/")
    }
  )

  return (
    <>
      <section class="grid gap-y-4">
        <h1 class="text-xl font-bold text-gray-600">Posts</h1>
        <Show
          when={data()?.length}
          fallback={<p class="italic text-gray-600">No posts yet</p>}
        >
          <ul class="space-y-4">
            <For each={data()}>
              {(post) => (
                <li class="group relative">
                  <a
                    href={`/post/${post.id}`}
                    class="grid gap-y-2 rounded-md bg-gray-100 p-4"
                  >
                    <div class="flex items-baseline justify-between">
                      <h2 class="text-lg font-semibold text-gray-700">
                        {post.title}
                      </h2>
                      <time
                        dateTime={String(post.createdAt)}
                        class="text-sm text-gray-600"
                      >
                        {new Date(post.createdAt ?? "").toLocaleDateString()}
                      </time>
                    </div>
                    <p class="text-gray-600 line-clamp-2">{post.body}</p>
                  </a>
                  <deletePost.Form class="absolute -top-2 -right-2">
                    <input type="hidden" name="id" value={post.id} />
                    <button
                      type="submit"
                      disabled={deletingPost.pending}
                      class="rounded-full bg-red-400 px-2 py-1 font-mono text-sm text-gray-50 opacity-0 transition-opacity hover:bg-red-500 group-hover:opacity-100"
                    >
                      {deletingPost.pending ? "Deleting..." : "Delete"}
                    </button>
                  </deletePost.Form>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </section>
      <addPost.Form class="grid gap-y-4">
        <input
          name="title"
          placeholder="Title"
          classList={{
            "rounded-md border border-gray-200 py-1 px-2": true,
            "border-red-500": Boolean(addingPost.error?.fieldErrors?.title),
          }}
        />
        <textarea
          name="body"
          placeholder="Body"
          classList={{
            "min-h-[160px] rounded-md border border-gray-200 py-1 px-2": true,
            "border-red-500": Boolean(addingPost.error?.fieldErrors?.body),
          }}
        />
        <button
          type="submit"
          disabled={addingPost.pending}
          class="rounded-md bg-gray-800 p-2 font-medium text-gray-50"
        >
          {addingPost.pending ? "Adding..." : "Add Post"}
        </button>
      </addPost.Form>
    </>
  )
}
