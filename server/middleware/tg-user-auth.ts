export default defineEventHandler((event) => {
  console.dir(event.headers.get("TG"));
});
