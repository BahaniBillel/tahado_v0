const { PrismaClient, Decimal } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const resolvers = {
  Query: {
    order: async (_, { user_id }) => {
      try {
        const orders = await prisma.orders.findMany({
          where: {
            user_id: parseInt(user_id),
          },
        });

        // Check if orders array contains any order with null order_id
        if (orders.some((order) => order.order_id == null)) {
          // Handle this scenario appropriately
        }

        return orders;
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Error fetching orders. See console logs for details.");
      }
    },
    orders: () =>
      prisma.orders.findMany({
        include: {
          orderitems: true,
        },
      }),

    orderitems: () =>
      prisma.orderitems.findMany({
        include: {
          products: true,
        },
      }),
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
    products: () =>
      prisma.products.findMany({
        include: {
          inventory: true, // Include inventory data
          orderitems: true,
        },
      }),
    inventory: () => prisma.inventory.findMany(),
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

    deliveryOptions: () =>
      prisma.deliveryOptions
        .findMany({
          include: {
            DeliveryPricing: true,
            DeliveryTime: true,
            orders: {
              select: {
                order_id: true,
              },
            },
          },
        })
        .then((options) =>
          options.map((option) => ({
            ...option,
            orders: option.orders || [],
          }))
        ),

    deliveryOptionsWithDetails: async () => {
      try {
        const deliveryOptions = await prisma.deliveryOptions.findMany({
          include: {
            DeliveryPricing: true,
            DeliveryTime: true,
          },
        });

        return deliveryOptions.map((option) => {
          // Calculate total cost
          const total_cost = option.DeliveryPricing.reduce(
            (acc, curr) => acc + curr.total_price,
            0
          );

          // Calculate average estimated time
          const estimated_time_sum = option.DeliveryTime.reduce(
            (acc, curr) => acc + curr.estimated_time,
            0
          );
          const estimated_time_count = option.DeliveryTime.length;
          const estimated_time =
            estimated_time_count > 0
              ? Math.round(estimated_time_sum / estimated_time_count)
              : 0;

          return {
            delivery_option_id: option.delivery_option_id,
            provider_name: option.provider_name,
            city: option.city,
            total_cost: total_cost,
            estimated_time: estimated_time,
          };
        });
      } catch (error) {
        console.error("Error fetching delivery options with details:", error);
        throw new Error("Error fetching delivery options with details.");
      }
    },
  },

  Mutation: {
    createCraftman: async (_, { craftmanData }, context) => {
      // console.log("logging context from createCraftman", context);
      // console.log("lgging from mutation resolver", craftmanData);

      // if (!context.user || !context.user.roles.includes("admin")) {
      //   throw new Error("Unauthorized");
      // }
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

    createOccasion: async (_, { occasionData }, context) => {
      console.log("logging from resolvers", occasionData);
      // if (!context.user || !context.user.roles.includes("admin")) {
      //   throw new Error("Unauthorized");
      // }
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

    createCategory: async (_, { categoryData }, context) => {
      // if (!context.user || !context.user.roles.includes("admin")) {
      //   throw new Error("Unauthorized");
      // }
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

    createGift: async (_, { giftData }, context) => {
      // if (!context.user || !context.user.roles.includes("admin")) {
      //   throw new Error("Unauthorized");
      // }
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
              main_image: giftData.main_image,
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

    createWishItem: async (_, { wishData }, context) => {
      // if (!context.user || !context.user.roles.includes("admin")) {
      //   throw new Error("Unauthorized");
      // }
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
    removeFromWishList: async (_, { wishlistRemoveData }, context) => {
      // if (!context.user || !context.user.roles.includes("admin")) {
      //   throw new Error("Unauthorized");
      // }
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

    createUser: async (_, { userDataInput }, context) => {
      // if (!context.user || !context.user.roles.includes("admin")) {
      //   throw new Error("Unauthorized");
      // }
      console.log(userDataInput);

      // Validate input
      if (!userDataInput.phone_number) {
        throw new Error("phone_number is required");
      }

      // Check if phone number already exists
      const existingUser = await prisma.users.findUnique({
        where: { phone_number: userDataInput.phone_number },
      });

      if (existingUser) {
        throw new Error("A user with this phone number already exists");
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
        // If there is no email put this default email

        // TODO: add email to input and make the email optional in prisma
        // if (!userDataInput.email) {
        //   userDataInput.email = ""; // Provide a default email
        // }

        // Create the user
        const user = await prisma.users.create({
          data: userDataInput,
        });

        // Set the first user as admin, and the second and third as moderators
        // if (user.user_id === 1) {
        //   await prisma.users.update({
        //     where: { user_id: user.user_id },
        //     data: { roles: ["admin"] },
        //   });
        // } else if (user.user_id >= 2 && user.user_id <= 5) {
        //   await prisma.users.update({
        //     where: { user_id: user.user_id },
        //     data: { roles: ["moderator"] },
        //   });
        // }

        if (user.user_id === 1) {
          await prisma.users.update({
            where: { user_id: user.user_id },
            data: { roles: ["admin"] },
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

    addInventory: async (_, { addInventoryInput }, context) => {
      // if (!context.user || !context.user.roles.includes("admin")) {
      //   throw new Error("Unauthorized");
      // }
      console.log("addInventoryResolver:", addInventoryInput);
      try {
        // Check if an inventory record with this product_id already exists
        const existingInventory = await prisma.inventory.findUnique({
          where: { product_id: addInventoryInput.product_id },
        });

        let productToInventory;

        if (existingInventory) {
          // Update the existing inventory record
          productToInventory = await prisma.inventory.update({
            where: { product_id: addInventoryInput.product_id },
            data: addInventoryInput,
          });
        } else {
          // Create a new inventory record
          productToInventory = await prisma.inventory.create({
            data: addInventoryInput,
          });
        }

        if (!productToInventory) {
          throw new Error("Failed to add or update inventory.");
        }

        return productToInventory;
      } catch (error) {
        console.error(error);
        throw new Error("Error adding or updating inventory.");
      }
    },

    addToOrder: async (_, { addToOrderInput }, context) => {
      const {
        user_id,
        sender,
        product_id,
        recipient,
        gifter_message,
        flower_pocket,
        quantity,
        price,

        address,
        city,
        commune,

        extra_info,
        email,
        phone_number,

        delivery_option_id,
      } = addToOrderInput;

      console.log("addToOrderInput", addToOrderInput);
      const flower_pocket_fee = 1200;

      try {
        // Check if the specified product exists
        const existingProduct = await prisma.products.findUnique({
          where: {
            gift_id: product_id,
          },
        });

        if (!existingProduct) {
          throw new Error(`Product with ID ${product_id} not found.`);
        }
        // Check if the specified product exists in inventory table
        const existingInventory = await prisma.inventory.findUnique({
          where: {
            product_id: product_id,
          },
        });

        if (!existingInventory) {
          throw new Error(
            `Product with ID ${product_id} not found in inventory table.`
          );
        }

        if (existingInventory.quantity < quantity) {
          throw new Error(`The quantity ordered is not available`);
        }

        const existingOrder = await prisma.orders.findFirst({
          where: {
            user_id,
            total_amount: quantity * price,
            recipient,
            gifter_message,
          },
        });

        if (existingOrder) {
          throw new Error(
            `This Order with reference ${existingOrder.order_id} already exists`
          );
        }
        const findDeliveryProvider = await prisma.deliveryPricing.findFirst({
          where: {
            delivery_option_id,
          },
        });

        if (!findDeliveryProvider) {
          throw new Error(
            `The provider for this oder # ${existingOrder.order_id} is not defined`
          );
        }
        // Add the product to the order
        const newOrder = await prisma.orders.create({
          data: {
            user_id,
            order_date: new Date(),
            total_amount: flower_pocket
              ? quantity * price + flower_pocket_fee
              : quantity * price,
            sender,
            recipient,
            flower_pocket,
            gifter_message,
            delivery_option_id,
            delivery_price: findDeliveryProvider.total_price,
          },
        });

        if (!newOrder.order_id) {
          throw new Error(
            `order_is is not yet  was not added to orders table `
          );
        }

        const updatedNewOrder = await prisma.orders.update({
          where: {
            order_id: newOrder.order_id,
            order_date: newOrder.order_date,
            sender: newOrder.sender,
          },

          data: {
            total_order_cost:
              parseFloat(newOrder.total_amount) +
              parseFloat(newOrder.delivery_price),
          },
        });
        if (!newOrder) {
          throw new Error("The new ordered was not added to orders table");
        }

        // Add newOrderItem
        const newOrderItem = await prisma.orderitems.create({
          data: {
            order_id: newOrder.order_id,
            product_id,
            quantity,
            subtotal: quantity * price,
          },
        });

        // Retrieve all reserved orders for the product
        const reservedOrders = await prisma.orderitems.groupBy({
          where: {
            product_id,
            // Add any additional conditions to filter reserved orders
          },
          by: ["product_id"],
          _sum: {
            quantity: true,
          },
        });
        const reservedQuantity = reservedOrders[0]?._sum.quantity || 0;

        console.log("reservedQuantity", reservedQuantity);
        // TODO: implment check for the availability of the product
        // Update the inventory table

        // if (reservedQuantity >= existingInventory.available) {
        //   throw new Error("Insufficient stock available for the product.");
        // }
        const UpdateInventory = await prisma.inventory.update({
          where: {
            product_id,
          },
          data: {
            reserved: reservedQuantity,
            available: existingInventory.quantity - reservedQuantity,
            last_updated: new Date(),
          },
        });

        // Update order_id in deliveryoptions
        if (!newOrder.order_id) {
          throw new Error("The order_id havn't yet been created");
        }

        const DeliveryTime = await prisma.deliveryTime.findFirst({
          where: {
            delivery_option_id,
          },
        });

        const UpdateDeliveryOptions = await prisma.deliveryOptions.update({
          where: {
            delivery_option_id,
          },

          data: {
            // order_id: newOrder.order_id,
            delivery_time_id: DeliveryTime.delivery_time_id,
          },
        });
        // Add shipping address
        const AddshippingInfo = await prisma.shippingaddresses.create({
          data: {
            user_id,
            address,
            city,
            commune,

            extra_info,
          },
        });

        // Update user email and phone_number

        const UpdateUserInfo = await prisma.users.update({
          where: {
            user_id,
          },

          data: {
            email,
            phone_number,
          },
        });
        return {
          order: updatedNewOrder,
          orderItem: newOrderItem,
          inventory: UpdateInventory,
          shippingaddress: AddshippingInfo,
          users: UpdateUserInfo,
          delivery_option: UpdateDeliveryOptions,
        };
      } catch (error) {
        console.error("Error in addToOrder resolver:", error);
        throw new Error("Failed to add item to order");
      }
    },

    removeItem: async (_, { removeItemInput }) => {
      const { order_id } = removeItemInput;

      const findItemId = await prisma.orderitems.findFirst({
        where: {
          order_id: parseInt(removeItemInput.order_id),
        },
      });

      const item_id = findItemId.item_id;

      try {
        // Start a transaction
        await prisma.$transaction(async (prisma) => {
          // Remove the item from orderitems
          await prisma.orderitems.delete({
            where: {
              item_id: parseInt(item_id),
            },
          });

          // Check if there are any items left in the order
          const remainingItems = await prisma.orderitems.count({
            where: {
              order_id: parseInt(order_id),
            },
          });

          // If no items left, remove the order
          if (remainingItems === 0) {
            await prisma.orders.delete({
              where: {
                order_id: parseInt(order_id),
              },
            });
          }
        });

        return {
          success: true,
          message: "Item and order updated successfully",
        };
      } catch (error) {
        console.error("Error removing item from order:", error);
        return { success: false, message: "Error removing item from order" };
      }
    },
    addDeliveryProvider: async (_, { deliveryDataInput }) => {
      try {
        // Check if a delivery option with the same provider_name and city already exists
        const existingDeliveryOption = await prisma.deliveryOptions.findFirst({
          where: {
            provider_name: deliveryDataInput.provider_name,
            city: deliveryDataInput.city,
          },
        });

        // If an existing record is found, throw an error
        if (existingDeliveryOption) {
          throw new Error(
            "A delivery provider with the same name and city already exists."
          );
        }
        // Begin a transaction to ensure data consistency
        const result = await prisma.$transaction(async (prisma) => {
          // Create a new delivery option
          const deliveryOption = await prisma.deliveryOptions.create({
            data: {
              provider_name: deliveryDataInput.provider_name,
              city: deliveryDataInput.city,
            },
          });
          // Calculate the total price by adding base price and additional cost
          const totalPrice = new Decimal(deliveryDataInput.base_price).plus(
            deliveryDataInput.additional_cost
          );

          // Create the delivery pricing with the calculated total price
          const deliveryPricing = await prisma.deliveryPricing.create({
            data: {
              delivery_option_id: deliveryOption.delivery_option_id,
              base_price: deliveryDataInput.base_price,
              additional_cost: deliveryDataInput.additional_cost,
              total_price: totalPrice.toNumber(),
            },
          });

          // Create the delivery time
          const deliveryTime = await prisma.deliveryTime.create({
            data: {
              delivery_option_id: deliveryOption.delivery_option_id,
              estimated_time: deliveryDataInput.estimated_time,
            },
          });

          // Return the combined data
          return {
            deliveryOption,
            deliveryPricing,
            deliveryTime,
          };
        });

        // Format the result as per the GraphQL response type
        const response = {
          deliveryOptions: {
            provider_name: result.deliveryOption.provider_name,
            city: result.deliveryOption.city,
          },
          deliveryPricing: {
            base_price: result.deliveryPricing.base_price,
            additional_cost: result.deliveryPricing.additional_cost,
            total_price: result.deliveryPricing.total_price,
          },
          deliveryTime: {
            estimated_time: result.deliveryTime.estimated_time,
          },
        };

        return response;
      } catch (error) {
        // Handle any errors
        throw new Error("Failed to add delivery provider: " + error.message);
      }
    },
  },
  Order: {
    user: (parent) =>
      prisma.users.findUnique({ where: { user_id: parent.user_id } }),
    orderitems: (parent) =>
      prisma.orderitems.findMany({ where: { order_id: parent.order_id } }),
    deliveryOption: (parent) => {
      console.log(
        "Order ID:",
        parent.order_id,
        "Delivery Option ID:",
        parent.delivery_option_id
      );
      // Check if the order has a delivery_option_id
      if (parent.delivery_option_id) {
        return prisma.deliveryOptions.findUnique({
          where: { delivery_option_id: parent.delivery_option_id },
        });
      } else {
        // If there is no delivery_option_id, return null or an appropriate default
        return null;
      }
    },
  },
  OrderItem: {
    product: (parent) =>
      prisma.products.findUnique({ where: { gift_id: parent.product_id } }),
    order: (parent) =>
      prisma.order.findMany({
        where: {
          order_id: parent.order_id,
        },
      }),
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
