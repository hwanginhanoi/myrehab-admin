import { useGetMyProfile } from '@/api/hooks/Staff ManagementHooks/useGetMyProfile'
import { getPermissionCategoriesByStaffType } from '@/features/staff/data/permissions'
import { Separator } from '@/components/ui/separator'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronDown, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'

export function SettingsPermissions() {
  const { data, isPending } = useGetMyProfile()

  const ownedPermissions = useMemo(
    () => new Set(data?.permissions ?? []),
    [data?.permissions]
  )

  const categories = useMemo(
    () => getPermissionCategoriesByStaffType(data?.staffType ?? ''),
    [data?.staffType]
  )

  // Only keep categories that have at least one owned permission
  const visibleCategories = useMemo(
    () =>
      categories
        .map((cat) => ({
          ...cat,
          permissions: cat.permissions.filter((p) => ownedPermissions.has(p.id)),
        }))
        .filter((cat) => cat.permissions.length > 0),
    [categories, ownedPermissions]
  )

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-none">
        <h3 className="text-lg font-medium">Quyền hạn</h3>
        <p className="text-muted-foreground text-sm">
          Xem quyền truy cập và thao tác của bạn trong hệ thống.
        </p>
      </div>
      <Separator className="my-4 flex-none" />
      <div className="h-full w-full overflow-y-auto scroll-smooth pb-12">
        {isPending ? (
          <p className="text-sm text-muted-foreground">Đang tải quyền hạn…</p>
        ) : !data ? (
          <p className="text-sm text-muted-foreground">
            Không thể tải thông tin quyền hạn.
          </p>
        ) : visibleCategories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Bạn chưa được cấp quyền nào.
          </p>
        ) : (
          <div className="rounded-lg border">
            {visibleCategories.map((category, index) => (
              <Collapsible key={category.id} defaultOpen>
                <CollapsibleTrigger
                  className={cn(
                    'flex w-full items-center gap-2 px-4 py-3 text-left group',
                    index !== 0 && 'border-t'
                  )}
                >
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {category.title}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {category.permissions.length}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {category.description}
                    </p>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="border-t bg-muted/30 px-4 py-4">
                    <div className="space-y-1">
                      {category.permissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center gap-2 rounded-md px-3 py-2 bg-primary/5"
                        >
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-sm">{permission.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
