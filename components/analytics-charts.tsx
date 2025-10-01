"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { Analytics } from "@/lib/types"
import { Card } from "@/components/ui/card"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export function AnalyticsSection({ username }: { username?: string }) {
  // Only fetch data when username is provided
  const key = username ? `/api/analytics?username=${encodeURIComponent(username)}` : null
  const { data, error } = useSWR<Analytics>(key, fetcher)

  // Show welcome message when no username is provided (check this FIRST)
  if (!username) {
    return (
      <Card className="bg-card text-card-foreground p-4 sm:p-6 lg:p-8 rounded-lg text-center bg-background">
        <div className="max-w-2xl mx-auto">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-xl sm:text-2xl">📊</span>
          </div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">Advanced Analytics</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
            Get detailed insights into engagement rates, content performance, and audience demographics for any Instagram profile.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 rounded-lg bg-background border">
              <div className="text-base sm:text-lg mb-1">📈</div>
              <div className="text-xs font-medium">Engagement</div>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-background border">
              <div className="text-base sm:text-lg mb-1">💝</div>
              <div className="text-xs font-medium">Likes</div>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-background border">
              <div className="text-base sm:text-lg mb-1">💬</div>
              <div className="text-xs font-medium">Comments</div>
            </div>
            <div className="p-2 sm:p-3 rounded-lg bg-background border">
              <div className="text-base sm:text-lg mb-1">📋</div>
              <div className="text-xs font-medium">Trends</div>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Enter a username above to start analyzing their performance metrics and audience insights.
          </p>
        </div>
      </Card>
    )
  }

  if (error) return <div className="text-destructive">Failed to load analytics.</div>
  if (!data)
    return (
      <div className="grid gap-4 md:grid-cols-2 bg-background">
        <Card className="p-4 bg-card">
          <div className="h-40 bg-secondary rounded animate-pulse" />
        </Card>
        <Card className="p-4 bg-card">
          <div className="h-40 bg-secondary rounded animate-pulse" />
        </Card>
        <Card className="p-4 bg-card md:col-span-2">
          <div className="h-64 bg-secondary rounded animate-pulse" />
        </Card>
      </div>
    )

  const palette = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
    "var(--color-chart-5)",
  ]

  return (
    <section className="grid gap-3 sm:gap-4 lg:grid-cols-2">
      <Card className="p-3 sm:p-4 bg-card text-card-foreground">
        <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Engagement Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <Metric label="Avg Likes" value={Intl.NumberFormat().format(data.avgLikes)} />
          <Metric label="Avg Comments" value={Intl.NumberFormat().format(data.avgComments)} />
          <Metric label="Eng. Rate" value={`${data.engagementRate}%`} />
        </div>
        {data.trend && data.trend.length > 0 ? (
          <div className="h-48 sm:h-56 mt-3 sm:mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend}>
                <XAxis 
                  dataKey="index" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickMargin={5}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickMargin={5}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    color: "var(--color-card-foreground)",
                    border: `1px solid var(--color-border)`,
                    fontSize: "12px",
                  }}
                />
                <Line type="monotone" dataKey="likes" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="comments" stroke="var(--color-chart-2)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 sm:h-56 mt-3 sm:mt-4 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">No trend data available</p>
          </div>
        )}
      </Card>

      <Card className="p-3 sm:p-4 bg-card text-card-foreground">
        <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Likes vs Comments</h2>
        {data.trend && data.trend.length > 0 ? (
          <div className="h-48 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.trend}>
                <XAxis 
                  dataKey="index" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickMargin={5}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickMargin={5}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    color: "var(--color-card-foreground)",
                    border: `1px solid var(--color-border)`,
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="likes" fill="var(--color-chart-1)" />
                <Bar dataKey="comments" fill="var(--color-chart-2)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 sm:h-56 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">No data available for comparison</p>
          </div>
        )}
      </Card>

      {data.demographics && (
        <Card className="p-3 sm:p-4 bg-card text-card-foreground lg:col-span-2">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Audience Demographics</h2>
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <div className="h-48 sm:h-64">
              <h3 className="text-sm font-medium mb-2">Gender Distribution</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Male", value: data.demographics.gender.male },
                      { name: "Female", value: data.demographics.gender.female },
                      { name: "Other", value: data.demographics.gender.other },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={2}
                  >
                    {[0, 1, 2].map((i) => (
                      <Cell key={i} fill={palette[i % palette.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      color: "var(--color-card-foreground)",
                      border: `1px solid var(--color-border)`,
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-48 sm:h-64">
              <h3 className="text-sm font-medium mb-2">Age Groups</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.demographics.age}>
                  <XAxis 
                    dataKey="range" 
                    stroke="var(--color-muted-foreground)"
                    fontSize={10}
                    tickMargin={5}
                  />
                  <YAxis 
                    stroke="var(--color-muted-foreground)"
                    fontSize={10}
                    tickMargin={5}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      color: "var(--color-card-foreground)",
                      border: `1px solid var(--color-border)`,
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="percent" fill="var(--color-chart-2)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      )}
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border p-2 sm:p-3">
      <p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
      <p className="text-base sm:text-lg lg:text-xl font-medium">{value}</p>
    </div>
  )
}
