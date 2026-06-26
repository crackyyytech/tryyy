import { useState } from 'react'
import { Upload, Link as LinkIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

const CATEGORIES = ['Pizza', 'Burger', 'Biryani', 'Chinese', 'South Indian', 'Desserts', 'Beverages']

export default function FoodForm({ initialData = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    price: initialData.price || '',
    category: initialData.category || 'Pizza',
    imageUrl: initialData.imageUrl || '',
    rating: initialData.rating || 4.0,
    isAvailable: initialData.isAvailable !== undefined ? initialData.isAvailable : true,
    preparationTime: initialData.preparationTime || 30,
    foodType: initialData.foodType || 'VEG',
  })
  const [uploading, setUploading] = useState(false)
  const [imageMode, setImageMode] = useState('url') // 'url' or 'upload'
  const [previewUrl, setPreviewUrl] = useState(initialData.imageUrl || '')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newVal = type === 'checkbox' ? checked : value
    setForm(prev => ({ ...prev, [name]: newVal }))
    if (name === 'imageUrl') setPreviewUrl(value)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    setUploading(true)
    try {
      const reader = new FileReader()
      reader.onload = async (ev) => {
        const base64 = ev.target.result
        const res = await api.post('/admin/upload', {
          imageData: base64,
          fileName: file.name,
          contentType: file.type,
        })
        const url = res.data.data.url
        setForm(prev => ({ ...prev, imageUrl: url }))
        setPreviewUrl(url)
        toast.success('Image uploaded!')
      }
      reader.readAsDataURL(file)
    } catch (err) {
      toast.error('Upload failed. Use an image URL instead.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.description || !form.price || !form.category || !form.imageUrl) {
      toast.error('Please fill all required fields')
      return
    }
    if (isNaN(form.price) || parseFloat(form.price) <= 0) {
      toast.error('Enter a valid price')
      return
    }
    onSubmit({ ...form, price: parseFloat(form.price), rating: parseFloat(form.rating), preparationTime: parseInt(form.preparationTime) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Food Name *</label>
          <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="e.g., Margherita Classic" required />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Describe the food item..." required />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹) *</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} className="input-field" placeholder="299" min="0" step="1" required />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-field">
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Food Type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Food Type *</label>
          <div className="flex gap-3">
            {['VEG', 'NON_VEG'].map(type => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="foodType" value={type} checked={form.foodType === type} onChange={handleChange} className="text-primary-500" />
                <span className={`text-sm font-medium ${type === 'VEG' ? 'text-green-600' : 'text-red-600'}`}>
                  {type === 'VEG' ? '🌿 Veg' : '🍗 Non-Veg'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Preparation Time */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Prep Time (mins)</label>
          <input type="number" name="preparationTime" value={form.preparationTime} onChange={handleChange} className="input-field" min="5" max="120" />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (1-5)</label>
          <input type="number" name="rating" value={form.rating} onChange={handleChange} className="input-field" min="1" max="5" step="0.1" />
        </div>

        {/* Available */}
        <div className="flex items-center gap-3">
          <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} id="isAvailable" className="w-4 h-4 text-primary-500 rounded" />
          <label htmlFor="isAvailable" className="text-sm font-semibold text-gray-700 cursor-pointer">Available for Order</label>
        </div>
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Food Image *</label>
        <div className="flex gap-2 mb-3">
          {['url', 'upload'].map(mode => (
            <button type="button" key={mode} onClick={() => setImageMode(mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${imageMode === mode ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {mode === 'url' ? <LinkIcon className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
              {mode === 'url' ? 'Image URL' : 'Upload File'}
            </button>
          ))}
        </div>
        {imageMode === 'url' ? (
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="input-field" placeholder="https://images.unsplash.com/photo-..." />
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="imageUpload" />
            <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500">{uploading ? 'Uploading...' : 'Click to upload image (max 5MB)'}</span>
            </label>
          </div>
        )}
        {previewUrl && (
          <div className="mt-3">
            <img src={previewUrl} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-gray-200" onError={() => setPreviewUrl('')} />
          </div>
        )}
      </div>

      <button type="submit" disabled={loading || uploading} className="btn-primary w-full py-3 text-base">
        {loading ? 'Saving...' : 'Save Food Item'}
      </button>
    </form>
  )
}
