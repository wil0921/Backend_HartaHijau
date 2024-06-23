# Documentation for backend harta hijau app

## How to use
[1] clone this repository
```
git clone [this repo url.git]
```
[2] install the necessary package
```
npm install
```
[3] run the server
```
npm run start
```

### Example Request
Demo Request Auth API

#### [1] create new session in local wa gateway API
- Endpoint: `GET` `/wa/api/v1/start-session`

If you don't have a session yet, you will see a QR code appear on the screen. Scan the qrcode using your WhatsApp account

#### [2] Auth Register
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
{
    status: true,
    message: "Pengguna berhasil mendaftar. Silahkan melakukan verifikasi.",
    user
}
```
#### [3] Auth sendOTPVerification
- Endpoint: `POST` `api/v1/auth/otp/send`

- Example Request Body:

```
{
    "phoneNumber": 081234567890
}
```

- Response Body Success:

```
{
    status: true,
    message: "kode otp telah berhasil dikirim ke nomor 081234567890. Silahkan melakukan verifikasi otp"
}
```
#### [4] Auth verifyOTP
- Endpoint: `POST` `api/v1/auth/otp/verify`

- Example Request Body:

```
{
    "userId": "jay2837-28de3ygf-nsj374ss",
    "otp": "1234"
}
```

- Response Body Success:

```
{
    status: true,
    message: "Pengguna berhasil terverifikasi",
    token,
}
```
#### [5] Auth Login
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
# Other API (still under develpment)

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

- add redis for otp record
- add time limit on qr scan feature
- add transaction_history feature
- fix logic for creating user profile
- add news and products tabel databases
- add news and products models
- add news and products controllers
- add news and products routes
- improve database searching using indexes
- upgrade API docs
