import { render, screen } from '@testing-library/react'
import { ReelsGrid } from '@/components/reels-grid'
import useSWR from 'swr'

// Mock SWR
const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>

describe('ReelsGrid Component', () => {
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

      render(<ReelsGrid />)

      expect(screen.getByText('🎬 Reels & Videos')).toBeInTheDocument()
      expect(screen.getByText(/Discover engaging video content from Instagram profiles/)).toBeInTheDocument()
    })

    it('displays reel feature highlights', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<ReelsGrid />)

      expect(screen.getByText('Short Videos')).toBeInTheDocument()
      expect(screen.getByText('Viral Content')).toBeInTheDocument()
      expect(screen.getByText('View Counts')).toBeInTheDocument()
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

      render(<ReelsGrid username="testuser" />)

      expect(screen.getByText('Loading reels...')).toBeInTheDocument()

      // Check for skeleton animations
      const skeletonItems = document.querySelectorAll('.animate-pulse')
      expect(skeletonItems.length).toBeGreaterThan(0)
    })
  })

  describe('Reels Data Display', () => {
    const mockReelsData = [
      {
        id: '1',
        pk: '123',
        code: 'REEL123',
        takenAt: '2023-01-01T00:00:00Z',
        mediaType: 2, // Video/Reel
        thumbnailUrl: '/reel-thumb1.jpg',
        videoUrl: '/reel-video1.mp4',
        captionText: 'Amazing dance moves! 💃',
        likeCount: 5000,
        commentCount: 500,
        playCount: 50000,
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
        code: 'REEL456',
        takenAt: '2023-01-02T00:00:00Z',
        mediaType: 2,
        thumbnailUrl: '/reel-thumb2.jpg',
        videoUrl: '/reel-video2.mp4',
        captionText: 'Cooking tutorial step by step',
        likeCount: 3000,
        commentCount: 200,
        playCount: 25000,
        user: {
          pk: '456',
          username: 'testuser',
          fullName: 'Test User',
          profilePicUrl: '/avatar.jpg',
          isVerified: false
        }
      }
    ]

    it('renders reels grid with correct data', () => {
      mockUseSWR.mockReturnValue({
        data: mockReelsData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<ReelsGrid username="testuser" />)

      expect(screen.getByText('Reels by @testuser')).toBeInTheDocument()
      expect(screen.getByText('Amazing dance moves! 💃')).toBeInTheDocument()
      expect(screen.getByText('Cooking tutorial step by step')).toBeInTheDocument()
    })

    it('displays reel engagement metrics correctly', () => {
      mockUseSWR.mockReturnValue({
        data: mockReelsData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<ReelsGrid username="testuser" />)

      // Check for formatted numbers
      expect(screen.getByText('5K')).toBeInTheDocument() // 5000 likes
      expect(screen.getByText('500')).toBeInTheDocument() // 500 comments
      expect(screen.getByText('50K')).toBeInTheDocument() // 50000 views
    })

    it('shows play count for reels', () => {
      mockUseSWR.mockReturnValue({
        data: mockReelsData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<ReelsGrid username="testuser" />)

      // Play count should be displayed
      expect(screen.getByText('50K views')).toBeInTheDocument()
      expect(screen.getByText('25K views')).toBeInTheDocument()
    })

    it('displays video play icon overlay', () => {
      mockUseSWR.mockReturnValue({
        data: mockReelsData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<ReelsGrid username="testuser" />)

      // Check for play button icons
      const playIcons = screen.getAllByText('▶️')
      expect(playIcons.length).toBe(2) // One for each reel
    })

    it('handles empty reels array', () => {
      mockUseSWR.mockReturnValue({
        data: [],
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<ReelsGrid username="testuser" />)

      expect(screen.getByText('No reels found')).toBeInTheDocument()
      expect(screen.getByText(/This profile doesn't have any reels yet/)).toBeInTheDocument()
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

      render(<ReelsGrid username="testuser" />)

      expect(screen.getByText('Unable to load reels')).toBeInTheDocument()
      expect(screen.getByText(/There was an error loading the reels/)).toBeInTheDocument()
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

      render(<ReelsGrid username="testuser" />)

      const retryButton = screen.getByText('Try Again')
      expect(retryButton).toBeInTheDocument()
    })
  })

  describe('Responsive Video Layout', () => {
    it('applies responsive grid classes for video aspect ratio', () => {
      mockUseSWR.mockReturnValue({
        data: [],
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      const { container } = render(<ReelsGrid username="testuser" />)

      // Check for responsive grid classes optimized for video content
      const gridElement = container.querySelector('.grid')
      expect(gridElement).toHaveClass('grid-cols-1')
      expect(gridElement).toHaveClass('sm:grid-cols-2')
      expect(gridElement).toHaveClass('lg:grid-cols-3')
      expect(gridElement).toHaveClass('xl:grid-cols-4')
    })

    it('uses correct aspect ratio for video thumbnails', () => {
      const mockReelsData = [{
        id: '1',
        pk: '123',
        code: 'REEL123',
        takenAt: '2023-01-01T00:00:00Z',
        mediaType: 2,
        thumbnailUrl: '/reel-thumb1.jpg',
        videoUrl: '/reel-video1.mp4',
        captionText: 'Test reel',
        likeCount: 100,
        commentCount: 10,
        playCount: 1000,
        user: {
          pk: '456',
          username: 'testuser',
          fullName: 'Test User',
          profilePicUrl: '/avatar.jpg',
          isVerified: false
        }
      }]

      mockUseSWR.mockReturnValue({
        data: mockReelsData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      const { container } = render(<ReelsGrid username="testuser" />)

      // Check for video-optimized height classes
      const videoContainer = container.querySelector('.h-40')
      expect(videoContainer).toBeInTheDocument()
    })
  })

  describe('Data Fetching', () => {
    it('calls SWR with correct endpoint when username is provided', () => {
      render(<ReelsGrid username="testuser" />)

      expect(mockUseSWR).toHaveBeenCalledWith(
        '/api/reels?username=testuser',
        expect.any(Function)
      )
    })

    it('calls SWR with null when no username is provided', () => {
      render(<ReelsGrid />)

      expect(mockUseSWR).toHaveBeenCalledWith(
        null,
        expect.any(Function)
      )
    })
  })

  describe('Video Interaction Features', () => {
    const mockReelsData = [{
      id: '1',
      pk: '123',
      code: 'REEL123',
      takenAt: '2023-01-01T00:00:00Z',
      mediaType: 2,
      thumbnailUrl: '/reel-thumb1.jpg',
      videoUrl: '/reel-video1.mp4',
      captionText: 'Test reel with a very long caption that should be truncated properly to maintain layout consistency',
      likeCount: 15000,
      commentCount: 1500,
      playCount: 150000,
      user: {
        pk: '456',
        username: 'testuser',
        fullName: 'Test User',
        profilePicUrl: '/avatar.jpg',
        isVerified: true
      }
    }]

    it('truncates long captions appropriately for reels', () => {
      mockUseSWR.mockReturnValue({
        data: mockReelsData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<ReelsGrid username="testuser" />)

      // Caption should be present but potentially truncated
      const caption = screen.getByText(/Test reel with a very long caption/)
      expect(caption).toBeInTheDocument()
    })

    it('formats large view counts correctly', () => {
      mockUseSWR.mockReturnValue({
        data: mockReelsData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<ReelsGrid username="testuser" />)

      expect(screen.getByText('150K views')).toBeInTheDocument() // 150000 views formatted
      expect(screen.getByText('15K')).toBeInTheDocument() // 15000 likes formatted
    })

    it('shows reel duration indicator', () => {
      mockUseSWR.mockReturnValue({
        data: mockReelsData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<ReelsGrid username="testuser" />)

      // Check for duration or video indicator
      const videoIndicator = screen.getByText('🎬')
      expect(videoIndicator).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper video accessibility attributes', () => {
      const mockReelsData = [{
        id: '1',
        pk: '123',
        code: 'REEL123',
        takenAt: '2023-01-01T00:00:00Z',
        mediaType: 2,
        thumbnailUrl: '/reel-thumb1.jpg',
        videoUrl: '/reel-video1.mp4',
        captionText: 'Accessible reel content',
        likeCount: 100,
        commentCount: 10,
        playCount: 1000,
        user: {
          pk: '456',
          username: 'testuser',
          fullName: 'Test User',
          profilePicUrl: '/avatar.jpg',
          isVerified: false
        }
      }]

      mockUseSWR.mockReturnValue({
        data: mockReelsData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<ReelsGrid username="testuser" />)

      // Check for semantic video elements
      expect(screen.getByRole('main')).toBeInTheDocument()
    })
  })
})
