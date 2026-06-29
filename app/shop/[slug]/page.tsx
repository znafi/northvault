import { notFound } from "next/navigation";
import { jerseys, getJerseyBySlug, getRelated } from "@/lib/data";
import { ProductDetail } from "@/components/pdp/ProductDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return jerseys.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const jersey = getJerseyBySlug(slug);
  if (!jersey) return {};
  return {
    title: jersey.name,
    description: jersey.description,
    openGraph: {
      title: jersey.name,
      description: jersey.description,
      images: jersey.images[0] ? [jersey.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const jersey = getJerseyBySlug(slug);
  if (!jersey) notFound();

  const related = getRelated(jersey);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: jersey.name,
    description: jersey.description,
    brand: { "@type": "Brand", name: jersey.maker },
    offers: {
      "@type": "Offer",
      priceCurrency: "CAD",
      price: jersey.price,
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: jersey.rating,
      reviewCount: jersey.reviewCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-paper pb-20 lg:pb-0">
        <ProductDetail jersey={jersey} related={related} />
      </div>
    </>
  );
}
