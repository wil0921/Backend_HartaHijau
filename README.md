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

## Transaction generate QR Code (under development / not tested yet)

- Endpoint: `POST` `/api/v1/transactions/generate-qrcode`

- Example Request Body:

```
{
    "phoneNumber": 081234567890,
    "username": "John Doe"
}
```

- Response Body Success:

```
{
    status: true,
    message: "Berhasil membuat kode QR",
    qr_code_url: result.secure_url,
}
```

## Transaction transfer balance (under development / not tested yet)

- Endpoint: `POST` `/api/v1/transactions/send`

- Example Request Body:

```
{
    sender: 081234567890,
    receiver: 080987654321,
    amount: 50
}
```

- Response Body Success:

```
{
    status: true,
    message: 'Berhasil mengirim 50 poin ke pengguna dengan nomor 080987654321',
}
```

# To Do List:

- Fix twilio
- fix database configuration
- continue writing API docs
- testing auth handler
