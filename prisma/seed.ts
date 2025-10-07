import { PrismaClient, Role, OrderStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.category.deleteMany()
  await prisma.restaurant.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })

  const staff = await prisma.user.create({
    data: {
      name: 'Staff User',
      email: 'staff@example.com',
      password: hashedPassword,
      role: Role.STAFF,
    },
  })

  const customer = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'customer@example.com',
      password: hashedPassword,
      role: Role.CUSTOMER,
    },
  })

  console.log('Created users')

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Pizza', slug: 'pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591' },
    }),
    prisma.category.create({
      data: { name: 'Burgers', slug: 'burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd' },
    }),
    prisma.category.create({
      data: { name: 'Sushi', slug: 'sushi', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351' },
    }),
    prisma.category.create({
      data: { name: 'Pasta', slug: 'pasta', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9' },
    }),
    prisma.category.create({
      data: { name: 'Asian', slug: 'asian', image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d' },
    }),
    prisma.category.create({
      data: { name: 'Desserts', slug: 'desserts', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307' },
    }),
  ])

  console.log('Created categories')

  // Create restaurants
  const restaurant1 = await prisma.restaurant.create({
    data: {
      name: 'Pizza Palace',
      description: 'Authentic Italian pizza with fresh ingredients',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
      cuisine: 'Italian',
      location: 'Downtown',
      ownerId: staff.id,
    },
  })

  const restaurant2 = await prisma.restaurant.create({
    data: {
      name: 'Burger Haven',
      description: 'Gourmet burgers made to perfection',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add',
      cuisine: 'American',
      location: 'City Center',
      ownerId: staff.id,
    },
  })

  const restaurant3 = await prisma.restaurant.create({
    data: {
      name: 'Sushi Master',
      description: 'Fresh sushi and Japanese cuisine',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
      cuisine: 'Japanese',
      location: 'Westside',
      ownerId: admin.id,
    },
  })

  const restaurant4 = await prisma.restaurant.create({
    data: {
      name: 'Pasta Paradise',
      description: 'Homemade pasta and Italian delicacies',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9',
      cuisine: 'Italian',
      location: 'Eastside',
      ownerId: admin.id,
    },
  })

  console.log('Created restaurants')

  // Create menu items for Pizza Palace
  await Promise.all([
    prisma.menuItem.create({
      data: {
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato, mozzarella, and basil',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
        restaurantId: restaurant1.id,
        categoryId: categories[0].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Pepperoni Pizza',
        description: 'Pizza topped with pepperoni and cheese',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e',
        restaurantId: restaurant1.id,
        categoryId: categories[0].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Vegetarian Pizza',
        description: 'Fresh vegetables with mozzarella on thin crust',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49',
        restaurantId: restaurant1.id,
        categoryId: categories[0].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'BBQ Chicken Pizza',
        description: 'BBQ sauce, grilled chicken, red onions, and cilantro',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
        restaurantId: restaurant1.id,
        categoryId: categories[0].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Hawaiian Pizza',
        description: 'Ham, pineapple, and mozzarella cheese',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee',
        restaurantId: restaurant1.id,
        categoryId: categories[0].id,
      },
    }),
  ])

  // Create menu items for Burger Haven
  await Promise.all([
    prisma.menuItem.create({
      data: {
        name: 'Classic Beef Burger',
        description: 'Juicy beef patty with lettuce, tomato, and cheese',
        price: 10.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
        restaurantId: restaurant2.id,
        categoryId: categories[1].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Chicken Burger',
        description: 'Grilled chicken breast with special sauce',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086',
        restaurantId: restaurant2.id,
        categoryId: categories[1].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Veggie Burger',
        description: 'Plant-based patty with fresh vegetables',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707',
        restaurantId: restaurant2.id,
        categoryId: categories[1].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Double Bacon Burger',
        description: 'Two beef patties with crispy bacon and cheddar',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b',
        restaurantId: restaurant2.id,
        categoryId: categories[1].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Mushroom Swiss Burger',
        description: 'Beef patty with sautéed mushrooms and Swiss cheese',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5',
        restaurantId: restaurant2.id,
        categoryId: categories[1].id,
      },
    }),
  ])

  // Create menu items for Sushi Master
  await Promise.all([
    prisma.menuItem.create({
      data: {
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
        restaurantId: restaurant3.id,
        categoryId: categories[2].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Salmon Nigiri',
        description: 'Fresh salmon on rice',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56',
        restaurantId: restaurant3.id,
        categoryId: categories[2].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Tuna Roll',
        description: 'Fresh tuna with rice and nori',
        price: 10.99,
        image: 'https://images.unsplash.com/photo-1564489563601-c53cfc451e93',
        restaurantId: restaurant3.id,
        categoryId: categories[2].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Spicy Salmon Roll',
        description: 'Salmon with spicy mayo and cucumber',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252',
        restaurantId: restaurant3.id,
        categoryId: categories[2].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Dragon Roll',
        description: 'Eel, cucumber, and avocado with special sauce',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d',
        restaurantId: restaurant3.id,
        categoryId: categories[2].id,
      },
    }),
  ])

  // Create menu items for Pasta Paradise
  await Promise.all([
    prisma.menuItem.create({
      data: {
        name: 'Spaghetti Carbonara',
        description: 'Creamy pasta with bacon and parmesan',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3',
        restaurantId: restaurant4.id,
        categoryId: categories[3].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Fettuccine Alfredo',
        description: 'Rich and creamy alfredo sauce',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a',
        restaurantId: restaurant4.id,
        categoryId: categories[3].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Penne Arrabbiata',
        description: 'Spicy tomato sauce with penne pasta',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9',
        restaurantId: restaurant4.id,
        categoryId: categories[3].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Lasagna Bolognese',
        description: 'Layered pasta with meat sauce and béchamel',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3',
        restaurantId: restaurant4.id,
        categoryId: categories[3].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Seafood Linguine',
        description: 'Linguine with shrimp, mussels, and clams in white wine sauce',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8',
        restaurantId: restaurant4.id,
        categoryId: categories[3].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Ravioli al Tartufo',
        description: 'Cheese ravioli with truffle cream sauce',
        price: 17.99,
        image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb',
        restaurantId: restaurant4.id,
        categoryId: categories[3].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Spaghetti Bolognese',
        description: 'Traditional meat sauce with spaghetti',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb',
        restaurantId: restaurant4.id,
        categoryId: categories[3].id,
      },
    }),
    prisma.menuItem.create({
      data: {
        name: 'Pesto Genovese',
        description: 'Fresh basil pesto with pine nuts and parmesan',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601',
        restaurantId: restaurant4.id,
        categoryId: categories[3].id,
      },
    }),
  ])

  console.log('Created menu items')

  // Create sample orders
  const order1 = await prisma.order.create({
    data: {
      userId: customer.id,
      restaurantId: restaurant1.id,
      total: 27.98,
      status: OrderStatus.DELIVERED,
      orderItems: {
        create: [
          {
            menuItemId: (await prisma.menuItem.findFirst({ where: { name: 'Margherita Pizza' } }))!.id,
            quantity: 1,
            price: 12.99,
          },
          {
            menuItemId: (await prisma.menuItem.findFirst({ where: { name: 'Pepperoni Pizza' } }))!.id,
            quantity: 1,
            price: 14.99,
          },
        ],
      },
    },
  })

  const order2 = await prisma.order.create({
    data: {
      userId: customer.id,
      restaurantId: restaurant2.id,
      total: 20.98,
      status: OrderStatus.PREPARING,
      orderItems: {
        create: [
          {
            menuItemId: (await prisma.menuItem.findFirst({ where: { name: 'Classic Beef Burger' } }))!.id,
            quantity: 2,
            price: 10.99,
          },
        ],
      },
    },
  })

  console.log('Created sample orders')

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })