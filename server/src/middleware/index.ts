import type { NextFunction, Request, Response } from "express";
import { verifyAdminToken } from "../services";
import type { AdminRole } from "../types";

export type AuthenticatedRequest = Request & {
  admin?: {
    id: string;
    email: string;
    role: AdminRole;
  };
};

function extractBearerToken(request: Request) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice(7).trim();
}

export function authenticateAdmin(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  const token = extractBearerToken(request);

  if (!token) {
    response.status(401).json({ message: "Admin token required" });
    return;
  }

  try {
    const payload = verifyAdminToken(token);
    request.admin = {
      id: payload.adminId,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch {
    response.status(401).json({ message: "Invalid admin token" });
  }
}

export function requireAdminRole(allowedRoles: AdminRole[]) {
  return function guard(request: AuthenticatedRequest, response: Response, next: NextFunction) {
    const role = request.admin?.role;

    if (!role || !allowedRoles.includes(role)) {
      response.status(403).json({ message: "Admin access required" });
      return;
    }

    next();
  };
}

export function notFoundMiddleware(_: Request, response: Response) {
  response.status(404).json({ message: "Resource not found" });
}

export function errorMiddleware(error: Error, _: Request, response: Response, __: NextFunction) {
  response.status(error.name === "ValidationError" ? 400 : 500).json({
    message: error.message,
  });
}