import { render, screen, waitFor } from '@testing-library/react'
import { ProfileCard } from '@/components/profile-card'
import useSWR from 'swr'

// Mock SWR
const mockUseSWR = useSWR as jest.MockedFunction<typeof useSWR>

describe('ProfileCard Component', () => {
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

      render(<ProfileCard />)

      expect(screen.getByText('Welcome to Instagram Analytics Dashboard')).toBeInTheDocument()
      expect(screen.getByText(/Discover detailed insights about any public Instagram profile/)).toBeInTheDocument()
      expect(screen.getByText('Analytics')).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
      expect(screen.getByText('Audience')).toBeInTheDocument()
    })

    it('displays feature cards with correct icons and descriptions', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<ProfileCard />)

      expect(screen.getByText('Engagement rates & trends')).toBeInTheDocument()
      expect(screen.getByText('Posts & reels analysis')).toBeInTheDocument()
      expect(screen.getByText('Demographics & insights')).toBeInTheDocument()
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

      render(<ProfileCard username="testuser" />)

      expect(screen.getByText('Loading profile...')).toBeInTheDocument()
      // Check for skeleton elements
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('renders error message when API fails', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: new Error('API Error'),
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<ProfileCard username="testuser" />)

      expect(screen.getByText('Profile not found')).toBeInTheDocument()
      expect(screen.getByText(/Unable to load profile information/)).toBeInTheDocument()
    })
  })

  describe('Profile Data Display', () => {
    const mockProfileData = {
      id: '123',
      name: 'Test User',
      username: 'testuser',
      profilePic: '/test-avatar.jpg',
      followers: 10000,
      following: 500,
      postsCount: 150,
      biography: 'Test biography',
      isVerified: true,
      isPrivate: false,
      categoryName: 'Content Creator'
    }

    it('renders profile information correctly', () => {
      mockUseSWR.mockReturnValue({
        data: mockProfileData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<ProfileCard username="testuser" />)

      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('@testuser')).toBeInTheDocument()
      expect(screen.getByText('Test biography')).toBeInTheDocument()
      expect(screen.getByText('Content Creator')).toBeInTheDocument()
    })

    it('displays follower stats with proper formatting', () => {
      mockUseSWR.mockReturnValue({
        data: mockProfileData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<ProfileCard username="testuser" />)

      expect(screen.getByText('10K')).toBeInTheDocument() // Followers
      expect(screen.getByText('500')).toBeInTheDocument() // Following
      expect(screen.getByText('150')).toBeInTheDocument() // Posts
    })

    it('shows verification badge for verified accounts', () => {
      mockUseSWR.mockReturnValue({
        data: mockProfileData,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<ProfileCard username="testuser" />)

      expect(screen.getByText('Verified')).toBeInTheDocument()
    })

    it('shows private account indicator for private profiles', () => {
      const privateProfile = { ...mockProfileData, isPrivate: true }
      
      mockUseSWR.mockReturnValue({
        data: privateProfile,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      render(<ProfileCard username="testuser" />)

      expect(screen.getByText('Private')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('applies responsive classes correctly', () => {
      mockUseSWR.mockReturnValue({
        data: undefined,
        error: undefined,
        isLoading: false,
        mutate: jest.fn(),
        isValidating: false,
      })

      const { container } = render(<ProfileCard />)

      // Check for responsive padding classes
      expect(container.querySelector('.p-4')).toBeInTheDocument()
      expect(container.querySelector('.sm\\:p-6')).toBeInTheDocument()
      expect(container.querySelector('.lg\\:p-8')).toBeInTheDocument()
    })
  })

  describe('Data Fetching', () => {
    it('calls SWR with correct key when username is provided', () => {
      render(<ProfileCard username="testuser" />)

      expect(mockUseSWR).toHaveBeenCalledWith(
        '/api/profile?username=testuser',
        expect.any(Function)
      )
    })

    it('calls SWR with null key when no username is provided', () => {
      render(<ProfileCard />)

      expect(mockUseSWR).toHaveBeenCalledWith(
        null,
        expect.any(Function)
      )
    })
  })
})
