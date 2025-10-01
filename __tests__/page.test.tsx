import { render, screen } from '@testing-library/react'
import Page from '@/app/page'

// Mock all child components to focus on page structure
jest.mock('@/components/profile-card', () => ({
  ProfileCard: ({ username }: { username?: string }) => (
    <div data-testid="profile-card">Profile Card - {username || 'no-username'}</div>
  )
}))

jest.mock('@/components/stories-highlights', () => ({
  StoriesHighlights: ({ username }: { username?: string }) => (
    <div data-testid="stories-highlights">Stories - {username}</div>
  )
}))

jest.mock('@/components/highlights-section', () => ({
  HighlightsSection: ({ username }: { username?: string }) => (
    <div data-testid="highlights-section">Highlights - {username}</div>
  )
}))

jest.mock('@/components/analytics-charts', () => ({
  AnalyticsSection: ({ username }: { username?: string }) => (
    <div data-testid="analytics-section">Analytics - {username || 'no-username'}</div>
  )
}))

jest.mock('@/components/posts-grid', () => ({
  PostsGrid: ({ username }: { username?: string }) => (
    <div data-testid="posts-grid">Posts - {username || 'no-username'}</div>
  )
}))

jest.mock('@/components/reels-grid', () => ({
  ReelsGrid: ({ username }: { username?: string }) => (
    <div data-testid="reels-grid">Reels - {username || 'no-username'}</div>
  )
}))

jest.mock('@/components/search-header', () => ({
  SearchHeader: () => (
    <div data-testid="search-header">Search Header</div>
  )
}))

describe('Main Page', () => {
  describe('Without Username', () => {
    it('renders all main sections without username', () => {
      render(<Page searchParams={{}} />)

      expect(screen.getByText('Instagram Profile Dashboard')).toBeInTheDocument()
      expect(screen.getByText(/Analyze any public Instagram profile/)).toBeInTheDocument()
      expect(screen.getByTestId('profile-card')).toBeInTheDocument()
      expect(screen.getByTestId('analytics-section')).toBeInTheDocument()
      expect(screen.getByTestId('posts-grid')).toBeInTheDocument()
      expect(screen.getByTestId('reels-grid')).toBeInTheDocument()
      expect(screen.getByTestId('search-header')).toBeInTheDocument()
    })

    it('does not render username-specific sections without username', () => {
      render(<Page searchParams={{}} />)

      expect(screen.queryByTestId('stories-highlights')).not.toBeInTheDocument()
      expect(screen.queryByTestId('highlights-section')).not.toBeInTheDocument()
    })

    it('shows welcome message without username', () => {
      render(<Page searchParams={{}} />)

      expect(screen.getByText(/Analyze any public Instagram profile with detailed insights/)).toBeInTheDocument()
    })

    it('does not show navigation buttons without username', () => {
      render(<Page searchParams={{}} />)

      expect(screen.queryByText('📸 Posts')).not.toBeInTheDocument()
      expect(screen.queryByText('🎬 Reels')).not.toBeInTheDocument()
    })

    it('renders footer with current year', () => {
      render(<Page searchParams={{}} />)

      const currentYear = new Date().getFullYear()
      expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument()
      expect(screen.getByText(/Abhishek Yadav/)).toBeInTheDocument()
    })
  })

  describe('With Username', () => {
    const mockSearchParams = { username: 'testuser' }

    it('renders all sections with username', () => {
      render(<Page searchParams={mockSearchParams} />)

      expect(screen.getByText('Instagram Profile Dashboard')).toBeInTheDocument()
      expect(screen.getByTestId('profile-card')).toHaveTextContent('testuser')
      expect(screen.getByTestId('stories-highlights')).toHaveTextContent('testuser')
      expect(screen.getByTestId('highlights-section')).toHaveTextContent('testuser')
      expect(screen.getByTestId('analytics-section')).toHaveTextContent('testuser')
      expect(screen.getByTestId('posts-grid')).toHaveTextContent('testuser')
      expect(screen.getByTestId('reels-grid')).toHaveTextContent('testuser')
    })

    it('shows username-specific header message', () => {
      render(<Page searchParams={mockSearchParams} />)

      expect(screen.getByText(/Analyzing @testuser/)).toBeInTheDocument()
      expect(screen.getByText(/Scroll down to see posts, reels, and analytics/)).toBeInTheDocument()
    })

    it('shows navigation buttons with username', () => {
      render(<Page searchParams={mockSearchParams} />)

      expect(screen.getByText('📸 Posts')).toBeInTheDocument()
      expect(screen.getByText('🎬 Reels')).toBeInTheDocument()
    })

    it('renders section anchors for navigation', () => {
      const { container } = render(<Page searchParams={mockSearchParams} />)

      expect(container.querySelector('#posts')).toBeInTheDocument()
      expect(container.querySelector('#reels')).toBeInTheDocument()
    })

    it('shows username in footer', () => {
      render(<Page searchParams={mockSearchParams} />)

      expect(screen.getByText(/testuser/)).toBeInTheDocument()
    })

    it('navigation links have correct href attributes', () => {
      render(<Page searchParams={mockSearchParams} />)

      const postsLink = screen.getByText('📸 Posts').closest('a')
      const reelsLink = screen.getByText('🎬 Reels').closest('a')

      expect(postsLink).toHaveAttribute('href', '#posts')
      expect(reelsLink).toHaveAttribute('href', '#reels')
    })
  })

  describe('Responsive Layout', () => {
    it('applies responsive classes to main container', () => {
      const { container } = render(<Page searchParams={{}} />)

      const main = container.querySelector('main')
      expect(main).toHaveClass('max-w-7xl')
      expect(main).toHaveClass('mx-auto')
      expect(main).toHaveClass('px-4')
      expect(main).toHaveClass('sm:px-6')
      expect(main).toHaveClass('lg:px-8')
    })

    it('applies responsive classes to header', () => {
      const { container } = render(<Page searchParams={{}} />)

      const header = container.querySelector('header')
      expect(header).toHaveClass('flex')
      expect(header).toHaveClass('flex-col')
      expect(header).toHaveClass('sm:flex-row')
    })

    it('applies responsive spacing classes', () => {
      const { container } = render(<Page searchParams={{}} />)

      const main = container.querySelector('main')
      expect(main).toHaveClass('py-4')
      expect(main).toHaveClass('sm:py-6')
      expect(main).toHaveClass('lg:py-8')
    })
  })

  describe('Page Structure', () => {
    it('maintains correct section order without username', () => {
      render(<Page searchParams={{}} />)

      const sections = screen.getAllByRole('main')[0].children
      
      // Check that sections are in expected order
      expect(sections[0]).toContainElement(screen.getByText('Instagram Profile Dashboard'))
      expect(sections[1]).toContainElement(screen.getByTestId('profile-card'))
      expect(sections[2]).toContainElement(screen.getByTestId('analytics-section'))
    })

    it('maintains correct section order with username', () => {
      render(<Page searchParams={{ username: 'testuser' }} />)

      // Should include additional sections when username is provided
      expect(screen.getByTestId('stories-highlights')).toBeInTheDocument()
      expect(screen.getByTestId('highlights-section')).toBeInTheDocument()
    })

    it('uses semantic HTML elements', () => {
      render(<Page searchParams={{}} />)

      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getAllByRole('region')).toHaveLength(3) // Profile, posts, reels sections
      expect(screen.getByRole('contentinfo')).toBeInTheDocument() // Footer
    })

    it('has proper heading hierarchy', () => {
      render(<Page searchParams={{}} />)

      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveTextContent('Instagram Profile Dashboard')
    })
  })

  describe('Accessibility', () => {
    it('has proper document structure', () => {
      render(<Page searchParams={{}} />)

      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('provides meaningful text content', () => {
      render(<Page searchParams={{}} />)

      expect(screen.getByText('Instagram Profile Dashboard')).toBeInTheDocument()
      expect(screen.getByText(/Analyze any public Instagram profile/)).toBeInTheDocument()
    })

    it('includes navigation landmarks', () => {
      render(<Page searchParams={{ username: 'testuser' }} />)

      const postsLink = screen.getByText('📸 Posts')
      const reelsLink = screen.getByText('🎬 Reels')

      expect(postsLink).toBeInTheDocument()
      expect(reelsLink).toBeInTheDocument()
    })
  })

  describe('Props Handling', () => {
    it('handles undefined searchParams', () => {
      expect(() => {
        render(<Page />)
      }).not.toThrow()
    })

    it('handles empty searchParams object', () => {
      expect(() => {
        render(<Page searchParams={{}} />)
      }).not.toThrow()
    })

    it('handles searchParams with undefined username', () => {
      expect(() => {
        render(<Page searchParams={{ username: undefined }} />)
      }).not.toThrow()
    })

    it('handles searchParams with empty string username', () => {
      render(<Page searchParams={{ username: '' }} />)

      // Should treat empty string as no username
      expect(screen.queryByTestId('stories-highlights')).not.toBeInTheDocument()
    })

    it('handles special characters in username', () => {
      render(<Page searchParams={{ username: 'user.name_123' }} />)

      expect(screen.getByText(/Analyzing @user.name_123/)).toBeInTheDocument()
    })

    it('trims whitespace from username', () => {
      render(<Page searchParams={{ username: '  testuser  ' }} />)

      expect(screen.getByText(/Analyzing @testuser/)).toBeInTheDocument()
    })
  })

  describe('Content Sections', () => {
    it('renders all required content sections', () => {
      render(<Page searchParams={{ username: 'testuser' }} />)

      // Main sections
      expect(screen.getByTestId('profile-card')).toBeInTheDocument()
      expect(screen.getByTestId('stories-highlights')).toBeInTheDocument()
      expect(screen.getByTestId('highlights-section')).toBeInTheDocument()
      expect(screen.getByTestId('analytics-section')).toBeInTheDocument()
      expect(screen.getByTestId('posts-grid')).toBeInTheDocument()
      expect(screen.getByTestId('reels-grid')).toBeInTheDocument()
    })

    it('passes username prop to all components that need it', () => {
      render(<Page searchParams={{ username: 'testuser' }} />)

      expect(screen.getByTestId('profile-card')).toHaveTextContent('testuser')
      expect(screen.getByTestId('stories-highlights')).toHaveTextContent('testuser')
      expect(screen.getByTestId('highlights-section')).toHaveTextContent('testuser')
      expect(screen.getByTestId('analytics-section')).toHaveTextContent('testuser')
      expect(screen.getByTestId('posts-grid')).toHaveTextContent('testuser')
      expect(screen.getByTestId('reels-grid')).toHaveTextContent('testuser')
    })

    it('renders search header in all cases', () => {
      render(<Page searchParams={{}} />)
      expect(screen.getByTestId('search-header')).toBeInTheDocument()

      render(<Page searchParams={{ username: 'testuser' }} />)
      expect(screen.getByTestId('search-header')).toBeInTheDocument()
    })
  })
})
