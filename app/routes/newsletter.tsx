import { ActionFunctionArgs } from "@remix-run/node";
import { addEmailToMailerLiteGroup } from "~/utils/mailerlite.server";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const email = body.get("email") as string;
  if (!email && typeof email !== "string") {
    return { error: "Polje za email mora biti izpolnjeno" };
  }

  // is valid email
  if (!email.match(/^\S+@\S+$/)) {
    return { error: "Email ni veljaven" };
  }

  try {
    await addEmailToMailerLiteGroup(email);
  } catch (error) {
    console.error(error);
    return { error: "Prijava ni uspela" };
  }

  return { success: true };
}
