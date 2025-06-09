import type { SearchResponse } from "@/types"
import ServiceCard from "./ServiceCard"
import { SparklesIcon, ChartBarIcon } from "@heroicons/react/24/outline"

interface SearchResultsProps {
  results: SearchResponse
  loading: boolean
}

export default function SearchResults({ results, loading }: SearchResultsProps) {
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-500 mx-auto"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500/20 to-blue-500/20 blur-xl"></div>
        </div>
        <p className="mt-6 text-slate-600 font-medium">Analyzing your request with Neptune AI...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* AI Summary */}
      {results.summary && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-50/80 via-blue-50/80 to-cyan-50/80 backdrop-blur-sm rounded-3xl border border-white/20"></div>
          <div className="relative p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Neptune AI Analysis</h3>
                <p className="text-sm text-slate-600">Intelligent insights for your search</p>
              </div>
            </div>
            <div className="text-slate-700 leading-relaxed prose prose-lg max-w-none">
              {results.summary.split("\n").map((line, index) => {
                if (line.trim() === "") return <br key={index} />

                if (line.includes("**")) {
                  const parts = line.split("**")
                  return (
                    <p key={index} className="mb-3">
                      {parts.map((part, i) =>
                        i % 2 === 1 ? (
                          <strong key={i} className="text-slate-900">
                            {part}
                          </strong>
                        ) : (
                          part
                        ),
                      )}
                    </p>
                  )
                }

                return (
                  <p key={index} className="mb-3">
                    {line}
                  </p>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Search Results</h2>
          <div className="flex items-center space-x-4 text-sm text-slate-600">
            <span>{results.providers.length} providers found</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <ChartBarIcon className="w-4 h-4 text-teal-500" />
              <span>Sorted by Neptune Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service Provider Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {results.providers.map((provider, index) => (
          <ServiceCard key={provider.id} provider={provider} index={index} />
        ))}
      </div>

      {/* No Results */}
      {results.providers.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No results found</h3>
          <p className="text-slate-600 max-w-md mx-auto">
            Try adjusting your search terms or location. We're constantly adding new service providers to our network.
          </p>
        </div>
      )}
    </div>
  )
}
