"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { Reel } from "@/lib/types"
import { Card } from "@/components/ui/card"

export function ReelsGrid({ username }: { username?: string }) {
  // Only fetch data when username is provided
  const key = username ? `/api/reels?username=${encodeURIComponent(username)}` : null
  const { data, error } = useSWR<Reel[]>(key, fetcher)
  
  // Show welcome message when no username is provided
  if (!username) {
    return (
      <section>
        <h2 className="text-lg font-semibold mb-3">Reels</h2>
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl">🎬</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Discover Instagram Reels</h3>
            <p className="text-muted-foreground mb-4">
              Enter an Instagram username in the search bar above to view their latest reels, video content, and engagement data.
            </p>
            <p className="text-sm text-muted-foreground">
              Search for creators known for their video content and reels.
            </p>
          </div>
        </div>
      </section>
    )
  }
  
  if (error) return <div className="text-destructive">Failed to load reels.</div>
  if (!data) return <GridSkeleton />

  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Reels</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((reel) => (
          <Card key={reel.id} className="bg-card text-card-foreground overflow-hidden rounded-lg hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={reel.thumbnailUrl || "/placeholder.svg"}
                alt={`Reel ${reel.id}`}
                className="w-full h-48 object-cover"
                width={420}
                height={320}
              />
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 rounded-md bg-black/50 text-white text-xs">
                  🎥
                </span>
              </div>
              <div className="absolute bottom-2 left-2">
                <span className="px-2 py-1 rounded-md bg-black/50 text-white text-xs">
                  ▶️ {Intl.NumberFormat('en', { notation: 'compact' }).format(reel.playCount)}
                </span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-card-foreground line-clamp-2 mb-3">
                {reel.captionText || "No caption"}
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    ❤️ {Intl.NumberFormat('en', { notation: 'compact' }).format(reel.likeCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    💬 {Intl.NumberFormat('en', { notation: 'compact' }).format(reel.commentCount)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="truncate">by @{reel.user.username}</span>
                <span>Video Reel</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

function GridSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="bg-card p-0 overflow-hidden">
          <div className="h-56 bg-secondary" />
          <div className="p-4 space-y-2">
            <div className="h-4 w-2/3 bg-secondary rounded" />
            <div className="h-4 w-1/3 bg-secondary rounded" />
          </div>
        </Card>
      ))}
    </div>
  )
}
