const prisma = require("../prisma/prisma");
const bcrypt = require("bcrypt");

// GET ALL USERS
exports.getUsers = async (req, res) => {
  console.log(req.body);
  try {
    // const result = await db.query("select * from users ");
    const result = await prisma.users.findMany();
    // console.log(result.rows);
    res.status(200).json({
      status: "success",
      results: result.length,
      data: {
        users: result,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// CREATE NEW USER

exports.createUser = async (req, res) => {
  console.log(req.body);
  const userData = req.body;

  // Hash the password
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(
      userData.password_hash,
      saltRounds
    );

    // Replace the plaintext password with the hashed password
    userData.password_hash = hashedPassword;

    // Create the user
    const user = await prisma.users.create({
      data: userData,
    });

    // // Set users with user_id from 1 to 3 as admins by default
    // if (user.user_id >= 1 && user.user_id <= 3) {
    //   await prisma.users.update({
    //     where: { user_id: user.user_id },
    //     data: { roles: ["admin"] },
    //   });
    // }

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

    res.status(201).json({ message: "User created", user });
  } catch (error) {
    console.error("Prisma Error:", error);
    res.status(500).json({ error: "Failed to create user", details: error });
  } finally {
    // Close the Prisma client
    await prisma.$disconnect();
  }
};

// Make a user an admin
// backend controller
// backend controller
exports.makeUserAdmin = async (req, res) => {
  try {
    // Extract userId from the request body
    const userId = parseInt(req.body.userId, 10);

    // Fetch the existing user
    const existingUser = await prisma.user.findUnique({
      where: { user_id: userId }, // Ensure the table name is 'user'
    });

    // Check if the user exists
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is already an admin
    if (existingUser.roles.includes("admin")) {
      return res.status(400).json({ error: "User is already an admin" });
    }

    // Replace existing roles with "admin"
    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: {
        roles: ["admin"], // Replace existing roles with "admin"
      },
    });

    // Send success response
    res
      .status(201)
      .json({ message: "This user has become an Admin", user: updatedUser });
  } catch (error) {
    // Handle errors and send error response
    console.error("Prisma Error:", error);
    res.status(500).json({
      error: "Failed to make this user an admin",
      details: error.message,
    });
  }
};
