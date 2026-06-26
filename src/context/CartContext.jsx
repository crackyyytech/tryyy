import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('foodkart_cart')
      if (saved) setCartItems(JSON.parse(saved))
    } catch {
      setCartItems([])
    }
  }, [])

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('foodkart_cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (food, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === food.id)
      if (existing) {
        toast.success(`${food.name} quantity updated!`)
        return prev.map(item =>
          item.id === food.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      toast.success(`${food.name} added to cart!`)
      return [...prev, { ...food, quantity }]
    })
  }

  const removeFromCart = (foodId) => {
    setCartItems(prev => prev.filter(item => item.id !== foodId))
    toast.success('Item removed from cart')
  }

  const updateQuantity = (foodId, quantity) => {
    if (quantity < 1) {
      removeFromCart(foodId)
      return
    }
    setCartItems(prev =>
      prev.map(item => item.id === foodId ? { ...item, quantity } : item)
    )
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('foodkart_cart')
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = subtotal > 0 ? (subtotal > 500 ? 0 : 40) : 0
  const tax = Math.round(subtotal * 0.05 * 100) / 100
  const totalAmount = Math.round((subtotal + deliveryFee + tax) * 100) / 100

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}
