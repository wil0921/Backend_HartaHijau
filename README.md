# Documentation for backend harta hijau app

## Auth Register (under development / not tested yet)

- Endpoint: `POST` `api/v1/auth/register`

- Example Request Body:

```
{
    "phoneNumber": 081234567890,
    "username": "John Doe",
    "password": "test_123"
}
```

- Response Body Success:

```

```

## Auth Login (under development / not tested yet)

- Endpoint: `GET` `api/v1/auth/login`

- Example Request Body:

```
{
    "phoneNumber": 081234567890,
    "password": "test_123"
}
```

- Response Body Success:

```
{
    status: true,
    message: "Berhasil login",
    token
}
```

## Auth Forgot Password (under development / not tested yet)

- Endpoint: `GET` `api/v1/auth/forgotpassword`

- Example Request Body:

```
{
    "phoneNumber": 081234567890,
    "password": "new_password_123"
}
```

- Response Body Success:

```
{
    status: true,
    message: "Password berhasil diperbarui",
    updatedUser,
}
```

# To Do List:
- Fix twilio
- fix database configuration
- continue writing API docs
- testing auth handler