const typeDefs = `#graphql
  type Query {
    orders: [Order!]!
    order(user_id: ID!): [Order]
    paymentmethods: [PaymentMethod!]!
    productreviews: [ProductReview!]!
    shippingaddresses: [ShippingAddress!]!
    users: [User!]!
    user(user_id: ID!): User  # New query to fetch a single user by user_id
    wishlist: [Wishlist!]!
    wishlistitems: [WishlistItem!]!
    categories: [Category!]!
    products: [Product!]!
    occasions: [Occasion!]!
    productOccasion(productId: Int!): [ProductOccasion!]!
    wishlistByUser(userId: Int!): [Wishlist!]!
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
    state: String
    postal_code: String
    country: String
    user: User
  }

  type User {
    user_id: ID!
    email: String!
    password_hash: String!
    first_name: String
    last_name: String
    address: String
    phone_number: String
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
}



input AddOrderItemInput {
  user_id: Int!
 
  product_id: Int!
  recipient:String   
  gifter_message:String
  quantity: Int!

  price: Float! 
    
}

type AddOrderItemResponse {
  order: Order
  orderItem: OrderItem
}

input AddInventoryInput{
  product_id:Int
  quantity: Int
  reserved: Int
  minimum_level: Int
  last_updated: String
  
}
input UserDataInput{
  email:String!
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
    order_date:String
    recipient:String    
    gifter_message:String     
    wished_gift_date: String    
    total_amount: Float
    orderitems: [OrderItem!]!
    user: User
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
    giftname: String!
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

  

  
`;

module.exports = typeDefs;
