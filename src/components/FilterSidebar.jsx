import { SlidersHorizontal, ChevronDown } from 'lucide-react'

const CATEGORIES = ['All', 'Pizza', 'Burger', 'Biryani', 'Chinese', 'South Indian', 'Desserts', 'Beverages']
const FOOD_TYPES = ['All', 'VEG', 'NON_VEG']
const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Rating: High to Low' },
  { value: 'preparationTime_asc', label: 'Fastest First' },
]

export default function FilterSidebar({ filters, onChange }) {
  const { category, foodType, sortBy } = filters

  const handleSortChange = (val) => {
    if (!val) {
      onChange({ ...filters, sortBy: '', order: 'asc' })
    } else {
      const [field, ord] = val.split('_')
      onChange({ ...filters, sortBy: field, order: ord })
    }
  }

  const currentSort = sortBy ? `${sortBy}_${filters.order || 'asc'}` : ''

  return (
    <aside className="card p-5 space-y-6 sticky top-24">
      <div className="flex items-center gap-2 font-semibold text-gray-900">
        <SlidersHorizontal className="w-5 h-5 text-primary-500" />
        Filters
      </div>

      {/* Category */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Category</p>
        <div className="space-y-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => onChange({ ...filters, category: cat })}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                category === cat
                  ? 'bg-primary-50 text-primary-600 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat === 'NON_VEG' ? 'Non-Veg' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food Type */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Food Type</p>
        <div className="flex gap-2">
          {FOOD_TYPES.map(type => (
            <button
              key={type}
              onClick={() => onChange({ ...filters, foodType: type })}
              className={`flex-1 text-xs font-semibold py-2 px-2 rounded-lg border transition-all ${
                foodType === type
                  ? type === 'VEG' ? 'bg-green-500 text-white border-green-500'
                    : type === 'NON_VEG' ? 'bg-red-500 text-white border-red-500'
                    : 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {type === 'NON_VEG' ? 'Non-Veg' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Sort By</p>
        <div className="relative">
          <select
            value={currentSort}
            onChange={e => handleSortChange(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 pr-8"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => onChange({ category: 'All', foodType: 'All', sortBy: '', order: 'asc', search: '' })}
        className="w-full py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-xl transition-colors border border-primary-200"
      >
        Reset Filters
      </button>
    </aside>
  )
}
