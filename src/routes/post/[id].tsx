import { eq } from "drizzle-orm/expressions"
import { Show } from "solid-js"
import { useParams } from "solid-start"
import { createServerData$ } from "solid-start/server"
import { NotFound } from "~/components/NotFound"
import { db } from "~/db/client"
import { posts } from "~/db/schema"

export default function Post() {
  const { id } = useParams()
  const post = createServerData$(
    async ([, id], { env }) => {
      const data = await db(env)
        .select()
        .from(posts)
        .where(eq(posts.id, Number(id)))
      return data[0]
    },
    {
      key: ["post", id],
    }
  )

  return (
    <Show when={post()} fallback={<PostNotFound />}>
      <header class="space-y-2">
        <h1 class="text-2xl font-semibold text-gray-800">{post()?.title}</h1>
        <time
          dateTime={String(post()?.createdAt)}
          class="text-sm text-gray-600"
        >
          {post()?.createdAt?.toDateString()}
        </time>
      </header>
      <p class="whitespace-pre-line">{post()?.body}</p>
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
