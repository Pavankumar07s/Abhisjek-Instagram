import { GET } from '@/app/api/posts/route'
import { NextRequest } from 'next/server'

// Mock axios
jest.mock('axios', () => ({
  request: jest.fn(),
}))

process.env.RAPIDAPI_KEY = 'test-api-key'

const axios = require('axios')
const mockAxios = axios as jest.Mocked<typeof axios>

describe('/api/posts Route', () => {
  beforeEach(() => {
    mockAxios.request.mockClear()
  })

  describe('GET /api/posts', () => {
    it('returns empty array when no username is provided', async () => {
      const request = new NextRequest('http://localhost:3000/api/posts')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual([])
    })

    it('fetches and returns posts data for valid username', async () => {
      const mockProfileResponse = {
        data: {
          pk: '123456789'
        }
      }

      const mockMediaResponse = {
        data: [
          {
            id: 'post1',
            pk: 'pk1',
            code: 'CODE1',
            taken_at: '2023-01-01T00:00:00Z',
            media_type: 1, // Image
            thumbnail_url: 'https://example.com/image1.jpg',
            image_versions: [
              {
                height: 640,
                url: 'https://example.com/image1_640.jpg',
                width: 640
              }
            ],
            caption_text: 'Test post 1',
            like_count: 100,
            comment_count: 10,
            user: {
              pk: '123456789',
              username: 'testuser',
              full_name: 'Test User',
              profile_pic_url: 'https://example.com/profile.jpg',
              is_verified: true
            }
          },
          {
            id: 'post2',
            pk: 'pk2',
            code: 'CODE2',
            taken_at: '2023-01-02T00:00:00Z',
            media_type: 8, // Carousel
            thumbnail_url: 'https://example.com/image2.jpg',
            caption_text: 'Test carousel post',
            like_count: 200,
            comment_count: 20,
            user: {
              pk: '123456789',
              username: 'testuser',
              full_name: 'Test User',
              profile_pic_url: 'https://example.com/profile.jpg',
              is_verified: false
            },
            resources: [
              {
                pk: 'res1',
                thumbnail_url: 'https://example.com/carousel1.jpg',
                media_type: 1
              },
              {
                pk: 'res2',
                thumbnail_url: 'https://example.com/carousel2.jpg',
                media_type: 1
              }
            ]
          },
          {
            id: 'reel1',
            pk: 'pk3',
            code: 'REEL1',
            taken_at: '2023-01-03T00:00:00Z',
            media_type: 2, // Video/Reel (should be filtered out)
            thumbnail_url: 'https://example.com/reel1.jpg',
            caption_text: 'Test reel',
            like_count: 500,
            comment_count: 50,
            user: {
              pk: '123456789',
              username: 'testuser',
              full_name: 'Test User',
              profile_pic_url: 'https://example.com/profile.jpg',
              is_verified: false
            }
          }
        ]
      }

      mockAxios.request
        .mockResolvedValueOnce(mockProfileResponse) // Profile call
        .mockResolvedValueOnce(mockMediaResponse) // Media call

      const request = new NextRequest('http://localhost:3000/api/posts?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveLength(2) // Only posts, not reels
      expect(data[0]).toEqual({
        id: 'post1',
        pk: 'pk1',
        code: 'CODE1',
        takenAt: '2023-01-01T00:00:00Z',
        mediaType: 1,
        thumbnailUrl: '/api/image-proxy?url=https%3A//example.com/image1.jpg',
        imageVersions: [
          {
            height: 640,
            url: '/api/image-proxy?url=https%3A//example.com/image1_640.jpg',
            width: 640
          }
        ],
        captionText: 'Test post 1',
        likeCount: 100,
        commentCount: 10,
        user: {
          pk: '123456789',
          username: 'testuser',
          fullName: 'Test User',
          profilePicUrl: '/api/image-proxy?url=https%3A//example.com/profile.jpg',
          isVerified: true
        },
        resources: undefined
      })
    })

    it('filters out reels and only returns posts', async () => {
      const mockProfileResponse = {
        data: { pk: '123456789' }
      }

      const mockMediaResponse = {
        data: [
          {
            id: 'post1',
            pk: 'pk1',
            code: 'CODE1',
            taken_at: '2023-01-01T00:00:00Z',
            media_type: 1, // Image post
            thumbnail_url: 'https://example.com/image1.jpg',
            caption_text: 'Post',
            like_count: 100,
            comment_count: 10,
            user: {
              pk: '123456789',
              username: 'testuser',
              full_name: 'Test User',
              profile_pic_url: 'https://example.com/profile.jpg',
              is_verified: false
            }
          },
          {
            id: 'reel1',
            pk: 'pk2',
            code: 'REEL1',
            taken_at: '2023-01-02T00:00:00Z',
            media_type: 2, // Video/Reel
            thumbnail_url: 'https://example.com/reel1.jpg',
            caption_text: 'Reel',
            like_count: 200,
            comment_count: 20,
            user: {
              pk: '123456789',
              username: 'testuser',
              full_name: 'Test User',
              profile_pic_url: 'https://example.com/profile.jpg',
              is_verified: false
            }
          },
          {
            id: 'carousel1',
            pk: 'pk3',
            code: 'CAR1',
            taken_at: '2023-01-03T00:00:00Z',
            media_type: 8, // Carousel post
            thumbnail_url: 'https://example.com/carousel1.jpg',
            caption_text: 'Carousel',
            like_count: 300,
            comment_count: 30,
            user: {
              pk: '123456789',
              username: 'testuser',
              full_name: 'Test User',
              profile_pic_url: 'https://example.com/profile.jpg',
              is_verified: false
            }
          }
        ]
      }

      mockAxios.request
        .mockResolvedValueOnce(mockProfileResponse)
        .mockResolvedValueOnce(mockMediaResponse)

      const request = new NextRequest('http://localhost:3000/api/posts?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveLength(2) // Only posts (image and carousel), not reel
      expect(data[0].mediaType).toBe(1) // Image
      expect(data[1].mediaType).toBe(8) // Carousel
    })

    it('handles carousel posts with resources correctly', async () => {
      const mockProfileResponse = {
        data: { pk: '123456789' }
      }

      const mockMediaResponse = {
        data: [
          {
            id: 'carousel1',
            pk: 'pk1',
            code: 'CAR1',
            taken_at: '2023-01-01T00:00:00Z',
            media_type: 8,
            thumbnail_url: 'https://example.com/carousel_main.jpg',
            caption_text: 'Carousel post',
            like_count: 300,
            comment_count: 30,
            user: {
              pk: '123456789',
              username: 'testuser',
              full_name: 'Test User',
              profile_pic_url: 'https://example.com/profile.jpg',
              is_verified: true
            },
            resources: [
              {
                pk: 'res1',
                thumbnail_url: 'https://example.com/carousel1.jpg',
                media_type: 1,
                image_versions: [
                  {
                    height: 640,
                    url: 'https://example.com/carousel1_640.jpg',
                    width: 640
                  }
                ]
              },
              {
                pk: 'res2',
                thumbnail_url: 'https://example.com/carousel2.jpg',
                media_type: 1,
                image_versions: [
                  {
                    height: 640,
                    url: 'https://example.com/carousel2_640.jpg',
                    width: 640
                  }
                ]
              }
            ]
          }
        ]
      }

      mockAxios.request
        .mockResolvedValueOnce(mockProfileResponse)
        .mockResolvedValueOnce(mockMediaResponse)

      const request = new NextRequest('http://localhost:3000/api/posts?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data[0].resources).toHaveLength(2)
      expect(data[0].resources[0]).toEqual({
        pk: 'res1',
        thumbnailUrl: '/api/image-proxy?url=https%3A//example.com/carousel1.jpg',
        mediaType: 1,
        imageVersions: [
          {
            height: 640,
            url: '/api/image-proxy?url=https%3A//example.com/carousel1_640.jpg',
            width: 640
          }
        ]
      })
    })

    it('handles missing optional fields gracefully', async () => {
      const mockProfileResponse = {
        data: { pk: '123456789' }
      }

      const mockMediaResponse = {
        data: [
          {
            id: 'post1',
            pk: 'pk1',
            code: 'CODE1',
            taken_at: '2023-01-01T00:00:00Z',
            media_type: 1,
            // Missing thumbnail_url, caption_text, like_count, comment_count
            user: {
              pk: '123456789',
              username: 'testuser',
              full_name: 'Test User',
              profile_pic_url: 'https://example.com/profile.jpg'
              // Missing is_verified
            }
          }
        ]
      }

      mockAxios.request
        .mockResolvedValueOnce(mockProfileResponse)
        .mockResolvedValueOnce(mockMediaResponse)

      const request = new NextRequest('http://localhost:3000/api/posts?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data[0]).toEqual({
        id: 'post1',
        pk: 'pk1',
        code: 'CODE1',
        takenAt: '2023-01-01T00:00:00Z',
        mediaType: 1,
        thumbnailUrl: '/placeholder.jpg', // Default fallback
        imageVersions: undefined,
        captionText: '', // Default empty string
        likeCount: 0, // Default 0
        commentCount: 0, // Default 0
        user: {
          pk: '123456789',
          username: 'testuser',
          fullName: 'Test User',
          profilePicUrl: '/api/image-proxy?url=https%3A//example.com/profile.jpg',
          isVerified: false // Default false
        },
        resources: undefined
      })
    })

    it('returns 404 when user is not found', async () => {
      const mockProfileResponse = {
        data: {
          // Missing pk indicates user not found
        }
      }

      mockAxios.request.mockResolvedValueOnce(mockProfileResponse)

      const request = new NextRequest('http://localhost:3000/api/posts?username=nonexistentuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data).toEqual({ error: 'User not found' })
    })

    it('returns 500 when API fails', async () => {
      mockAxios.request.mockRejectedValue(new Error('API Error'))

      const request = new NextRequest('http://localhost:3000/api/posts?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch posts' })
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

      const request = new NextRequest('http://localhost:3000/api/posts?username=testuser')
      
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

    it('properly encodes URLs for image proxy', async () => {
      const complexImageUrl = 'https://scontent-atl3-2.cdninstagram.com/v/t51.2885-15/123456789_123456789123456789_123456789123456789_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-atl3-2.cdninstagram.com&_nc_cat=1&_nc_ohc=abcdefg&edm=ABfd0MgBAAAA&ccb=7-5&ig_cache_key=YW5vbnltb3VzX3Byb2ZpbGVfcGlj.2-ccb7-5&tp=1&_nc_sid=abcdef'

      const mockProfileResponse = {
        data: { pk: '123456789' }
      }

      const mockMediaResponse = {
        data: [
          {
            id: 'post1',
            pk: 'pk1',
            code: 'CODE1',
            taken_at: '2023-01-01T00:00:00Z',
            media_type: 1,
            thumbnail_url: complexImageUrl,
            caption_text: 'Test post',
            like_count: 100,
            comment_count: 10,
            user: {
              pk: '123456789',
              username: 'testuser',
              full_name: 'Test User',
              profile_pic_url: complexImageUrl,
              is_verified: false
            }
          }
        ]
      }

      mockAxios.request
        .mockResolvedValueOnce(mockProfileResponse)
        .mockResolvedValueOnce(mockMediaResponse)

      const request = new NextRequest('http://localhost:3000/api/posts?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(data[0].thumbnailUrl).toBe(`/api/image-proxy?url=${encodeURIComponent(complexImageUrl)}`)
      expect(data[0].user.profilePicUrl).toBe(`/api/image-proxy?url=${encodeURIComponent(complexImageUrl)}`)
    })

    it('handles empty media response', async () => {
      const mockProfileResponse = {
        data: { pk: '123456789' }
      }

      const mockMediaResponse = {
        data: []
      }

      mockAxios.request
        .mockResolvedValueOnce(mockProfileResponse)
        .mockResolvedValueOnce(mockMediaResponse)

      const request = new NextRequest('http://localhost:3000/api/posts?username=testuser')
      
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual([])
    })
  })
})
