# Quran Replica - Interactive Web Application

A beautiful, interactive Quran web application inspired by Quran.com, built with Next.js, TypeScript, and Tailwind CSS. This application features Surah Al-Ikhlas with synchronized audio playback, word-by-word highlighting, and multi-language support.

## Features

### 🎯 Core Features

- **Surah Al-Ikhlas** - Complete chapter with 4 verses
- **Synchronized Audio Playback** - Real-time word highlighting with audio
- **Word-by-Word Mode** - Individual word display with translation and transliteration
- **Multi-Language Support** - Multiple English translations available
- **Interactive Pop-ups** - Click on any word to see detailed meanings
- **Responsive Design** - Optimized for desktop, tablet, and mobile

### 📊 Display Modes

- **Word Mode** - Focus on individual words with detailed information
- **Ayah Mode** - Display single verses with translations
- **Full Surah Mode** - Complete chapter view with all verses

### 🔊 Audio Features

- **Professional Recitation** - High-quality audio from Quran.com
- **Word Synchronization** - Precise timing for word-by-word highlighting
- **Verse Navigation** - Jump to specific verses in audio
- **Playback Controls** - Play, pause, seek, and volume control

### 🌐 API Integration

- **Quran.com Public APIs** - Real-time data fetching
- **Prayer Times Integration** - Location-based prayer times
- **Multiple Translations** - Dynamic translation loading
- **Audio Streaming** - Direct audio streaming from Quran.com

### 🎨 UI/UX Features

- **Arabic Font Support** - Beautiful Arabic typography
- **Font Size Controls** - Adjustable text sizing
- **Child Mode** - Simplified interface for younger users
- **Image Sliders** - Islamic artwork and Tajweed visuals
- **Prayer Times Display** - Real-time prayer times based on location

## Technology Stack

- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Audio**: Quran.com public APIs
- **Prayer Times**: Aladhan API / Islamic Finder API

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd quran-replica
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with Arabic fonts
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── QuranApp.tsx      # Main application component
│   ├── Header.tsx        # Header with prayer times
│   ├── MiddleSection.tsx # Bismillah and introduction
│   ├── TabsSection.tsx   # Navigation tabs
│   ├── ContentBoxes.tsx  # Main content display
│   ├── AudioPlayer.tsx   # Audio playback controls
│   ├── ImageSlider.tsx   # Islamic artwork slider
│   └── Footer.tsx        # Footer with links
├── services/             # API services
│   └── quranApi.ts      # Quran.com API integration
├── types/               # TypeScript type definitions
│   └── api.ts          # API response types
├── utils/              # Utility functions
│   └── api.ts         # API configuration
└── data/              # Static data
    └── surah-al-ikhlas.json  # Fallback data
```

## API Integration

### Quran.com APIs Used

- **Verses API** - Chapter verses with translations
- **Audio API** - Recitation files and timestamps
- **Translations API** - Available translation resources
- **Reciters API** - Available reciters information

### Example API Usage

```typescript
// Fetch complete Surah Al-Ikhlas data
const data = await fetchSurahIkhlasData();

// Get verses with translations
const verses = await fetchVersesByChapter(112);

// Get audio with word timings
const audio = await fetchAudioFiles(reciterId, chapterId);
```

## Features Implementation

### 10-Row Layout Structure

1. **Header** - Logo and prayer times
2. **Middle Section** - Bismillah and chapter introduction
3. **Tabs** - Word/Ayah/Surah view switcher
4. **Content Boxes** - Main content display (3 boxes)
5. **Audio Player** - Synchronized playback controls
6. **Image Slider 1** - Islamic artwork
7. **Image Slider 2** - Tajweed visuals
8. **Content Section 1** - About Surah Al-Ikhlas
9. **Content Section 2** - Benefits of recitation
10. **Footer** - Navigation and information links

### Word Synchronization

- Real-time highlighting during audio playback
- Precise timing data from Quran.com APIs
- Visual feedback for current word/verse
- Click-to-seek functionality

### Multi-Language Support

- Dynamic translation loading
- User-selectable translation pairs
- Support for multiple English translations
- Extensible for other languages

## Configuration

### Environment Variables

```env
# Optional: Add any API keys if needed
NEXT_PUBLIC_API_BASE_URL=https://api.qurancdn.com/api/qdc
```

### Customization

- Modify `src/utils/api.ts` for API endpoints
- Update `src/types/api.ts` for type definitions
- Customize styling in `src/app/globals.css`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- **Quran.com** for providing public APIs
- **Islamic content** handled with utmost respect
- **Arabic typography** using Google Fonts (Amiri, Scheherazade New)
- **Prayer times** from Aladhan API

## Support

For support, please open an issue in the repository or contact the development team.

---

_May Allah accept this effort and make it beneficial for the Muslim community. Ameen._

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
