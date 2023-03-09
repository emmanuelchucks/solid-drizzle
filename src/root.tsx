// @refresh reload
import { Suspense } from "solid-js"
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start"
import "./root.css"

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>SolidStart - Drizzle, PlanetScale, Bun</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta
          name="description"
          content="The perfect stack. Made to surf on the edge"
        />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <main class="mx-auto mt-24 mb-12 grid gap-y-6 px-4 md:max-w-sm md:p-0">
              <Routes>
                <FileRoutes />
              </Routes>
            </main>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  )
}
