import { userRepository } from "../repositories/userRepository.js";
import type { PublicUser, UserRow } from "../types/auth.js";
import { HttpError } from "../utils/httpError.js";
import { signAuthToken } from "../utils/jwt.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { toIsoTimestamp } from "../utils/timestamp.js";

const MAX_USERNAME_LENGTH = 50;
// bcrypt 只处理前 72 字节，超长部分会被静默截断，因此直接拒绝超长密码。
const MAX_PASSWORD_BYTES = 72;

const toPublicUser = (user: UserRow): PublicUser => ({
  id: user.id,
  username: user.username,
  role: user.role,
  createdAt: toIsoTimestamp(user.created_at)
});

const isUniqueConstraintError = (error: unknown): boolean => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "SQLITE_CONSTRAINT_UNIQUE"
  );
};

export const authService = {
  async register(username: string, password: string): Promise<{ user: PublicUser; token: string }> {
    if (username.length < 3) {
      throw new HttpError(400, "用户名至少需要 3 个字符。");
    }

    if (username.length > MAX_USERNAME_LENGTH) {
      throw new HttpError(400, `用户名长度不能超过 ${MAX_USERNAME_LENGTH} 个字符。`);
    }

    if (password.length < 6) {
      throw new HttpError(400, "密码至少需要 6 个字符。");
    }

    if (Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES) {
      throw new HttpError(400, `密码长度不能超过 ${MAX_PASSWORD_BYTES} 字节。`);
    }

    const existing = userRepository.findByUsername(username);
    if (existing) {
      throw new HttpError(409, "该用户名已被注册。");
    }

    const passwordHash = await hashPassword(password);

    let user: UserRow;
    try {
      user = userRepository.create(username, passwordHash);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new HttpError(409, "该用户名已被注册。");
      }
      throw error;
    }

    const token = signAuthToken({ id: user.id, username: user.username, role: user.role });

    return {
      user: toPublicUser(user),
      token
    };
  },

  async login(username: string, password: string): Promise<{ user: PublicUser; token: string }> {
    const user = userRepository.findByUsername(username);

    if (!user) {
      throw new HttpError(401, "用户名或密码错误。");
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      throw new HttpError(401, "用户名或密码错误。");
    }

    const token = signAuthToken({ id: user.id, username: user.username, role: user.role });

    return {
      user: toPublicUser(user),
      token
    };
  }
};
