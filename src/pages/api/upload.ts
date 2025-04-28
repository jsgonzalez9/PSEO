import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.status(500).json({ message: 'Error parsing file' });
    }

    const uploadedFile = files.file;
    const file = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;

    if (!file || !file.filepath) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const fileBuffer = await fs.promises.readFile(file.filepath);
      console.log('CSV Content:', fileBuffer.toString('utf-8')); // Just log it for now
      return res.status(200).json({ message: 'File uploaded and processed!' });
    } catch (readError) {
      console.error('Error reading file:', readError);
      return res.status(500).json({ message: 'Error reading uploaded file' });
    }
  });
}
