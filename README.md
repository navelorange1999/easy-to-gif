# Easy to GIF

A free, privacy-focused online video to GIF converter built with React and FFmpeg WASM. Convert videos to high-quality GIFs directly in your browser with zero server dependencies.

[![Deploy to Cloudflare Pages](https://deploy.workers.cloudflare.com/button)](https://dash.cloudflare.com/pages)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)

## 🚀 Quick Start

1. **Try it online**: Visit the live demo at [easy2gif.chankay.com](https://easy2gif.chankay.com)
2. **Upload a video**: Drag and drop or click to select your video file
3. **Adjust settings**: Configure frame rate, resolution, and quality
4. **Convert**: Click "Start Conversion" and wait for the magic to happen
5. **Download**: Save your high-quality GIF!

## ✨ Features

- 🎥 **Multi-format Support**: MP4, MOV, AVI, WebM, MKV and other popular video formats
- ⚡ **Fast Conversion**: Powered by FFmpeg WASM technology for client-side processing
- 🔒 **Privacy First**: All processing happens locally in your browser - no file uploads
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices
- 🎨 **Modern UI**: Built with shadcn/ui components for a beautiful, accessible interface
- ⚙️ **Customizable Parameters**: Adjust frame rate, resolution, and quality settings
- 👀 **Live Preview**: Preview GIF results before downloading with aspect ratio preservation
- 🌐 **Free Forever**: No registration required, completely free to use

## 🚀 Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS + shadcn/ui
- **Video Processing**: @ffmpeg/ffmpeg + @ffmpeg/core (WASM)
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
echo "VITE_GITHUB_OWNER=your-username" > .env.local
```

### Development Server

```bash
pnpm dev
```

Visit http://localhost:3000 to view the application.

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
        - `VITE_GITHUB_OWNER`: Your GitHub username
    - Update `public/sitemap.xml` and `public/robots.txt` with your domain

### Manual Deployment

```bash
# Build the project
pnpm build

# Deploy to Cloudflare Pages using Wrangler
npx wrangler pages deploy dist --project-name=easy-to-gif
```

## 🎯 Usage

1. **Auto-initialization**: FFmpeg engine initializes automatically on page load
2. **Upload Video**: Drag and drop or click to select a video file
3. **Adjust Settings**: Configure frame rate, resolution, and quality parameters
4. **Start Conversion**: Click "Start Conversion" and monitor real-time progress
5. **Preview Result**: Click the GIF thumbnail to preview in full size
6. **Download**: Save the converted GIF to your device

## ⚙️ Configuration

### Recommended Settings

- **Frame Rate**: 15 FPS (balances file size and quality)
- **Resolution**: 480px width (maintains aspect ratio)
- **Quality**: Medium (uses palette optimization)

### Quality Presets

- **Low Quality**: 320px width, 10 FPS
- **Medium Quality**: 480px width, 15 FPS (recommended)
- **High Quality**: 720px width, 20 FPS

### Technical Requirements

- **File Size Limit**: Maximum 200MB
- **Browser Support**: Modern browsers with SharedArrayBuffer support
- **Initial Load**: Downloads FFmpeg core files (~30MB) on first use

## ⚙️ Configuration

### Environment Variables

The project supports the following environment variables:

- `VITE_GITHUB_OWNER`: GitHub username for the repository link (default: `navelorange1999`)

### Build Configuration

- **Framework**: React 18 + TypeScript + Vite 5
- **Styling**: Tailwind CSS + shadcn/ui components
- **Video Processing**: FFmpeg WASM for client-side conversion
- **Deployment**: Cloudflare Pages with Deploy Hooks
- **CI/CD**: GitHub Actions triggered by releases

### Browser Requirements

- **SharedArrayBuffer Support**: Required for FFmpeg WASM
- **Modern Browsers**: Chrome 68+, Firefox 79+, Safari 15.2+
- **Initial Load**: Downloads ~30MB FFmpeg core files on first use

## 🔧 Project Structure

```
src/
├── components/          # React Components
│   ├── VideoUploader.tsx    # Video upload component
│   ├── ConversionSettings.tsx # Parameter configuration
│   ├── GifPreview.tsx       # GIF preview and download
│   ├── ProgressBar.tsx      # Progress indicator
│   ├── Header.tsx          # Navigation header
│   ├── Footer.tsx          # Footer component
│   └── ui/              # shadcn/ui components
├── contexts/            # React Context
│   └── AppContext.tsx       # Global state management
├── hooks/               # Custom Hooks
│   └── useFFmpeg.ts         # FFmpeg processing logic
├── lib/                 # Utility functions
│   └── utils.ts             # Common utilities
├── types/               # TypeScript definitions
│   └── index.ts             # Type definitions
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## 🏗️ Core Features

- **FFmpeg WASM Integration**: Client-side video processing using `@ffmpeg/ffmpeg`
- **Auto-initialization**: FFmpeg engine loads automatically on page load
- **File Processing**: Drag-and-drop upload with file validation
- **Progress Monitoring**: Real-time conversion progress with multi-stage tracking
- **Preview Functionality**: Full-size GIF preview with aspect ratio preservation
- **Error Handling**: Comprehensive error messages and retry mechanisms
- **Responsive Design**: Optimized for all screen sizes with mobile-first approach
- **State Management**: Global state management using React Context API
- **Performance Optimization**: Memoization with memo, useCallback, and useMemo

## 🌟 Project Highlights

- **Zero Backend**: Completely frontend-based, no server required
- **Privacy Security**: All processing happens locally, no file uploads
- **Modern Tech Stack**: React 18 + TypeScript + Vite + Tailwind CSS
- **Component Architecture**: Built with shadcn/ui for modern, accessible UI
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

- [FFmpeg](https://ffmpeg.org/) - Powerful multimedia framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful React component library
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Cloudflare Pages](https://pages.cloudflare.com/) - Free static site hosting

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/navelorange1999/easy-to-gif/issues) page
2. Create a new issue with detailed information
3. For security issues, please email us directly

---

Made with ❤️ for creators and developers worldwide.
