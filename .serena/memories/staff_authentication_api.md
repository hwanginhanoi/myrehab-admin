# Staff Authentication API Implementation

## Purpose
This admin dashboard is exclusively for **staff members only** (Doctors and Admins). No patient/user access.

## Staff Login API

### Endpoint
- **URL**: `POST /api/auth/staff/login`
- **Purpose**: Authentication for doctors and administrators
- **Generated Client**: `staffLogin` from `@/api/api/authenticationController`

### Request Format
```json
{
  "email": "string", // required - staff email address
  "password": "string" // required - staff password
}
```

### Response Format
```json
{
  "token": "string", // JWT token for authentication
  "email": "string", // Staff email
  "role": "DOCTOR" | "ADMIN", // Staff role (no USER role for this admin dashboard)
  "firstName": "string", // Optional staff first name
  "lastName": "string" // Optional staff last name
}
```

## Frontend Implementation

### User Interface (Staff Only)
```typescript
interface User {
  id: string;
  email: string;
  role: 'DOCTOR' | 'ADMIN'; // Only staff roles
  firstName?: string;
  lastName?: string;
}
```

### Login Form Features
- **Title**: "Staff Login" 
- **Description**: "Enter your credentials to access the admin dashboard"
- **Access Message**: "Need access? Contact your administrator"
- **Validation**: Email format and required password
- **Error Handling**: Proper error messages for invalid credentials

### Security Features
- JWT token stored in localStorage and cookies
- 7-day token expiration
- Auth guard protection for all dashboard routes
- Automatic redirect to login for unauthenticated access

## Note
The API also includes user OTP endpoints (`/api/auth/user/send-otp`, `/api/auth/user/verify-otp`) but these are **not used** in this admin dashboard as it's staff-only.