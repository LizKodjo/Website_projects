from flask import Flask, flash, redirect, render_template, request
from models import db, Cafe
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('APP_SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cafes.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/add-cafe', methods=['GET', 'POST'])
def add_cafe():
    if request.method == 'POST':
        new_cafe = Cafe(
            name=request.form['name'],
            location=request.form['location'],
            wifi=request.form['wifi']
        )
        db.session.add(new_cafe)
        db.session.commit()
        flash(f"{new_cafe.name} added successfully!", "success")
        return redirect('/cafes')
    return render_template('add_cafe.html')


@app.route('/cafes')
def cafes():
    # Test data
    all_cafes = Cafe.query.all()
    return render_template('cafes.html', cafes=all_cafes)


@app.route('/admin')
def admin():
    return render_template('admin.html')


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


if __name__ == "__main__":
    app.run(debug=True)
