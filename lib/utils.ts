import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { ServiceProvider, SearchQuery } from "@/types"
import { mockServiceProviders } from "./mockData"

/**
 * Calculate Neptune Score based on multiple factors
 *
 * Scoring Algorithm:
 * - Customer Rating (30% weight): Normalized rating score
 * - Review Count (20% weight): Logarithmic scale for review volume
 * - Availability/Response Time (25% weight): Based on service availability
 * - Price Competitiveness (15% weight): Inverse relationship with price
 * - Service Specialization Match (10% weight): Relevance to query
 */
export function calculateNeptuneScore(provider: ServiceProvider, query?: string, category?: string): number {
  // Customer Rating Score (30% weight) - Scale 0-10
  const ratingScore = (provider.rating / 5) * 10 * 0.3

  // Review Count Score (20% weight) - Logarithmic scale
  const reviewScore = Math.min(Math.log10(provider.reviewCount + 1) * 2.5, 10) * 0.2

  // Availability Score (25% weight)
  let availabilityScore = 5 // Base score
  if (provider.availability.includes("24/7") || provider.availability.includes("emergency")) {
    availabilityScore = 10
  } else if (provider.availability.includes("same-day") || provider.availability.includes("Same-day")) {
    availabilityScore = 8.5
  } else if (provider.availability.includes("next-day") || provider.availability.includes("Next-day")) {
    availabilityScore = 7
  }
  availabilityScore *= 0.25

  // Price Competitiveness Score (15% weight)
  const priceRange = provider.priceRange.toLowerCase()
  let priceScore = 5 // Base score
  if (priceRange.includes("$40-") || priceRange.includes("$45-") || priceRange.includes("$50-")) {
    priceScore = 9
  } else if (priceRange.includes("$60-") || priceRange.includes("$65-")) {
    priceScore = 8
  } else if (priceRange.includes("$75-") || priceRange.includes("$80-")) {
    priceScore = 7
  } else if (priceRange.includes("$90-") || priceRange.includes("$95-")) {
    priceScore = 6
  }
  priceScore *= 0.15

  // Service Specialization Match (10% weight)
  let specializationScore = 5 // Base score
  if (query && category) {
    const queryLower = query.toLowerCase()
    const hasSpecialtyMatch = provider.specialties.some((specialty) => queryLower.includes(specialty.toLowerCase()))
    const hasServiceMatch = provider.services.some((service) => queryLower.includes(service.toLowerCase()))

    if (hasSpecialtyMatch) specializationScore = 9
    else if (hasServiceMatch) specializationScore = 7
  }
  specializationScore *= 0.1

  const totalScore = ratingScore + reviewScore + availabilityScore + priceScore + specializationScore
  return Math.round(totalScore * 10) / 10 // Round to 1 decimal place
}

export function searchProviders(searchQuery: SearchQuery): ServiceProvider[] {
  const { query, location, category } = searchQuery
  const queryLower = query.toLowerCase()

  // Filter providers based on location and category
  let filteredProviders = mockServiceProviders.filter((provider) => {
    // Location matching
    const locationMatch =
      !location ||
      provider.location.toLowerCase().includes(location.toLowerCase()) ||
      queryLower.includes(provider.location.toLowerCase().split(",")[0])

    // Category matching
    const categoryMatch =
      !category ||
      provider.category === category ||
      provider.services.some((service) => queryLower.includes(service.toLowerCase())) ||
      queryLower.includes(provider.category.replace("-", " "))

    return locationMatch && categoryMatch
  })

  // If no specific matches, try broader matching
  if (filteredProviders.length === 0) {
    filteredProviders = mockServiceProviders.filter((provider) => {
      const cityMatch = provider.location.toLowerCase().split(",")[0]
      return (
        queryLower.includes(cityMatch) ||
        provider.services.some((service) => queryLower.includes(service.toLowerCase().split(" ")[0]))
      )
    })
  }

  // Recalculate Neptune scores based on query relevance
  const providersWithScores = filteredProviders.map((provider) => ({
    ...provider,
    neptuneScore: calculateNeptuneScore(provider, query, category),
  }))

  // Sort by Neptune Score (highest first)
  return providersWithScores.sort((a, b) => b.neptuneScore - a.neptuneScore)
}

export function extractSearchIntent(query: string) {
  const queryLower = query.toLowerCase()

  // Extract location
  const locationPatterns = [
    /in\s+([^,]+(?:,\s*[A-Z]{2})?)/i,
    /near\s+([^,]+)/i,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z]{2})/,
    /(San Francisco|Austin|Chicago|Miami|Denver|Seattle|New York|Los Angeles)/i,
  ]

  let location = ""
  for (const pattern of locationPatterns) {
    const match = query.match(pattern)
    if (match) {
      location = match[1].trim()
      break
    }
  }

  // Extract category
  const categoryMap: Record<string, string> = {
    plumber: "plumber",
    plumbing: "plumber",
    dishwasher: "appliance-repair",
    appliance: "appliance-repair",
    electrician: "electrician",
    electrical: "electrician",
    vet: "veterinarian",
    veterinarian: "veterinarian",
    hvac: "hvac",
    heating: "hvac",
    cooling: "hvac",
    grooming: "pet-grooming",
    groomer: "pet-grooming",
  }

  let category = ""
  for (const [keyword, cat] of Object.entries(categoryMap)) {
    if (queryLower.includes(keyword)) {
      category = cat
      break
    }
  }

  // Extract price preference
  const priceMatch = query.match(/under\s*\$?(\d+)/i)
  const maxPrice = priceMatch ? Number.parseInt(priceMatch[1]) : undefined

  return {
    location,
    category,
    maxPrice,
    originalQuery: query,
  }
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
