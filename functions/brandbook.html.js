export async function onRequest() {
  return new Response("Not Found", {
    status: 404,
    statusText: "Not Found",
  });
}
