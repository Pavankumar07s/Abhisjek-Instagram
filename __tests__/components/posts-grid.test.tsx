import { render, screen, waitFor } from '@testing-library/react'
import { PostsGrid } from '@/components/posts-grid'
import useSWR from 'swr'

// Mock SWR
const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>

describe('PostsGrid Component', () => {
  beforeEach(() => {
    mockUseSWR.mockClear()
  })

  describe('Welcome State', () => {
    it('renders welcome message when no username is provided', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<PostsGrid />)

      expect(screen.getByText('📸 Posts & Content')).toBeInTheDocument()
      expect(screen.getByText(/Explore engaging posts from any Instagram profile/)).toBeInTheDocument()
      expect(screen.getByText('Photo Posts')).toBeInTheDocument()
      expect(screen.getByText('Carousel Posts')).toBeInTheDocument()
      expect(screen.getByText('Engagement Stats')).toBeInTheDocument()
    })

    it('displays feature highlights correctly', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<PostsGrid />)

      expect(screen.getByText('High-quality images')).toBeInTheDocument()
      expect(screen.getByText('Multi-photo stories')).toBeInTheDocument()
      expect(screen.getByText('Likes & comments')).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('renders loading skeleton when data is loading', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: true,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<PostsGrid username="testuser" />)

      expect(screen.getByText('Loading posts...')).toBeInTheDocument()
      
      // Check for skeleton grid
      const skeletonItems = document.querySelectorAll('.animate-pulse')
      expect(skeletonItems.length).toBeGreaterThan(0)
    })

    it('displays correct number of skeleton items', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: true,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<PostsGrid username="testuser" />)

      // Should render 8 skeleton items
      const skeletonCards = document.querySelectorAll('.bg-card')
      expect(skeletonCards.length).toBe(8)
    })
  })

  describe('Posts Data Display', () => {
    const mockPostsData = [
      {
        id: '1',
        pk: '123',
        code: 'ABC123',
        takenAt: '2023-01-01T00:00:00Z',
        mediaType: 1,
        thumbnailUrl: '/test-image1.jpg',
        captionText: 'Test post 1',
        likeCount: 100,
        commentCount: 10,
        user: {
          pk: '456',
          username: 'testuser',
          fullName: 'Test User',
          profilePicUrl: '/avatar.jpg',
          isVerified: true
        }
      },
      {
        id: '2',
        pk: '124',
        code: 'DEF456',
        takenAt: '2023-01-02T00:00:00Z',
        mediaType: 8, // Carousel
        thumbnailUrl: '/test-image2.jpg',
        captionText: 'Test carousel post',
        likeCount: 200,
        commentCount: 20,
        user: {
          pk: '456',
          username: 'testuser',
          fullName: 'Test User',
          profilePicUrl: '/avatar.jpg',
          isVerified: false
        },
        resources: [
          {
            pk: '125',
            thumbnailUrl: '/carousel1.jpg',
            mediaType: 1
          },
          {
            pk: '126',
            thumbnailUrl: '/carousel2.jpg',
            mediaType: 1
          }
        ]
      }
    ]

    it('renders posts grid with correct data', () => {
      mockUseSWR.mockReturnValue({
        data: mockPostsData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<PostsGrid username="testuser" />)

      expect(screen.getByText('Posts by @testuser')).toBeInTheDocument()
      expect(screen.getByText('Test post 1')).toBeInTheDocument()
      expect(screen.getByText('Test carousel post')).toBeInTheDocument()
    })

    it('displays engagement metrics correctly', () => {
      mockUseSWR.mockReturnValue({
        data: mockPostsData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<PostsGrid username="testuser" />)

      expect(screen.getByText('100')).toBeInTheDocument() // Likes
      expect(screen.getByText('10')).toBeInTheDocument() // Comments
      expect(screen.getByText('200')).toBeInTheDocument() // Likes for carousel
      expect(screen.getByText('20')).toBeInTheDocument() // Comments for carousel
    })

    it('shows carousel indicator for multi-photo posts', () => {
      mockUseSWR.mockReturnValue({
        data: mockPostsData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<PostsGrid username="testuser" />)

      // Check for carousel indicator (multiple images icon)
      const carouselIcon = screen.getByText('📸+')
      expect(carouselIcon).toBeInTheDocument()
    })

    it('handles empty posts array', () => {
      mockUseSWR.mockReturnValue({
        data: [],
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<PostsGrid username="testuser" />)

      expect(screen.getByText('No posts found')).toBeInTheDocument()
      expect(screen.getByText(/This profile doesn't have any posts yet/)).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('renders error state when API fails', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: new Error('API Error'),
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<PostsGrid username="testuser" />)

      expect(screen.getByText('Unable to load posts')).toBeInTheDocument()
      expect(screen.getByText(/There was an error loading the posts/)).toBeInTheDocument()
    })

    it('provides retry functionality on error', () => {
      const mockMutate = jest.fn()
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: new Error('API Error'),
        isLoading: false,
        mutate: mockMutate,
        isValidating: false,
      })

      render(<PostsGrid username="testuser" />)

      const retryButton = screen.getByText('Try Again')
      expect(retryButton).toBeInTheDocument()
    })
  })

  describe('Responsive Grid Layout', () => {
    it('applies responsive grid classes correctly', () => {
      mockUseSWR.mockReturnValue({
        data: [],
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      const { container } = render(<PostsGrid username="testuser" />)

      // Check for responsive grid classes
      const gridElement = container.querySelector('.grid')
      expect(gridElement).toHaveClass('grid-cols-1')
      expect(gridElement).toHaveClass('sm:grid-cols-2')
      expect(gridElement).toHaveClass('lg:grid-cols-3')
      expect(gridElement).toHaveClass('xl:grid-cols-4')
    })
  })

  describe('Data Fetching', () => {
    it('calls SWR with correct endpoint when username is provided', () => {
      render(<PostsGrid username="testuser" />)

      expect(mockUseSWR).toHaveBeenCalledWith(
        '/api/posts?username=testuser',
        expect.any(Function)
      )
    })

    it('calls SWR with null when no username is provided', () => {
      render(<PostsGrid />)

      expect(mockUseSWR).toHaveBeenCalledWith(
        null,
        expect.any(Function)
      )
    })
  })

  describe('Post Card Interactions', () => {
    const mockPostsData = [
      {
        id: '1',
        pk: '123',
        code: 'ABC123',
        takenAt: '2023-01-01T00:00:00Z',
        mediaType: 1,
        thumbnailUrl: '/test-image1.jpg',
        captionText: 'Test post with a longer caption that might get truncated',
        likeCount: 1500,
        commentCount: 150,
        user: {
          pk: '456',
          username: 'testuser',
          fullName: 'Test User',
          profilePicUrl: '/avatar.jpg',
          isVerified: true
        }
      }
    ]

    it('truncates long captions appropriately', () => {
      mockUseSWR.mockReturnValue({
        data: mockPostsData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<PostsGrid username="testuser" />)

      // Caption should be truncated and have "..." indicator
      const caption = screen.getByText(/Test post with a longer caption/)
      expect(caption).toBeInTheDocument()
    })

    it('formats large numbers correctly', () => {
      mockUseSWR.mockReturnValue({
        data: mockPostsData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<PostsGrid username="testuser" />)

      expect(screen.getByText('1.5K')).toBeInTheDocument() // 1500 likes formatted
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      mockUseSWR.mockReturnValue({
        data: [],
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<PostsGrid username="testuser" />)

      // Check for semantic elements
      expect(screen.getByRole('main')).toBeInTheDocument()
    })
  })
})
