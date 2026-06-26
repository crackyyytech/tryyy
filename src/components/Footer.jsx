import { Link } from 'react-router-dom'
import { ChefHat, MapPin, Phone, Mail, Instagram, Twitter, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-red-500 rounded-xl flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FoodKart</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Discover and order the best food from top restaurants near you. Fresh, fast, and delicious every time.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <button key={i} className="w-9 h-9 bg-gray-800 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/foods', 'Browse Menu'], ['/login', 'Login'], ['/register', 'Sign Up']].map(([href, label]) => (
                <li key={href}>
                  <Link to={href} className="hover:text-primary-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Categories</h3>
            <ul className="space-y-2 text-sm">
              {['Pizza', 'Burger', 'Biryani', 'Chinese', 'South Indian', 'Desserts', 'Beverages'].map(cat => (
                <li key={cat}>
                  <Link to={`/foods?category=${cat}`} className="hover:text-primary-400 transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-400 shrink-0" />
                <span>123 Food Street, Gourmet City, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                <span>+91 99999 99999</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                <span>support@foodkart.com</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 mt-10 mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} FoodKart. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
