import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'myrehab_access_token'
const USER_TYPE = 'myrehab_user_type'
const AUTH_USER = 'myrehab_auth_user'

export type UserType = 'SUPER_ADMIN' | 'ADMIN' | 'DOCTOR' | 'TRAINER'

interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
  userType?: UserType
}

/**
 * Reads a string cookie, stripping legacy JSON.stringify wrapping if present.
 * Previously cookies were stored with JSON.stringify (e.g. `"\"value\""`).
 */
function readStringCookie(name: string): string {
  const raw = getCookie(name)
  if (!raw) return ''
  // If the value starts and ends with `"`, it was JSON.stringify'd — unwrap it
  if (raw.startsWith('"') && raw.endsWith('"')) {
    try {
      return JSON.parse(raw) as string
    } catch {
      return raw
    }
  }
  return raw
}

interface AuthState {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  accessToken: string
  setAccessToken: (accessToken: string) => void
  userType: UserType | null
  setUserType: (userType: UserType | null) => void
  resetAccessToken: () => void
  reset: () => void
}

export const useAuthStore = create<AuthState>()((set) => {
  const initToken = readStringCookie(ACCESS_TOKEN)
  const initUserType = (readStringCookie(USER_TYPE) || null) as UserType | null
  const userCookie = getCookie(AUTH_USER)
  const initUser: AuthUser | null = userCookie ? JSON.parse(userCookie) : null

  return {
    user: initUser,
    setUser: (user) =>
      set(() => {
        if (user) {
          setCookie(AUTH_USER, JSON.stringify(user))
        } else {
          removeCookie(AUTH_USER)
        }
        return { user }
      }),
    accessToken: initToken,
    setAccessToken: (accessToken) =>
      set(() => {
        setCookie(ACCESS_TOKEN, accessToken)
        return { accessToken }
      }),
    userType: initUserType,
    setUserType: (userType) =>
      set(() => {
        if (userType) {
          setCookie(USER_TYPE, userType)
        } else {
          removeCookie(USER_TYPE)
        }
        return { userType }
      }),
    resetAccessToken: () =>
      set(() => {
        removeCookie(ACCESS_TOKEN)
        return { accessToken: '' }
      }),
    reset: () =>
      set(() => {
        removeCookie(ACCESS_TOKEN)
        removeCookie(USER_TYPE)
        removeCookie(AUTH_USER)
        return { user: null, accessToken: '', userType: null }
      }),
  }
})
