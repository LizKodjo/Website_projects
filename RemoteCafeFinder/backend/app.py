from flask import Flask, flash, make_response, redirect, render_template, request, session
from models import Admin, db, Cafe
import os
from dotenv import load_dotenv
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from flask_migrate import Migrate
import csv
import io


load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('APP_SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cafes.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
migrate = Migrate(app, db)
MY_EMAIL = os.getenv('MAIL_USERNAME')

app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
app.config['MAIL_USERNAME'] = MY_EMAIL
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS')
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_DEFAULT_SENDER'] = MY_EMAIL
mail = Mail(app)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/add-cafe', methods=['GET', 'POST'])
def add_cafe():
    if 'admin_id' not in session:
        return redirect('/login')

    if request.method == 'POST':
        new_cafe = Cafe(
            name=request.form['name'],
            location=request.form['location'],
            wifi=request.form['wifi']
        )
        db.session.add(new_cafe)
        db.session.commit()
        flash(f"{new_cafe.name} added successfully!", "success")
        msg = Message("New Cafe Added", recipients=[MY_EMAIL])
        msg.body = f"{new_cafe.name} was added at {new_cafe.location} with Wi-Fi: {new_cafe.wifi}"
        mail.send(msg)
        return redirect('/cafes')

    return render_template('add_cafe.html')


@app.route('/cafes')
def cafes():
    page = request.args.get('page', 1, type=int)
    wifi_filter = request.args.get('wifi')
    query = request.args.get('q', '')

    base_query = Cafe.query

    if query:
        search = f"%{query}%"
        base_query = base_query.filter(Cafe.name.ilike(
            search) | Cafe.location.ilike(search) | Cafe.wifi.ilike(search))

    if wifi_filter:
        base_query = base_query.filter_by(wifi=wifi_filter)

    cafes = db.paginate(base_query, page=page, per_page=10)
    # Test data
    # all_cafes = Cafe.query.all()
    return render_template('cafes.html', cafes=cafes)


@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        message_body = request.form['message']

        msg = Message(subject="New Contact Form Submission",
                      sender=email, recipients=[MY_EMAIL])
        msg.body = f"From: {name} <{email}>\n\n{message_body}"
        mail.send(msg)

        flash("Thanks for reaching out!  We'll be in touch soon.", "success")
        return redirect("/contact")
    return render_template('contact.html')


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
        cafes = db.paginate(Cafe.query.filter(Cafe.name.ilike(search) | Cafe.location.ilike(search) | Cafe.wifi.ilike(search)),
                            page=page,
                            per_page=10)
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
    if 'admin_id' not in session:
        return redirect('/login')
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


@app.route('/logout')
def logout():
    session.pop('admin_id', None)
    flash("You've been logged out.", "info")
    return redirect('/login')


@app.route('/edit-cafe/<int:cafe_id>', methods=['GET', 'POST'])
def edit_cafe(cafe_id):
    if 'admin_id' not in session:
        return redirect('/login')
    cafe = Cafe.query.get_or_404(cafe_id)
    if request.method == 'POST':
        cafe.name = request.form['name']
        cafe.location = request.form['location']
        cafe.wifi = request.form['wifi']
        db.session.commit()
        flash("Cafe updated!", "success")
        return redirect('/admin-dashboard')
    return render_template('edit_cafe.html', cafe=cafe)


@app.route('/delete-cafe/<int:cafe_id>', methods=['POST'])
def delete_cafe(cafe_id):
    if 'admin_id' not in session:
        return redirect('/login')
    cafe = Cafe.query.get_or_404(cafe_id)
    db.session.delete(cafe)
    db.session.commit()
    flash("Cafe deleted", "warning")
    return redirect('/admin-dashboard')


@app.cli.command("create-admin")
def create_admin():
    username = input("Enter admin username: ")
    password = input("Enter admin password: ")

    if Admin.query.filter_by(username=username).first():
        print("❌ Admin already exists.")
        return

    hashed_pw = generate_password_hash(password)
    new_admin = Admin(username=username, password_hash=hashed_pw)
    db.session.add(new_admin)
    db.session.commit()
    print(f"✅ Admin '{username}' created successfully.")


if __name__ == "__main__":
    app.run(debug=True)
