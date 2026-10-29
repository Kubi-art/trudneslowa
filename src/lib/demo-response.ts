import { agentInstructions, type DemoIndustry, type DemoMessage } from "./demo-agent";

export async function generateDemoAnswer(input: {industry: DemoIndustry; messages: DemoMessage[]}) {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST", headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-5-mini", instructions: agentInstructions(input.industry), input: input.messages, max_output_tokens: 800, reasoning: { effort: "low" }, store: false }),
      signal: AbortSignal.timeout(30000), cache: "no-store",
    });
    if (!response.ok) throw Object.assign(new Error("Provider unavailable"), {name:"ProviderError"});
    const data = await response.json();
    const text = (data.output ?? []).filter((item: { type: string }) => item.type === "message")
      .flatMap((item: { content?: { type: string; text?: string }[] }) => item.content ?? [])
      .filter((item: { type: string }) => item.type === "output_text")
      .map((item: { text: string }) => item.text).join("\n");
    if (!text || data.status !== "completed" || text.length > 2400) throw Object.assign(new Error("Incomplete answer"), {name:"ProviderError"});

    return text as string;
}
