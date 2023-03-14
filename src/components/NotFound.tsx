import { JSX } from "solid-js/jsx-runtime"
import { A } from "solid-start"
import { HttpStatusCode } from "solid-start/server"

export function NotFound(props: { title: string; children?: JSX.Element }) {
  return (
    <>
      <HttpStatusCode code={404} />
      <h1 class="text-xl font-bold text-gray-600">{props.title}</h1>
      {props.children}
      <A
        href="/"
        class="text-gray-600 underline underline-offset-4 hover:text-gray-500"
      >
        &larr; Go home
      </A>
    </>
  )
}
