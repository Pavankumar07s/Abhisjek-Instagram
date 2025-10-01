# Instagram Profile Analyzer

A comprehensive Instagram profile analytics tool built with Next.js that provides real-time insights into Instagram profiles, posts, reels, and audience engagement metrics.

## 🚀 Features

### 📊 Profile Analysis
- **Real-time Profile Data**: Fetch live Instagram profile information using the Premium API
- **Comprehensive Profile Cards**: Display profile pictures, bio, follower counts, verification status
- **Privacy & Category Detection**: Show account privacy settings and business categories
- **Bio Link Extraction**: Parse and display external links from user bios

### 📱 Content Analysis
- **Posts Grid**: Visual grid layout of recent posts with engagement metrics
- **Reels Grid**: Dedicated section for video content with play counts and engagement
- **Content Performance**: Like counts, comment counts, and engagement rates per post
- **Media Quality**: High-definition image display with responsive design

### 📈 Advanced Analytics
- **Engagement Overview**: Average likes, comments, and engagement rates
- **Trend Analysis**: Interactive charts showing engagement patterns over time
- **Audience Demographics**: Gender distribution and age group analytics
- **Performance Comparison**: Visual comparison of likes vs comments

### 🎨 User Experience
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Dark/Light Theme**: Built-in theme switching with system preference detection
- **Loading States**: Elegant skeleton loading animations
- **Error Handling**: Graceful fallbacks with mock data when API is unavailable
- **Welcome Messages**: Informative onboarding for new users

### 🔍 Search & Navigation
- **Real-time Search**: Instant profile lookup with username suggestions
- **URL State Management**: Shareable URLs with username parameters
- **Form Validation**: Input sanitization and error prevention
- **Keyboard Navigation**: Full accessibility support

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui component library
- **Data Fetching**: SWR for efficient data management
- **Charts**: Recharts for interactive analytics
- **Icons**: Lucide React icons
- **Testing**: Jest + React Testing Library

## 📦 Setup & Installation

### Prerequisites
- Node.js 18+ 
- pnpm package manager
- Instagram Premium API access

### 1. API Setup
1. Visit [RapidAPI Instagram Premium API 2023](https://rapidapi.com/DataFanatic/api/instagram-premium-api-2023)
2. Create an account and subscribe to the API
3. Copy your API key from the dashboard

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```bash
RAPIDAPI_KEY=your_actual_api_key_here
```

### 3. Installation
```bash
# Clone the repository
git clone https://github.com/Pavankumar07s/Abhisjek-Instagram.git
cd Abhisjek-Instagram

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### 4. Build for Production
```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 🏗️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── analytics/     # Analytics endpoint
│   │   ├── posts/         # Posts data endpoint
│   │   ├── profile/       # Profile data endpoint
│   │   └── reels/         # Reels data endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── loading.tsx        # Loading UI
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── analytics-charts.tsx
│   ├── posts-grid.tsx
│   ├── profile-card.tsx
│   ├── reels-grid.tsx
│   └── search-header.tsx
├── lib/                   # Utilities and types
│   ├── fetcher.ts        # SWR fetcher function
│   ├── mock-data.ts      # Fallback mock data
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Utility functions
├── __tests__/            # Test suites
└── public/               # Static assets
```

## 🔌 API Integration

### Instagram Premium API Endpoints
The application integrates with multiple Instagram API endpoints:

```typescript
// Profile endpoint
GET /api/profile?username={username}

// Posts endpoint  
GET /api/posts?username={username}

// Reels endpoint
GET /api/reels?username={username}

// Analytics endpoint
GET /api/analytics?username={username}
```

### Data Mapping
Instagram API responses are mapped to our internal types:

```typescript
// Profile mapping
{
  full_name → name
  username → username
  profile_pic_url_hd → profilePic
  edge_followed_by.count → followers
  edge_follow.count → following
  edge_owner_to_timeline_media.count → postsCount
  biography → biography
  bio_links → bioLinks
  category_name → categoryName
  is_verified → isVerified
  is_private → isPrivate
}
```

## 🎯 Usage Guide

### Basic Usage
1. **Search for a Profile**: Enter any Instagram username in the search bar
2. **View Profile Details**: See comprehensive profile information and statistics
3. **Analyze Content**: Browse through posts and reels with engagement metrics
4. **Review Analytics**: Examine detailed engagement and demographic data

### Advanced Features
- **Responsive Layout**: Works seamlessly across all device sizes
- **Theme Switching**: Toggle between light and dark modes
- **Shareable URLs**: Share specific profile analyses via URL
- **Offline Fallback**: View sample data when API is unavailable

## 🧪 Testing

The application includes comprehensive test coverage:

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Test Coverage
- ✅ Component rendering and interactions
- ✅ API route functionality
- ✅ Data fetching and error handling
- ✅ Responsive design validation
- ✅ Accessibility compliance
- ✅ Integration testing

## 🚦 Error Handling & Fallbacks

### Graceful Degradation
- **API Failures**: Automatic fallback to mock data
- **Network Issues**: Retry mechanisms with SWR
- **Invalid Usernames**: User-friendly error messages
- **Rate Limiting**: Proper error handling and user feedback

### Mock Data
When the API is unavailable, the application provides realistic mock data including:
- Sample profiles with various follower counts
- Mock posts with engagement metrics
- Sample analytics data
- Demographic information

## 🔧 Configuration

### Environment Variables
```bash
RAPIDAPI_KEY=your_api_key          # Required: Instagram API key
NEXT_PUBLIC_APP_URL=https://...    # Optional: App URL for metadata
```

### Build Configuration
- **Next.js**: Optimized for production with static generation
- **Tailwind**: Purged CSS for minimal bundle size
- **TypeScript**: Strict mode enabled for type safety

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Instagram Premium API 2023](https://rapidapi.com/DataFanatic/api/instagram-premium-api-2023) for data access
- [Shadcn/ui](https://ui.shadcn.com/) for the component library
- [Recharts](https://recharts.org/) for analytics visualization
- [Vercel](https://vercel.com/) for deployment platform

---

Built with ❤️ by [Pavankumar07s](https://github.com/Pavankumar07s)
