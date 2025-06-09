import type { ServiceProvider } from "@/types"
import { StarIcon, PhoneIcon, MapPinIcon, ClockIcon, TrophyIcon } from "@heroicons/react/24/solid"
import { StarIcon as StarOutlineIcon, GlobeAltIcon } from "@heroicons/react/24/outline"

interface ServiceCardProps {
  provider: ServiceProvider
  index: number
}

export default function ServiceCard({ provider, index }: ServiceCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating)
      const halfFilled = i === Math.floor(rating) && rating % 1 >= 0.5

      return (
        <div key={i} className="relative">
          <StarOutlineIcon className="h-4 w-4 text-slate-300" />
          {(filled || halfFilled) && (
            <StarIcon className={`h-4 w-4 text-yellow-400 absolute inset-0 ${halfFilled ? "clip-path-half" : ""}`} />
          )}
        </div>
      )
    })
  }

  const getNeptuneScoreColor = (score: number) => {
    if (score >= 8.5) return "from-emerald-500 to-green-600"
    if (score >= 7.0) return "from-blue-500 to-teal-600"
    if (score >= 5.5) return "from-yellow-500 to-orange-600"
    return "from-red-500 to-pink-600"
  }

  const getNeptuneScoreLabel = (score: number) => {
    if (score >= 8.5) return "Excellent"
    if (score >= 7.0) return "Great"
    if (score >= 5.5) return "Good"
    return "Fair"
  }

  return (
    <div
      className="group relative bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl hover:bg-white/80 hover:border-teal-200/50 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500 overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Top Badge */}
      {index === 0 && (
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
            <TrophyIcon className="w-3 h-3" />
            <span>Top Pick</span>
          </div>
        </div>
      )}

      {/* Neptune Score Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div
          className={`px-2 py-2 rounded-2xl bg-gradient-to-r ${getNeptuneScoreColor(provider.neptuneScore)} text-white shadow-lg`}
        >
          <div className="text-center">
            <div className="text-sm font-bold">{provider.neptuneScore.toFixed(1)}</div>
            <div className="text-xs opacity-90">Neptune</div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 pt-16">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 group-hover:text-teal-700 transition-colors">
            {provider.name}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">{provider.description}</p>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center space-x-1">{renderStars(provider.rating)}</div>
          <span className="text-sm font-semibold text-slate-700">{provider.rating.toFixed(1)}</span>
          <span className="text-sm text-slate-500">({provider.reviewCount} reviews)</span>
        </div>

        {/* Neptune Score Label */}
        <div className="mb-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100/80 backdrop-blur-sm text-sm border border-slate-200/50">
            <span className="font-medium text-slate-700">Score: </span>
            <span
              className={`ml-1 font-bold bg-gradient-to-r ${getNeptuneScoreColor(provider.neptuneScore)} bg-clip-text text-transparent`}
            >
              {getNeptuneScoreLabel(provider.neptuneScore)}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-slate-600">
            <MapPinIcon className="h-4 w-4 mr-3 text-slate-400" />
            <span>{provider.location}</span>
          </div>

          <div className="flex items-center text-sm text-slate-600">
            <ClockIcon className="h-4 w-4 mr-3 text-slate-400" />
            <span>{provider.availability}</span>
          </div>

          <div className="flex items-center text-sm">
            <span className="font-medium text-slate-700 mr-2">Price:</span>
            <span className="text-teal-600 font-bold">{provider.priceRange}</span>
          </div>
        </div>

        {/* Services */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {provider.services.slice(0, 3).map((service, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-teal-50/80 text-teal-700 text-xs rounded-full border border-teal-200/50 backdrop-blur-sm"
              >
                {service}
              </span>
            ))}
            {provider.services.length > 3 && (
              <span className="px-3 py-1 bg-slate-50/80 text-slate-600 text-xs rounded-full border border-slate-200/50 backdrop-blur-sm">
                +{provider.services.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <a
            href={`tel:${provider.phone}`}
            className="flex-1 bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 px-4 rounded-2xl font-semibold text-center hover:from-teal-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40"
          >
            <PhoneIcon className="h-4 w-4" />
            <span>Call Now</span>
          </a>

          {provider.website && (
            <a
              href={provider.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-white/80 backdrop-blur-sm border border-slate-200/50 text-slate-700 py-3 px-4 rounded-2xl font-semibold text-center hover:bg-white hover:border-slate-300 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <GlobeAltIcon className="h-4 w-4" />
              <span>Website</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
