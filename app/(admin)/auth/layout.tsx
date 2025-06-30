import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication - MyRehab Admin",
  description: "Sign in to your MyRehab Admin account",
}

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {children}
    </div>
  )
}

export default AuthLayout 