import { 
  getProfileFor, 
  getPostsFor, 
  getReelsFor, 
  getAnalyticsFor 
} from '@/lib/mock-data'

describe('Mock Data Utilities', () => {
  describe('getProfileFor', () => {
    it('generates consistent profile data for same username', () => {
      const profile1 = getProfileFor('testuser')
      const profile2 = getProfileFor('testuser')

      expect(profile1).toEqual(profile2)
      expect(profile1.username).toBe('@testuser')
    })

    it('generates different data for different usernames', () => {
      const profile1 = getProfileFor('user1')
      const profile2 = getProfileFor('user2')

      expect(profile1.id).not.toEqual(profile2.id)
      expect(profile1.name).not.toEqual(profile2.name)
      expect(profile1.username).toBe('@user1')
      expect(profile2.username).toBe('@user2')
    })

    it('includes all required profile fields', () => {
      const profile = getProfileFor('testuser')

      expect(profile).toHaveProperty('id')
      expect(profile).toHaveProperty('name')
      expect(profile).toHaveProperty('username')
      expect(profile).toHaveProperty('profilePic')
      expect(profile).toHaveProperty('followers')
      expect(profile).toHaveProperty('following')
      expect(profile).toHaveProperty('postsCount')
    })

    it('generates realistic follower counts', () => {
      const profile = getProfileFor('testuser')

      expect(profile.followers).toBeGreaterThan(0)
      expect(profile.following).toBeGreaterThan(0)
      expect(profile.postsCount).toBeGreaterThanOrEqual(0)
      expect(typeof profile.followers).toBe('number')
      expect(typeof profile.following).toBe('number')
      expect(typeof profile.postsCount).toBe('number')
    })

    it('handles usernames with special characters', () => {
      const profile1 = getProfileFor('user.name_123')
      const profile2 = getProfileFor('user-name-456')

      expect(profile1.username).toBe('@user.name_123')
      expect(profile2.username).toBe('@user-name-456')
      expect(profile1.id).not.toEqual(profile2.id)
    })

    it('includes profile picture URL', () => {
      const profile = getProfileFor('testuser')

      expect(profile.profilePic).toContain('diverse-user-avatars.png')
    })

    it('generates proper display names from usernames', () => {
      const profile1 = getProfileFor('john.doe')
      const profile2 = getProfileFor('jane_smith')

      expect(profile1.name).toBe('John Doe')
      expect(profile2.name).toBe('Jane Smith')
    })
  })

  describe('getPostsFor', () => {
    it('generates consistent posts for same username', () => {
      const posts1 = getPostsFor('testuser')
      const posts2 = getPostsFor('testuser')

      expect(posts1).toEqual(posts2)
      expect(posts1.length).toBe(posts2.length)
    })

    it('generates different posts for different usernames', () => {
      const posts1 = getPostsFor('user1')
      const posts2 = getPostsFor('user2')

      expect(posts1[0].id).not.toEqual(posts2[0].id)
      // Type assertion for mock data structure
      expect((posts1[0] as any).profileId).not.toEqual((posts2[0] as any).profileId)
    })

    it('generates exactly 10 posts', () => {
      const posts = getPostsFor('testuser')

      expect(posts).toHaveLength(10)
    })

    it('includes all required post fields', () => {
      const posts = getPostsFor('testuser')
      const post = posts[0] as any // Type assertion for mock data

      expect(post).toHaveProperty('id')
      expect(post).toHaveProperty('profileId')
      expect(post).toHaveProperty('imageUrl')
      expect(post).toHaveProperty('caption')
      expect(post).toHaveProperty('likes')
      expect(post).toHaveProperty('comments')
      expect(post).toHaveProperty('tags')
      expect(post).toHaveProperty('vibe')
    })

    it('generates realistic engagement numbers', () => {
      const posts = getPostsFor('testuser')
      
      posts.forEach(post => {
        const mockPost = post as any
        expect(mockPost.likes).toBeGreaterThan(0)
        expect(mockPost.comments).toBeGreaterThan(0)
        expect(mockPost.likes).toBeGreaterThan(mockPost.comments) // Generally likes > comments
        expect(typeof mockPost.likes).toBe('number')
        expect(typeof mockPost.comments).toBe('number')
      })
    })

    it('generates valid tags and vibes', () => {
      const posts = getPostsFor('testuser')
      
      posts.forEach(post => {
        const mockPost = post as any
        expect(Array.isArray(mockPost.tags)).toBe(true)
        expect(mockPost.tags.length).toBeGreaterThan(0)
        expect(typeof mockPost.vibe).toBe('string')
        expect(mockPost.vibe.length).toBeGreaterThan(0)
      })
    })

    it('links posts to correct profile', () => {
      const username = 'testuser'
      const profile = getProfileFor(username)
      const posts = getPostsFor(username)
      
      posts.forEach(post => {
        const mockPost = post as any
        expect(mockPost.profileId).toBe(profile.id)
      })
    })

    it('generates different captions', () => {
      const posts = getPostsFor('testuser')
      const captions = posts.map(post => (post as any).caption)
      const uniqueCaptions = new Set(captions)
      
      // Should have some variety in captions (at least half should be unique)
      expect(uniqueCaptions.size).toBeGreaterThanOrEqual(captions.length / 2)
    })
  })

  describe('getReelsFor', () => {
    it('generates consistent reels for same username', () => {
      const reels1 = getReelsFor('testuser')
      const reels2 = getReelsFor('testuser')

      expect(reels1).toEqual(reels2)
      expect(reels1.length).toBe(reels2.length)
    })

    it('generates exactly 5 reels', () => {
      const reels = getReelsFor('testuser')

      expect(reels).toHaveLength(5)
    })

    it('includes all required reel fields', () => {
      const reels = getReelsFor('testuser')
      const reel = reels[0] as any // Type assertion for mock data

      expect(reel).toHaveProperty('id')
      expect(reel).toHaveProperty('profileId')
      expect(reel).toHaveProperty('thumbnailUrl')
      expect(reel).toHaveProperty('caption')
      expect(reel).toHaveProperty('views')
      expect(reel).toHaveProperty('likes')
      expect(reel).toHaveProperty('comments')
      expect(reel).toHaveProperty('timestamp')
      expect(reel).toHaveProperty('tags')
      expect(reel).toHaveProperty('vibe')
    })

    it('generates realistic reel engagement numbers', () => {
      const reels = getReelsFor('testuser')
      
      reels.forEach(reel => {
        const mockReel = reel as any
        expect(mockReel.views).toBeGreaterThan(mockReel.likes) // Views should be higher than likes
        expect(mockReel.likes).toBeGreaterThan(mockReel.comments) // Likes should be higher than comments
        expect(mockReel.views).toBeGreaterThan(0)
        expect(mockReel.likes).toBeGreaterThan(0)
        expect(mockReel.comments).toBeGreaterThan(0)
      })
    })

    it('generates different reels for different usernames', () => {
      const reels1 = getReelsFor('user1')
      const reels2 = getReelsFor('user2')

      expect(reels1[0].id).not.toEqual(reels2[0].id)
      expect((reels1[0] as any).profileId).not.toEqual((reels2[0] as any).profileId)
    })

    it('links reels to correct profile', () => {
      const username = 'testuser'
      const profile = getProfileFor(username)
      const reels = getReelsFor(username)
      
      reels.forEach(reel => {
        const mockReel = reel as any
        expect(mockReel.profileId).toBe(profile.id)
      })
    })

    it('generates appropriate reel vibes', () => {
      const reels = getReelsFor('testuser')
      const validVibes = ['nightlife', 'lavish', 'casual']
      
      reels.forEach(reel => {
        const mockReel = reel as any
        expect(validVibes).toContain(mockReel.vibe)
      })
    })
  })

  describe('getAnalyticsFor', () => {
    it('generates consistent analytics for same username', () => {
      const analytics1 = getAnalyticsFor('testuser')
      const analytics2 = getAnalyticsFor('testuser')

      expect(analytics1).toEqual(analytics2)
    })

    it('includes all required analytics fields', () => {
      const analytics = getAnalyticsFor('testuser')

      expect(analytics).toHaveProperty('avgLikes')
      expect(analytics).toHaveProperty('avgComments')
      expect(analytics).toHaveProperty('engagementRate')
      expect(analytics).toHaveProperty('trend')
      expect(analytics).toHaveProperty('demographics')
    })

    it('calculates analytics based on posts data', () => {
      const username = 'testuser'
      const posts = getPostsFor(username)
      const analytics = getAnalyticsFor(username)
      
      const expectedAvgLikes = Math.round(posts.reduce((sum, post) => sum + (post as any).likes, 0) / posts.length)
      const expectedAvgComments = Math.round(posts.reduce((sum, post) => sum + (post as any).comments, 0) / posts.length)
      
      expect(analytics.avgLikes).toBe(expectedAvgLikes)
      expect(analytics.avgComments).toBe(expectedAvgComments)
    })

    it('calculates engagement rate correctly', () => {
      const username = 'testuser'
      const profile = getProfileFor(username)
      const analytics = getAnalyticsFor(username)
      
      expect(analytics.engagementRate).toBeGreaterThan(0)
      expect(analytics.engagementRate).toBeLessThan(100)
      expect(typeof analytics.engagementRate).toBe('number')
      
      // Engagement rate should be reasonable for the follower count
      const maxExpectedRate = (analytics.avgLikes + analytics.avgComments) / profile.followers * 100
      expect(analytics.engagementRate).toBeLessThanOrEqual(maxExpectedRate + 1) // Allow for rounding
    })

    it('generates trend data based on posts', () => {
      const username = 'testuser'
      const posts = getPostsFor(username)
      const analytics = getAnalyticsFor(username)
      
      expect(analytics.trend).toHaveLength(posts.length)
      expect(analytics.trend[0]).toHaveProperty('index')
      expect(analytics.trend[0]).toHaveProperty('likes')
      expect(analytics.trend[0]).toHaveProperty('comments')
    })

    it('includes complete demographics data', () => {
      const analytics = getAnalyticsFor('testuser')
      
      expect(analytics.demographics).toHaveProperty('gender')
      expect(analytics.demographics).toHaveProperty('age')
      expect(analytics.demographics).toHaveProperty('geography')
      
      // Gender percentages should add up to 100
      const genderTotal = analytics.demographics!.gender.male + 
                         analytics.demographics!.gender.female + 
                         analytics.demographics!.gender.other
      expect(genderTotal).toBe(100)
      
      // Age percentages should add up to 100
      const ageTotal = analytics.demographics!.age.reduce((sum, item) => sum + item.percent, 0)
      expect(ageTotal).toBe(100)
      
      // Geography percentages should add up to 100
      const geoTotal = analytics.demographics!.geography.reduce((sum, item) => sum + item.percent, 0)
      expect(geoTotal).toBe(100)
    })

    it('generates different analytics for different usernames', () => {
      const analytics1 = getAnalyticsFor('user1')
      const analytics2 = getAnalyticsFor('user2')

      expect(analytics1.avgLikes).not.toBe(analytics2.avgLikes)
      expect(analytics1.avgComments).not.toBe(analytics2.avgComments)
      expect(analytics1.engagementRate).not.toBe(analytics2.engagementRate)
    })
  })

  describe('Data Consistency', () => {
    it('maintains data relationships across functions', () => {
      const username = 'testuser'
      const profile = getProfileFor(username)
      const posts = getPostsFor(username)
      const reels = getReelsFor(username)
      const analytics = getAnalyticsFor(username)
      
      // All posts should belong to the same profile
      posts.forEach(post => {
        expect((post as any).profileId).toBe(profile.id)
      })
      
      // All reels should belong to the same profile
      reels.forEach(reel => {
        expect((reel as any).profileId).toBe(profile.id)
      })
      
      // Analytics should be calculated from the posts
      expect(analytics.trend).toHaveLength(posts.length)
    })

    it('generates deterministic data for reproducible tests', () => {
      // Multiple calls should return identical data
      for (let i = 0; i < 5; i++) {
        const profile = getProfileFor('consistent-user')
        const posts = getPostsFor('consistent-user')
        const reels = getReelsFor('consistent-user')
        const analytics = getAnalyticsFor('consistent-user')
        
        expect(profile.followers).toBe(getProfileFor('consistent-user').followers)
        expect((posts[0] as any).likes).toBe((getPostsFor('consistent-user')[0] as any).likes)
        expect((reels[0] as any).views).toBe((getReelsFor('consistent-user')[0] as any).views)
        expect(analytics.avgLikes).toBe(getAnalyticsFor('consistent-user').avgLikes)
      }
    })
  })
})
