import type { SafeUser } from "../utils/userMappers.js";

declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
    }
  }
}
