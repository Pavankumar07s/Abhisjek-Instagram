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
        <h2 className="text-lg font-semibold mb-3">Recent Posts</h2>
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl">📸</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Discover Instagram Posts</h3>
            <p className="text-muted-foreground mb-4">
              Enter an Instagram username in the search bar above to view their latest posts, engagement metrics, and content analysis.
            </p>
            <p className="text-sm text-muted-foreground">
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
      <h2 className="text-lg font-semibold mb-3">Recent Posts</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((post) => (
          <Card key={post.id} className="bg-card text-card-foreground overflow-hidden rounded-lg hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={post.thumbnailUrl || "/placeholder.svg"}
                alt={`Post ${post.id}`}
                className="w-full h-48 object-cover"
                width={420}
                height={320}
              />
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 rounded-md bg-black/50 text-white text-xs">
                  {post.mediaType === 1 ? "📷" : post.mediaType === 8 ? "🖼️" : "📝"}
                </span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-card-foreground line-clamp-2 mb-3">
                {post.captionText || "No caption"}
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    ❤️ {Intl.NumberFormat('en', { notation: 'compact' }).format(post.likeCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    💬 {Intl.NumberFormat('en', { notation: 'compact' }).format(post.commentCount)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="truncate">by @{post.user.username}</span>
                <span>{post.mediaType === 1 ? "Photo" : post.mediaType === 8 ? "Carousel" : "Post"}</span>
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
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="bg-card p-0 overflow-hidden">
          <div className="h-56 bg-secondary" />
          <div className="p-4 space-y-2">
            <div className="h-4 w-2/3 bg-secondary rounded" />
            <div className="h-4 w-1/3 bg-secondary rounded" />
            <div className="h-6 w-1/2 bg-secondary rounded" />
          </div>
        </Card>
      ))}
    </div>
  )
}
