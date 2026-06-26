import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FoodCard from '../components/FoodCard'
import FilterSidebar from '../components/FilterSidebar'
import SearchBar from '../components/SearchBar'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import api from '../services/api'

export default function FoodsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    foodType: 'All',
    sortBy: '',
    order: 'asc',
  })

  const fetchFoods = useCallback(async (f) => {
    setLoading(true)
    try {
      const params = {}
      if (f.search) params.search = f.search
      if (f.category && f.category !== 'All') params.category = f.category
      if (f.foodType && f.foodType !== 'All') params.foodType = f.foodType
      if (f.sortBy) { params.sortBy = f.sortBy; params.order = f.order }

      const res = await api.get('/foods', { params })
      setFoods(res.data.data.foods)
    } catch {
      setFoods([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFoods(filters)
  }, [filters, fetchFoods])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    const params = {}
    if (newFilters.search) params.search = newFilters.search
    if (newFilters.category && newFilters.category !== 'All') params.category = newFilters.category
    setSearchParams(params)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {filters.category !== 'All' ? `${filters.category}` : 'All Foods'}
          </h1>
          <p className="text-gray-500 text-sm">{loading ? 'Loading...' : `${foods.length} items found`}</p>
        </div>

        {/* Search & Filter Toggle */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <SearchBar
              value={filters.search}
              onChange={(val) => handleFilterChange({ ...filters, search: val })}
              placeholder="Search pizza, burger, biryani..."
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`lg:hidden flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-medium transition-colors ${showFilter ? 'bg-primary-500 text-white border-primary-500' : 'bg-white border-gray-200 text-gray-600'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <div className={`${showFilter ? 'block' : 'hidden'} lg:block w-full lg:w-60 shrink-0`}>
            <FilterSidebar filters={filters} onChange={handleFilterChange} />
          </div>

          {/* Food Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="card overflow-hidden">
                    <div className="shimmer aspect-[4/3]" />
                    <div className="p-4 space-y-2">
                      <div className="shimmer h-4 rounded w-3/4" />
                      <div className="shimmer h-3 rounded w-full" />
                      <div className="shimmer h-3 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : foods.length === 0 ? (
              <EmptyState
                emoji="🍽️"
                title="No foods found"
                description="Try adjusting your search or filters to find what you're looking for."
                actionLabel="Clear Filters"
                onAction={() => handleFilterChange({ search: '', category: 'All', foodType: 'All', sortBy: '', order: 'asc' })}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {foods.map(food => <FoodCard key={food.id} food={food} />)}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
