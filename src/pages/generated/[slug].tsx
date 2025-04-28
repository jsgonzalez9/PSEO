import { getCsvData } from '@/lib/csvData';
import { GetServerSideProps } from 'next';

interface PageProps {
  title: string;
  description: string;
}

export default function GeneratedPage({ title, description }: PageProps) {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg">{description}</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };
  const data = getCsvData();

  const page = data.find((row) => row.slug === slug);

  if (!page) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      title: page.title,
      description: page.description,
    },
  };
}