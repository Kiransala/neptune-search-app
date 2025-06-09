"use client"

import type React from "react"
import { useState } from "react"
import { MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline"
import LoadingSpinner from "./LoadingSpinner"

interface SearchFormProps {
  onSearch: (query: string) => void
  loading: boolean
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && !loading) {
      onSearch(query.trim())
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          {/* Background with glassmorphism effect */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl shadow-teal-500/10 group-focus-within:shadow-teal-500/20 group-focus-within:border-teal-200/50 transition-all duration-300"></div>

          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
            <MagnifyingGlassIcon className="h-6 w-6 text-slate-400 group-focus-within:text-teal-500 transition-colors duration-200" />
          </div>

          {/* Input Field */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything... e.g., 'Find the best plumbers in Austin under $100'"
            className="relative w-full pl-14 pr-40 py-6 text-lg bg-transparent border-0 rounded-3xl focus:ring-0 focus:outline-none placeholder-slate-400 text-slate-900 z-10"
            disabled={loading}
          />

          {/* Search Button */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-10">
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="px-8 py-3 bg-gradient-to-r from-teal-500 via-blue-500 to-cyan-500 text-white font-semibold rounded-2xl hover:from-teal-600 hover:via-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Indicator */}
        <div className="flex items-center justify-center mt-4 space-x-2 text-sm text-slate-500">
          <SparklesIcon className="w-4 h-4 text-teal-500" />
          <span>Powered by Neptune AI</span>
        </div>
      </form>
    </div>
  )
}
