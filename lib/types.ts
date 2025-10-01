export type Profile = {
  id: string
  name: string
  username: string
  profilePic: string
  followers: number
  following: number
  postsCount: number
  biography?: string
  bioLinks?: Array<{
    title: string
    url: string
    link_type: string
  }>
  categoryName?: string
  isVerified?: boolean
  isPrivate?: boolean
}

export type Post = {
  id: string
  pk: string
  code: string
  takenAt: string
  mediaType: number // 1 = image, 8 = carousel
  thumbnailUrl: string
  imageVersions?: Array<{
    height: number
    url: string
    width: number
  }>
  captionText: string
  likeCount: number
  commentCount: number
  user: {
    pk: string
    username: string
    fullName: string
    profilePicUrl: string
    isVerified: boolean
  }
  resources?: Array<{
    pk: string
    thumbnailUrl: string
    mediaType: number
    imageVersions?: Array<{
      height: number
      url: string
      width: number
    }>
  }>
}

export type Reel = {
  id: string
  pk: string
  code: string
  takenAt: string
  mediaType: number // 2 = video/reel
  thumbnailUrl: string
  imageVersions?: Array<{
    height: number
    url: string
    width: number
  }>
  videoUrl?: string
  videoDuration?: number
  captionText: string
  likeCount: number
  commentCount: number
  playCount: number
  user: {
    pk: string
    username: string
    fullName: string
    profilePicUrl: string
    isVerified: boolean
  }
}

export type Story = {
  id: string
  pk: string
  code: string
  takenAt: string
  mediaType: number // 1 = image, 2 = video
  thumbnailUrl: string
  videoUrl?: string
  videoDuration?: number
  user: {
    pk: string
    username: string
    fullName: string
    profilePicUrl: string
    isVerified: boolean
  }
}

export type Highlight = {
  id: string
  pk: string
  title: string
  createdAt: string
  mediaCount: number
  coverMedia: {
    url: string
    width: number
    height: number
  }
  user: {
    pk: string
    username: string
    fullName: string
    profilePicUrl: string
    isVerified: boolean
  }
  isPinnedHighlight: boolean
}

export type Analytics = {
  avgLikes: number
  avgComments: number
  engagementRate: number // percentage value (e.g., 5.4)
  trend: Array<{ index: number; likes: number; comments: number }>
  demographics?: {
    gender: { male: number; female: number; other: number }
    age: Array<{ range: string; percent: number }>
    geography: Array<{ country: string; percent: number }>
  }
}
