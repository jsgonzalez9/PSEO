/**
 * Schema Generator utility for creating structured data (JSON-LD)
 */
import { ContentData } from './seoOptimizer';

export interface SchemaData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export class SchemaGenerator {
  /**
   * Generate schema.org structured data for a page
   */
  generateSchema(contentData: ContentData, url: string): SchemaData {
    // Determine the most appropriate schema type based on content
    const schemaType = this.determineSchemaType(contentData);
    
    switch (schemaType) {
      case 'Hotel':
        return this.generateHotelSchema(contentData, url);
      case 'Article':
        return this.generateArticleSchema(contentData, url);
      default:
        return this.generateArticleSchema(contentData, url);
    }
  }

  /**
   * Determine the most appropriate schema.org type based on content
   */
  private determineSchemaType(data: ContentData): string {
    const content = data.content.toLowerCase();
    const title = data.title.toLowerCase();
    
    // Check for hotel-related content
    if (
      content.includes('hotel') ||
      content.includes('room') ||
      content.includes('suite') ||
      content.includes('accommodation') ||
      title.includes('hotel') ||
      title.includes('room') ||
      title.includes('suite')
    ) {
      return 'Hotel';
    }
    
    // Default to Article for general content
    return 'Article';
  }

  /**
   * Generate schema.org Hotel structured data
   */
  private generateHotelSchema(data: ContentData, url: string): SchemaData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Hotel',
      name: data.title,
      description: data.description,
      url: url,
      address: {
        '@type': 'PostalAddress',
        addressLocality: data.location || 'City',
        addressCountry: 'US'
      },
      image: 'https://example.com/hotel-image.jpg', // Placeholder - should be replaced with actual image
      priceRange: '$$', // Placeholder
      starRating: {
        '@type': 'Rating',
        ratingValue: '4.5' // Placeholder
      },
      amenityFeature: this.extractAmenities(data.content)
    };
  }

  /**
   * Generate schema.org Article structured data
   */
  private generateArticleSchema(data: ContentData, url: string): SchemaData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.title,
      description: data.description,
      author: {
        '@type': 'Organization',
        name: 'Your Brand Name'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Your Brand Name',
        logo: {
          '@type': 'ImageObject',
          url: 'https://yourdomain.com/logo.png'
        }
      },
      url: url,
      mainEntityOfPage: url,
      keywords: data.keywords
    };
  }

  /**
   * Extract amenities from content text
   */
  private extractAmenities(content: string): Array<{"@type": string, name: string}> {
    const amenityKeywords = [
      'wifi', 'pool', 'spa', 'gym', 'fitness', 'breakfast', 
      'restaurant', 'bar', 'parking', 'room service', 'concierge',
      'air conditioning', 'tv', 'minibar'
    ];
    
    const foundAmenities: Array<{"@type": string, name: string}> = [];
    const contentLower = content.toLowerCase();
    
    amenityKeywords.forEach(amenity => {
      if (contentLower.includes(amenity)) {
        foundAmenities.push({
          '@type': 'LocationFeatureSpecification',
          name: amenity.charAt(0).toUpperCase() + amenity.slice(1)
        });
      }
    });
    
    return foundAmenities;
  }
}

// Export a singleton instance
export const schemaGenerator = new SchemaGenerator();