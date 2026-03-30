import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { notes } = await req.json();
    if (!notes || typeof notes !== "string" || notes.trim().length < 5) {
      return new Response(JSON.stringify({ error: "Please provide product notes (at least 5 characters)." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a marketplace listing expert for HaathSe, a platform for rural artisans and handmade products.
Given raw product notes from an artisan, generate a professional marketplace listing.

Return ONLY valid JSON with these fields:
{
  "title": "Professional product title (max 80 chars)",
  "description": "Detailed marketplace description (200-400 words, highlighting craftsmanship, materials, use cases)",
  "short_summary": "SEO-friendly one-line summary (max 160 chars)",
  "tags": ["array", "of", "5-8", "relevant", "tags"],
  "materials": "Materials used",
  "care_instructions": "How to care for the product",
  "suggested_category": "One of: Textiles & Handloom, Pottery & Ceramics, Woodwork, Bamboo & Cane, Jewelry, Paintings & Art, Home Decor, Food & Spices",
  "bulk_order_suitable": true/false,
  "export_suitable": true/false
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Product notes from artisan:\n\n${notes}` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_listing",
            description: "Create a structured product listing from artisan notes",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                short_summary: { type: "string" },
                tags: { type: "array", items: { type: "string" } },
                materials: { type: "string" },
                care_instructions: { type: "string" },
                suggested_category: { type: "string" },
                bulk_order_suitable: { type: "boolean" },
                export_suitable: { type: "boolean" },
              },
              required: ["title", "description", "short_summary", "tags", "materials", "suggested_category"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "create_listing" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "AI rate limit reached. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI error:", response.status, text);
      throw new Error("AI generation failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const listing = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(listing), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-listing error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
