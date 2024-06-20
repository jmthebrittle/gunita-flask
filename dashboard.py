from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configure the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///gunita.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define the Favorite model
class Favorite(db.Model):
    __tablename__ = 'favorites'
    id = db.Column(db.Integer, primary_key=True)
    img = db.Column(db.String(255))
    text = db.Column(db.String(255))
    category = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id': self.id,
            'img': self.img,
            'text': self.text,
            'category': self.category
        }

@app.before_first_request
def create_tables():
    db.create_all()

@app.route('/add_item', methods=['POST'])
def add_item():
    data = request.json
    new_favorite = Favorite(img=data['img'], text=data['text'], category=data['category'])
    db.session.add(new_favorite)
    db.session.commit()
    return jsonify({'status': 'success', 'id': new_favorite.id})

@app.route('/remove_item', methods=['DELETE'])
def remove_item():
    data = request.json
    favorite = Favorite.query.filter_by(img=data['img'], category=data['category']).first()
    if favorite:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({'status': 'success'})
    return jsonify({'status': 'not found'}), 404

@app.route('/')
def index():
    favorites = Favorite.query.all()
    return render_template('userDashboard.html', favorites=favorites)

if __name__ == '__main__':
    app.run(debug=True)
