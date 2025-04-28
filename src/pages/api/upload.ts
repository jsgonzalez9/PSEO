import type { NextApiRequest, NextApiResponse } from 'next';

// Disable Next.js built-in body parser (we will manually parse)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const chunks: Buffer[] = [];

    // Listen to incoming data
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });

    // When all data is received
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const fileContent = buffer.toString('utf-8');

      console.log('CSV file content:', fileContent);

      // Here you can now parse CSV, store it, etc.

      return res.status(200).json({ message: 'File uploaded and processed successfully!' });
    });

    req.on('error', (err) => {
      console.error('Request stream error:', err);
      return res.status(500).json({ message: 'Error receiving file' });
    });
  } catch (error) {
    console.error('File processing error:', error);
    return res.status(500).json({ message: 'Failed to process file' });
  }
}