from flask import Flask, render_template, request, flash, redirect, url_for
import sqlite3 as sql

app=Flask(__name__)

@app.route('/')
def home():
    return render_template("LandPage.html")

@app.route('/createNewAcc')
def create_user():
    return render_template("SignUp.html")

@app.route('/createUser', methods=['GET','POST'])
def details():
    if request.method=='POST':
        try:
            FName=request.form['FName']
            LName=request.form['LName']
            Email=request.form['Email']
            Password=request.form['Password']
            if not FName or LName or Email or Password:
               
                with sql.connect("gunita.db") as con:
                    cur=con.cursor()
                    cur.execute("insert into Users (FName, LName, Email, Password)values(?, ?, ?, ?)",(FName, LName, Email, Password))
                    con.commit()
                    msg="Account created successfully!"
            else:
                msg="We are unable to process your request, please try again."
                con.rollback()
        except:
            msg="Operational error"
            con.rollback()
        finally:
            return render_template("createUser.html", msg=msg)

if __name__=='__main__':
    app.run(debug=True)

           