import { useCallback, useEffect, useRef, useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { DataTablePagination } from '@/components/server-data-table'
import {
  type BannerResponse,
  useCreateBanner,
  useReorderBanners,
} from '@/api'
import { bannersColumns as columns } from './banners-columns'
import { BannersTableToolbar } from './banners-table-toolbar'
import { useBanners } from './banners-provider'
import { toast } from 'sonner'

const DRAFT_ID = -1

type DataTableProps = {
  data: BannerResponse[]
  search: Record<string, unknown>
  navigate: NavigateFn
  pageCount: number
}

function SortableTableRow({
  row,
  isDraft,
}: {
  row: ReturnType<
    ReturnType<typeof useReactTable<BannerResponse>>['getRowModel']
  >['rows'][number]
  isDraft?: boolean
}) {
  const bannerId = row.original.id
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: bannerId ?? row.index })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={row.getIsSelected() && 'selected'}
      className={cn(
        'group/row',
        isDragging && 'opacity-50',
        isDraft && 'border-dashed border-primary/50 bg-primary/5'
      )}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={cn(
            isDraft
              ? 'bg-primary/5 group-hover/row:bg-primary/10'
              : 'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
            cell.column.columnDef.meta?.className,
            cell.column.columnDef.meta?.tdClassName
          )}
          {...(cell.column.id === 'drag-handle'
            ? { ...attributes, ...listeners }
            : {})}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function BannersTable({
  data,
  search,
  navigate,
  pageCount,
}: DataTableProps) {
  'use no memo'
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [localData, setLocalData] = useState(data)
  const [isDirty, setIsDirty] = useState(false)

  const queryClient = useQueryClient()
  const createMutation = useCreateBanner()
  const reorderMutation = useReorderBanners()
  const { draftBanner, setDraftBanner } = useBanners()

  // Track previous data ref to detect server data changes
  const prevDataRef = useRef(data)

  // Sync local data when server data changes, but only if not dirty
  useEffect(() => {
    if (prevDataRef.current !== data) {
      prevDataRef.current = data
      if (!isDirty) {
        setLocalData(data)
      }
    }
  }, [data, isDirty])

  // When a draft banner is set from the dialog, append it to localData
  useEffect(() => {
    if (draftBanner) {
      const draftRow: BannerResponse = {
        id: DRAFT_ID,
        title: draftBanner.title,
        imageUrl: draftBanner.imageUrl,
        status: draftBanner.status as BannerResponse['status'],
      }
      setLocalData((prev) => {
        // Remove any existing draft first
        const withoutDraft = prev.filter((b) => b.id !== DRAFT_ID)
        return [...withoutDraft, draftRow]
      })
      setIsDirty(true)
    }
  }, [draftBanner])

  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [
      { columnId: 'title', searchKey: 'title', type: 'string' },
      { columnId: 'status', searchKey: 'status', type: 'string' },
    ],
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: localData,
    columns,
    pageCount,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
    manualPagination: true,
    manualFiltering: true,
    onPaginationChange,
    onColumnFiltersChange,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => String(row.id ?? ''),
  })

  useEffect(() => {
    ensurePageInRange(pageCount)
  }, [pageCount, ensurePageInRange])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const oldIndex = localData.findIndex((b) => b.id === active.id)
      const newIndex = localData.findIndex((b) => b.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return

      const newData = arrayMove(localData, oldIndex, newIndex)
      setLocalData(newData)
      setIsDirty(true)
    },
    [localData]
  )

  const handleCancel = useCallback(() => {
    setLocalData(data)
    setDraftBanner(null)
    setIsDirty(false)
  }, [data, setDraftBanner])

  const handleSave = useCallback(() => {
    const pageOffset = pagination.pageIndex * pagination.pageSize
    const hasDraft = localData.some((b) => b.id === DRAFT_ID)

    const saveDraft = () => {
      if (!draftBanner) return Promise.resolve(null)

      return new Promise<number | null>((resolve, reject) => {
        const draftIndex = localData.findIndex((b) => b.id === DRAFT_ID)
        createMutation.mutate(
          {
            data: {
              title: draftBanner.title,
              imageUrl: draftBanner.imageUrl,
              displayOrder: pageOffset + draftIndex,
              status: draftBanner.status as 'ACTIVE' | 'INACTIVE' | 'ARCHIVED',
            },
          },
          {
            onSuccess: (result) => {
              resolve(result?.id ?? null)
            },
            onError: (error) => {
              reject(error)
            },
          }
        )
      })
    }

    const doReorder = (newBannerId: number | null) => {
      // Build reorder payload, replacing DRAFT_ID with the real ID
      const existingBanners = localData.filter((b) => b.id !== DRAFT_ID)
      const reorderPayload = existingBanners.map((banner, idx) => {
        // Account for draft position in the ordering
        const draftIndex = localData.findIndex((b) => b.id === DRAFT_ID)
        const actualIdx =
          hasDraft && draftIndex !== -1 && idx >= draftIndex ? idx + 1 : idx
        return {
          id: banner.id!,
          displayOrder: pageOffset + actualIdx,
        }
      })

      // Add the new banner's order if it was created
      if (newBannerId !== null) {
        const draftIndex = localData.findIndex((b) => b.id === DRAFT_ID)
        if (draftIndex !== -1) {
          reorderPayload.push({
            id: newBannerId,
            displayOrder: pageOffset + draftIndex,
          })
        }
      }

      if (reorderPayload.length > 0) {
        reorderMutation.mutate(
          { data: reorderPayload },
          {
            onSuccess: () => {
              setIsDirty(false)
              setDraftBanner(null)
              queryClient.invalidateQueries({
                queryKey: [{ url: '/api/banners/all' }],
              })
              toast.success('Cập nhật thứ tự thành công')
            },
            onError: (error) => {
              toast.error('Sắp xếp lại thất bại: ' + error.message)
            },
          }
        )
      } else {
        setIsDirty(false)
        setDraftBanner(null)
        queryClient.invalidateQueries({
          queryKey: [{ url: '/api/banners/all' }],
        })
        toast.success('Cập nhật thứ tự thành công')
      }
    }

    if (hasDraft && draftBanner) {
      saveDraft()
        .then((newId) => doReorder(newId))
        .catch((error) => {
          toast.error(
            'Tạo banner thất bại: ' +
              (error instanceof Error ? error.message : 'Unknown error')
          )
        })
    } else {
      // No draft, just reorder existing banners
      const reorderPayload = localData.map((banner, index) => ({
        id: banner.id!,
        displayOrder: pageOffset + index,
      }))

      reorderMutation.mutate(
        { data: reorderPayload },
        {
          onSuccess: () => {
            setIsDirty(false)
            queryClient.invalidateQueries({
              queryKey: [{ url: '/api/banners/all' }],
            })
            toast.success('Cập nhật thứ tự thành công')
          },
          onError: (error) => {
            toast.error('Sắp xếp lại thất bại: ' + error.message)
          },
        }
      )
    }
  }, [
    localData,
    pagination,
    draftBanner,
    createMutation,
    reorderMutation,
    queryClient,
    setDraftBanner,
  ])

  const sortableIds = localData.map((b) => b.id ?? 0)
  const isSaving = createMutation.isPending || reorderMutation.isPending

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4'
      )}
    >
      <BannersTableToolbar table={table} />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group/row">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        header.column.columnDef.meta?.className,
                        header.column.columnDef.meta?.thClassName
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortableIds}
              strategy={verticalListSortingStrategy}
            >
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table
                    .getRowModel()
                    .rows.map((row) => (
                      <SortableTableRow
                        key={row.id}
                        row={row}
                        isDraft={row.original.id === DRAFT_ID}
                      />
                    ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Không có dữ liệu.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </SortableContext>
          </DndContext>
        </Table>
      </div>

      {isDirty && (
        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed inset-x-0 bottom-0 z-50 border-t p-4 backdrop-blur">
          <div className="mx-auto flex max-w-screen-xl items-center justify-end gap-2">
            <span className="me-auto text-sm text-muted-foreground">
              {draftBanner
                ? 'Banner mới đã được thêm. Sắp xếp vị trí và nhấn "Lưu thứ tự" để lưu.'
                : 'Thứ tự đã thay đổi'}
            </span>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Đang lưu...' : 'Lưu thứ tự'}
            </Button>
          </div>
        </div>
      )}

      <DataTablePagination table={table} className="mt-auto" />
    </div>
  )
}
