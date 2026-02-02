import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  ListTodo,
  FileX,
  HelpCircle,
  Lock,
  Bell,
  Package,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  Users,
  MessagesSquare,
  ShieldCheck,
  FolderTree,
  Layers,
  Dumbbell,
  Newspaper,
  ClipboardList,
  Image,
} from 'lucide-react'
import { Logo } from '@/assets/logo'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin',
    email: 'admin@myrehab.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'MyRehab Admin',
      logo: Logo,
      plan: 'Quản trị hệ thống',
    },
  ],
  navGroups: [
    {
      title: 'Quản trị hệ thống',
      items: [
        {
          title: 'Trang chủ',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Tin tức',
          url: '/news',
          icon: Newspaper,
          requiredPermission: 'news:view',
        },
        {
          title: 'Banner',
          url: '/banners',
          icon: Image,
        },
        {
          title: 'Kho bài tập',
          url: '/exercise-groups',
          icon: Layers,
          requiredPermission: 'exercise_groups:view',
        },
      ],
    },
    {
      title: 'Quản trị nội dung',
      items: [
        {
          title: 'Danh mục bài tập',
          url: '/exercise-categories',
          icon: FolderTree,
          requiredPermission: 'categories:view',
        },
        {
          title: 'Bài tập',
          url: '/exercises',
          icon: Dumbbell,
          requiredPermission: 'exercises:view',
        },
        {
          title: 'Gói bài tập',
          url: '/exercise-packages',
          icon: Package,
          requiredPermission: 'packages:view',
        },
        {
          title: 'Phiếu khám',
          url: '/rehabilitation-forms',
          icon: ClipboardList,
          requiredPermission: 'rehab_forms:view',
        },
      ]
    },
    {
      title: 'Quản trị người dùng',
      items: [
        {
          title: 'Staff',
          url: '/staff',
          icon: UserCog,
          requiredPermission: 'staff:view',
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
          requiredPermission: 'users:view',
        },
      ]
    },
    {
      title: 'Hệ thống',
      items: [
        {
          title: 'Tasks',
          url: '/tasks',
          icon: ListTodo,
        },
        {
          title: 'Apps',
          url: '/apps',
          icon: Package,
        },
        {
          title: 'Chats',
          url: '/chats',
          badge: '3',
          icon: MessagesSquare,
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: ShieldCheck,
          items: [
            {
              title: 'Login',
              url: '/login',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: Bug,
          items: [
            {
              title: 'Unauthorized',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'Forbidden',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'Not Found',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
