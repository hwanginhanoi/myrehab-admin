import { createFileRoute } from '@tanstack/react-router'
import { SettingsPermissions } from '@/features/settings/permissions'

export const Route = createFileRoute('/_authenticated/settings/permissions')({
  component: SettingsPermissions,
})
