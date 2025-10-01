import { ProfileCard } from "@/components/profile-card"
import { StoriesHighlights } from "@/components/stories-highlights"
import { HighlightsSection } from "@/components/highlights-section"
import { AnalyticsSection } from "@/components/analytics-charts"
import { PostsGrid } from "@/components/posts-grid"
import { ReelsGrid } from "@/components/reels-grid"
import { SearchHeader } from "@/components/search-header"

export default function Page({ searchParams }: { searchParams?: { username?: string } }) {
  const username = searchParams?.username
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance mb-2">Instagram Profile Dashboard</h1>
          {!username && (
            <p className="text-muted-foreground">
              Analyze any public Instagram profile with detailed insights and analytics
            </p>
          )}
          {username && (
            <p className="text-muted-foreground">
              Analyzing @{username} - Scroll down to see posts, reels, and analytics
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {username && (
            <>
              <a href="#posts" className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                📸 Posts
              </a>
              <a href="#reels" className="px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors">
                🎬 Reels
              </a>
            </>
          )}
          <SearchHeader />
        </div>
      </header>

      <section className="space-y-6">
        <ProfileCard username={username} />
        {username && (
          <>
            <StoriesHighlights username={username} />
            <HighlightsSection username={username} />
          </>
        )}
        <AnalyticsSection username={username} />
      </section>

      <section id="posts" className="mt-8 space-y-4">
        <PostsGrid username={username} />
      </section>

      <section id="reels" className="mt-8 space-y-4">
        <ReelsGrid username={username} />
      </section>

      <footer className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
        <p>
          {"© "}
          {new Date().getFullYear()} {username ? username : "Abhishek Yadav "}. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
