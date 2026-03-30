import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetRevenue } from '@/api'
import { ChartTooltip } from '../../components/chart-tooltip'
import {
  formatVND,
  formatPercent,
  SUBSCRIPTION_TYPE_LABELS,
  CHART_COLORS,
} from '../../lib/formatters'

export function PackageRevenueBreakdown() {
  const { data, isLoading } = useGetRevenue()

  const pieData = useMemo(() => {
    if (!data?.packageRevenueBySubscriptionType) return []
    return Object.entries(data.packageRevenueBySubscriptionType)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => ({
        key,
        name: SUBSCRIPTION_TYPE_LABELS[key] ?? key,
        value,
      }))
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu gói theo loại</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="mx-auto h-[300px] w-[300px] rounded-full" />
        ) : pieData.length === 0 ? (
          <div className="text-muted-foreground flex h-[300px] items-center justify-center">
            Chưa có dữ liệu
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={
                    <ChartTooltip valueFormatter={(v) => formatVND(v)} />
                  }
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid w-full grid-cols-1 gap-2 text-sm">
              {pieData.map((d, i) => {
                const share =
                  data?.packageRevenueShareBySubscriptionType?.[d.key]
                return (
                  <div key={d.key} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{
                        backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                      }}
                    />
                    <span className="text-muted-foreground truncate">
                      {d.name}
                    </span>
                    <span className="ms-auto font-medium">
                      {formatVND(d.value)}
                    </span>
                    <span className="text-muted-foreground w-12 text-right">
                      {formatPercent(share)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
