export async function addEmailToMailerLiteGroup(email: string) {
  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;
  if (!apiKey || !groupId) {
    throw new Error("MAILERLITE_API_KEY and MAILERLITE_GROUP_ID must be set");
  }

  try {
    const response = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
          groups: [groupId],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error: ${response.status} - ${errorData.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    console.log("Subscriber added:", data);
    return data;
  } catch (error) {
    console.error("Error adding subscriber:", error);
    throw error;
  }
}
