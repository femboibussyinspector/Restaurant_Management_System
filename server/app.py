from flask import Flask, request, jsonify
from flask_cors import CORS

from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import load_dotenv
import os
from models import *

load_dotenv()

app = Flask(__name__, instance_relative_config=True)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev')
app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///smartdine.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
from models import db
db.init_app(app)
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

@app.route('/')
def hello():
    return {'message': 'SmartDine RMS Backend Ready! DB: sqlite (temp)'}

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data or not all(k in data for k in ('username', 'email', 'password')):
        return jsonify({'error': 'Missing fields'}), 400
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username exists'}), 400
    user = User(
        username=data['username'],
        email=data['email']
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    token = create_access_token(identity=user.id)
    return jsonify({'message': 'Registered', 'token': token})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        token = create_access_token(identity=user.id)
        return jsonify({'token': token})
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/protected')
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    return jsonify({'message': f'Protected endpoint. User ID: {current_user_id}'})

@app.route('/api/menu', methods=['GET'])
def get_menu():
    items = MenuItem.query.all()
    return jsonify([{'id': i.id, 'name': i.name, 'price': i.price, 'category': i.category} for i in items])

@app.route('/api/menu', methods=['POST'])
@jwt_required()
def add_menu():
    data = request.json
    item = MenuItem(name=data['name'], price=float(data['price']), category=data.get('category', ''))
    db.session.add(item)
    db.session.commit()
    return jsonify({'message': 'Added', 'id': item.id})

@app.route('/api/menu/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_menu(id):
    item = MenuItem.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Deleted'})


@app.route('/api/tables', methods=['GET'])
def get_tables():
    tables = Table.query.all()
    return jsonify([{'id': t.id, 'number': t.number, 'status': t.status} for t in tables])

@app.route('/api/tables/<int:id>/status', methods=['PATCH'])
@jwt_required()
def update_table_status(id):
    table = Table.query.get_or_404(id)
    data = request.json
    table.status = data['status']
    db.session.commit()
    socketio.emit('table_update', {'id': id, 'status': table.status}, broadcast=True)
    return jsonify({'message': 'Updated'})

@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    items = Inventory.query.all()
    return jsonify([{'id': i.id, 'name': i.name, 'quantity': i.quantity} for i in items])

@app.route('/api/inventory', methods=['POST'])
@jwt_required()
def add_inventory():
    data = request.json
    item = Inventory(name=data['name'], quantity=data['quantity'])
    db.session.add(item)
    db.session.commit()
    return jsonify({'message': 'Added'})

@app.route('/api/bill/<int:order_id>', methods=['GET'])
@jwt_required()
def get_bill(order_id):
    order = Order.query.get_or_404(order_id)
    return jsonify({'total': order.total or 0})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Seed data
        if not MenuItem.query.first():
            burger = MenuItem(name='Burger', price=12.99, category='Main')
            db.session.add(burger)
            db.session.flush()
            salad = MenuItem(name='Salad', price=8.99, category='Starter')
            db.session.add(salad)
            db.session.commit()
        if not Table.query.first():
            t1 = Table(number=1, capacity=4)
            db.session.add(t1)
            t2 = Table(number=2, capacity=6)
            db.session.add(t2)
            db.session.commit()
    socketio.run(app, debug=True, host='0.0.0.0')



