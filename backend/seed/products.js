const products = [
  // DAIRY PRODUCTS (10 items)
  {
    name: 'Amul Taaza Toned Milk',
    description: 'Fresh toned milk - 1 Liter pack',
    price: 60,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
    category: 'Dairy',
    stock: 50,
    unit: 'l',
    discount: 5
  },
  {
    name: 'Amul Butter',
    description: 'Pasteurized butter - 500g pack',
    price: 250,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400',
    category: 'Dairy',
    stock: 40,
    unit: 'g',
    discount: 0
  },
  {
    name: 'Britannia Cheese Slices',
    description: 'Cheese slices - 200g pack',
    price: 120,
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400',
    category: 'Dairy',
    stock: 35,
    unit: 'g',
    discount: 10
  },
  {
    name: 'Mother Dairy Curd',
    description: 'Fresh curd - 400g cup',
    price: 35,
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400',
    category: 'Dairy',
    stock: 60,
    unit: 'g',
    discount: 0
  },
  {
    name: 'Amul Paneer',
    description: 'Fresh paneer - 200g pack',
    price: 90,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400',
    category: 'Dairy',
    stock: 30,
    unit: 'g',
    discount: 5
  },
  {
    name: 'Nestle Milkmaid',
    description: 'Sweetened condensed milk - 400g tin',
    price: 130,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    category: 'Dairy',
    stock: 25,
    unit: 'g',
    discount: 0
  },
  {
    name: 'Amul Fresh Cream',
    description: 'Cooking cream - 250ml pack',
    price: 55,
    image: 'https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=400',
    category: 'Dairy',
    stock: 40,
    unit: 'ml',
    discount: 0
  },
  {
    name: 'Mother Dairy Ghee',
    description: 'Pure cow ghee - 500ml jar',
    price: 350,
    image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400',
    category: 'Dairy',
    stock: 20,
    unit: 'ml',
    discount: 15
  },
  {
    name: 'Amul Buttermilk',
    description: 'Spiced buttermilk - 200ml pack',
    price: 15,
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400',
    category: 'Dairy',
    stock: 80,
    unit: 'ml',
    discount: 0
  },
  {
    name: 'Britannia Bread',
    description: 'Whole wheat bread - 400g loaf',
    price: 40,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    category: 'Bakery',
    stock: 50,
    unit: 'g',
    discount: 5
  },

  // VEGETABLES (8 items)
  {
    name: 'Fresh Tomatoes',
    description: 'Red ripe tomatoes - Farm fresh',
    price: 40,
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400',
    category: 'Vegetables',
    stock: 100,
    unit: 'kg',
    discount: 0
  },
  {
    name: 'Fresh Onions',
    description: 'Red onions - Premium quality',
    price: 35,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400',
    category: 'Vegetables',
    stock: 100,
    unit: 'kg',
    discount: 0
  },
  {
    name: 'Fresh Potatoes',
    description: 'Farm fresh potatoes',
    price: 30,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400',
    category: 'Vegetables',
    stock: 120,
    unit: 'kg',
    discount: 0
  },
  {
    name: 'Green Capsicum',
    description: 'Fresh bell peppers',
    price: 60,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400',
    category: 'Vegetables',
    stock: 50,
    unit: 'kg',
    discount: 10
  },
  {
    name: 'Fresh Carrots',
    description: 'Crunchy orange carrots',
    price: 45,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
    category: 'Vegetables',
    stock: 70,
    unit: 'kg',
    discount: 0
  },
  {
    name: 'Fresh Spinach',
    description: 'Green leafy spinach - Palak',
    price: 25,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
    category: 'Vegetables',
    stock: 40,
    unit: 'kg',
    discount: 0
  },
  {
    name: 'Cauliflower',
    description: 'Fresh white cauliflower - Gobi',
    price: 50,
    image: 'https://images.unsplash.com/photo-1568584711271-946d33925c4d?w=400',
    category: 'Vegetables',
    stock: 45,
    unit: 'piece',
    discount: 5
  },
  {
    name: 'Green Peas',
    description: 'Fresh green peas - Matar',
    price: 80,
    image: 'https://images.unsplash.com/photo-1452509133926-2b180c6d6367?w=400',
    category: 'Vegetables',
    stock: 60,
    unit: 'kg',
    discount: 0
  },

  // FRUITS (8 items)
  {
    name: 'Fresh Bananas',
    description: 'Ripe yellow bananas - Dozen',
    price: 60,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
    category: 'Fruits',
    stock: 80,
    unit: 'dozen',
    discount: 0
  },
  {
    name: 'Fresh Apples',
    description: 'Red delicious apples - Kashmiri',
    price: 180,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
    category: 'Fruits',
    stock: 60,
    unit: 'kg',
    discount: 10
  },
  {
    name: 'Fresh Oranges',
    description: 'Juicy oranges - Nagpur variety',
    price: 100,
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400',
    category: 'Fruits',
    stock: 70,
    unit: 'kg',
    discount: 5
  },
  {
    name: 'Fresh Mangoes',
    description: 'Alphonso mangoes - Premium',
    price: 250,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400',
    category: 'Fruits',
    stock: 40,
    unit: 'kg',
    discount: 0
  },
  {
    name: 'Fresh Grapes',
    description: 'Green seedless grapes',
    price: 90,
    image: 'https://images.unsplash.com/photo-1599819177043-95dd5a2c5328?w=400',
    category: 'Fruits',
    stock: 50,
    unit: 'kg',
    discount: 15
  },
  {
    name: 'Fresh Pomegranate',
    description: 'Sweet pomegranate - Anar',
    price: 150,
    image: 'https://images.unsplash.com/photo-1595431048148-522d9704fbc2?w=400',
    category: 'Fruits',
    stock: 35,
    unit: 'kg',
    discount: 0
  },
  {
    name: 'Fresh Watermelon',
    description: 'Sweet red watermelon - Tarbooz',
    price: 40,
    image: 'https://images.unsplash.com/photo-1587363882110-31e9c5c144d9?w=400',
    category: 'Fruits',
    stock: 30,
    unit: 'kg',
    discount: 5
  },
  {
    name: 'Fresh Papaya',
    description: 'Ripe yellow papaya',
    price: 50,
    image: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400',
    category: 'Fruits',
    stock: 40,
    unit: 'kg',
    discount: 0
  },

  // GRAINS & PULSES (8 items)
  {
    name: 'Tata Sampann Toor Dal',
    description: 'Premium quality toor dal - 1kg',
    price: 150,
    image: 'https://images.unsplash.com/photo-1596797882870-8c33deeznuts?w=400',
    category: 'Grains',
    stock: 50,
    unit: 'kg',
    discount: 10
  },
  {
    name: 'India Gate Basmati Rice',
    description: 'Premium basmati rice - 5kg',
    price: 550,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    category: 'Grains',
    stock: 40,
    unit: 'kg',
    discount: 5
  },
  {
    name: 'Aashirvaad Atta',
    description: 'Whole wheat flour - 5kg',
    price: 250,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    category: 'Grains',
    stock: 60,
    unit: 'kg',
    discount: 0
  },
  {
    name: 'Tata Sampann Chana Dal',
    description: 'Split chickpeas - 1kg',
    price: 120,
    image: 'https://images.unsplash.com/photo-1596797882870-8c33d81b4fd2?w=400',
    category: 'Grains',
    stock: 45,
    unit: 'kg',
    discount: 0
  },
  {
    name: 'Fortune Soya Bean Oil',
    description: 'Refined soybean oil - 1L',
    price: 140,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
    category: 'Grains',
    stock: 50,
    unit: 'l',
    discount: 15
  },
  {
    name: 'Quaker Oats',
    description: 'Rolled oats - 1kg',
    price: 180,
    image: 'https://images.unsplash.com/photo-1590757738868-97a3bee9f163?w=400',
    category: 'Grains',
    stock: 40,
    unit: 'kg',
    discount: 10
  },
  {
    name: 'Tata Sampann Moong Dal',
    description: 'Green moong dal - 1kg',
    price: 130,
    image: 'https://images.unsplash.com/photo-1596797882692-6650bb54b673?w=400',
    category: 'Grains',
    stock: 50,
    unit: 'kg',
    discount: 0
  },
  {
    name: 'Tata Salt',
    description: 'Iodized salt - 1kg',
    price: 22,
    image: 'https://images.unsplash.com/photo-1598346762291-a33ca2a6d5f8?w=400',
    category: 'Spices',
    stock: 100,
    unit: 'kg',
    discount: 0
  },

  // SNACKS (8 items)
  {
    name: 'Lays Chips',
    description: 'Classic salted potato chips - 50g',
    price: 20,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400',
    category: 'Snacks',
    stock: 100,
    unit: 'pack',
    discount: 0
  },
  {
    name: 'Parle-G Biscuits',
    description: 'Glucose biscuits - 200g pack',
    price: 25,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
    category: 'Snacks',
    stock: 120,
    unit: 'pack',
    discount: 5
  },
  {
    name: 'Britannia Good Day',
    description: 'Butter cookies - 100g pack',
    price: 30,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400',
    category: 'Snacks',
    stock: 90,
    unit: 'pack',
    discount: 0
  },
  {
    name: 'Haldirams Bhujia',
    description: 'Crispy bhujia - 200g pack',
    price: 50,
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400',
    category: 'Snacks',
    stock: 70,
    unit: 'pack',
    discount: 10
  },
  {
    name: 'Maggi Noodles',
    description: 'Masala instant noodles - 70g',
    price: 14,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400',
    category: 'Snacks',
    stock: 150,
    unit: 'pack',
    discount: 0
  },
  {
    name: 'Kurkure Masala Munch',
    description: 'Crunchy snack - 90g',
    price: 20,
    image: 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=400',
    category: 'Snacks',
    stock: 80,
    unit: 'pack',
    discount: 0
  },
  {
    name: 'Sunfeast Dark Fantasy',
    description: 'Chocolate biscuits - 75g',
    price: 35,
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400',
    category: 'Snacks',
    stock: 70,
    unit: 'pack',
    discount: 5
  },
  {
    name: 'Pringles',
    description: 'Original potato chips - 110g',
    price: 120,
    image: 'https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=400',
    category: 'Snacks',
    stock: 40,
    unit: 'pack',
    discount: 15
  },

  // BEVERAGES (8 items)
  {
    name: 'Coca Cola',
    description: 'Cold drink - 750ml bottle',
    price: 40,
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
    category: 'Beverages',
    stock: 100,
    unit: 'ml',
    discount: 0
  },
  {
    name: 'Pepsi',
    description: 'Cold drink - 750ml bottle',
    price: 40,
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400',
    category: 'Beverages',
    stock: 100,
    unit: 'ml',
    discount: 0
  },
  {
    name: 'Bisleri Water',
    description: 'Mineral water - 1L bottle',
    price: 20,
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400',
    category: 'Beverages',
    stock: 200,
    unit: 'l',
    discount: 0
  },
  {
    name: 'Red Bull',
    description: 'Energy drink - 250ml can',
    price: 125,
    image: 'https://images.unsplash.com/photo-1622543925917-763c34f6a2d0?w=400',
    category: 'Beverages',
    stock: 50,
    unit: 'ml',
    discount: 10
  },
  {
    name: 'Tropicana Orange Juice',
    description: '100% orange juice - 1L pack',
    price: 120,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    category: 'Beverages',
    stock: 60,
    unit: 'l',
    discount: 5
  },
  {
    name: 'Nescafe Coffee',
    description: 'Instant coffee - 50g jar',
    price: 180,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    category: 'Beverages',
    stock: 70,
    unit: 'g',
    discount: 0
  },
  {
    name: 'Tata Tea Gold',
    description: 'Premium tea - 250g pack',
    price: 140,
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400',
    category: 'Beverages',
    stock: 80,
    unit: 'g',
    discount: 10
  },
  {
    name: 'Real Mango Juice',
    description: 'Mango fruit juice - 1L pack',
    price: 110,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    category: 'Beverages',
    stock: 65,
    unit: 'l',
    discount: 0
  }
];

module.exports = products;