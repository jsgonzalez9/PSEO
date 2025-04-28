import json
from pathlib import Path

class ContentGenerator:
    def __init__(self):
        self.data_dir = Path(__file__).parent.parent / 'data'
    
    def generate_room_content(self, room_type):
        with open(self.data_dir / 'rooms.json') as f:
            rooms_data = json.load(f)
            
        room = rooms_data.get(room_type, {})
        return {
            'title': f'{room["name"]} - {room["type"]} Room at Our Hotel',
            'description': room['description'],
            'amenities': room['amenities'],
            'images': room['images'],
            'pricing': room['pricing'],
            'availability': room['availability']
        }