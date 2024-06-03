from flask import Flask, render_template, request
import sqlite3 as sql

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('list.html')

@app.route('/list')
def list():
    con = sql.connect("gunita.db")
    con.row_factory = sql.Row
    cur = con.cursor()
    cur.execute("SELECT * FROM events")
    rows = cur.fetchall()
    return render_template("list.html", rows = rows)

if __name__ == '__main__':
   app.run(debug=True)