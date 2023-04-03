// import bcrypt from 'bcryptjs';

const data = {
  sliders: [
    {
      _id: '1',
      name: 'Susvimo Injection',
      category: 'Injection',
      image:
        'https://www.empr.com/wp-content/uploads/sites/7/2021/10/Susvimo-Genentech-860x573.jpg',
      subCategory: [
        {
          name: 'Nike Slim shirt',
          slug: 'nike-slim-shirt',

          image:
            'https://www.empr.com/wp-content/uploads/sites/7/2021/04/Cabenuva_ViIV-860x574.jpg',
          price: 120,
          countInStock: 10,
          rating: 4.5,
          numReviews: 10,
          productDiscountedPrice: '10',
        },
        {
          name: 'Adidas Slim shirt',
          slug: 'adidas-slim-shirt',
          image:
            'https://www.empr.com/wp-content/uploads/sites/7/2021/03/Evkeeza-1-860x552.jpg',
          price: 120,
          countInStock: 10,
          rating: 4.5,
          numReviews: 10,
          productDiscountedPrice: '10',
        },
        {
          name: 'Nike Slim Pant',
          slug: 'nike-slim-pant',
          image:
            'https://www.empr.com/wp-content/uploads/sites/7/2021/05/Gemtesa_Urovant-Sciences-860x573.jpg',
          price: 120,
          countInStock: 10,
          rating: 4.5,
          numReviews: 10,
          productDiscountedPrice: '10',
        },
      ],

      brand: 'Nike',

      description: 'high quality shirt',
    },
  ],
  // users: [
  //   {
  //     name: 'Basir',
  //     email: 'admin@example.com',
  //     password: bcrypt.hashSync('123456'),
  //     isAdmin: true,
  //   },
  //   {
  //     name: 'John',
  //     email: 'user@example.com',
  //     password: bcrypt.hashSync('123456'),
  //     isAdmin: false,
  //   },
  // ],
  products: [
    {
      // _id: '1',
      name: 'Nike Slim shirt',
      slug: 'nike-slim-shirt',
      category: 'Shirts',
      image: '/images/p1.jpg', // 679px × 829px
      price: 120,
      countInStock: 10,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality shirt',
    },
    {
      // _id: '2',
      name: 'Adidas Fit Shirt',
      slug: 'adidas-fit-shirt',
      category: 'Shirts',
      image: '/images/p2.jpg',
      price: 250,
      countInStock: 0,
      brand: 'Adidas',
      rating: 4.0,
      numReviews: 10,
      description: 'high quality product',
    },
    {
      // _id: '3',
      name: 'Nike Slim Pant',
      slug: 'nike-slim-pant',
      category: 'Pants',
      image: '/images/p3.jpg',
      price: 25,
      countInStock: 15,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 14,
      description: 'high quality product',
    },
    {
      // _id: '4',
      name: 'Adidas Fit Pant',
      slug: 'adidas-fit-pant',
      category: 'Pants',
      image: '/images/p4.jpg',
      price: 65,
      countInStock: 5,
      brand: 'Puma',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality product',
    },
  ],
};
export default data;
