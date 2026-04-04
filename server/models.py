from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), default='customer')  # admin, waiter, chef, customer

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_token(self):
        return create_access_token(identity=self.id)

class MenuItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50))
    image = db.Column(db.String(200))
    available = db.Column(db.Boolean, default=True)

class Table(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.Integer, unique=True)
    capacity = db.Column(db.Integer)
    status = db.Column(db.String(20), default='available')  # available, occupied, reserved
    qr_code = db.Column(db.String(200))

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    table_id = db.Column(db.Integer, db.ForeignKey('table.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    items = db.relationship('OrderItem', backref='order')
    total = db.Column(db.Float)
    status = db.Column(db.String(20), default='pending')  # pending, preparing, ready, served, paid
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'))
    menu_item_id = db.Column(db.Integer, db.ForeignKey('menu_item.id'))
    quantity = db.Column(db.Integer)
    price = db.Column(db.Float)

class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Float)
    unit = db.Column(db.String(20))
    low_threshold = db.Column(db.Float)

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'))
    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    sentiment = db.Column(db.String(20))  # positive, negative, neutral

class WasteLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item = db.Column(db.String(100))
    quantity = db.Column(db.Float)
    reason = db.Column(db.String(200))
    date = db.Column(db.DateTime, default=datetime.utcnow)

