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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <header className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance mb-2">Instagram Profile Dashboard</h1>
          {!username && (
            <p className="text-sm sm:text-base text-muted-foreground">
              Analyze any public Instagram profile with detailed insights and analytics
            </p>
          )}
          {username && (
            <p className="text-sm sm:text-base text-muted-foreground">
              Analyzing @{username} - Scroll down to see posts, reels, and analytics
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {username && (
            <div className="flex gap-2">
              <a href="#posts" className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:bg-primary/90 transition-colors text-center">
                📸 Posts
              </a>
              <a href="#reels" className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md bg-accent text-accent-foreground text-xs sm:text-sm font-medium hover:bg-accent/90 transition-colors text-center">
                🎬 Reels
              </a>
            </div>
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

      <footer className="mt-8 sm:mt-12 border-t border-border pt-4 sm:pt-6 text-xs sm:text-sm text-muted-foreground text-center">
        <p>
          {"© "}
          {new Date().getFullYear()} {username ? username : "Abhishek Yadav "}. All rights reserved.
        </p>
      </footer>
    </main>
  )
}
