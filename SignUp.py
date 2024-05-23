from flask import Flask, request, render_template
import sqlite3 as sql

app=Flask(__name__)

@app.route('/')
def home():
    return render_template("LandPage.html")


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
if __name__ == '__main__':
   app.run(debug=True)