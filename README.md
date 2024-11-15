# Next JS Appwrite Project Management App

## Overview

This project is built using Next.js and Appwrite. It includes user authentication and data management features. Managing Projects, Tasks and Comments with relationships and permissions

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository.
2. Install the dependencies using `npm install`.
3. Set up your environment variables as described in the `.env.example` file.
4. Create the required database collections and attributes in your Appwrite project.

## Required Database Collections and Attributes

### Users Collection

The `users` collection is used to store user information. It should have the following attributes:

- `id` (string): The unique identifier for the user.
- `name` (string): The name of the user.
- `email` (string): The email address of the user.
- `createdAt` (date): The date and time when the user was created.

### Projects Collection

The `projects` collection is used to store project information. It should have the following attributes:

- `$id` (string, system-generated): The unique identifier for the project.
- `$collectionId` (string, system-generated): The collection ID.
- `$databaseId` (string, system-generated): The database ID.
- `$createdAt` (string, system-generated): The date and time when the project was created.
- `$updatedAt` (string, system-generated): The date and time when the project was last updated.
- `$permissions` (string[], system-generated): The permissions associated with the project.
- `name` (string): The name of the project.
- `description` (string): The description of the project.
- `tasks` (Task[]): An array of tasks associated with the project.

### Tasks Collection

The `tasks` collection is used to store task information. It should have the following attributes:

- `$id` (string, system-generated): The unique identifier for the task.
- `$collectionId` (string, system-generated): The collection ID.
- `$databaseId` (string, system-generated): The database ID.
- `$createdAt` (string, system-generated): The date and time when the task was created.
- `$updatedAt` (string, system-generated): The date and time when the task was last updated.
- `$permissions` (string[], system-generated): The permissions associated with the task.
- `name` (string): The name of the task.
- `description` (string): The description of the task.
- `status` (string): The status of the task.
- `projects` (string): The ID of the project this task is associated with.

### Comments Collection

The `comments` collection is used to store comments on tasks. It should have the following attributes:

- `$id` (string, system-generated): The unique identifier for the comment.
- `$collectionId` (string, system-generated): The collection ID.
- `$databaseId` (string, system-generated): The database ID.
- `$createdAt` (string, system-generated): The date and time when the comment was created.
- `$updatedAt` (string, system-generated): The date and time when the comment was last updated.
- `$permissions` (string[], system-generated): The permissions associated with the comment.
- `comment_text` (string): The text of the comment.
- `author_id` (string): The ID of the author of the comment.
- `author_name` (string): The name of the author of the comment.
- `tasks` (string): The ID of the task this comment is associated with.

## Setting Up Appwrite

1. Sign up for an Appwrite account and create a new project.
2. Create the required database collections and attributes as described above.
3. Set up your environment variables with the Appwrite project details:
   - `NEXT_PUBLIC_APPWRITE_ENDPOINT`: The endpoint URL of your Appwrite server.
   - `NEXT_PUBLIC_APPWRITE_PROJECT_ID`: The project ID of your Appwrite project.
   - `APPWRITE_API_KEY`: The API key for your Appwrite project (for admin operations).
   - `NEXT_APPWRITE_COOKIE_NAME`: The name of the cookie used for session management.

## Running the Project

To run the project locally, use the following command:

```bash
npm run dev