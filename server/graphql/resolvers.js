const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const resolvers = {
  Query: {
    orders: () => prisma.orders.findMany(),
    paymentmethods: () => prisma.paymentmethods.findMany(),
    productreviews: () => prisma.productreviews.findMany(),
    shippingaddresses: () => prisma.shippingaddresses.findMany(),

    users: () => prisma.users.findMany(),

    user: async (_, { user_id }) => {
      try {
        const user = await prisma.users.findUnique({
          where: {
            user_id: parseInt(user_id),
          },
        });

        if (!user) {
          console.error(`User with user_id ${user_id} not found.`);
          throw new Error(`User with user_id ${user_id} not found.`);
        }

        return user;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Error fetching user. See console logs for details.");
      }
    },
    wishlist: () => prisma.wishlist.findMany(),
    wishlistitems: () => prisma.wishlistitems.findMany(),
    categories: () => prisma.categories.findMany(),
    products: () => prisma.products.findMany(),
    occasions: () => prisma.occasion.findMany(),
    productOccasion: async (_, { productId }) => {
      return await prisma.productOccasion.findMany({
        where: {
          productId: productId,
        },
        include: {
          occasions: true,
        },
      });
    },

    wishlistByUser: (_, { userId }) => {
      return prisma.wishlist.findMany({
        where: {
          user_id: userId,
        },
      });
    },
  },

  Mutation: {
    createCraftman: async (_, { craftmanData }) => {
      try {
        // Check if the craftman already exists based on the name
        const existingCraftman = await prisma.craftmen.findFirst({
          where: { name: craftmanData.name },
        });

        // If the craftman already exists, return an error message
        if (existingCraftman) {
          throw new Error("Craftman already exists");
        }

        // If the craftman does not exist, create a new craftman
        const craftman = await prisma.craftmen.create({
          data: craftmanData,
        });

        return craftman;
      } catch (error) {
        console.error("Error creating craftman:", error);
        throw new Error("Failed to create craftman");
      }
    },
  },
  Order: {
    user: (parent) =>
      prisma.users.findUnique({ where: { user_id: parent.user_id } }),
    orderitems: (parent) =>
      prisma.orderitems.findMany({ where: { order_id: parent.order_id } }),
  },
  PaymentMethod: {
    user: (parent) =>
      prisma.users.findUnique({ where: { user_id: parent.user_id } }),
  },
  ProductReview: {
    product: (parent) =>
      prisma.products.findUnique({ where: { gift_id: parent.product_id } }),
    user: (parent) =>
      prisma.users.findUnique({ where: { user_id: parent.user_id } }),
  },
  ShippingAddress: {
    user: (parent) =>
      prisma.users.findUnique({ where: { user_id: parent.user_id } }),
  },
  User: {
    orders: (parent) =>
      prisma.orders.findMany({ where: { user_id: parent.user_id } }),
    paymentmethods: (parent) =>
      prisma.paymentmethods.findMany({ where: { user_id: parent.user_id } }),
    productreviews: (parent) =>
      prisma.productreviews.findMany({ where: { user_id: parent.user_id } }),
    shippingaddresses: (parent) =>
      prisma.shippingaddresses.findMany({ where: { user_id: parent.user_id } }),
    wishlist: (parent) =>
      prisma.wishlist.findMany({ where: { user_id: parent.user_id } }),
  },
  Wishlist: {
    user: (parent) =>
      prisma.users.findUnique({ where: { user_id: parent.user_id } }),
  },
  Wishlist: {
    user: (parent) =>
      prisma.users.findUnique({ where: { user_id: parent.user_id } }),
    wishlistitems: (parent) =>
      prisma.wishlistitems.findMany({
        where: { wishlist_id: parent.wishlist_id },
      }),
  },
  WishlistItem: {
    product: (parent) =>
      prisma.products.findUnique({ where: { gift_id: parent.product_id } }),
    wishlist: (parent) =>
      prisma.wishlist.findUnique({
        where: { wishlist_id: parent.wishlist_id },
      }),
  },
  Category: {
    productCategory: (parent) =>
      prisma.productCategory.findMany({
        where: { category_id: parent.category_id },
      }),
    subcategories: (parent) =>
      prisma.categories.findMany({
        where: { parent_category_id: parent.category_id },
      }),
  },
  Product: {
    productCategory: (parent) =>
      prisma.productCategory.findMany({ where: { gift_id: parent.gift_id } }),
    orderitems: (parent) =>
      prisma.orderitems.findMany({ where: { product_id: parent.gift_id } }),
    productreviews: (parent) =>
      prisma.productreviews.findMany({ where: { product_id: parent.gift_id } }),
    wishlistitems: (parent) =>
      prisma.wishlistitems.findMany({ where: { product_id: parent.gift_id } }),
    occasions: (parent) =>
      prisma.productOccasion.findMany({ where: { productId: parent.gift_id } }),
    craftman: (parent) =>
      prisma.craftmen.findUnique({
        where: { craftman_id: parent.craftman_id },
      }),
  },
  Occasion: {
    products: (parent) =>
      prisma.productOccasion.findMany({ where: { occasionId: parent.id } }),
  },
  ProductOccasion: {
    product: (parent) =>
      prisma.products.findUnique({ where: { gift_id: parent.productId } }),
    occasion: (parent) =>
      prisma.occasion.findUnique({ where: { id: parent.occasionId } }),
  },
  // ... other resolvers for mutations or complex types
};

module.exports = resolvers;
