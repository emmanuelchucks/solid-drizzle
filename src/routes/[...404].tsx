import { NotFound } from "~/components/NotFound"

export default function PageNotFound() {
  return (
    <NotFound title="404: Not Found">
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <p>
        "I told my wife she was drawing her eyebrows too high. She looked
        surprised."
      </p>
    </NotFound>
  )
}
