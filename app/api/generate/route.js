export async function POST(request) {
  try {
    const { prompt, system } = await request.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
        system: system,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return Response.json({ error: "API call failed: " + error }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    return Response.json({ text });
  } catch (error) {
    return Response.json({ error: "Server error: " + error.message }, { status: 500 });
  }
}
