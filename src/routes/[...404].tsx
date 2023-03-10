import { A } from "solid-start"
import { HttpStatusCode } from "solid-start/server"

export default function NotFound() {
  return (
    <>
      <HttpStatusCode code={404} />
      <h1 class="text-xl font-bold text-gray-600">404: Not Found</h1>
      <p>
        "I told my wife she was drawing her eyebrows too high. She looked
        surprised."
      </p>
      <A
        href="/"
        class="text-gray-600 underline underline-offset-4 hover:text-gray-500"
      >
        &larr; Go home
      </A>
    </>
  )
}
