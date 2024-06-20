from flask import Flask, request, render_template, redirect, jsonify, session, url_for
from flask_sqlalchemy import SQLAlchemy
import os
import sqlite3 as sql

app = Flask(__name__)

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///gunita.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = os.urandom(24)
db = SQLAlchemy(app)

# Favorites model
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
    
@app.route('/')
def home():
    return render_template("LandPage.html")

# SIGN UP
@app.route('/createNewAcc', methods=['GET', 'POST'])
def create_user():
    if request.method == 'POST':
        try:
            FName = request.form['FName']
            LName = request.form['LName']
            UName = request.form['UName']
            Email = request.form['Email']
            Password = request.form['Password']
            if FName and LName and UName and Email and Password:
                with sql.connect("gunita.db") as con:
                    cur = con.cursor()
                    cur.execute("INSERT INTO users (UName, FName, LName, Email, Password) VALUES (?, ?, ?, ?, ?)", 
                                (UName, FName, LName, Email, Password))
                    con.commit()
                    msg = "Account created successfully!"
            else:
                msg = "All fields are required!"
        except Exception as e:
            msg = f"Operational error: {e}"
            con.rollback()
        finally:
            return render_template("login.html", msg=msg)
    else:
        return render_template("SignUp.html")

# LOGIN
@app.route('/login', methods=['GET', 'POST'])
def login():
    msg = ""
    if request.method == 'POST':
        try:
            UName = request.form['UName']
            Password = request.form['Password']
            with sql.connect("gunita.db") as con:
                cur = con.cursor()
                cur.execute("SELECT * FROM users WHERE UName=? AND Password=?", (UName, Password))
                user = cur.fetchone()
                if user:
                    session['username'] = UName
                    msg = "Login successful!"
                    return redirect('/homepage')
                else:
                    msg = "Invalid Username or Password!"
        except Exception as e:
            msg = f"Operational error: {e}"
    return render_template("login.html", msg=msg)

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect('/login')

@app.route('/profile')
def dashboard():
    if 'username' not in session:
        return redirect('/login')
    favorites = Favorite.query.all()
    return render_template('userDashboard.html', favorites=favorites)

#Save and Remove Items (not working with database yet)
@app.route('/add_item', methods=['POST'])
def add_item():
    data = request.json
    print("Data received for saving:", data)
    if 'img' in data and 'text' in data and 'category' in data:
        new_favorite = Favorite(img=data['img'], text=data['text'], category=data['category'])
        db.session.add(new_favorite)
        db.session.commit()
        print("Item saved:", new_favorite) 
        return jsonify({'status': 'success', 'id': new_favorite.id})
    else:
        print("Failed to save item, missing data:", data)  
        return jsonify({'status': 'failed', 'reason': 'Missing data'}), 400

@app.route('/remove_item', methods=['DELETE'])
def remove_item():
    data = request.json
    print("Data received for removing:", data)
    favorite = Favorite.query.filter_by(img=data['img'], text=data['text'], category=data['category']).first()
    if favorite:
        print("Item found:", favorite)  
        db.session.delete(favorite)
        db.session.commit()
        print("Item deleted:", favorite) 
        return jsonify({'status': 'success'})
    else:
        print("Item not found:", data)  
        return jsonify({'status': 'not found'}), 404

@app.route('/get_items', methods=['GET'])
def get_items():
    favorites = Favorite.query.all()
    items = [favorite.to_dict() for favorite in favorites]
    return jsonify(items)

#For dynamic banner image change per pages
@app.route('/category/<category_name>')
def category_page(category_name):
    images = {
        'attractions': 'images/Activities_Attractions/mt-pulag-1.jpg',
        'activities': 'images/Activities_Attractions/siargao-maasin-river-swing-4.jpg',
        'events': 'images/Events/boracay-dragon-boat-fest-2.jpg',
        'food': 'images/Food/arrowroot-cookies-1.jpg'
    }
    
    titles = {
        'attractions': 'ATTRACTIONS',
        'activities': 'ACTIVITIES',
        'events': 'EVENTS',
        'food': 'FOOD'
    }
    
    templates = {
        'attractions': 'attractions.html',
        'activities': 'activities.html',
        'events': 'events.html',
        'food': 'food.html'
    }
    
    image_url = images.get(category_name, 'default-image.jpg')
    page_title = titles.get(category_name, 'DEFAULT TITLE')
    template = templates.get(category_name, 'base_template.html')
    
    return render_template(template, image_url=image_url, page_title=page_title)


@app.route('/homepage')
def homepage():
    return render_template('homepage.html')

@app.route('/events')
def events_page():
    image_url = '/static/images/Events/boracay-dragon-boat-fest-2.jpg'
    page_title = 'EVENTS'
    return render_template('mainEventPage.html', image_url=image_url, page_title=page_title)

@app.route('/attractions')
def attracttions_page():
    image_url = '/static/images/Activities_Attractions/mt-pulag-1.jpg'
    page_title = 'ATTRACTIONS'
    return render_template('mainAttractionPage.html', image_url=image_url, page_title=page_title)


@app.route('/activities')
def activities_page():
    image_url = '/static/images/Activities_Attractions/siargao-maasin-river-swing-4.jpg'
    page_title = 'ACTIVITIES'
    return render_template('mainActivitiesPage.html', image_url=image_url, page_title=page_title)


@app.route('/food')
def food_page():
    image_url = '/static/images/Food/arrowroot-cookies-1.jpg'
    page_title = 'FOOD'
    return render_template('mainFoodPage.html', image_url=image_url, page_title=page_title)

#John's attempt of a database showing on screen
@app.route('/GetEventByID/<int:id_data>', methods = ['POST','GET'])
def GetEventByID(id_data):
    #flash(id_data)
    con = sql.connect("gunita.db")
    con.row_factory = sql.Row
    cur = con.cursor()
    cur.execute("SELECT * FROM events WHERE evID = ?", (id_data,))
    rows = cur.fetchall();
    #flash(rows)
    return render_template("catIndivEvent.html", rows = rows)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
