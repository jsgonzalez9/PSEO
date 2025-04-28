/**
 * SEO Optimizer utility for generating optimized metadata
 */
export interface ContentData {
  title: string;
  description: string;
  content: string;
  keywords: string;
  location: string;
  [key: string]: string;
}

export interface SEOData {
  titleTag: string;
  metaDescription: string;
  keywords: string[];
  headers: string[];
}

export class SEOOptimizer {
  /**
   * Generate optimized SEO data from content
   */
  optimize(contentData: ContentData): SEOData {
    return {
      titleTag: this.generateTitleTag(contentData),
      metaDescription: this.generateMetaDescription(contentData),
      keywords: this.extractKeywords(contentData),
      headers: this.generateHeaders(contentData),
    };
  }

  /**
   * Generate an optimized title tag
   */
  private generateTitleTag(data: ContentData): string {
    return `${data.title} | Your Brand Name`;
  }

  /**
   * Generate an optimized meta description (max 160 characters)
   */
  private generateMetaDescription(data: ContentData): string {
    return data.description.substring(0, 160);
  }

  /**
   * Extract keywords from the content data
   */
  private extractKeywords(data: ContentData): string[] {
    // If keywords are provided as a comma-separated string, split them
    if (data.keywords && typeof data.keywords === 'string') {
      return data.keywords.split(',').map(keyword => keyword.trim());
    }
    
    // Fallback to extracting keywords from content
    const content = data.content.toLowerCase();
    const words = content.split(/\s+/);
    const wordCount: Record<string, number> = {};
    
    // Count word frequency
    words.forEach(word => {
      // Remove punctuation and only count words longer than 3 characters
      const cleanWord = word.replace(/[^\w\s]/g, '');
      if (cleanWord.length > 3) {
        wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
      }
    });
    
    // Sort by frequency and take top 5
    return Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  /**
   * Generate header suggestions based on content
   */
  private generateHeaders(data: ContentData): string[] {
    // Simple implementation - in a real app, this would be more sophisticated
    const headers = [];
    
    // Add main title
    headers.push(data.title);
    
    // Add location-based header if available
    if (data.location) {
      headers.push(`${data.title} in ${data.location}`);
    }
    
    // Add a features header
    headers.push('Features & Amenities');
    
    return headers;
  }
}

// Export a singleton instance
export const seoOptimizer = new SEOOptimizer();