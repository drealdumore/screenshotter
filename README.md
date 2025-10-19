# Screenshot Generator

A modern web application built with Next.js that captures high-quality screenshots of any website. Features a clean UI with smooth animations, device-specific screenshots, real-time status updates, and an engaging user experience.

## Features

- 📸 **High-Quality Screenshots** - Generate WebP screenshots with optimized quality
- 📱 **Device Selection** - Choose between desktop and mobile viewport screenshots
- ✨ **Animated UI** - Smooth framer-motion animations throughout the interface
- 🔄 **Real-Time Status Updates** - Live progress updates streamed from API during generation
- 💾 **State Persistence** - Remembers your URL and device preferences
- 🎨 **Custom Design** - Built with custom components and Satoshi fonts
- ⚡ **Fast Performance** - Optimized screenshot generation with timing display
- 🖼️ **Image Actions** - Copy to clipboard, download with smart filenames, full-screen modal
- 🔧 **Production Ready** - Configured for Vercel deployment with Puppeteer
- 🌊 **Smooth Scrolling** - Enhanced scrolling experience with Lenis

## Tech Stack

- **Framework**: Next.js 15.5.6 with App Router
- **Animations**: Framer Motion for smooth UI transitions
- **Styling**: Tailwind CSS v4 with custom fonts (Satoshi)
- **Screenshot Engine**: Puppeteer with @sparticuz/chromium for production
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/drealdumore/screenshotter.git
cd screenshotter
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter any valid URL (e.g., `https://drealdumore.vercel.app`)
2. Select device type (Desktop or Mobile)
3. Click "Generate" to create a screenshot
4. Watch the friendly animated status messages
5. View, copy, or download the generated screenshot
6. Click "Generate Another" to create more screenshots

## API Reference

### Screenshot Endpoint

```
GET /api/screenshot?url={url}&colorScheme=light&device={device}
```

**Parameters:**
- `url` (required): The website URL to screenshot
- `colorScheme` (optional): Always set to `light`
- `device` (optional): `desktop` or `mobile` viewport

**Response:**
- Success: WebP image binary data
- Error: JSON with error message

### Streaming Screenshot Endpoint

```
GET /api/screenshot-stream?url={url}&colorScheme=light&device={device}
```

**Parameters:**
- Same as above

**Response:**
- Server-Sent Events (SSE) stream with real-time status updates
- Final event contains base64-encoded WebP image
- Graceful handling of slow-loading pages

## Environment Configuration

The application automatically detects the environment:

- **Development**: Uses local Puppeteer with bundled Chrome
- **Production**: Uses `@sparticuz/chromium` for serverless deployment

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with optimized settings

The app is configured for Vercel with:
- Serverless function optimization
- Chrome binary for screenshot generation
- Automatic dependency installation

### Other Platforms

For other deployment platforms, ensure:
- Node.js runtime support
- Sufficient memory (1GB+ recommended)
- Chrome/Chromium availability

## Project Structure

```
screenshotter/
├── app/
│   ├── api/
│   │   ├── screenshot/route.ts         # Original screenshot API endpoint
│   │   └── screenshot-stream/route.ts  # Streaming screenshot API with SSE
│   ├── ClientBody.tsx             # Client wrapper for smooth scrolling
│   ├── globals.css                # Global styles with custom scrollbar
│   ├── layout.tsx                 # Root layout with custom fonts
│   └── page.tsx                   # Main page component
├── components/
│   ├── ui/
│   │   ├── copy-button.tsx        # Animated copy button
│   │   ├── image-modal.tsx        # Full-screen image modal
│   │   └── status-message.tsx     # Animated status messages
│   └── errorMessage.tsx           # Error message component
├── lib/
│   ├── utils.ts                   # Utility functions
│   └── metadata.ts                # SEO metadata configuration
└── public/                        # Static assets and fonts
```

## Configuration Files

- `next.config.ts` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration with custom fonts
- `tsconfig.json` - TypeScript configuration

## Performance Optimizations

- **State Persistence**: localStorage for URL and device preferences
- **Image Format**: WebP format for optimal file size
- **Smart Filenames**: Downloads named with domain and device type
- **Viewport Optimization**: Desktop (1280x764) and Mobile (375x812) viewports
- **Generation Timing**: Real-time performance feedback
- **Smooth Scrolling**: Lenis integration for enhanced UX
- **Streaming Updates**: Server-Sent Events for real-time progress
- **Graceful Timeouts**: Continues screenshot capture even with slow page loads

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support, please open an issue on GitHub or contact the maintainers.