import {
  isRouteErrorResponse,
  Link,
  Links,
  LinksFunction,
  LoaderFunctionArgs,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import { Text } from "~/ui/common/Text/Text";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
  { rel: "icon", type: "image/png", href: "/favicon-32x32.png", sizes: "32x32" },
  { rel: "icon", type: "image/png", href: "/favicon-16x16.png", sizes: "16x16" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
  { rel: "manifest", href: "/site.webmanifest" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function loader({ request }: LoaderFunctionArgs) {
  const host = request.headers.get("host");
  if (host === "www.obdavcen.si") {
    const url = new URL(request.url);
    url.host = "obdavcen.si";
    url.protocol = "https:";
    return redirect(url.toString(), 301);
  }

  return null;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Brskalnik že pred nalaganjem CSS uporabi temo sistema (brez belega bliska) */}
        <meta name="color-scheme" content="light dark" />
        <script
          async
          src="https://scripts.simpleanalyticscdn.com/latest.js"
        ></script>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <main className="mx-auto max-w-xl space-y-6 px-4 py-24 text-center">
      <title>
        {notFound ? "Stran ne obstaja | obdavcen.si" : "Napaka | obdavcen.si"}
      </title>
      <Text variant="h1">
        {notFound ? "Ta stran ne obstaja" : "Prišlo je do napake"}
      </Text>
      <Text className="text-muted">
        {notFound
          ? "Povezava je morda napačna ali pa je bila stran odstranjena."
          : "Poskusi znova čez nekaj trenutkov."}
      </Text>
      <Link to="/" className="btn btn-accent">
        Nazaj na kalkulator
      </Link>
      {import.meta.env.DEV && error instanceof Error && (
        <pre className="overflow-x-auto rounded-box bg-base-200 p-4 text-left text-xs">
          {error.stack}
        </pre>
      )}
    </main>
  );
}
