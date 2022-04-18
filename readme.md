# Authentication Api with nodejs

User Authentication api made with nodejs and express framework. Has features like token based user validation and resetting password.

## Run Locally

Clone the project

```bash
  git clone https://github.com/samip779/authentication-system.git
```

Go to the project directory

```bash
  cd authentication-system
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`JWT_SECRET`

Mail trap is used for fake email testing for development phase of the api. You can signup and us it
[HERE](https://mailtrap.io).
You will get followings credentials after signing up which should be kept in your .env file.

```
MAILTRAP_USERNAME
MAILTRAP_PASSWORD
MAILTRAP_HOST
MAILTRAP_PORT
```

## API Reference

#### create new user

```http
POST /api/user/create
```

#### SignIn

```http
POST /api/user/signin
```

#### Verify Email

```http
POST /api/user/verify-email
```
