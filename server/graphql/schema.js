const typeDefs = `#graphql
  type Query {
    orders: [Order!]!
    order(user_id: ID!): [Order]
    orderitems:[OrderItem!]!
    paymentmethods: [PaymentMethod!]!
    productreviews: [ProductReview!]!
    shippingaddresses: [ShippingAddress!]!
    users: [User!]!
    user(user_id: ID!): User  # New query to fetch a single user by user_id
    wishlist: [Wishlist!]!
    wishlistitems: [WishlistItem!]!
    categories: [Category!]!
    products: [Product!]!
    inventory:[Inventory!]!
    occasions: [Occasion!]!
    productOccasion(productId: Int!): [ProductOccasion!]!
    wishlistByUser(userId: Int!): [Wishlist!]!
    deliveryOptions:[DeliveryOptions!]!
     deliveryOptionsWithDetails: [DeliveryOptionsWithDetails!]!
  }

 

  type PaymentMethod {
    payment_method_id: ID!
    user_id: Int
    payment_type: String
    card_number: String
    expiration_date: String
    billing_address: String
    user: User
  }

  type ProductReview {
    review_id: ID!
    product_id: Int
    user_id: Int
    rating: Int
    review_text: String
    review_date: String
    product: Product
    user: User
  }

  type ShippingAddress {
    address_id: ID!
    user_id: Int
    address: String
    city: String
    commune: String
    postal_code: String
    extra_info: String
    user: User
  }

  type User {
    user_id: ID!
    email: String
    password_hash: String!
    first_name: String
    last_name: String
    address: String
    phone_number: String!
    roles: [String!]!  # Add this line for the roles field
    orders: [Order!]!
    paymentmethods: [PaymentMethod!]!
    productreviews: [ProductReview!]!
    shippingaddresses: [ShippingAddress!]!
    wishlist: [Wishlist!]!
  }

  type Wishlist {
    wishlist_id: ID!
    user_id: Int
    user: User
    wishlistitems: [WishlistItem!]!
  }

  type WishlistItem {
    wishlist_item_id: ID!
    wishlist_id: Int
    product_id: Int
    product: Product
    wishlist: Wishlist
  }

  type Category {
    category_id: ID!
    category_name: String
    parent_category_id: Int
    productCategory: [ProductCategory!]!
    subcategories: [Category!]!
  }

  type ProductCategory {
    product: Product!
    category: Category!
  }

  type Craftman {
    craftman_id: ID!
    name: String!
    products: [Product!]!
  }
  type Mutation {
  createCraftman(craftmanData: CraftmanInput!): Craftman!
  createOccasion(occasionData: OccasionInput!): Occasion!
  createCategory(categoryData: CategoryInput!): Category!
  createGift(giftData: GiftInput!): Product!
  createWishItem(wishData:WishInput!):WishlistProductResponse!
  removeFromWishList(wishlistRemoveData: WishlistRemoveInput!): WishlistItem!
  createUser(userDataInput:UserDataInput!):User!
  addInventory(addInventoryInput:AddInventoryInput!):Inventory!
  addToOrder(addToOrderInput: AddOrderItemInput!): AddOrderItemResponse!
  removeItem(removeItemInput:RemoveItemInput!):AddOrderItemResponse!
  addDeliveryProvider(deliveryDataInput:DeliveryDataInput!):DeliveryResponse!
}
 type DeliveryOptionsWithDetails {
    provider_name: String!
    city: String!
    total_cost: Float!
    estimated_time: Int!
    delivery_option_id:Int!
  }

type DeliveryResponse {
  deliveryPricing:DeliveryPricing
  deliveryOptions:DeliveryOptions
  deliveryTime:DeliveryTime
}

input DeliveryDataInput {
  provider_name:String
  city:String
  base_price:Float!
  additional_cost:Float!
  estimated_time:Int!
}

input RemoveItemInput {
   order_id: ID!
}

input AddOrderItemInput {
  user_id: Int!
 sender:String
  product_id: Int!
  recipient:String   
  gifter_message:String
  quantity: Int!
  flower_pocket:Boolean
  price: Float! 

  # from shippingaddress table
  address:String!
  city: String!
  commune: String!
 
  extra_info: String

  # for updating user email and phone number
  email: String
  phone_number: String!

  # DeliveryOptions
  delivery_option_id: Int!

}

type AddOrderItemResponse {
  order: Order
  orderItem: OrderItem
  shippingaddress:ShippingAddress
  delivery_option:DeliveryOptions
}

input AddInventoryInput{
  product_id:Int
  quantity: Int
  reserved: Int
  minimum_level: Int
  last_updated: String
  
}
input UserDataInput{
  phone_number:String!
  password_hash:String!
  first_name:String!
  last_name:String!
}

input WishlistRemoveInput {
  wishlist_id: Int!
  
}



type WishlistProductResponse {
  wishlist: Wishlist
  product: Product
}

input WishInput{
  user_id:Int!
  product_id:Int!
}

input GiftInput {
  craftman_id: Int
    sku: String!
    giftname: String!
    description: String
    price: Float!
    url: String
    main_image:String!
    category_id: Int!  
    occasionIds: [Int!]
}

input CategoryInput{
   category_name:String!
   parent_category_id:Int!
}

 input CategoryInput {
    category_name: String!
    # Add other fields as needed
  }

input CraftmanInput {
  name: String!
  # Add other fields as needed
}
 input OccasionInput {
    name: String!
    # Add other fields as needed
  }


type Order {
  order_id: ID!
  user_id: Int
  order_date: String
  sender: String
  recipient: String
  gifter_message: String
  flower_pocket: Boolean   
  wished_gift_date: String    
  total_amount: Float
  orderitems: [OrderItem!]!
  user: User
  deliveryOption: DeliveryOptions  # Link to DeliveryOptions
}


  type OrderItem {
    item_id: ID!
    order_id: Int
    product_id: Int
    quantity: Int
    subtotal: Float
    order: Order
    product: Product
  }

  type Product {
    gift_id: ID!
    craftman_id: Int
    sku: String!
    giftname: String
    description: String
    price: Float!
    url: String
    main_image: String
    productCategory: [ProductCategory!]!
    orderitems: [OrderItem!]!
    productreviews: [ProductReview!]!
    wishlistitems: [WishlistItem!]!
    occasions: [ProductOccasion!]!
    craftman: Craftman
    inventory:Inventory
  }

 type Inventory {
  inventory_id: ID!
  product_id: Int
  quantity: Int
  reserved: Int
  available: Int
  minimum_level: Int
  last_updated: String
  product: Product
}


  type Occasion {
    id: ID!
    name: String!
    products: [ProductOccasion!]!
  }

  type ProductOccasion {
    product: Product!
    occasion: Occasion!
  }

type DeliveryOptions {
  delivery_option_id: Int!
  provider_name: String!
  city: String!
  delivery_time_id: Int
  orders: [Order]      # Updated to reflect one-to-many relationship
  DeliveryPricing: [DeliveryPricing!]!
  DeliveryTime: [DeliveryTime!]!
}
 

type DeliveryPricing {
  pricing_id: Int!
  delivery_option_id: Int!
  base_price: Float!
  additional_cost: Float!
  total_price: Float!
  deliveryOptions: DeliveryOptions!
}

type DeliveryTime {
  delivery_time_id: Int!
  delivery_option_id: Int!
  estimated_time: Int!
  deliveryOptions: DeliveryOptions!
}

type Storytelling {
  id: ID!
  title: String!
  description:String!
  characters:String!
  setting:String!
  plot:String!
  createdAt: String!
  updatedAt: String!
  
}






  

  
`;

module.exports = typeDefs;
