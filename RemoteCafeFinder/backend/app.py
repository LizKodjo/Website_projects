from flask import Flask, flash, redirect, render_template, request, session
from models import Admin, db, Cafe
import os
from dotenv import load_dotenv
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from flask_migrate import Migrate

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('APP_SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cafes.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
migrate = Migrate(app, db)

app.config['MAIL_SERVER'] = 'smtp.example.com'
app.config['MAIL_PORT'] = 589
app.config['MAIL_USERNAME'] = 'your@email.com'
app.config['MAIL_PASSWORD'] = 'your-password'
app.config['MAIL_USE_TLS'] = True
mail = Mail(app)


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
        msg = Message("New Cafe Added", recipients=["admin@email.com"])
        msg.body = f"{new_cafe.name} was added at {new_cafe.location} with Wi-Fi: {new_cafe.wifi}"
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


@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        admin = Admin.query.filter_by(
            username=request.form['username']).first()
        if admin and check_password_hash(admin.password_hash, request.form['password']):
            session['admin_id'] = admin.id
            flash('Login successful!', "success")
            return redirect('/admin-dashboard')
        else:
            flash('Invalid credentials', 'danger')
    return render_template('login.html')


@app.route('/admin-dashboard')
def admin_dashboard():
    if 'admin_id' not in session:
        flash("Please log in to access the dashboard.", "warning")
        return redirect('/login')

    page = request.args.get('page', 1, type=int)
    query = request.args.get('q', '')

    if query:
        search = f"%{query}%"
        cafes = db.paginate(Cafe.query.filter(
            Cafe.name.ilike(search) |
            Cafe.location.ilike(search) |
            Cafe.wifi.ilike(search)
        ),
            page=page,
            per_page=10
        )
    else:
        cafes = db.paginate(Cafe.query, page=page, per_page=10)

    return render_template('admin_dashboard.html', cafes=cafes)


@app.route('/search')
def search():
    query = request.args.get('q')
    results = Cafe.query.filter(Cafe.name.ilike(f"%{query}%")).all()
    return render_template('search_results.html', cafes=results)


@app.route('/export')
def export():
    cafes = Cafe.query.all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['Name', 'Location', 'Wi-Fi'])
    for cafe in cafes:
        writer.writerow([cafe.name, cafe.location, cafe.wifi])
    response = make_response(output.getvalue())
    response.headers["Content-Disposition"] = "attachment; filename=cafes.csv"
    response.headers["Content-type"] = "text/csv"
    return response


if __name__ == "__main__":
    app.run(debug=True)
