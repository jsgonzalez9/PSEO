import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { seoOptimizer, ContentData } from '../utils/seoOptimizer';
import { schemaGenerator } from '../utils/schemaGenerator';

interface PageProps {
  content: ContentData;
  seo: ReturnType<typeof seoOptimizer.optimize>;
  schema: ReturnType<typeof schemaGenerator.generateSchema>;
  slug: string;
}

export default function DynamicPage({ content, seo, schema, slug }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{seo.titleTag}</title>
        <meta name="description" content={seo.metaDescription} />
        <meta name="keywords" content={seo.keywords.join(', ')} />
        <link rel="canonical" href={`https://yourdomain.com/${slug}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      </Head>

      <main className="container mx-auto py-10 px-4">
        <article className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4">{content.title}</h1>
          <p className="text-gray-600 mb-6">{content.description}</p>
          
          <div className="prose max-w-none">
            {content.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
          
          {content.location && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-3">Location Information</h2>
              <p>{content.location}</p>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Read the CSV file to generate paths
  const csvPath = path.join(process.cwd(), 'sample-data.csv');
  
  // If the file doesn't exist yet, return empty paths
  if (!fs.existsSync(csvPath)) {
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
  
  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    delimiter: ',',
    relax_column_count: false,
    quote: true,
  }) as ContentData[];
  
  const paths = records.map(record => ({
    params: { slug: slugify(record.title) },
  }));
  
  return {
    paths,
    fallback: 'blocking', // Show a loading state
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const csvPath = path.join(process.cwd(), 'sample-data.csv');
  
  // If the file doesn't exist, return 404
  if (!fs.existsSync(csvPath)) {
    return {
      notFound: true,
    };
  }
  
  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    delimiter: ',',
    relax_column_count: false,
    quote: true,
  }) as ContentData[];
  
  // Find the record that matches the slug
  const record = records.find(r => slugify(r.title) === slug);
  
  if (!record) {
    return {
      notFound: true,
    };
  }
  
  // Generate SEO data
  const seo = seoOptimizer.optimize(record);
  const schema = schemaGenerator.generateSchema(
    record, 
    `https://yourdomain.com/${slug}`
  );
  
  return {
    props: {
      content: record,
      seo,
      schema,
      slug,
    },
    // Revalidate every 24 hours
    revalidate: 86400,
  };
};

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
}