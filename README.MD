# CookNest Recipe Sahring Platform (Backend)

## Project Overview

This Recipe Sharing Community is a full-stack web application designed for cooking enthusiasts to discover, share, and organize recipes. The platform targets home cooks, culinary students, and passionate food lovers, allowing users to share their favorite recipes, interact with ingredient checklists, and manage cooking time estimates. It promotes culinary knowledge-sharing and social interaction through comments, ratings, following users, and upvoting/downvoting recipes.
Premium membership unlocks exclusive content, accessible through a subscription-based model, allowing users to access additional features and content.

## Features

- **User Authentication & Authorization:**:
  - User Registration
  - Login & JWT-Based Authentication
  - Role-based Access Control (Admin and User)
  - Secure Password Change
- **User Profile Management:**:
  - Profile Customization
  - Social Connectivity
  - Premium Membership Subscription
- **Recipe Management**:

  - My Recipes
  - Recipe Creation & Update
  - Recipe Deletion

- **Rating, Commenting & Upvote/Downvote System**:
  - Rate Recipes
  - Commenting
  - Upvote/Downvote System
- **Validation**:
  - Input validation using Zod
- **Recipe Feed**:
  - Recipe Display
  - Advanced Search & Filter
  - Infinite Scroll
- **User Management**:
  - Admins can block/unblock users, publish/unpublish recipe posts, manage user accounts, and perform CRUD operations on all recipes and admin accounts.

## Technology Stack

- **Programming Language**: TypeScript
- **Web Framework**: Express.js
- **ODM & Validation Library**: Mongoose for MongoDB
- **Validation Library**: Zod

## Setting Up and Using the Application

### Prerequisites

- Node.js (>=14.x)
- npm or yarn
- MongoDB

### Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/yasin-arafat-389/CookNest-Backend
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following variables:

   ```
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=your mongodb URI
   SALT_ROUND=JWT salt round
   JWT_ACESS_TOKEN_SECRET=your JWT access token secret
   ACCESS_TOKEN_EXPIRES_IN=1d
   JWT_REFRESH_TOKEN_SECRET=your token secret
   REFRESH_TOKEN_EXPIRES_IN=7d
   RESET_PASS_UI_LINK=your reset password ui link
   SMTP_HOST=your smtp host
   SMTP_PORT=your smtp port
   SMTP_USER=your smtp user name
   SMTP_PASS=your smtp password
   STORE_ID=aamarpay store id
   SIGNATURE_KEY=aamarpay signature key
   PAYMENT_URL=aamarpay payment url
   PAYMENT_VERIFICATION_URL=aamarpay payment verification url
   ```

4. **Run the application**:
   ```sh
   npm run start:dev
   ```

### Usage

Once the server is running, you can use the following endpoints:

### API Endpoints

1. **User login**

   - **Route**: `POST /api/v1/auth/login`

2. **Change password**

   - **Route**: `POST /api/v1/auth/change-password`

3. **Forgot Password**

   - **Route**: `POST /api/v1/auth/forgot-password`

4. **Create User**

   - **Route**: `POST /api/v1/users/create-user`

5. **Update User**

   - **Route**: `PUT /api/v1/users/update-user/:id`

6. **Follow User**

   - **Route**: `POST /api/v1/users/follow-user/:id`

7. **Unfollow User**

   - **Route**: `POST /api/v1/users/unfollow-user/:id`

8. **Get Single User**

   - **Route**: `GET /api/v1/users/get-single-user/:id`

9. **Get User Info**

   - **Route**: `GET /api/v1/users/get-user-info/:id`

10. **Become Premium Member**

    - **Route**: `POST /api/v1/users/become-premium-member`

11. **Payment Confirmation**

    - **Route**: `POST /api/v1/users/confirmation`

12. **Get All Users**

    - **Route**: `GET /api/v1/users/get-all-user`

13. **Block User**

    - **Route**: `POST /api/v1/users/block-user/:id`

14. **Unblock User**

    - **Route**: `POST /api/v1/users/unblock-user/:id`

15. **Delete User**

    - **Route**: `DELETE /api/v1/users/delete-user/:id`

16. **Create Admin**

    - **Route**: `POST /api/v1/users/create-admin`

17. **Get All Admins**

    - **Route**: `GET /api/v1/users/get-all-admin`

18. **Update Admin**

    - **Route**: `POST /api/v1/users/update-admin/:userId`

19. **Delete Admin**

    - **Route**: `DELETE /api/v1/users/delete-admin/:id`

20. **Create Recipe**

    - **Route**: `POST /api/v1/recipes/create-recipe`

21. **Upvote Recipe**

    - **Route**: `POST /api/v1/recipes/upvote-recipe/:recipeId`

22. **Downvote Recipe**

    - **Route**: `POST /api/v1/recipes/downvote-recipe/:recipeId`

23. **Rate Recipe**

    - **Route**: `POST /api/v1/recipes/rate-recipe/:recipeId`

24. **Comment Recipe**

    - **Route**: `POST /api/v1/recipes/comment-recipe/:recipeId`

25. **Update Comment on Recipe**

    - **Route**: `POST /api/v1/recipes/update-comment-recipe/:recipeId/:commentId`

26. **Delete Recipe**

    - **Route**: `DELETE /api/v1/recipes/delete-recipe/:recipeId`

27. **Get All Recipes**

    - **Route**: `GET /api/v1/recipes/get-all-recipe`

28. **Get Single Recipe**

    - **Route**: `GET /api/v1/recipes/get-single-recipe/:recipeId`

29. **Get All Recipes for Admin**

    - **Route**: `GET /api/v1/recipes/get-all-recipies-for-admin`

30. **Unpublish Recipe**

    - **Route**: `POST /api/v1/recipes/unpublish-recipe/:id`

31. **Publish Recipe**
    - **Route**: `POST /api/v1/recipes/publish-recipe/:id`
