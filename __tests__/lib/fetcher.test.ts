import { fetcher } from '@/lib/fetcher'

// Mock global fetch
global.fetch = jest.fn()

describe('Fetcher Utility', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear()
  })

  describe('Successful Requests', () => {
    it('fetches and returns JSON data', async () => {
      const mockData = { id: 1, name: 'Test' }
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      const result = await fetcher('/api/test')

      expect(fetch).toHaveBeenCalledWith('/api/test')
      expect(result).toEqual(mockData)
    })

    it('handles different API endpoints', async () => {
      const mockProfileData = { id: '123', username: 'testuser' }
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfileData,
      })

      const result = await fetcher('/api/profile?username=testuser')

      expect(fetch).toHaveBeenCalledWith('/api/profile?username=testuser')
      expect(result).toEqual(mockProfileData)
    })

    it('works with posts endpoint', async () => {
      const mockPostsData = [
        { id: '1', caption: 'Test post 1' },
        { id: '2', caption: 'Test post 2' }
      ]
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPostsData,
      })

      const result = await fetcher('/api/posts?username=testuser')

      expect(result).toEqual(mockPostsData)
    })

    it('works with analytics endpoint', async () => {
      const mockAnalyticsData = {
        avgLikes: 1000,
        avgComments: 100,
        engagementRate: 5.5
      }
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalyticsData,
      })

      const result = await fetcher('/api/analytics?username=testuser')

      expect(result).toEqual(mockAnalyticsData)
    })
  })

  describe('Error Handling', () => {
    it('throws error when fetch fails', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      await expect(fetcher('/api/test')).rejects.toThrow('Network error')
    })

    it('throws error when response is not ok', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      await expect(fetcher('/api/test')).rejects.toThrow()
    })

    it('handles 500 server errors', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })

      await expect(fetcher('/api/test')).rejects.toThrow()
    })

    it('handles 401 unauthorized errors', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      })

      await expect(fetcher('/api/test')).rejects.toThrow()
    })

    it('handles malformed JSON responses', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        }
      })

      await expect(fetcher('/api/test')).rejects.toThrow('Invalid JSON')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty responses', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => null,
      })

      const result = await fetcher('/api/test')
      expect(result).toBeNull()
    })

    it('handles undefined responses', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => undefined,
      })

      const result = await fetcher('/api/test')
      expect(result).toBeUndefined()
    })

    it('handles array responses', async () => {
      const mockArray = [1, 2, 3]
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockArray,
      })

      const result = await fetcher('/api/test')
      expect(result).toEqual(mockArray)
    })

    it('handles string responses', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => 'test string',
      })

      const result = await fetcher('/api/test')
      expect(result).toBe('test string')
    })

    it('handles boolean responses', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => true,
      })

      const result = await fetcher('/api/test')
      expect(result).toBe(true)
    })
  })

  describe('Network Conditions', () => {
    it('handles timeout scenarios', async () => {
      jest.useFakeTimers()
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 5000)
      })
      
      ;(fetch as jest.Mock).mockReturnValueOnce(timeoutPromise)

      const fetchPromise = fetcher('/api/test')
      
      jest.advanceTimersByTime(5000)
      
      await expect(fetchPromise).rejects.toThrow('Timeout')
      
      jest.useRealTimers()
    })

    it('handles slow responses', async () => {
      const slowResponse = new Promise(resolve => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: async () => ({ data: 'slow response' })
          })
        }, 100)
      })
      
      ;(fetch as jest.Mock).mockReturnValueOnce(slowResponse)

      const result = await fetcher('/api/test')
      expect(result).toEqual({ data: 'slow response' })
    })
  })

  describe('URL Handling', () => {
    it('handles absolute URLs', async () => {
      const mockData = { test: true }
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      await fetcher('https://api.example.com/data')

      expect(fetch).toHaveBeenCalledWith('https://api.example.com/data')
    })

    it('handles URLs with query parameters', async () => {
      const mockData = { filtered: true }
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      await fetcher('/api/test?param1=value1&param2=value2')

      expect(fetch).toHaveBeenCalledWith('/api/test?param1=value1&param2=value2')
    })

    it('handles URLs with encoded characters', async () => {
      const mockData = { user: 'test user' }
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      const encodedUrl = '/api/profile?username=test%20user'
      await fetcher(encodedUrl)

      expect(fetch).toHaveBeenCalledWith(encodedUrl)
    })
  })

  describe('Content Types', () => {
    it('handles JSON content type', async () => {
      const mockData = { type: 'json' }
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Map([['content-type', 'application/json']]),
        json: async () => mockData,
      })

      const result = await fetcher('/api/test')
      expect(result).toEqual(mockData)
    })

    it('handles different response content types gracefully', async () => {
      const mockData = { mixed: 'content' }
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        headers: new Map([['content-type', 'text/plain']]),
        json: async () => mockData,
      })

      const result = await fetcher('/api/test')
      expect(result).toEqual(mockData)
    })
  })
})
