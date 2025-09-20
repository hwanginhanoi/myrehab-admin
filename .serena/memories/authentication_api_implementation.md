# Authentication API Implementation

## API Endpoints

### Staff Login (Admin/Doctor)
- **Endpoint**: `POST /api/auth/staff/login`
- **Purpose**: Login for doctors and admins using email and password
- **Request Body**: `LoginRequest`
  ```json
  {
    "email": "string", // required
    "password": "string" // required
  }
  ```
- **Response**: `AuthResponse`
  ```json
  {
    "token": "string",
    "email": "string", 
    "role": "USER" | "DOCTOR" | "ADMIN",
    "firstName": "string",
    "lastName": "string"
  }
  ```

### User OTP Login (Patients)
- **Send OTP**: `POST /api/auth/user/send-otp`
  - Request: `OtpLoginRequest` with phone number
  - Response: Success message
- **Verify OTP**: `POST /api/auth/user/verify-otp`
  - Request: `OtpVerificationRequest` with phone number and OTP code
  - Response: `AuthResponse`

## Frontend Implementation

### Authentication Context
- **File**: `contexts/auth-context.tsx`
- **User Interface**: Extended with role, firstName, lastName
- **Storage**: JWT token + user data in localStorage and cookies
- **Cookie**: `authToken` set for 7 days for middleware access

### Login Form
- **File**: `components/login-form.tsx`
- **API Client**: Uses `staffLogin` from `@/api/api/authenticationController`
- **Validation**: Zod schema with email and password validation
- **Error Handling**: Proper error messages for failed login attempts
- **User Data**: Maps API response to user context with role and profile info

### Auth Guard
- **File**: `components/auth-guard.tsx`
- **Purpose**: Protects admin dashboard routes
- **Functionality**: Redirects unauthenticated users to `/auth/login`

## Implementation Details
- Admin and Doctor staff use email/password authentication
- Patients (users) use OTP-based phone authentication
- JWT tokens stored in localStorage and cookies for persistence
- User roles determine dashboard access and permissions
- Full user profile data (name, email, role) stored in context