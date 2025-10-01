import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchHeader } from '@/components/search-header'

// Mock Next.js router
const mockPush = jest.fn()
const mockGet = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}))

describe('SearchHeader Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGet.mockReturnValue(null)
  })

  it('renders search input and button', () => {
    render(<SearchHeader />)
    
    const input = screen.getByPlaceholderText(/Enter Instagram username/)
    const button = screen.getByRole('button', { name: /search/i })
    
    expect(input).toBeInTheDocument()
    expect(button).toBeInTheDocument()
  })

  it('updates input value when user types', async () => {
    const user = userEvent.setup()
    render(<SearchHeader />)

    const input = screen.getByPlaceholderText(/Enter Instagram username/)
    
    await user.type(input, 'testuser')
    
    expect(input).toHaveValue('testuser')
  })

  it('navigates to profile when search button is clicked', async () => {
    const user = userEvent.setup()
    render(<SearchHeader />)

    const input = screen.getByPlaceholderText(/Enter Instagram username/)
    const searchButton = screen.getByRole('button', { name: /search/i })

    await user.type(input, 'testuser')
    await user.click(searchButton)

    expect(mockPush).toHaveBeenCalledWith('/?username=testuser')
  })
})
