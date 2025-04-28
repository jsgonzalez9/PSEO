# Programmatic SEO Generator

A Next.js application for generating SEO-optimized pages from CSV data. This project allows you to upload CSV files containing content data and automatically generates optimized pages with proper SEO metadata, structured data, and content formatting.

## Features

- CSV file upload and parsing
- Automatic page generation from CSV data
- SEO optimization including:
  - Title tags
  - Meta descriptions
  - Keyword optimization
  - Structured data (JSON-LD)
  - Canonical URLs
- Responsive design with TailwindCSS
- Daily automatic updates via GitHub Actions
- Deployment to Vercel

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd programmatic-seo

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### CSV Format

Your CSV file should include the following columns:

- `title`: The page title
- `description`: A brief description of the content
- `content`: The main content (can include line breaks)
- `keywords`: Comma-separated keywords for SEO
- `location`: Location information if applicable

Additional columns will be available in the generated pages as well.

### Deployment

The project is configured to deploy automatically to Vercel via GitHub Actions. You'll need to set up the following secrets in your GitHub repository:

- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

## Project Structure

- `/src/pages/index.tsx`: Main upload form
- `/src/pages/api/upload.ts`: API endpoint for processing CSV uploads
- `/src/pages/generated/`: Directory where generated pages are stored

## License

MIT