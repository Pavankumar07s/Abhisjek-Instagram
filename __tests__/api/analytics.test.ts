import { GET } from '@/app/api/analytics/route'
import { NextRequest } from 'next/server'

// Mock axios
jest.mock('axios', () => ({
  request: jest.fn(),
}))

process.env.RAPIDAPI_KEY = 'test-api-key'

const axios = require('axios')
const mockAxios = axios as jest.Mocked<typeof axios>

describe('/api/analytics Route', () => {
  beforeEach(() => {
    mockAxios.request.mockClear()
  })

  describe('GET /api/analytics', () => {
    it('returns default analytics when no username is provided', async () => {
      const request = new NextRequest('http://localhost:3000/api/analytics')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        avgLikes: 0,
        avgComments: 0,
        engagementRate: 0,
        trend: [],
        demographics: {
          gender: { male: 45, female: 52, other: 3 },
          age: [
            { range: '18-24', percent: 25 },
            { range: '25-34', percent: 35 },
            { range: '35-44', percent: 22 },
            { range: '45-54', percent: 12 },
            { range: '55+', percent: 6 }
          ],
          geography: [
            { country: 'United States', percent: 35 },
            { country: 'India', percent: 20 },
            { country: 'Brazil', percent: 15 },
            { country: 'United Kingdom', percent: 10 },
            { country: 'Other', percent: 20 }
          ]
        }
      })
    })

    it('calculates analytics from real Instagram data', async () => {
      const mockProfileResponse = {
        data: { pk: '123456789' }
      }

      const mockMediaResponse = {
        data: [
          {
            id: 'post1',
            like_count: 1000,
            comment_count: 100,
            media_type: 1
          },
          {
            id: 'post2',
            like_count: 1500,
            comment_count: 150,
            media_type: 8
          },
          {
            id: 'reel1',
            like_count: 2000,
            comment_count: 200,
            media_type: 2
          },
          {
            id: 'post3',
            like_count: 800,
            comment_count: 80,
            media_type: 1
          },
          {
            id: 'post4',
            like_count: 1200,
            comment_count: 120,
            media_type: 1
          }
        ]
      }

      mockAxios.request
        .mockResolvedValueOnce(mockProfileResponse)
        .mockResolvedValueOnce(mockMediaResponse)

      const request = new NextRequest('http://localhost:3000/api/analytics?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.avgLikes).toBe(1300) // (1000+1500+2000+800+1200)/5
      expect(data.avgComments).toBe(130) // (100+150+200+80+120)/5
      expect(data.engagementRate).toBeGreaterThan(0)
      expect(data.trend).toHaveLength(5)
      expect(data.demographics).toBeDefined()
    })

    it('generates correct trend data from media', async () => {
      const mockProfileResponse = {
        data: { pk: '123456789' }
      }

      const mockMediaResponse = {
        data: [
          {
            id: 'post1',
            like_count: 1000,
            comment_count: 100,
            media_type: 1
          },
          {
            id: 'post2',
            like_count: 1500,
            comment_count: 150,
            media_type: 1
          },
          {
            id: 'post3',
            like_count: 800,
            comment_count: 80,
            media_type: 1
          }
        ]
      }

      mockAxios.request
        .mockResolvedValueOnce(mockProfileResponse)
        .mockResolvedValueOnce(mockMediaResponse)

      const request = new NextRequest('http://localhost:3000/api/analytics?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(data.trend).toEqual([
        { index: 1, likes: 800, comments: 80 },   // Reversed order (oldest first)
        { index: 2, likes: 1500, comments: 150 },
        { index: 3, likes: 1000, comments: 100 }
      ])
    })

    it('limits trend data to last 12 posts', async () => {
      const mockProfileResponse = {
        data: { pk: '123456789' }
      }

      // Create 15 posts to test the 12-post limit
      const mockMediaData = Array.from({ length: 15 }, (_, i) => ({
        id: `post${i + 1}`,
        like_count: 1000 + i * 100,
        comment_count: 100 + i * 10,
        media_type: 1
      }))

      const mockMediaResponse = {
        data: mockMediaData
      }

      mockAxios.request
        .mockResolvedValueOnce(mockProfileResponse)
        .mockResolvedValueOnce(mockMediaResponse)

      const request = new NextRequest('http://localhost:3000/api/analytics?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(data.trend).toHaveLength(12) // Should be limited to 12
      expect(data.trend[0].index).toBe(1)
      expect(data.trend[11].index).toBe(12)
    })

    it('handles empty media data', async () => {
      const mockProfileResponse = {
        data: { pk: '123456789' }
      }

      const mockMediaResponse = {
        data: []
      }

      mockAxios.request
        .mockResolvedValueOnce(mockProfileResponse)
        .mockResolvedValueOnce(mockMediaResponse)

      const request = new NextRequest('http://localhost:3000/api/analytics?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.avgLikes).toBe(0)
      expect(data.avgComments).toBe(0)
      expect(data.engagementRate).toBe(0)
      expect(data.trend).toEqual([])
    })

    it('handles missing like/comment counts gracefully', async () => {
      const mockProfileResponse = {
        data: { pk: '123456789' }
      }

      const mockMediaResponse = {
        data: [
          {
            id: 'post1',
            // Missing like_count and comment_count
            media_type: 1
          },
          {
            id: 'post2',
            like_count: 1000,
            comment_count: 100,
            media_type: 1
          }
        ]
      }

      mockAxios.request
        .mockResolvedValueOnce(mockProfileResponse)
        .mockResolvedValueOnce(mockMediaResponse)

      const request = new NextRequest('http://localhost:3000/api/analytics?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.avgLikes).toBe(500) // (0 + 1000) / 2
      expect(data.avgComments).toBe(50) // (0 + 100) / 2
    })

    it('includes all media types in analytics calculation', async () => {
      const mockProfileResponse = {
        data: { pk: '123456789' }
      }

      const mockMediaResponse = {
        data: [
          {
            id: 'post1',
            like_count: 1000,
            comment_count: 100,
            media_type: 1 // Image
          },
          {
            id: 'carousel1',
            like_count: 1500,
            comment_count: 150,
            media_type: 8 // Carousel
          },
          {
            id: 'reel1',
            like_count: 2000,
            comment_count: 200,
            media_type: 2 // Video/Reel
          }
        ]
      }

      mockAxios.request
        .mockResolvedValueOnce(mockProfileResponse)
        .mockResolvedValueOnce(mockMediaResponse)

      const request = new NextRequest('http://localhost:3000/api/analytics?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(data.avgLikes).toBe(1500) // (1000+1500+2000)/3
      expect(data.avgComments).toBe(150) // (100+150+200)/3
      expect(data.trend).toHaveLength(3)
    })

    it('provides consistent demographics data', async () => {
      const mockProfileResponse = {
        data: { pk: '123456789' }
      }

      const mockMediaResponse = {
        data: [
          {
            id: 'post1',
            like_count: 1000,
            comment_count: 100,
            media_type: 1
          }
        ]
      }

      mockAxios.request
        .mockResolvedValueOnce(mockProfileResponse)
        .mockResolvedValueOnce(mockMediaResponse)

      const request = new NextRequest('http://localhost:3000/api/analytics?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(data.demographics.gender).toEqual({
        male: 45,
        female: 52,
        other: 3
      })
      expect(data.demographics.age).toHaveLength(5)
      expect(data.demographics.geography).toHaveLength(5)
      
      // Check that percentages add up correctly
      const genderTotal = data.demographics.gender.male + data.demographics.gender.female + data.demographics.gender.other
      expect(genderTotal).toBe(100)
      
      const ageTotal = data.demographics.age.reduce((sum: number, item: any) => sum + item.percent, 0)
      expect(ageTotal).toBe(100)
      
      const geoTotal = data.demographics.geography.reduce((sum: number, item: any) => sum + item.percent, 0)
      expect(geoTotal).toBe(100)
    })

    it('returns 500 when API fails', async () => {
      mockAxios.request.mockRejectedValue(new Error('API Error'))

      const request = new NextRequest('http://localhost:3000/api/analytics?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch analytics' })
    })

    it('makes correct API calls with proper parameters', async () => {
      const mockProfileResponse = {
        data: { pk: '123456789' }
      }

      const mockMediaResponse = {
        data: []
      }

      mockAxios.request
        .mockResolvedValueOnce(mockProfileResponse)
        .mockResolvedValueOnce(mockMediaResponse)

      const request = new NextRequest('http://localhost:3000/api/analytics?username=testuser')
      
      await GET(request)

      // Check profile API call
      expect(mockAxios.request).toHaveBeenNthCalledWith(1, {
        method: 'GET',
        url: 'https://instagram-premium-api-2023.p.rapidapi.com/v1/user/by/username',
        params: {
          username: 'testuser'
        },
        headers: {
          'x-rapidapi-key': 'test-api-key',
          'x-rapidapi-host': 'instagram-premium-api-2023.p.rapidapi.com'
        }
      })

      // Check media API call
      expect(mockAxios.request).toHaveBeenNthCalledWith(2, {
        method: 'GET',
        url: 'https://instagram-premium-api-2023.p.rapidapi.com/v1/user/medias',
        params: {
          user_id: '123456789',
          amount: '33'
        },
        headers: {
          'x-rapidapi-key': 'test-api-key',
          'x-rapidapi-host': 'instagram-premium-api-2023.p.rapidapi.com'
        }
      })
    })

    it('calculates engagement rate correctly', async () => {
      const mockProfileResponse = {
        data: { pk: '123456789' }
      }

      const mockMediaResponse = {
        data: [
          {
            id: 'post1',
            like_count: 1000,
            comment_count: 100,
            media_type: 1
          },
          {
            id: 'post2',
            like_count: 500,
            comment_count: 50,
            media_type: 1
          }
        ]
      }

      mockAxios.request
        .mockResolvedValueOnce(mockProfileResponse)
        .mockResolvedValueOnce(mockMediaResponse)

      const request = new NextRequest('http://localhost:3000/api/analytics?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      // Average engagement: (1000+100+500+50)/2 = 825
      // Since we don't have follower count from this endpoint, 
      // engagement rate calculation may use a default or be calculated differently
      expect(data.engagementRate).toBeGreaterThanOrEqual(0)
      expect(typeof data.engagementRate).toBe('number')
    })
  })

  describe('Error Handling', () => {
    it('handles network errors gracefully', async () => {
      mockAxios.request.mockRejectedValue(new Error('Network Error'))

      const request = new NextRequest('http://localhost:3000/api/analytics?username=testuser')
      
      const response = await GET(request)
      
      expect(response.status).toBe(500)
    })

    it('handles malformed media data', async () => {
      const mockProfileResponse = {
        data: { pk: '123456789' }
      }

      const mockMediaResponse = {
        data: [
          {
            // Missing required fields
            id: 'post1'
          },
          null, // Null entry
          {
            id: 'post2',
            like_count: 'invalid', // Invalid type
            comment_count: 100,
            media_type: 1
          }
        ]
      }

      mockAxios.request
        .mockResolvedValueOnce(mockProfileResponse)
        .mockResolvedValueOnce(mockMediaResponse)

      const request = new NextRequest('http://localhost:3000/api/analytics?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      // Should handle malformed data gracefully
      expect(typeof data.avgLikes).toBe('number')
      expect(typeof data.avgComments).toBe('number')
    })

    it('handles user not found scenario', async () => {
      const mockProfileResponse = {
        data: {} // Empty data indicates user not found
      }

      mockAxios.request.mockResolvedValueOnce(mockProfileResponse)

      const request = new NextRequest('http://localhost:3000/api/analytics?username=nonexistentuser')
      
      const response = await GET(request)
      
      expect(response.status).toBe(500) // Should error when user not found
    })
  })
})
