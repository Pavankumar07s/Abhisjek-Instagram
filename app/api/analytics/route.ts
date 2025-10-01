import { NextResponse } from "next/server"
import axios from "axios"
import type { Analytics } from "@/lib/types"

interface InstagramImageVersion {
  height: number
  url: string
  width: number
}

interface InstagramUser {
  pk: string
  username: string
  full_name: string
  profile_pic_url: string
  is_verified: boolean
}

interface InstagramResource {
  pk: string
  thumbnail_url: string
  media_type: number
  image_versions?: InstagramImageVersion[]
}

interface InstagramMedia {
  id: string
  pk: string
  code: string
  taken_at: string
  media_type: number
  thumbnail_url?: string
  image_versions?: InstagramImageVersion[]
  video_url?: string
  caption_text?: string
  like_count?: number
  comment_count?: number
  play_count?: number
  user: InstagramUser
  resources?: InstagramResource[]
}

async function fetchUserMedia(username: string) {
  try {
    // Step 1: Get user profile to extract pk
    const profileOptions = {
      method: 'GET',
      url: 'https://instagram-premium-api-2023.p.rapidapi.com/v1/user/by/username',
      params: {
        username: username
      },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
        'x-rapidapi-host': 'instagram-premium-api-2023.p.rapidapi.com'
      }
    }

    const profileResponse = await axios.request(profileOptions)
    const userPk = profileResponse.data.pk

    if (!userPk) {
      throw new Error("User not found")
    }

    // Step 2: Get user media using the pk
    const mediaOptions = {
      method: 'GET',
      url: 'https://instagram-premium-api-2023.p.rapidapi.com/v1/user/medias',
      params: {
        user_id: userPk.toString(),
        amount: '50' // Get more data for better analytics
      },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
        'x-rapidapi-host': 'instagram-premium-api-2023.p.rapidapi.com'
      }
    }

    const mediaResponse = await axios.request(mediaOptions)
    return mediaResponse.data as InstagramMedia[]
  } catch (error) {
    console.error("Error fetching user media:", error)
    return []
  }
}

function calculateAnalytics(allMedia: InstagramMedia[]): Analytics {
  if (allMedia.length === 0) {
    return {
      avgLikes: 0,
      avgComments: 0,
      engagementRate: 0,
      trend: []
    }
  }

  // Calculate averages
  const totalLikes = allMedia.reduce((sum, media) => sum + (media.like_count || 0), 0)
  const totalComments = allMedia.reduce((sum, media) => sum + (media.comment_count || 0), 0)
  const avgLikes = Math.round(totalLikes / allMedia.length)
  const avgComments = Math.round(totalComments / allMedia.length)

  // Calculate engagement rate as a percentage of total interactions per post
  // Using a simplified formula: (avg likes + avg comments) / 1000 * 100 to get a percentage
  const avgEngagement = avgLikes + avgComments
  const engagementRate = Number((avgEngagement / 1000 * 100).toFixed(1))

  // Create trend data from the last 12 posts/reels
  const trendData = allMedia
    .slice(0, 12)
    .reverse()
    .map((media, index) => ({
      index: index + 1,
      likes: media.like_count || 0,
      comments: media.comment_count || 0
    }))

  // Generate mock demographics (Instagram API doesn't provide this)
  const demographics = {
    gender: {
      male: 45,
      female: 52,
      other: 3
    },
    age: [
      { range: "18-24", percent: 25 },
      { range: "25-34", percent: 35 },
      { range: "35-44", percent: 22 },
      { range: "45-54", percent: 12 },
      { range: "55+", percent: 6 }
    ],
    geography: [
      { country: "United States", percent: 35 },
      { country: "India", percent: 20 },
      { country: "Brazil", percent: 15 },
      { country: "United Kingdom", percent: 10 },
      { country: "Other", percent: 20 }
    ]
  }

  return {
    avgLikes,
    avgComments,
    engagementRate,
    trend: trendData,
    demographics
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    
    if (!username) {
      // Return default analytics when no username provided
      return NextResponse.json({
        avgLikes: 0,
        avgComments: 0,
        engagementRate: 0,
        trend: [],
        demographics: {
          gender: { male: 45, female: 52, other: 3 },
          age: [
            { range: "18-24", percent: 25 },
            { range: "25-34", percent: 35 },
            { range: "35-44", percent: 22 },
            { range: "45-54", percent: 12 },
            { range: "55+", percent: 6 }
          ],
          geography: [
            { country: "United States", percent: 35 },
            { country: "India", percent: 20 },
            { country: "Brazil", percent: 15 },
            { country: "United Kingdom", percent: 10 },
            { country: "Other", percent: 20 }
          ]
        }
      })
    }

    const allMedia = await fetchUserMedia(username)
    const analytics = calculateAnalytics(allMedia)
    
    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error calculating analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
