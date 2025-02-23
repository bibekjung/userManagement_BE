import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "mysecretkey";

interface AuthRequest extends Request {
  user?: any;
}
const prisma = new PrismaClient();
export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, SECRET) as {
        userId: string;
        role: string;
      };
      if (!roles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

export const authMiddleware = async (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const blacklisted = await prisma.tokenBlacklist.findUnique({
    where: { token },
  });

  if (blacklisted) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
