# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Quran replica web application inspired by Quran.com, built with Next.js, TypeScript, and Tailwind CSS. The app features:

- Surah Al-Ikhlas with synchronized audio playback
- Word-by-word highlighting as audio progresses
- Multi-language support for translations
- Interactive pop-ups for word meanings/Tafseer
- Prayer times integration using Islamic APIs
- Responsive design for desktop, tablet, and mobile
- Image sliders for Islamic artwork
- Font size controls

## Technical Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Audio**: Quran.com public APIs
- **Prayer Times**: Islamic Finder API integration
- **Hosting**: Vercel (recommended)

## Code Generation Guidelines

- Use TypeScript for all components and utilities
- Follow Next.js 15 App Router conventions
- Implement responsive design with Tailwind CSS
- Use semantic HTML for accessibility
- Create reusable components for common UI elements
- Implement proper error handling for API calls
- Use modern React patterns (hooks, contexts)
- Optimize for performance with Next.js features

## API Integration

- Use Quran.com public APIs for Quranic content
- Implement Islamic Finder API for prayer times
- Handle loading states and error boundaries
- Cache responses where appropriate

## Islamic Content Guidelines

- Ensure Arabic text is properly displayed with correct fonts
- Respect Islamic content with appropriate handling
- Provide accurate translations and transliterations
- Handle RTL (right-to-left) text properly
