const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

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
      console.log("lgging from mutation resolver", craftmanData);
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

    createOccasion: async (_, { occasionData }) => {
      console.log("logging from resolvers", occasionData);
      try {
        const existingOccasion = await prisma.occasion.findFirst({
          where: { name: occasionData.name },
        });

        if (existingOccasion) {
          throw new Error("Occasion already exists");
        }

        const occasion = await prisma.occasion.create({
          data: occasionData,
        });

        return occasion;
      } catch (error) {
        console.error("Error creating occasion:", error);
        throw new Error("Failed to create occasion");
      }
    },

    createCategory: async (_, { categoryData }) => {
      try {
        // Check if the category already exists based on the name
        const existingCategory = await prisma.categories.findFirst({
          where: { category_name: categoryData.category_name },
        });

        // If the category already exists, return an error message
        if (existingCategory) {
          throw new Error("Category already exists");
        }

        // If the category does not exist, create a new category
        const category = await prisma.categories.create({
          data: categoryData,
        });

        return category;
      } catch (error) {
        console.error("Error creating category:", error);
        throw new Error("Failed to create category");
      }
    },

    createGift: async (_, { giftData }) => {
      const { category_id, occasionIds, ...giftDetails } = giftData;
      console.log(
        "createGift about to be sent to tables:",
        giftData.category_id,
        giftData.occasionIds,

        giftDetails
      );
      try {
        // Start a transaction to ensure atomicity
        const result = await prisma.$transaction(async (prisma) => {
          // Step 1: Create the gift in the products table
          const createdGift = await prisma.products.create({
            data: {
              craftman_id: giftData.craftman_id,
              sku: giftData.sku,
              giftname: giftData.giftname,
              description: giftData.description,
              price: giftData.price,
              url: giftData.url,
              Main_Image: giftData.main_image,
            },
          });

          // Extract the gift_id
          const gift_id = createdGift.gift_id;

          // Step 2: Create the entry in the productCategory table
          if (giftData.category_id) {
            await prisma.productCategory.create({
              data: {
                gift_id: gift_id,
                category_id: giftData.category_id,
              },
            });
          }

          // Step 3: Create entries in the productOccasion table
          if (giftData.occasionIds && giftData.occasionIds.length > 0) {
            await prisma.productOccasion.createMany({
              data: giftData.occasionIds.map((occasionId) => ({
                productId: gift_id,
                occasionId: occasionId,
              })),
            });
          }

          // Return the created gift
          return createdGift;
        });

        // If the transaction is successful, return the created gift
        return result;
      } catch (error) {
        console.error("Prisma Error:", error);
        throw new Error("Failed to create new gift");
      }
    },

    createWishItem: async (_, { wishData }) => {
      const { user_id, product_id } = wishData;

      console.log("Logging createwishItem", user_id, product_id);
      try {
        // Create a new wishlist entry
        const wishlist = await prisma.wishlist.create({
          data: { user_id },
        });
        console.log(wishlist);
        // Check if the wishlist entry was created successfully
        if (wishlist && wishlist.wishlist_id) {
          // Create a wishlist item entry
          const wishlistItem = await prisma.wishlistitems.create({
            data: {
              wishlist_id: wishlist.wishlist_id,
              product_id,
            },
          });

          // Return the created wishlist item

          return wishlistItem;
        } else {
          throw new Error("Wishlist creation failed");
        }
      } catch (error) {
        console.error("Error in createWishItem resolver:", error);
        throw new Error("Failed to create wishlist item");
      }
    },
    removeFromWishList: async (_, { wishlistRemoveData }) => {
      const { wishlist_id } = wishlistRemoveData;
      console.log("logging from remove resolver :", wishlist_id);
      try {
        // Delete the specified wishlist item
        await prisma.wishlistitems.deleteMany({
          where: {
            wishlist_id: wishlist_id,
          },
        });

        // Check if there are any items left in the wishlist
        const remainingItems = await prisma.wishlistitems.findMany({
          where: {
            wishlist_id: wishlist_id,
          },
        });

        // If no items left, delete the wishlist
        if (remainingItems.length === 0) {
          await prisma.wishlist.delete({
            where: {
              wishlist_id: wishlist_id,
            },
          });
        }

        return { message: "Wishlist item removed successfully" };
      } catch (error) {
        console.error("Error in removeFromWishList resolver:", error);
        throw new Error("Error removing wishlist item");
      }
    },

    createUser: async (_, { userDataInput }) => {
      console.log(userDataInput);

      // Validate input
      if (!userDataInput.email) {
        throw new Error("Email is required");
      }

      // Hash the password
      const saltRounds = 10;
      try {
        const hashedPassword = await bcrypt.hash(
          userDataInput.password_hash,
          saltRounds
        );

        // Replace the plaintext password with the hashed password
        userDataInput.password_hash = hashedPassword;

        // Create the user
        const user = await prisma.users.create({
          data: userDataInput,
        });

        // Set the first user as admin, and the second and third as moderators
        if (user.user_id === 1) {
          await prisma.users.update({
            where: { user_id: user.user_id },
            data: { roles: ["admin"] },
          });
        } else if (user.user_id >= 2 && user.user_id <= 5) {
          await prisma.users.update({
            where: { user_id: user.user_id },
            data: { roles: ["moderator"] },
          });
        }

        return user;
      } catch (error) {
        console.error("Prisma Error:", error);
        throw new Error(`Failed to create user: ${error.message}`); // Throw an error
      } finally {
        // Close the Prisma client
        await prisma.$disconnect();
      }
    },
    addToOrder: async (_, { addToOrder }) => {
      const { order_id, product_id, quantity } = addToOrder;

      try {
        // Check if the specified order exists
        const order = await prisma.orders.findUnique({
          where: {
            order_id: order_id,
          },
        });

        if (!order) {
          throw new Error(`Order with ID ${order_id} not found.`);
        }

        // Check if the product exists
        const product = await prisma.products.findUnique({
          where: {
            gift_id: product_id,
          },
        });

        if (!product) {
          throw new Error(`Product with ID ${product_id} not found.`);
        }

        // Add the product to the order
        const newOrderItem = await prisma.orderitems.create({
          data: {
            order_id: order_id,
            product_id: product_id,
            quantity: quantity,
            subtotal: product.price * quantity, // Assuming the price is stored in the product record
          },
        });

        // Optionally update the total amount of the order
        const updatedOrder = await prisma.orders.update({
          where: {
            order_id: order_id,
          },
          data: {
            // Assuming total_amount is a sum of all order item subtotals
            total_amount: {
              increment: product.price * quantity,
            },
          },
        });

        return {
          order: updatedOrder,
          orderItem: newOrderItem,
        };
      } catch (error) {
        console.error("Error in addToOrder resolver:", error);
        throw new Error("Failed to add item to order");
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

  ProductCategory: {
    product: (parent) =>
      prisma.products.findUnique({ where: { gift_id: parent.product_id } }),
    category: (parent) =>
      prisma.categories.findUnique({
        where: { category_id: parent.category_id },
      }),
  },
  // ... other resolvers for mutations or complex types
};

module.exports = resolvers;
