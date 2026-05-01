import type { User } from "../generated/prisma/client.js";

export type safeUser = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  profileImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function toSafeUser(user: User): safeUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    profileImageUrl: user.profileImageUrl,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
