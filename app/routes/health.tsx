// respond with remix 200 empty page
export function loader() {
  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
    statusText: "ok",
    // status: 200,
  });
}
