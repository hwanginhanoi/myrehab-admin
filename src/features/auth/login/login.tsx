import { cn } from '@/lib/utils'
import loginImage from './assets/login-image.webp'
import logoMyRehab from './assets/logo-myrehab.webp'
import { UserAuthForm } from './components/user-auth-form'

export function Login() {
  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
          <div className='mb-4 flex items-center justify-center'>
            <img src={logoMyRehab} alt='MyRehab Matsuoka' className='h-16' />
          </div>
        </div>
        <div className='mx-auto flex w-full max-w-sm flex-col justify-center space-y-2'>
          <div className='flex flex-col space-y-2 text-start'>
            <h2 className='text-lg font-semibold tracking-tight'>Đăng Nhập</h2>
            <p className='text-muted-foreground text-sm'>
              Đăng nhập vào tài khoản quản trị của bạn
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>

      <div
        className={cn(
          'bg-muted relative h-full overflow-hidden max-lg:hidden flex items-center justify-center',
          '[&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>img]:select-none'
        )}
      >
      <img
          src={loginImage}
          className='dark:hidden h-full w-full'
          width={1024}
          height={1151}
          alt='MyRehab Matsuoka'
        />
        <img
          src={loginImage}
          className='hidden dark:block'
          width={1024}
          height={1138}
          alt='MyRehab Matsuoka'
        />
      </div>
    </div>
  )
}
