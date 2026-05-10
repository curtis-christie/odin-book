export type PublicUser = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SafeUser = PublicUser & {
  email: string;
};

export type RelationshipStatus = "SELF" | "FOLLOWING" | "PENDING" | "NONE";

export type PublicUserWithRelationship = PublicUser & {
  relationshipStatus: RelationshipStatus;
};

export type PublicPost = {
  id: string;
  content: string;
  author: PublicUser;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
};

export type PublicComment = {
  id: string;
  content: string;
  author: PublicUser;
  postId: string;
  createdAt: string;
  updatedAt: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedResponse<TDataKey extends string, TItem> = {
  pagination: PaginationMeta;
} & {
  [K in TDataKey]: TItem[];
};

export type AuthResponse = {
  user: SafeUser;
  accessToken: string;
};

export type ValidationError = {
  path: string;
  message: string;
};

export type ApiErrorResponse = {
  message: string;
  errors?: ValidationError[];
};
