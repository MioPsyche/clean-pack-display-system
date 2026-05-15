import { userRepository } from "../repositories/userRepository.js";
import type { PublicUser, UserRow } from "../types/auth.js";
import { HttpError } from "../utils/httpError.js";
import { signAuthToken } from "../utils/jwt.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

const toPublicUser = (user: UserRow): PublicUser => ({
  id: user.id,
  username: user.username,
  role: user.role,
  createdAt: user.created_at
});

export const authService = {
  async register(username: string, password: string): Promise<{ user: PublicUser; token: string }> {
    if (username.length < 3) {
      throw new HttpError(400, "username must be at least 3 characters.");
    }

    if (password.length < 6) {
      throw new HttpError(400, "password must be at least 6 characters.");
    }

    const existing = userRepository.findByUsername(username);
    if (existing) {
      throw new HttpError(409, "username already exists.");
    }

    const passwordHash = await hashPassword(password);
    const user = userRepository.create(username, passwordHash);
    const token = signAuthToken({ id: user.id, username: user.username, role: user.role });

    return {
      user: toPublicUser(user),
      token
    };
  },

  async login(username: string, password: string): Promise<{ user: PublicUser; token: string }> {
    const user = userRepository.findByUsername(username);

    if (!user) {
      throw new HttpError(401, "invalid username or password.");
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      throw new HttpError(401, "invalid username or password.");
    }

    const token = signAuthToken({ id: user.id, username: user.username, role: user.role });

    return {
      user: toPublicUser(user),
      token
    };
  }
};
