"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import type { Profile } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Shield, Lock } from "lucide-react"

export function ProfileCard({ username }: { username?: string }) {
  // Only fetch data when username is provided
  const key = username ? `/api/profile?username=${encodeURIComponent(username)}` : null
  const { data, error, isLoading } = useSWR<Profile>(key, fetcher)

  // Show welcome message when no username is provided
  if (!username) {
    return (
      <Card className="bg-card text-card-foreground p-8 rounded-lg text-center bg-background">
        <div className="max-w-2xl mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-3xl">📊</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Welcome to Instagram Analytics Dashboard</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Discover detailed insights about any public Instagram profile. Get analytics on posts, reels, engagement rates, and audience demographics.
          </p>
          <div className="bg-muted/50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-3">🔍 Get Started</h2>
            <p className="text-muted-foreground">
              Enter an Instagram username in the search bar above to begin analyzing their profile, posts, and engagement metrics.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-lg bg-background border">
              <div className="text-2xl mb-2">📈</div>
              <div className="font-medium">Analytics</div>
              <div className="text-muted-foreground">Engagement rates & trends</div>
            </div>
            <div className="p-4 rounded-lg bg-background border">
              <div className="text-2xl mb-2">📸</div>
              <div className="font-medium">Content</div>
              <div className="text-muted-foreground">Posts & reels analysis</div>
            </div>
            <div className="p-4 rounded-lg bg-background border">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-medium">Audience</div>
              <div className="text-muted-foreground">Demographics & insights</div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (error) return <div className="text-destructive">Failed to load profile.</div>

  return (
    <Card className="bg-card text-card-foreground p-6 rounded-lg">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start gap-6">
          <div className="relative">
            <img
              src={data?.profilePic || "/placeholder.svg?height=160&width=160&query=profile%20avatar"}
              alt="Profile picture"
              width={120}
              height={120}
              className="rounded-full border-4 border-primary/20 object-cover"
              onError={(e) => {
                console.log("Image failed to load:", data?.profilePic);
                e.currentTarget.src = "/placeholder.svg?height=160&width=160&query=profile%20avatar";
              }}
              onLoad={() => {
                console.log("Image loaded successfully:", data?.profilePic);
              }}
            />
            {data?.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                <Shield className="w-4 h-4" />
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-balance">
                    {data?.name || "Loading..."}
                  </h1>
                  {data?.isPrivate && (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <p className="text-muted-foreground text-lg">@{data?.username || ""}</p>
              </div>
              <div className="flex gap-2">
                {data?.categoryName && (
                  <Badge variant="secondary" className="px-3 py-1">
                    {data.categoryName}
                  </Badge>
                )}
                <Badge className="px-3 py-1">Influencer</Badge>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              {isLoading ? (
                <>
                  <SkeletonStat label="Followers" />
                  <SkeletonStat label="Following" />
                  <SkeletonStat label="Posts" />
                </>
              ) : (
                <>
                  <Stat label="Followers" value={Intl.NumberFormat().format(data!.followers)} />
                  <Stat label="Following" value={Intl.NumberFormat().format(data!.following)} />
                  <Stat label="Posts" value={Intl.NumberFormat().format(data!.postsCount)} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Biography Section */}
        {data?.biography && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Biography</h3>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {data.biography}
            </p>
          </div>
        )}

        {/* Bio Links Section */}
        {data?.bioLinks && data.bioLinks.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Links</h3>
            <div className="flex flex-wrap gap-2">
              {data.bioLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border hover:bg-secondary/50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">{link.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-border p-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-medium">{value}</p>
    </div>
  )
}

function SkeletonStat({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-border p-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="h-6 w-24 bg-secondary rounded mt-1" />
    </div>
  )
}
