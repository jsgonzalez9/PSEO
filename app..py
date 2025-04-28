from flask import Flask, render_template
from generators.content_generator import ContentGenerator
from generators.schema_generator import SchemaGenerator
from utils.seo_optimizer import SEOOptimizer
from utils.internal_linker import InternalLinker

app = Flask(__name__)
content_generator = ContentGenerator()
schema_generator = SchemaGenerator()
seo_optimizer = SEOOptimizer()
internal_linker = InternalLinker()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/rooms/<room_type>')
def room_page(room_type):
    room_data = content_generator.generate_room_content(room_type)
    schema = schema_generator.generate_room_schema(room_data)
    seo_data = seo_optimizer.optimize(room_data)
    internal_links = internal_linker.get_related_links(room_type)
    
    return render_template('room.html',
                         room=room_data,
                         schema=schema,
                         seo=seo_data,
                         links=internal_links)

# Similar routes for landmarks, events, and activities

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)