const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const foods = [
  // Pizza
  {
    name: 'Margherita Classic',
    description: 'Fresh tomato sauce, mozzarella cheese, and basil on a crispy thin crust. A timeless Italian classic that never disappoints.',
    price: 299,
    category: 'Pizza',
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80',
    rating: 4.5,
    preparationTime: 25,
    foodType: 'VEG',
    isAvailable: true,
  },
  {
    name: 'BBQ Chicken Feast',
    description: 'Smoky BBQ sauce, grilled chicken, caramelized onions, and a three-cheese blend on a golden crust.',
    price: 449,
    category: 'Pizza',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80',
    rating: 4.7,
    preparationTime: 30,
    foodType: 'NON_VEG',
    isAvailable: true,
  },
  {
    name: 'Garden Veggie Supreme',
    description: 'Bell peppers, mushrooms, olives, cherry tomatoes, corn, and jalapeños with herbed tomato sauce.',
    price: 349,
    category: 'Pizza',
    imageUrl: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&q=80',
    rating: 4.3,
    preparationTime: 25,
    foodType: 'VEG',
    isAvailable: true,
  },
  // Burger
  {
    name: 'Classic Beef Smash',
    description: 'Double smash patty, aged cheddar, crispy lettuce, tomato, pickles, and our secret house sauce in a brioche bun.',
    price: 249,
    category: 'Burger',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80',
    rating: 4.6,
    preparationTime: 15,
    foodType: 'NON_VEG',
    isAvailable: true,
  },
  {
    name: 'Crispy Chicken Tower',
    description: 'Buttermilk fried chicken thigh, coleslaw, pickled jalapeños, sriracha mayo stacked high in a sesame bun.',
    price: 229,
    category: 'Burger',
    imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&q=80',
    rating: 4.5,
    preparationTime: 18,
    foodType: 'NON_VEG',
    isAvailable: true,
  },
  {
    name: 'Mushroom Veggie Delight',
    description: 'Grilled portobello mushroom, avocado spread, caramelized onions, Swiss cheese, and rocket on a whole wheat bun.',
    price: 199,
    category: 'Burger',
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80',
    rating: 4.2,
    preparationTime: 15,
    foodType: 'VEG',
    isAvailable: true,
  },
  // Biryani
  {
    name: 'Hyderabadi Dum Biryani',
    description: 'Slow-cooked basmati rice layered with tender mutton, saffron, fried onions, and aromatic whole spices.',
    price: 379,
    category: 'Biryani',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80',
    rating: 4.8,
    preparationTime: 45,
    foodType: 'NON_VEG',
    isAvailable: true,
  },
  {
    name: 'Chicken Dum Biryani',
    description: 'Fragrant basmati rice with marinated chicken, caramelized onions, fresh mint, and a blend of whole spices.',
    price: 299,
    category: 'Biryani',
    imageUrl: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&q=80',
    rating: 4.7,
    preparationTime: 40,
    foodType: 'NON_VEG',
    isAvailable: true,
  },
  {
    name: 'Paneer Biryani',
    description: 'Aromatic basmati rice with chunks of soft paneer, vegetables, saffron milk, and warm spices. A vegetarian delight.',
    price: 279,
    category: 'Biryani',
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80',
    rating: 4.4,
    preparationTime: 35,
    foodType: 'VEG',
    isAvailable: true,
  },
  // Chinese
  {
    name: 'Hakka Noodles',
    description: 'Stir-fried noodles with crunchy vegetables, soy sauce, and chili oil tossed in a screaming hot wok.',
    price: 179,
    category: 'Chinese',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80',
    rating: 4.3,
    preparationTime: 20,
    foodType: 'VEG',
    isAvailable: true,
  },
  {
    name: 'Manchurian Gravy',
    description: 'Crispy vegetable balls in a tangy, spicy, and slightly sweet Manchurian sauce with spring onions.',
    price: 199,
    category: 'Chinese',
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500&q=80',
    rating: 4.5,
    preparationTime: 22,
    foodType: 'VEG',
    isAvailable: true,
  },
  {
    name: 'Chicken Fried Rice',
    description: 'Wok-tossed rice with egg, chicken strips, vegetables, and soy sauce with a hint of sesame oil.',
    price: 229,
    category: 'Chinese',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80',
    rating: 4.4,
    preparationTime: 20,
    foodType: 'NON_VEG',
    isAvailable: true,
  },
  // South Indian
  {
    name: 'Masala Dosa',
    description: 'Crispy golden dosa with spiced potato filling, served with coconut chutney, tomato chutney, and sambar.',
    price: 149,
    category: 'South Indian',
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&q=80',
    rating: 4.6,
    preparationTime: 15,
    foodType: 'VEG',
    isAvailable: true,
  },
  {
    name: 'Medu Vada Platter',
    description: 'Crispy lentil donuts with coconut chutney and sambar. A South Indian breakfast staple and evening snack.',
    price: 99,
    category: 'South Indian',
    imageUrl: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&q=80',
    rating: 4.3,
    preparationTime: 12,
    foodType: 'VEG',
    isAvailable: true,
  },
  {
    name: 'Filter Coffee',
    description: 'Authentic South Indian decoction coffee served in a traditional brass tumbler and dabara. Rich and aromatic.',
    price: 59,
    category: 'South Indian',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80',
    rating: 4.7,
    preparationTime: 5,
    foodType: 'VEG',
    isAvailable: true,
  },
  // Desserts
  {
    name: 'Gulab Jamun (6 pcs)',
    description: 'Soft milk-solid dumplings soaked in rose-flavored sugar syrup. Served warm with a scoop of vanilla ice cream.',
    price: 129,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1666540823665-a67dc3e0c88d?w=500&q=80',
    rating: 4.8,
    preparationTime: 10,
    foodType: 'VEG',
    isAvailable: true,
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, dusted with powdered sugar and served with vanilla bean ice cream.',
    price: 199,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80',
    rating: 4.9,
    preparationTime: 15,
    foodType: 'VEG',
    isAvailable: true,
  },
  {
    name: 'Mango Kulfi',
    description: 'Traditional Indian frozen dessert made with condensed milk, real Alphonso mango pulp, and cardamom.',
    price: 89,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80',
    rating: 4.6,
    preparationTime: 5,
    foodType: 'VEG',
    isAvailable: true,
  },
  // Beverages
  {
    name: 'Mango Lassi',
    description: 'Thick and creamy yogurt blended with Alphonso mango pulp, a pinch of cardamom, and a touch of honey.',
    price: 99,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1534353473418-4cfa0c32ee38?w=500&q=80',
    rating: 4.7,
    preparationTime: 5,
    foodType: 'VEG',
    isAvailable: true,
  },
  {
    name: 'Cold Brew Lemonade',
    description: 'Fresh squeezed lemon juice, mint leaves, and a hint of ginger served over crushed ice. Refreshing and zingy.',
    price: 79,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500&q=80',
    rating: 4.4,
    preparationTime: 3,
    foodType: 'VEG',
    isAvailable: true,
  },
]

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin@123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@foodkart.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@foodkart.com',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '9999999999',
      address: '123 Admin Street, Food City',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create test user
  const userPassword = await bcrypt.hash('User@123', 10)
  const testUser = await prisma.user.upsert({
    where: { email: 'user@foodkart.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'user@foodkart.com',
      password: userPassword,
      role: 'USER',
      phone: '8888888888',
      address: '456 User Lane, Food Town',
    },
  })
  console.log('✅ Test user created:', testUser.email)

  // Create food items
  for (const food of foods) {
    await prisma.food.create({ data: food })
  }
  console.log(`✅ ${foods.length} food items seeded`)

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
