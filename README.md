# Screenshot Generator

A modern web application built with Next.js that captures high-quality screenshots of any website. Features a clean UI with dark/light theme support and optimized for both development and production environments.

## Features

- 📸 **High-Quality Screenshots** - Generate WebP screenshots with customizable quality
- 🌓 **Theme Support** - Automatic dark/light mode detection and screenshot generation
- ⚡ **Fast Performance** - Optimized with caching and efficient rendering
- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- 📱 **Responsive Design** - Works seamlessly across all devices
- 🔧 **Production Ready** - Configured for Vercel deployment with Puppeteer

## Tech Stack

- **Framework**: Next.js 15.5.6 with App Router
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4
- **Screenshot Engine**: Puppeteer with Chromium
- **Icons**: Lucide React
- **Theme**: next-themes
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
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

1. Enter any valid URL (e.g., `https://example.com`)
2. Click "Scrape" to generate a screenshot
3. View, copy, or download the generated screenshot
4. Generate another screenshot or modify settings as needed

## API Reference

### Screenshot Endpoint

```
GET /api/screenshot?url={url}&colorScheme={theme}
```

**Parameters:**
- `url` (required): The website URL to screenshot
- `colorScheme` (optional): `light` or `dark` theme preference

**Response:**
- Success: WebP image binary data
- Error: JSON with error message

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
│   ├── api/screenshot/route.ts    # Screenshot API endpoint
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page component
├── components/
│   └── ui/                        # shadcn/ui components
├── comps/
│   └── errorMessage.tsx           # Error message component
├── lib/
│   └── utils.ts                   # Utility functions
└── public/                        # Static assets
```

## Configuration Files

- `next.config.ts` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `components.json` - shadcn/ui configuration
- `tsconfig.json` - TypeScript configuration

## Performance Optimizations

- **Caching**: 24-hour cache headers for generated screenshots
- **Image Format**: WebP format for optimal file size
- **Viewport**: Optimized 1280x764 viewport with 2x scale factor
- **Timeout Handling**: Environment-specific timeout configurations

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