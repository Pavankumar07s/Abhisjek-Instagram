import { NextResponse } from "next/server"
import axios from "axios"
import { Post } from "@/lib/types"

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
  caption_text?: string
  like_count?: number
  comment_count?: number
  user: InstagramUser
  resources?: InstagramResource[]
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    
    if (!username) {
      return NextResponse.json([], { status: 200 })
    }

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
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Step 2: Get user media using the pk
    const mediaOptions = {
      method: 'GET',
      url: 'https://instagram-premium-api-2023.p.rapidapi.com/v1/user/medias',
      params: {
        user_id: userPk.toString(),
        amount: '33'
      },
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
        'x-rapidapi-host': 'instagram-premium-api-2023.p.rapidapi.com'
      }
    }

    const mediaResponse = await axios.request(mediaOptions)
    const allMedia: InstagramMedia[] = mediaResponse.data

    // Filter only posts (media_type 1 = image, 8 = carousel)
    const posts: Post[] = allMedia
      .filter((media: InstagramMedia) => media.media_type === 1 || media.media_type === 8)
      .map((media: InstagramMedia) => {
        // Use image proxy for Instagram CDN URLs
        const proxyImageUrl = (url?: string) => {
          if (!url) return "/placeholder.jpg"
          return `/api/image-proxy?url=${encodeURIComponent(url)}`
        }

        return {
          id: media.id,
          pk: media.pk,
          code: media.code,
          takenAt: media.taken_at,
          mediaType: media.media_type,
          thumbnailUrl: proxyImageUrl(media.thumbnail_url || media.image_versions?.[0]?.url),
          imageVersions: media.image_versions?.map((version: InstagramImageVersion) => ({
            height: version.height,
            url: proxyImageUrl(version.url),
            width: version.width
          })),
          captionText: media.caption_text || "",
          likeCount: media.like_count || 0,
          commentCount: media.comment_count || 0,
          user: {
            pk: media.user.pk,
            username: media.user.username,
            fullName: media.user.full_name,
            profilePicUrl: proxyImageUrl(media.user.profile_pic_url),
            isVerified: media.user.is_verified || false
          },
          resources: media.resources?.map((resource: InstagramResource) => ({
            pk: resource.pk,
            thumbnailUrl: proxyImageUrl(resource.thumbnail_url),
            mediaType: resource.media_type,
            imageVersions: resource.image_versions?.map((version: InstagramImageVersion) => ({
              height: version.height,
              url: proxyImageUrl(version.url),
              width: version.width
            }))
          }))
        }
      })

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
