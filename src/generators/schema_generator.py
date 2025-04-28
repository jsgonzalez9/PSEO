class SchemaGenerator:
    def generate_room_schema(self, room_data):
        return {
            "@context": "https://schema.org",
            "@type": "HotelRoom",
            "name": room_data['title'],
            "description": room_data['description'],
            "amenityFeature": [
                {
                    "@type": "LocationFeatureSpecification",
                    "name": amenity
                } for amenity in room_data['amenities']
            ],
            "occupancy": {
                "@type": "QuantitativeValue",
                "maxValue": room_data['occupancy']
            }
        }