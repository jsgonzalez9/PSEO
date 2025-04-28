import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

// Disable Next.js body parsing (formidable will handle it)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ message: 'Failed to parse the file' });
    }

    const csvFile = files.csvFile?.[0] || files.csvFile;

    if (!csvFile) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      // Example: Read the file
      const fileContent = await fs.promises.readFile(csvFile.filepath, 'utf-8');
      console.log('CSV file content:', fileContent);

      // You can now process the CSV however you want here
      return res.status(200).json({ message: 'File uploaded and processed successfully!' });
    } catch (error) {
      console.error('File processing error:', error);
      return res.status(500).json({ message: 'Failed to process file' });
    }
  });
}
