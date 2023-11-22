const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");

// Define the types
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    user_id: { type: GraphQLID },
    email: { type: GraphQLString },
    password_hash: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    address: { type: GraphQLString },
    phone_number: { type: GraphQLString },
    orders: { type: new GraphQLList(OrderType) },
    paymentmethods: { type: new GraphQLList(PaymentMethodType) },
    productreviews: { type: new GraphQLList(ProductReviewType) },
    shippingaddresses: { type: new GraphQLList(ShippingAddressType) },
    wishlist: { type: new GraphQLList(WishlistType) },
  }),
});

const OrderType = new GraphQLObjectType({
  name: "Order",
  fields: () => ({
    order_id: { type: GraphQLID },
    user_id: { type: GraphQLInt },
    order_date: { type: GraphQLString },
    total_amount: { type: GraphQLFloat },
    orderitems: { type: new GraphQLList(OrderItemType) },
    user: { type: UserType },
  }),
});

const PaymentMethodType = new GraphQLObjectType({
  name: "PaymentMethod",
  fields: () => ({
    payment_method_id: { type: GraphQLID },
    user_id: { type: GraphQLInt },
    payment_type: { type: GraphQLString },
    card_number: { type: GraphQLString },
    expiration_date: { type: GraphQLString },
    billing_address: { type: GraphQLString },
    user: { type: UserType },
  }),
});

// Define other types similarly

// Define the Query type
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  fields: {

    users:{
        type:
    },
    orders: {
      type: new GraphQLList(OrderType),
      resolve() {
        // Resolve logic for fetching orders
      },
    },
    paymentmethods: {
      type: new GraphQLList(PaymentMethodType),
      resolve() {
        // Resolve logic for fetching payment methods
      },
    },
    // Add other queries here
  },
});

// Optionally, define the Mutation type

module.exports = RootQueryType;
