#User Signup/Login Code
from flask import Flask, request, render_template, url_for, redirect
import sqlite3 as sql

app=Flask(__name__)

@app.route('/')
def home():
    return render_template("LandPage.html")

#SIGN UP
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
       except:
           msg = "Operational error"
           con.rollback()
       finally:
           return render_template("createUser.html", msg=msg)
   else:
       return render_template("SignUp.html")
   
#LOGIN
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
                   return render_template('userDash.html')
               else:
                   msg = "Invalid Username or Password!"
       except Exception as e:
           msg = f"Operational error: {e}"
   return render_template("login1.html", msg=msg)

if __name__ == '__main__':
   app.run(debug=True)