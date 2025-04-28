class SEOOptimizer:
    def optimize(self, content_data):
        return {
            'title_tag': self._generate_title_tag(content_data),
            'meta_description': self._generate_meta_description(content_data),
            'headers': self._generate_headers(content_data),
            'keywords': self._extract_keywords(content_data)
        }
    
    def _generate_title_tag(self, data):
        return f"{data['title']} | Your Hotel Name"
    
    def _generate_meta_description(self, data):
        return data['description'][:160]