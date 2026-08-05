/**
 * Renders a JSON-LD structured-data <script>. Server component — the JSON is
 * serialized at render time and never hydrated on the client.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: it is our own schema data, and
      // "<" is escaped to prevent breaking out of the script tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
