export interface ServiceProvider {
  id: string
  name: string
  category: string
  location: string
  rating: number
  reviewCount: number
  priceRange: string
  phone: string
  website?: string
  services: string[]
  availability: string
  neptuneScore: number
  description: string
  specialties: string[]
}

export interface SearchResponse {
  providers: ServiceProvider[]
  summary: string
  query: string
  location?: string
  category?: string
}

export interface SearchQuery {
  query: string
  location?: string
  category?: string
  priceRange?: string
  rating?: number
}
