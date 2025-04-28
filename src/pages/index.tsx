import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Head from 'next/head';

const FormSchema = z.object({
  csvFile: z.any().refine((files) => {
    if (typeof window === 'undefined') return true;
    return files && files.length > 0 && files[0] instanceof File;
  }, {
    message: 'Please upload a CSV file',
  }),
});

type FormValues = z.infer<typeof FormSchema>;

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsUploading(true);
    setUploadResult(null);

    try {
      const file = data.csvFile?.[0];
      if (!file) throw new Error('No file selected');

      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }

      setUploadResult('Upload successful!');
      reset();
    } catch (error: any) {
      setUploadResult(error?.message || 'Something went wrong.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>CSV Upload</title>
        <meta name="description" content="Upload CSV File" />
      </Head>

      <main className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Upload CSV</h1>

        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700 mb-1">
                CSV File
              </label>
              <input
                id="csvFile"
                type="file"
                accept=".csv"
                {...register('csvFile')}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {errors.csvFile && (
                <p className="mt-1 text-sm text-red-600">{errors.csvFile.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </form>

          {uploadResult && (
            <div className="mt-4 p-3 rounded-md bg-green-50 text-green-800">
              {uploadResult}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
