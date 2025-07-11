"use server";

import dbConnect from "../db-connect";

import User from "@/models/user.model";

export async function createUser(userData) {
  try {
    await dbConnect();
    const user = await User.findOne({ clerkUserId: userData.clerkUserId });

    if (user) return user;

    const newUser = new User(userData);
    return await newUser.save();
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

export async function updateUser(clerkUserId, user) {
  try {
    await dbConnect();
    return await User.findOneAndUpdate({ clerkUserId }, user, {
      new: true,
    });
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

export async function deleteUser(clerkUserId) {
  try {
    await dbConnect();
    await User.deleteOne({ clerkUserId });
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

export async function getUser(clerkUserId) {
  try {
    await dbConnect();
    await User.findOne({ clerkUserId });
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}
