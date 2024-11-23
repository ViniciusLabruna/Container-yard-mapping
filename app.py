from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)
DATABASE = 'containers.db'

def create_table():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS containers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            container_number TEXT NOT NULL,
            rua TEXT,
            quadra TEXT NOT NULL,
            pilha TEXT NOT NULL,
            posicao INTEGER NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/')
def index():
    return "API do Terminal de Containers"

@app.route('/register', methods=['POST'])
def register_container():
    data = request.get_json()
    container_number = data['container_number']
    rua = data.get('rua', None)
    quadra = data['quadra']
    pilha = data['pilha']
    posicao = data['posicao']

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO containers (container_number, rua, quadra, pilha, posicao)
        VALUES (?, ?, ?, ?, ?)
    ''', (container_number, rua, quadra, pilha, posicao))
    conn.commit()
    conn.close()

    return jsonify({"message": "Container registrado com sucesso!"}), 201

@app.route('/containers', methods=['GET'])
def get_containers():
    rua = request.args.get('rua')
    quadra = request.args.get('quadra')
    pilha = request.args.get('pilha')
    posicao = request.args.get('posicao')

    query = "SELECT * FROM containers WHERE 1=1"
    params = []
    if rua:
        query += " AND rua = ?"
        params.append(rua)
    if quadra:
        query += " AND quadra = ?"
        params.append(quadra)
    if pilha:
        query += " AND pilha = ?"
        params.append(pilha)
    if posicao:
        query += " AND posicao = ?"
        params.append(posicao)

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    containers = [{"id": row[0], "container_number": row[1], "rua": row[2], "quadra": row[3], "pilha": row[4], "posicao": row[5]} for row in rows]

    return jsonify(containers)

@app.route('/update/<int:id>', methods=['PUT'])
def update_container(id):
    data = request.get_json()
    container_number = data['container_number']
    rua = data.get('rua', None)
    quadra = data['quadra']
    pilha = data['pilha']
    posicao = data['posicao']

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE containers
        SET container_number = ?, rua = ?, quadra = ?, pilha = ?, posicao = ?
        WHERE id = ?
    ''', (container_number, rua, quadra, pilha, posicao, id))
    conn.commit()
    conn.close()

    return jsonify({"message": "Container atualizado com sucesso!"})

@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_container(id):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM containers WHERE id = ?', (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Container removido com sucesso!"})

if __name__ == '__main__':
    create_table()
    app.run(debug=True)
