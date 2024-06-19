from flask import Flask, request, render_template, url_for, redirect
import sqlite3 as sql

app = Flask(__name__)

@app.route('/', methods=['GET']) 
def view_contacts(): 
    conn = sql.connect('gunita.db') 
    cursor = conn.cursor() 
    cursor.execute("SELECT * FROM events") 
    events = cursor.fetchall() 
    conn.close()
    return render_template('test.html', events=events)

if __name__ == '__main__':
   app.run(debug=True)