# Easy to GIF

A free, privacy-focused online video to GIF converter built with Astro, React and FFmpeg WASM. Convert videos to high-quality GIFs directly in your browser with zero server dependencies.

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://dash.cloudflare.com/pages)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Astro](https://img.shields.io/badge/Astro-5-orange.svg)](https://astro.build/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)

## 🚀 Quick Start

1. **Try it online**: Visit the live demo at [https://easy2gif.chankay.com](https://easy2gif.chankay.com)
2. **Choose language**: Select your preferred language (English, 中文, 日本語)
3. **Upload a video**: Drag and drop or click to select your video file
4. **Adjust settings**: Configure frame rate, resolution, and quality
5. **Convert**: Click "Start Conversion" and wait for the magic to happen
6. **Download**: Save your high-quality GIF!

## ✨ Features

- 🌍 **Multi-language Support**: English, 中文, 日本語 with automatic detection
- 🎥 **Multi-format Support**: MP4, MOV, AVI, WebM, MKV and other popular video formats
- ⚡ **Fast Conversion**: Powered by FFmpeg WASM technology for client-side processing
- 🔒 **Privacy First**: All processing happens locally in your browser - no file uploads
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices
- 🎨 **Modern UI**: Built with shadcn/ui components for a beautiful, accessible interface
- 🌙 **Dark Mode**: Toggle between light and dark themes with persistent preference
- ⚙️ **Customizable Parameters**: Adjust frame rate, resolution, and quality settings
- 👀 **Live Preview**: Preview GIF results before downloading with aspect ratio preservation
- 🌐 **Free Forever**: No registration required, completely free to use
- 🚀 **Astro-powered**: Built with Astro for optimal performance and SEO

## 🚀 Tech Stack

- **Static Site Generator**: Astro 5
- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS + shadcn/ui
- **Video Processing**: @ffmpeg/ffmpeg + @ffmpeg/core (WASM)
- **Internationalization**: i18next + react-i18next
- **Theme Management**: next-themes
- **State Management**: React Context API
- **Deployment**: Cloudflare Pages
- **CI/CD**: GitHub Actions

## 🛠️ Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Environment Setup

1. **Clone and install dependencies**:

```bash
git clone https://github.com/navelorange1999/easy-to-gif.git
cd easy-to-gif
pnpm install
```

2. **Configure environment variables** (optional):

```bash
# Create .env.local file
echo "PUBLIC_GITHUB_OWNER=your-username" > .env.local
```

### Development Server

```bash
pnpm dev
```

Visit http://localhost:4321 to view the application.

### Build for Production

```bash
pnpm build
```

## 📦 Deployment

### Using Cloudflare Pages with Deploy Hooks

1. **Fork this repository** to your GitHub account

2. **Create Cloudflare Pages Project**:
    - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/pages)
    - Create a new Pages project
    - Connect your GitHub repository

3. **Configure Deploy Hook**:
    - In your Pages project settings, go to **Settings** > **Builds**
    - Click **Add deploy hook**
    - Name: `github-release-deploy`
    - Branch: `main`
    - Copy the generated Deploy Hook URL

4. **Configure GitHub Secrets**:
    - Add the following secret in your GitHub repository settings:
        - `CLOUDFLARE_DEPLOY_HOOK_URL`: Your Deploy Hook URL

5. **Automatic Deployment**:
    - Create a GitHub Release to trigger deployment
    - GitHub Actions will automatically trigger Cloudflare Pages build

6. **Environment Variables** (optional):
    - In Cloudflare Pages settings, add environment variables:
        - `PUBLIC_GITHUB_OWNER`: Your GitHub username
    - Update `public/sitemap.xml` and `public/robots.txt` with your domain

### Manual Deployment

```bash
# Build the project
pnpm build

# Preview the production build
pnpm preview

# Deploy to Cloudflare Pages using Wrangler
npx wrangler pages deploy dist --project-name=easy-to-gif
```

## 🎯 Usage

1. **Language Selection**: Choose your preferred language from the header (English/中文/日本語)
2. **Auto-initialization**: FFmpeg engine initializes automatically on page load
3. **Upload Video**: Drag and drop or click to select a video file
4. **Adjust Settings**: Configure frame rate, resolution, and quality parameters
5. **Start Conversion**: Click "Start Conversion" and monitor real-time progress
6. **Preview Result**: Click the GIF thumbnail to preview in full size
7. **Download**: Save the converted GIF to your device
8. **Theme Toggle**: Switch between light and dark modes using the theme button in the header

## ⚙️ Configuration

### Recommended Settings

- **Frame Rate**: 15 FPS (balances file size and quality)
- **Resolution**: 480px width (maintains aspect ratio)
- **Quality**: Medium (uses palette optimization)

### Quality Presets

- **Low Quality**: 320px width, 10 FPS
- **Medium Quality**: 480px width, 15 FPS (recommended)
- **High Quality**: 720px width, 20 FPS

### Environment Variables

The project supports the following environment variables:

- `PUBLIC_GITHUB_OWNER`: GitHub username for the repository link (default: `navelorange1999`)

### Language Configuration

The app supports three languages:

- **English** (`en`): Available at `/`
- **中文** (`zh`): Available at `/zh/`
- **日本語** (`ja`): Available at `/ja/`

Languages are configured in `src/i18n/constants.ts` and use i18next for internationalization.

### Build Configuration

- **Static Site Generator**: Astro 5
- **Framework**: React 18 + TypeScript + Vite 5
- **Styling**: Tailwind CSS + shadcn/ui components
- **Video Processing**: FFmpeg WASM for client-side conversion
- **Internationalization**: i18next with automatic language detection
- **Theme Management**: next-themes with persistent preferences
- **Deployment**: Cloudflare Pages with Deploy Hooks
- **CI/CD**: GitHub Actions triggered by releases

### Technical Requirements

- **File Size Limit**: Maximum 200MB
- **SharedArrayBuffer Support**: Required for FFmpeg WASM
- **Modern Browsers**: Chrome 68+, Firefox 79+, Safari 15.2+
- **Initial Load**: Downloads ~30MB FFmpeg core files on first use

## 🔧 Project Structure

```
src/
├── components/          # Components
│   ├── astro/          # Astro components (static)
│   │   ├── Header.astro       # Navigation header
│   │   ├── Footer.astro       # Footer component
│   │   ├── Features.astro     # Features section
│   │   └── Page.astro         # Page layout wrapper
│   ├── ui/             # shadcn/ui React components
│   ├── ConverterApp.tsx       # Main converter app
│   ├── VideoUploader.tsx      # Video upload component
│   ├── ConversionSettings.tsx # Parameter configuration
│   ├── GifPreview.tsx          # GIF preview and download
│   ├── ProgressBar.tsx         # Progress indicator
│   ├── ThemeToggle.tsx         # Dark/light mode toggle
│   └── LanguageSwitcher.tsx    # Language switcher
├── contexts/           # React Context
│   └── AppContext.tsx      # Global state management
├── hooks/              # Custom Hooks
│   └── useFFmpeg.ts        # FFmpeg processing logic
├── i18n/               # Internationalization
│   ├── locales/        # Language files
│   │   ├── en-US.json  # English translations
│   │   ├── zh-CN.json   # Chinese translations
│   │   └── ja-JP.json   # Japanese translations
│   ├── constants.ts         # Language configuration
│   ├── index.ts             # i18next setup
│   └── utils.ts             # Translation utilities
├── layouts/            # Astro layouts
│   └── Layout.astro         # Main page layout
├── pages/              # Astro pages
│   ├── index.astro     # English home page
│   ├── zh/             # Chinese pages
│   │   └── index.astro
│   └── ja/             # Japanese pages
│       └── index.astro
├── lib/                # Utility functions
│   └── utils.ts            # Common utilities
├── types/              # TypeScript definitions
│   └── index.ts            # Type definitions
└── index.css           # Global styles
```

## 🏗️ Core Features

- **Astro Framework**: Hybrid static site generation with React islands for optimal performance
- **Multi-language Support**: i18next integration with three languages (en, zh, ja)
- **Language Routing**: Astro i18n routing with path-based language detection
- **FFmpeg WASM Integration**: Client-side video processing using `@ffmpeg/ffmpeg`
- **Auto-initialization**: FFmpeg engine loads automatically on page load
- **File Processing**: Drag-and-drop upload with file validation
- **Progress Monitoring**: Real-time conversion progress with multi-stage tracking
- **Preview Functionality**: Full-size GIF preview with aspect ratio preservation
- **Error Handling**: Comprehensive error messages and retry mechanisms
- **Responsive Design**: Optimized for all screen sizes with mobile-first approach
- **Dark Mode Support**: next-themes integration with persistent preferences
- **Theme Persistence**: Remembers user's theme choice across sessions
- **State Management**: Global state management using React Context API
- **Performance Optimization**: Memoization with memo, useCallback, and useMemo
- **SEO Optimized**: Astro's SSG capabilities for better search engine indexing

## 🌟 Project Highlights

- **Zero Backend**: Completely frontend-based, no server required
- **Privacy Security**: All processing happens locally, no file uploads
- **Astro-powered**: Hybrid static generation for maximum performance and SEO
- **Multi-language**: Full internationalization with three language support
- **Modern Tech Stack**: Astro 5 + React 18 + TypeScript + Tailwind CSS
- **Component Architecture**: Built with shadcn/ui for modern, accessible UI
- **Theme Support**: Light and dark mode with automatic system preference detection and persistence
- **Performance Optimized**: React Context, memo, useCallback for optimal rendering
- **Mobile Friendly**: Responsive design with simplified mobile interface
- **User Experience**: Auto-initialization, real-time progress, preview functionality

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

### Development Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Astro](https://astro.build/) - The web framework for content-driven websites
- [FFmpeg](https://ffmpeg.org/) - Powerful multimedia framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful React component library
- [i18next](https://www.i18next.com/) - Internationalization framework
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management for React
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Cloudflare Pages](https://pages.cloudflare.com/) - Free static site hosting

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/navelorange1999/easy-to-gif/issues) page
2. Create a new issue with detailed information

---

Made with 🌟 for creators and developers worldwide.
