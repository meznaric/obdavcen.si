import { Button } from "./Button/Button";
import { Input } from "./Input/Input";
import { useFetcher } from "@remix-run/react";
import { ArrowRight01Icon, CheckmarkCircle01Icon } from "hugeicons-react";

export default function NewsletterForm() {
  const fetcher = useFetcher<{ success?: boolean; error?: string }>();
  const hasSucceeded = fetcher.data?.success;

  return (
    <fetcher.Form method="post" action="/newsletter">
      <Input
        name="email"
        label="Email"
        placeholder="vpis@email.si"
        className="w-full"
        type="email"
        required
        error={fetcher.data?.error}
      />
      <Button
        disabled={fetcher.state === "submitting" || hasSucceeded}
        variant="accent"
        className="mt-4"
      >
        {hasSucceeded ? "Prijavljen" : "Prijavi se"}
        {hasSucceeded ? (
          <CheckmarkCircle01Icon className="size-6 text-success" />
        ) : (
          <ArrowRight01Icon className="size-6" />
        )}
      </Button>
    </fetcher.Form>
  );
}
