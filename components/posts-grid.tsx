"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { Post } from "@/lib/types"
import { Card } from "@/components/ui/card"

export function PostsGrid({ username }: { username?: string }) {
  // Only fetch data when username is provided
  const key = username ? `/api/posts?username=${encodeURIComponent(username)}` : null
  const { data, error } = useSWR<Post[]>(key, fetcher)
  
  // Show welcome message when no username is provided
  if (!username) {
    return (
      <section>
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Recent Posts</h2>
        <div className="text-center py-8 sm:py-12 border-2 border-dashed border-border rounded-lg">
          <div className="max-w-md mx-auto px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xl sm:text-2xl">📸</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Discover Instagram Posts</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
              Enter an Instagram username in the search bar above to view their latest posts, engagement metrics, and content analysis.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Try searching for popular accounts like &ldquo;natgeo&rdquo;, &ldquo;instagram&rdquo;, or any public profile.
            </p>
          </div>
        </div>
      </section>
    )
  }
  
  if (error) return <div className="text-destructive">Failed to load posts.</div>
  if (!data) return <GridSkeleton />

  return (
    <section>
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Recent Posts</h2>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((post) => (
          <Card key={post.id} className="bg-card text-card-foreground overflow-hidden rounded-lg hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={post.thumbnailUrl || "/placeholder.svg"}
                alt={`Post ${post.id}`}
                className="w-full h-40 sm:h-48 lg:h-52 object-cover"
                width={420}
                height={320}
              />
              <div className="absolute top-2 right-2">
                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-black/50 text-white text-xs">
                  {post.mediaType === 1 ? "📷" : post.mediaType === 8 ? "🖼️" : "📝"}
                </span>
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-card-foreground line-clamp-2 mb-2 sm:mb-3">
                {post.captionText || "No caption"}
              </p>
              <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="flex items-center gap-1">
                    ❤️ {Intl.NumberFormat('en', { notation: 'compact' }).format(post.likeCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    💬 {Intl.NumberFormat('en', { notation: 'compact' }).format(post.commentCount)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="truncate flex-1 mr-2">by @{post.user.username}</span>
                <span className="text-xs whitespace-nowrap">{post.mediaType === 1 ? "Photo" : post.mediaType === 8 ? "Carousel" : "Post"}</span>
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
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="bg-card p-0 overflow-hidden">
          <div className="h-40 sm:h-48 lg:h-52 bg-secondary animate-pulse" />
          <div className="p-3 sm:p-4 space-y-2">
            <div className="h-3 sm:h-4 w-full bg-secondary rounded animate-pulse" />
            <div className="h-3 sm:h-4 w-2/3 bg-secondary rounded animate-pulse" />
          </div>
        </Card>
      ))}
    </div>
  )
}
