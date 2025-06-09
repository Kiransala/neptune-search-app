import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { searchProviders, extractSearchIntent } from "@/lib/utils"
import type { SearchResponse } from "@/types"

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Extract search intent from the query
    const searchIntent = extractSearchIntent(query)

    // Search for relevant providers
    const providers = searchProviders({
      query,
      location: searchIntent.location,
      category: searchIntent.category,
    })

    // Generate AI summary
    let summary = ""
    try {
      // Check if Gemini API key is available
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API key not configured")
      }

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
      
      const prompt = `You are Neptune AI, an expert assistant for local service recommendations. 
Analyze the user's query and the search results to provide a helpful, concise summary.
Focus on key insights about the providers found, pricing trends, and recommendations.
Keep your response under 150 words and be conversational but professional.

User Query: "${query}"

Search Results Found: ${providers.length} providers
${
  providers.length > 0
    ? `
Top Results:
${providers
  .slice(0, 3)
  .map((p) => `- ${p.name} (Neptune Score: ${p.neptuneScore}/10, Rating: ${p.rating}/5, Price: ${p.priceRange})`)
  .join("\n")}

Location Focus: ${searchIntent.location || "Various locations"}
Service Category: ${searchIntent.category || "Multiple categories"}
`
    : "No specific providers found for this query."
}

Provide a helpful summary and recommendation for the user.`

      const result = await model.generateContent(prompt)
      const response = await result.response
      summary = response.text()
    } catch (error) {
      console.error("Gemini API error:", error)
      
      // Fallback to basic summary if AI service fails
      if (providers.length > 0) {
        const topProvider = providers[0]
        const avgScore = providers.reduce((sum, p) => sum + p.neptuneScore, 0) / providers.length
        const priceRanges = [...new Set(providers.map((p) => p.priceRange))]

        summary = `Found ${providers.length} ${searchIntent.category ? searchIntent.category.replace("-", " ") : "service"} providers${searchIntent.location ? ` in ${searchIntent.location}` : ""}. 

🏆 **Top Recommendation**: ${topProvider.name} leads with a Neptune Score of ${topProvider.neptuneScore}/10 and ${topProvider.rating}/5 stars from ${topProvider.reviewCount} reviews.

💰 **Pricing**: Options range from ${priceRanges[priceRanges.length - 1]} to ${priceRanges[0]}, with an average Neptune Score of ${avgScore.toFixed(1)}/10.

⚡ **Availability**: ${providers.filter((p) => p.availability.includes("24/7") || p.availability.includes("emergency")).length > 0 ? "Emergency services available" : providers.filter((p) => p.availability.includes("same-day") || p.availability.includes("Same-day")).length > 0 ? "Same-day service options available" : "Standard scheduling available"}.`
      } else {
        summary = `No service providers found matching "${query}". Try broadening your search terms, checking the spelling of your location, or searching for related services. For example, try "plumbers in [your city]" or "appliance repair near me".`
      }
    }

    const response: SearchResponse = {
      providers,
      summary,
      query,
      location: searchIntent.location,
      category: searchIntent.category,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
