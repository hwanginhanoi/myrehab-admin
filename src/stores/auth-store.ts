import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'myrehab_access_token'
const USER_TYPE = 'myrehab_user_type'
const AUTH_USER = 'myrehab_auth_user'

export type UserType = 'SUPER_ADMIN' | 'ADMIN' | 'DOCTOR' | 'TRAINER' | string

interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
  userType?: UserType
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    userType: UserType | null
    setUserType: (userType: UserType | null) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN)
  const initToken = cookieState ? JSON.parse(cookieState) : ''
  const userTypeState = getCookie(USER_TYPE)
  const initUserType = userTypeState ? JSON.parse(userTypeState) : null
  const userState = getCookie(AUTH_USER)
  const initUser: AuthUser | null = userState ? JSON.parse(userState) : null
  return {
    auth: {
      user: initUser,
      setUser: (user) =>
        set((state) => {
          if (user) {
            setCookie(AUTH_USER, JSON.stringify(user))
          } else {
            removeCookie(AUTH_USER)
          }
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      userType: initUserType,
      setUserType: (userType) =>
        set((state) => {
          if (userType) {
            setCookie(USER_TYPE, JSON.stringify(userType))
          } else {
            removeCookie(USER_TYPE)
          }
          return { ...state, auth: { ...state.auth, userType } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(USER_TYPE)
          removeCookie(AUTH_USER)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '', userType: null },
          }
        }),
    },
  }
})
