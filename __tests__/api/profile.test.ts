import { GET } from '@/app/api/profile/route'
import { NextRequest } from 'next/server'

// Mock axios
jest.mock('axios', () => ({
  request: jest.fn(),
}))

// Mock environment variables
process.env.RAPIDAPI_KEY = 'test-api-key'

const axios = require('axios')
const mockAxios = axios as jest.Mocked<typeof axios>

describe('/api/profile Route', () => {
  beforeEach(() => {
    mockAxios.request.mockClear()
  })

  describe('GET /api/profile', () => {
    it('returns null when no username is provided', async () => {
      const request = new NextRequest('http://localhost:3000/api/profile')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toBeNull()
    })

    it('fetches and returns profile data for valid username', async () => {
      const mockInstagramResponse = {
        data: {
          user: {
            id: '123456789',
            username: 'testuser',
            full_name: 'Test User',
            profile_pic_url_hd: 'https://example.com/profile.jpg',
            edge_followed_by: { count: 10000 },
            edge_follow: { count: 500 },
            edge_owner_to_timeline_media: { count: 150 },
            biography: 'Test biography',
            bio_links: [],
            category_name: 'Content Creator',
            is_verified: true,
            is_private: false
          }
        }
      }

      mockAxios.request.mockResolvedValue(mockInstagramResponse)

      const request = new NextRequest('http://localhost:3000/api/profile?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        id: '123456789',
        name: 'Test User',
        username: 'testuser',
        profilePic: '/api/image-proxy?url=https%3A//example.com/profile.jpg',
        followers: 10000,
        following: 500,
        postsCount: 150,
        biography: 'Test biography',
        bioLinks: [],
        categoryName: 'Content Creator',
        isVerified: true,
        isPrivate: false
      })
    })

    it('calls Instagram API with correct parameters', async () => {
      const mockInstagramResponse = {
        data: {
          user: {
            id: '123',
            username: 'testuser',
            full_name: 'Test User',
            profile_pic_url_hd: 'https://example.com/profile.jpg',
            edge_followed_by: { count: 1000 },
            edge_follow: { count: 100 },
            edge_owner_to_timeline_media: { count: 50 },
            biography: '',
            bio_links: [],
            category_name: '',
            is_verified: false,
            is_private: false
          }
        }
      }

      mockAxios.request.mockResolvedValue(mockInstagramResponse)

      const request = new NextRequest('http://localhost:3000/api/profile?username=testuser')
      
      await GET(request)

      expect(mockAxios.request).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://instagram-premium-api-2023.p.rapidapi.com/v1/user/web_profile_info',
        params: {
          username: 'testuser'
        },
        headers: {
          'x-rapidapi-key': 'test-api-key',
          'x-rapidapi-host': 'instagram-premium-api-2023.p.rapidapi.com'
        }
      })
    })

    it('falls back to mock data when Instagram API fails', async () => {
      mockAxios.request.mockRejectedValue(new Error('API Error'))

      const request = new NextRequest('http://localhost:3000/api/profile?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('id')
      expect(data).toHaveProperty('username')
      expect(data).toHaveProperty('followers')
    })

    it('handles missing user data in API response', async () => {
      const mockInstagramResponse = {
        data: {
          user: null
        }
      }

      mockAxios.request.mockResolvedValue(mockInstagramResponse)

      const request = new NextRequest('http://localhost:3000/api/profile?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('id')
      expect(data).toHaveProperty('username')
    })

    it('properly encodes image URLs for proxy', async () => {
      const profileImageUrl = 'https://scontent-atl3-2.cdninstagram.com/v/t51.2885-19/123456789_123456789123456789_123456789123456789_n.jpg?stp=dst-jpg_s150x150&_nc_ht=scontent-atl3-2.cdninstagram.com&_nc_cat=1&_nc_ohc=abcdefg&edm=ABfd0MgBAAAA&ccb=7-5&oh=abc123&ig_cache_key=YW5vbnltb3VzX3Byb2ZpbGVfcGlj.2-ccb7-5&tp=1&_nc_sid=abcdef'

      const mockInstagramResponse = {
        data: {
          user: {
            id: '123',
            username: 'testuser',
            full_name: 'Test User',
            profile_pic_url_hd: profileImageUrl,
            edge_followed_by: { count: 1000 },
            edge_follow: { count: 100 },
            edge_owner_to_timeline_media: { count: 50 },
            biography: '',
            bio_links: [],
            category_name: '',
            is_verified: false,
            is_private: false
          }
        }
      }

      mockAxios.request.mockResolvedValue(mockInstagramResponse)

      const request = new NextRequest('http://localhost:3000/api/profile?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(data.profilePic).toContain('/api/image-proxy?url=')
      expect(data.profilePic).toContain(encodeURIComponent(profileImageUrl))
    })

    it('handles usernames with special characters', async () => {
      const mockInstagramResponse = {
        data: {
          user: {
            id: '123',
            username: 'user.name_123',
            full_name: 'User Name',
            profile_pic_url_hd: 'https://example.com/profile.jpg',
            edge_followed_by: { count: 1000 },
            edge_follow: { count: 100 },
            edge_owner_to_timeline_media: { count: 50 },
            biography: '',
            bio_links: [],
            category_name: '',
            is_verified: false,
            is_private: false
          }
        }
      }

      mockAxios.request.mockResolvedValue(mockInstagramResponse)

      const request = new NextRequest('http://localhost:3000/api/profile?username=user.name_123')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.username).toBe('user.name_123')
    })

    it('handles bio links correctly', async () => {
      const mockBioLinks = [
        {
          title: 'My Website',
          url: 'https://example.com',
          link_type: 'external'
        },
        {
          title: 'Shop',
          url: 'https://shop.example.com',
          link_type: 'external'
        }
      ]

      const mockInstagramResponse = {
        data: {
          user: {
            id: '123',
            username: 'testuser',
            full_name: 'Test User',
            profile_pic_url_hd: 'https://example.com/profile.jpg',
            edge_followed_by: { count: 1000 },
            edge_follow: { count: 100 },
            edge_owner_to_timeline_media: { count: 50 },
            biography: 'Check out my links!',
            bio_links: mockBioLinks,
            category_name: 'Business',
            is_verified: true,
            is_private: false
          }
        }
      }

      mockAxios.request.mockResolvedValue(mockInstagramResponse)

      const request = new NextRequest('http://localhost:3000/api/profile?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(data.bioLinks).toEqual(mockBioLinks)
    })

    it('handles private account status correctly', async () => {
      const mockInstagramResponse = {
        data: {
          user: {
            id: '123',
            username: 'privateuser',
            full_name: 'Private User',
            profile_pic_url_hd: 'https://example.com/profile.jpg',
            edge_followed_by: { count: 1000 },
            edge_follow: { count: 100 },
            edge_owner_to_timeline_media: { count: 50 },
            biography: 'Private account',
            bio_links: [],
            category_name: '',
            is_verified: false,
            is_private: true
          }
        }
      }

      mockAxios.request.mockResolvedValue(mockInstagramResponse)

      const request = new NextRequest('http://localhost:3000/api/profile?username=privateuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(data.isPrivate).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('handles network errors gracefully', async () => {
      mockAxios.request.mockRejectedValue(new Error('Network Error'))

      const request = new NextRequest('http://localhost:3000/api/profile?username=testuser')
      
      const response = await GET(request)
      
      expect(response.status).toBe(200)
      // Should return mock data as fallback
    })

    it('handles API rate limiting', async () => {
      mockAxios.request.mockRejectedValue({
        response: {
          status: 429,
          data: { message: 'Rate limit exceeded' }
        }
      })

      const request = new NextRequest('http://localhost:3000/api/profile?username=testuser')
      
      const response = await GET(request)
      
      expect(response.status).toBe(200)
      // Should return mock data as fallback
    })

    it('handles malformed API responses', async () => {
      mockAxios.request.mockResolvedValue({
        data: {
          // Malformed response missing user object
          error: 'User not found'
        }
      })

      const request = new NextRequest('http://localhost:3000/api/profile?username=nonexistentuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('id')
    })
  })
})
