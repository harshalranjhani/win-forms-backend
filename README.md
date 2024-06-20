# Slidely Windows Forms App Backend

This project is an Express server written in TypeScript with endpoints for handling form submissions and retrieving them from a JSON file. It is designed to be deployed on Vercel as well as to run locally.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (version 6 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/harshalranjhani/win-forms-backend.git
   cd win-forms-backend
   ```

2. Install the dependencies:

    ```bash
    npm install
    ```

### Running Locally

Start the server:

   ```
      node index.ts
   ```

The server will run on http://localhost:8080.

## Routes

1. **GET `/`**

- Description: Root endpoint to check if the server is running.
- Response: "Slidely Forms App Backend!"

2. **GET `/ping`**

- Description: Health check endpoint.
- Response: { "success": true }

3. **POST `/submit`**

- Description: Submits a form with the following parameters: name, email, phone, github_link, stopwatch_time.
- This endpoint is to be run locally since it makes use of the `db.json` file and Vercel does not support file system access.
- An email with all the form responses will be sent to the email address provided in the form.
- Request Body:
    ```json
    {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "github_link": "https://github.com/johndoe",
    "stopwatch_time": "00:05:23"
    }
    ```
- Response:
    ```json
    {
    "success": true,
    "data": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "github_link": "https://github.com/johndoe",
        "stopwatch_time": "00:05:23"
        }
    }
    ```

4. **POST `/submit-vercel`**

- Description: Submits a form with the following parameters: name, email, phone, github_link, stopwatch_time.
- This endpoint is to be run on Vercel since it makes use of Vercel's environment variables.
- An email with all the form responses will be sent to the email address provided in the form.
- Request and Response are the same as `/submit`.

4. **GET `/read`**

- Description: Retrieves a form submission based on the index provided as a query parameter.
- Query Parameter: index (0-indexed)
- Response:
    ```json
    {
    "success": true,
    "data": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "github_link": "https://github.com/johndoe",
        "stopwatch_time": "00:05:23"
        }
    }
    ```
    or

    ```json    
    {
        "error": "Submission not found"
    }
    ```

5. **GET `/read-vercel`**

- Description: Retrieves a form submission based on the index provided as a query parameter.
- Query Parameter: index (0-indexed)
- Response is the same as `/read`.

6. **PUT `/edit/:index`**

- Description: Edits a form submission based on the index provided as a route parameter.
- Route Parameter: index (0-indexed)
- Request Body:
    ```json
    {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "github_link": "https://github.com/johndoe",
    "stopwatch_time": "00:05:23"
    }
    ```
- Response:
    ```json
    {
     "success": true,
    "message": "Submission updated"
    }
    ```

    or

    ```json
    {
     "error": "Submission not found"
    }
    ```

7. **PUT `/edit-vercel/:index`**

- Description: Edits a form submission based on the index provided as a route parameter.
- Route Parameter: index (0-indexed)
- Request and Response are the same as `/edit/:index`.

8. **DELETE `/delete/:index`**

- Description: Deletes a form submission based on the index provided as a route parameter.
- Route Parameter: index (0-indexed)
- Response:
    ```json
    {
     "success": true,
    "message": "Submission deleted"
    }
    ```
    or

    ```json
    {
     "error": "Submission not found"
    }
    ```

9. **DELETE `/delete-vercel/:index`**

- Description: Deletes a form submission based on the index provided as a route parameter.
- Route Parameter: index (0-indexed)
- Response is the same as `/delete/:index`.

10. **GET `/search`**

- Description: Searches for a form submission based on the email provided as a query parameter.
- Query Parameter: email
- Response:
- Response:
    ```json
    {
    "success": true,
    "data": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "github_link": "https://github.com/johndoe",
        "stopwatch_time": "00:05:23"
        }
    }
    ```

    or

    ```json
    {
    "success": true,
    "data": []
    }
    ```

11. **GET `/search-vercel`**

- Description: Searches for a form submission based on the email provided as a query parameter.
- Query Parameter: email
- Response is the same as `/search`.

Differences between Local and Vercel Routes
Local Routes: When running locally, the base URL is http://localhost:8080. All routes should be accessed using this base URL. For example, http://localhost:8080/ping.

Vercel Routes: When deployed on Vercel, the base URL will be your Vercel project's domain, such as https://winforms.harshalranjhani.in. All routes should be accessed using this base URL. For example, https://winforms.harshalranjhani.in/ping.

Thank you for reading! 🚀
