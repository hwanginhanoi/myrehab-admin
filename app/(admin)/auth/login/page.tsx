import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center px-6 bg-white">
        <div className="w-[320px] flex flex-col items-center gap-8">
          {/* Logo */}
          <div className="w-[238px] h-[67.75px] relative">
            <Image
              src="/myrehab-logo-26d68c.png"
              alt="MyRehab Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Login Form */}
          <LoginForm />
        </div>
      </div>

      {/* Right side - Background image */}
      <div className="w-[756px] hidden lg:block relative">
        <Image
          src="/login.png"
          alt="MyRehab Clinic"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}
