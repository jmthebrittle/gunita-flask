from flask import Flask, render_template, request, flash, redirect, url_for
import sqlite3 as sql

app=Flask(__name__)

@app.route('/')
def home():
    return render_template("LandPage.html")

@app.route('/loginAcc')
def create_user():
    return render_template("LogIn.html")

if __name__=='__main__':
    app.run(debug=True)