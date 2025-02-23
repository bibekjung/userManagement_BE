import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password, role = "USER" } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase() as Role,
      },
    });

    return res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creating user" });
  }
};

export const getUsers = async (req: any, res: any): Promise<any> => {
  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching users" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id: userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user" });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  const userId = req.params.id;
  const { name, email, password } = req.body;

  try {
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        password: hashedPassword ? hashedPassword : undefined,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: "Error updating user" });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  const { id: userId } = req.params;

  console.log("User");

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return res.status(200).json({ message: "Sucessfully deleting user" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting user" });
  }
};
