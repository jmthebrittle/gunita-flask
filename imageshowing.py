from flask import Flask, request, render_template, url_for, redirect
import sqlite3 as sql

app = Flask(__name__)

@app.route('/')
def list():
    con = sql.connect("gunita.db")
    con.row_factory = sql.Row
    cur = con.cursor()
    cur.execute("SELECT * FROM events")
    rows = cur.fetchall()
    return render_template("list.html", rows= rows)

if __name__ == '__main__':
   app.run(debug=True)