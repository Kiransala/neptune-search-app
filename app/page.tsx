"use client"

import { useState } from "react"
import SearchForm from "@/components/SearchForm"
import SearchResults from "@/components/SearchResults"
import type { SearchResponse } from "@/types"
import { SparklesIcon, ChartBarIcon } from "@heroicons/react/24/outline"

export default function HomePage() {
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (query: string) => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Search failed with status ${response.status}`)
      }

      const data: SearchResponse = await response.json()
      setResults(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(`Search failed: ${errorMessage}. Please try again.`)
      console.error("Search error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/50">
      {/* Modern Header */}
      <header className="relative">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-white/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 via-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Neptune
                </h1>
                <p className="text-sm text-slate-500 font-medium">AI-Powered Local Services</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-6 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <SparklesIcon className="w-4 h-4 text-teal-500" />
                <span>Smart Matching</span>
              </div>
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="w-4 h-4 text-blue-500" />
                <span>Neptune Score</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hero Section */}
        {!results && (
          <div className="text-center py-16 lg:py-24">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <h2 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-6 leading-tight">
                  Find Local Services
                  <br />
                  <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    with AI Precision
                  </span>
                </h2>
                <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                  Ask in natural language and get intelligent recommendations powered by our Neptune Score algorithm.
                  Find the perfect service provider for your needs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search Form */}
        <div className="mb-12">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Search Results */}
        {results && <SearchResults results={results} loading={loading} />}

        {/* Example Queries */}
        {!results && !loading && (
          <div className="pb-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Try these example searches</h3>
              <p className="text-slate-600">Click any example to see Neptune in action</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  query: "Best-rated dishwasher repair technicians in San Francisco, CA",
                  category: "Appliance Repair",
                  icon: "🔧",
                },
                {
                  query: "Find reliable plumbers in Austin, Texas under $100",
                  category: "Plumbing",
                  icon: "🚰",
                },
                {
                  query: "Veterinarians near downtown Chicago with emergency services",
                  category: "Veterinary",
                  icon: "🐕",
                },
                {
                  query: "Electricians in Miami with same-day availability",
                  category: "Electrical",
                  icon: "⚡",
                },
                {
                  query: "HVAC repair services in Denver with 24/7 support",
                  category: "HVAC",
                  icon: "❄️",
                },
                {
                  query: "Pet groomers in Seattle with organic products",
                  category: "Pet Care",
                  icon: "✂️",
                },
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(example.query)}
                  className="group p-6 bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/80 hover:border-teal-200/50 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 text-left"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">{example.icon}</div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-2">
                        {example.category}
                      </div>
                      <p className="text-slate-700 font-medium leading-relaxed group-hover:text-slate-900 transition-colors">
                        "{example.query}"
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="relative py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-white font-semibold text-lg">Neptune Search</span>
            </div>
            <p className="text-slate-400 mb-4">AI-Powered Local Service Discovery</p>
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
              <span>© 2024 Neptune</span>
              <span>•</span>
              <span>Powered by AI</span>
              <span>•</span>
              <span>Made with ❤️</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
