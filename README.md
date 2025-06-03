# OSINT Lab

A modern web application for OSINT practitioners, featuring a dark mode interface and comprehensive tool integration.

## Features

- Dark mode UI with modern design
- Dynamic input type detection
- Tool categorization and favorites
- Case management system
- Geolocation mapping
- Recent searches tracking
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/osint-lab.git
cd osint-lab
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Deployment

### Option 1: Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Option 2: Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy
```

### Option 3: Deploy to GitHub Pages

1. Add homepage to package.json:
```json
{
  "homepage": "https://yourusername.github.io/osint-lab"
}
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Add deploy scripts to package.json:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

4. Deploy:
```bash
npm run deploy
```

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=your_api_url
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React.js
- Leaflet for mapping
- Font Awesome for icons