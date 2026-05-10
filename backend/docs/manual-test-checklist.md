# OdinBook Backend Manual Test Checklist

This checklist verifies the backend MVP API before frontend integration.

## Test Users

Use at least four users:

A. User A — current primary test user  
B. User B — user to follow  
C. User C — unrelated user  
D. User D — user for rejection/unfollow edge cases

Save each user's:

- `id`
- `email`
- `username`
- `accessToken`

---

## 1. Health Checks

### 1.1 API health

Request:

```txt
GET /api/health
```

Expected:

```txt
200
```

Expected body includes:

```json
{
  "status": "ok"
}
```

### 1.2 Database health

Request:

```txt
GET /api/health/db
```

Expected:

```txt
200
```

---

## 2. Auth Flow

### 2.1 Register User A

Request:

```txt
POST /api/auth/register
```

Body:

```json
{
  "email": "usera@example.com",
  "username": "usera",
  "password": "password123",
  "confirmPassword": "password123",
  "firstName": "User",
  "lastName": "A"
}
```

Expected:

```txt
201
```

Verify:

- Response includes `user`
- Response includes `accessToken`
- Response does not include `passwordHash`

### 2.2 Register duplicate email

Request:

```txt
POST /api/auth/register
```

Use the same email as User A.

Expected:

```txt
409
```

### 2.3 Login User A

Request:

```txt
POST /api/auth/login
```

Body:

```json
{
  "identifier": "usera",
  "password": "password123"
}
```

Expected:

```txt
200
```

Verify:

- Response includes `user`
- Response includes `accessToken`

### 2.4 Invalid login

Request:

```txt
POST /api/auth/login
```

Body:

```json
{
  "identifier": "usera",
  "password": "wrongpassword"
}
```

Expected:

```txt
401
```

Verify:

- Error message does not reveal whether username or password was wrong

### 2.5 Get current user

Request:

```txt
GET /api/auth/me
Authorization: Bearer <user-a-token>
```

Expected:

```txt
200
```

Verify:

- Response includes User A
- Response does not include `passwordHash`

### 2.6 Missing token

Request:

```txt
GET /api/auth/me
```

Expected:

```txt
401
```

---

## 3. Users and Profiles

### 3.1 Get users list

Request:

```txt
GET /api/users
Authorization: Bearer <user-a-token>
```

Expected:

```txt
200
```

Verify:

- Response includes `users`
- Response includes `pagination`
- User A has `relationshipStatus: "SELF"`
- No user includes `passwordHash`

### 3.2 Get users list with pagination

Request:

```txt
GET /api/users?page=1&limit=2
Authorization: Bearer <user-a-token>
```

Expected:

```txt
200
```

Verify:

- `pagination.page` is `1`
- `pagination.limit` is `2`

### 3.3 Invalid users pagination

Request:

```txt
GET /api/users?limit=100
Authorization: Bearer <user-a-token>
```

Expected:

```txt
400
```

### 3.4 Get single user profile

Request:

```txt
GET /api/users/<user-b-id>
Authorization: Bearer <user-a-token>
```

Expected:

```txt
200
```

Verify:

- Response includes `relationshipStatus`
- Response does not include `passwordHash`

### 3.5 Invalid user ID

Request:

```txt
GET /api/users/not-a-valid-uuid
Authorization: Bearer <user-a-token>
```

Expected:

```txt
400
```

### 3.6 Missing user

Request:

```txt
GET /api/users/<valid-missing-uuid>
Authorization: Bearer <user-a-token>
```

Expected:

```txt
404
```

### 3.7 Update current user profile

Request:

```txt
PATCH /api/users/me
Authorization: Bearer <user-a-token>
```

Body:

```json
{
  "firstName": "Updated",
  "lastName": "User",
  "bio": "Testing OdinBook backend",
  "profileImageUrl": "https://example.com/avatar.png"
}
```

Expected:

```txt
200
```

Verify:

- Updated fields are returned
- `passwordHash` is not returned

### 3.8 Reject unknown profile fields

Request:

```txt
PATCH /api/users/me
Authorization: Bearer <user-a-token>
```

Body:

```json
{
  "passwordHash": "should-not-work"
}
```

Expected:

```txt
400
```

---

## 4. Posts

### 4.1 Create post as User A

Request:

```txt
POST /api/posts
Authorization: Bearer <user-a-token>
```

Body:

```json
{
  "content": "User A first post"
}
```

Expected:

```txt
201
```

Save:

- `userAPostId`

Verify:

- Author is User A
- Response includes `likeCount`
- Response includes `commentCount`

### 4.2 Reject empty post

Request:

```txt
POST /api/posts
Authorization: Bearer <user-a-token>
```

Body:

```json
{
  "content": ""
}
```

Expected:

```txt
400
```

### 4.3 Get post by ID

Request:

```txt
GET /api/posts/<user-a-post-id>
Authorization: Bearer <user-a-token>
```

Expected:

```txt
200
```

### 4.4 Update own post

Request:

```txt
PATCH /api/posts/<user-a-post-id>
Authorization: Bearer <user-a-token>
```

Body:

```json
{
  "content": "Updated User A post"
}
```

Expected:

```txt
200
```

### 4.5 Delete own post

Request:

```txt
DELETE /api/posts/<user-a-post-id>
Authorization: Bearer <user-a-token>
```

Expected:

```txt
200
```

---

## 5. Profile Posts

### 5.1 Get posts by user

Request:

```txt
GET /api/users/<user-b-id>/posts
Authorization: Bearer <user-a-token>
```

Expected:

```txt
200
```

Verify:

- Response includes `posts`
- Response includes `pagination`
- Every post author is User B

### 5.2 Get posts by user with pagination

Request:

```txt
GET /api/users/<user-b-id>/posts?page=1&limit=5
Authorization: Bearer <user-a-token>
```

Expected:

```txt
200
```

### 5.3 Invalid profile posts pagination

Request:

```txt
GET /api/users/<user-b-id>/posts?page=0
Authorization: Bearer <user-a-token>
```

Expected:

```txt
400
```

---

## 6. Likes

### 6.1 Like post

Request:

```txt
POST /api/posts/<user-b-post-id>/likes
Authorization: Bearer <user-a-token>
```

Expected:

```txt
200 or 201
```

Verify:

- Response includes updated `likeCount`

### 6.2 Duplicate like

Repeat the same request.

Expected:

```txt
409
```

### 6.3 Unlike post

Request:

```txt
DELETE /api/posts/<user-b-post-id>/likes
Authorization: Bearer <user-a-token>
```

Expected:

```txt
200
```

Verify:

- Response includes updated `likeCount`

### 6.4 Unlike when not liked

Repeat unlike request.

Expected:

```txt
404
```

---

## 7. Comments

### 7.1 Create comment

Request:

```txt
POST /api/posts/<user-b-post-id>/comments
Authorization: Bearer <user-a-token>
```

Body:

```json
{
  "content": "Nice post!"
}
```

Expected:

```txt
201
```

Save:

- `commentId`

### 7.2 Get comments for post

Request:

```txt
GET /api/posts/<user-b-post-id>/comments
Authorization: Bearer <user-a-token>
```

Expected:

```txt
200
```

Verify:

- Response includes `comments`
- Response includes `pagination`
- Comments are ordered oldest-first

### 7.3 Get comments with pagination

Request:

```txt
GET /api/posts/<user-b-post-id>/comments?page=1&limit=5
Authorization: Bearer <user-a-token>
```

Expected:

```txt
200
```

### 7.4 Update own comment

Request:

```txt
PATCH /api/comments/<comment-id>
Authorization: Bearer <user-a-token>
```

Body:

```json
{
  "content": "Updated comment"
}
```

Expected:

```txt
200
```

### 7.5 Delete own comment

Request:

```txt
DELETE /api/comments/<comment-id>
Authorization: Bearer <user-a-token>
```

Expected:

```txt
200
```

---

## 8. Follow Requests

### 8.1 Send follow request

Request:

```txt
POST /api/follow-requests/<user-b-id>
Authorization: Bearer <user-a-token>
```

Expected:

```txt
201
```

Save:

- `followRequestId`

Verify:

- `senderId` is User A
- `receiverId` is User B
- `status` is `PENDING`

### 8.2 Duplicate pending follow request

Repeat the same request.

Expected:

```txt
409
```

### 8.3 Cannot request self

Request:

```txt
POST /api/follow-requests/<user-a-id>
Authorization: Bearer <user-a-token>
```

Expected:

```txt
400
```

### 8.4 Incoming requests as User B

Request:

```txt
GET /api/follow-requests/incoming
Authorization: Bearer <user-b-token>
```

Expected:

```txt
200
```

Verify:

- Request from User A appears

### 8.5 Outgoing requests as User A

Request:

```txt
GET /api/follow-requests/outgoing
Authorization: Bearer <user-a-token>
```

Expected:

```txt
200
```

Verify:

- Request to User B appears

### 8.6 Wrong user cannot accept

Request:

```txt
PATCH /api/follow-requests/<follow-request-id>/accept
Authorization: Bearer <user-c-token>
```

Expected:

```txt
403
```

### 8.7 Receiver accepts request

Request:

```txt
PATCH /api/follow-requests/<follow-request-id>/accept
Authorization: Bearer <user-b-token>
```

Expected:

```txt
200
```

Verify:

- Follow request status becomes `ACCEPTED`
- Follow relationship is created

### 8.8 Already handled request

Repeat accept request.

Expected:

```txt
409
```

---

## 9. Follows

### 9.1 Get followers

Request:

```txt
GET /api/follows/followers/<user-b-id>
Authorization: Bearer <user-a-token>
```

Expected:

```txt
200
```

Verify:

- User A appears in User B followers
- Response includes `pagination`

### 9.2 Get following

Request:

```txt
GET /api/follows/following/<user-a-id>
Authorization: Bearer <user-a-token>
```

Expected:

```txt
200
```

Verify:

- User B appears in User A following
- Response includes `pagination`

### 9.3 Unfollow user

Request:

```txt
DELETE /api/follows/<user-b-id>
Authorization: Bearer <user-a-token>
```

Expected:

```txt
200
```

Verify:

- User A no longer follows User B

### 9.4 Unfollow when not following

Repeat unfollow request.

Expected:

```txt
404
```

---

## 10. Feed

### 10.1 Create posts for feed test

Create:

- A post by User A
- A post by User B
- A post by User C

Make User A follow User B.

Make sure User A does not follow User C.

### 10.2 Get feed as User A

Request:

```txt
GET /api/posts/feed
Authorization: Bearer <user-a-token>
```

Expected:

```txt
200
```

Verify:

- User A posts appear
- User B posts appear
- User C posts do not appear
- Response includes `pagination`

### 10.3 Feed pagination

Request:

```txt
GET /api/posts/feed?page=1&limit=5
Authorization: Bearer <user-a-token>
```

Expected:

```txt
200
```

### 10.4 Feed after unfollow

After User A unfollows User B:

```txt
GET /api/posts/feed
Authorization: Bearer <user-a-token>
```

Expected:

- User A posts appear
- User B posts no longer appear
- User C posts do not appear

---

## 11. Security Checks

Verify across all responses:

- No response includes `passwordHash`
- No route accepts ownership IDs from body, such as `authorId`, `senderId`, `receiverId`, or `userId`
- Invalid UUID params return `400`
- Missing resources return `404`
- Wrong-owner modification attempts return `403`
- Duplicate/conflict actions return `409`
- Missing auth token returns `401`

---

## 12. Pagination Checks

For all paginated routes:

```txt
GET /api/posts/feed
GET /api/users
GET /api/users/:userId/posts
GET /api/posts/:postId/comments
GET /api/follows/followers/:userId
GET /api/follows/following/:userId
```

Verify:

- Default `page` is `1`
- Default `limit` is `10`
- `limit=100` returns `400`
- `page=0` returns `400`
- Unknown query params return `400`
- Response includes `pagination`
- Response pagination includes:
  - `page`
  - `limit`
  - `totalCount`
  - `totalPages`
  - `hasNextPage`
  - `hasPreviousPage`
