from flask import Flask, request, render_template, redirect, jsonify, session, url_for
import os
import sqlite3 as sql

app = Flask(__name__)

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
                    cur.execute("INSERT INTO users (UName, FName, LName, Email, Password) VALUES (?, ?, ?, ?, ?)", (UName, FName, LName, Email, Password))
                    con.commit()
                    msg = "Account created successfully!"
            else:
                msg = "All fields are required!"
        except Exception as e:
            msg = f"Operational error: {e}"
            con.rollback()
        finally:
            return render_template("createUser.html", msg=msg)
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
                    msg = "Login successful!"
                    # You can redirect to a user dashboard or home page here
                    return redirect('/homepage')
                else:
                    msg = "Invalid Username or Password!"
        except Exception as e:
            msg = f"Operational error: {e}"
    return render_template("login.html", msg=msg)

# Route for homepage
@app.route('/homepage')
def homepage():
    return render_template('homepage.html')

# User Dashboard
@app.route('/profile')
def dashboard():
    return render_template('userDashboard.html')

# Event Handlers

@app.route('/item')
def item():
    return render_template('ItemPage.html')

@app.route('/attractions')
def attractions():
    return render_template('AttractionPage.html')

@app.route('/activities')
def activities():
    return render_template('ActivitiesPage.html')

@app.route('/events')
def events():
    return render_template('EventPage.html')

@app.route('/food')
def food():
    return render_template('FoodPage.html')

@app.route('/infoset-event')
def infoevent():
    return render_template('infoset-events.html')

#connect dashboard to database (unfinished) ~ rona

@app.route('/GetEventByID/<int:id_data>', methods=['POST','GET'])
def GetEventByID(id_data):
    with sql.connect("gunita.db") as con:
        con.row_factory = sql.Row
        cur = con.cursor()
        cur.execute("SELECT * FROM events WHERE evID = ?", (id_data,))
        rows = cur.fetchall()
    return render_template("Itempage.html", rows=rows)

# Save and Remove Items
@app.route('/add_item', methods=['POST'])
def add_item():
    data = request.json
    with sql.connect('gunita.db') as con:
        cur = con.cursor()
        cur.execute('''
            INSERT INTO saved_items (img, text, link, category)
            VALUES (?, ?, ?, ?)
        ''', (data['img'], data['text'], data['link'], data['category']))
        con.commit()
    return jsonify({'status': 'success'})

@app.route('/remove_item', methods=['POST'])
def remove_item():
    data = request.json
    with sql.connect('gunita.db') as con:
        cur = con.cursor()
        cur.execute('''
            DELETE FROM saved_items
            WHERE img = ? AND category = ?
        ''', (data['img'], data['category']))
        con.commit()
    return jsonify({'status': 'success'})

@app.route('/get_items', methods=['GET'])
def get_items():
    with sql.connect('gunita.db') as con:
        cur = con.cursor()
        cur.execute('SELECT img, text, link, category FROM saved_items')
        items = cur.fetchall()
    return jsonify(items)



if __name__ == '__main__':
    app.run(debug=True)
