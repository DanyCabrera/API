const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const db = require('../DB/DB_conection');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

//req = request, res = response
//req: enviamos una peticion con los metodos HTTP
//res: obtendremos una respuesta

// Obtenemos todos los usuarios
app.get('/users', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, email, address, phone, created_at, updated_at FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Obtenemos un usuario por ID
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT id, name, email, address, phone, created_at, updated_at FROM users WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
})

// Creamos un nuevo usuario
app.post('/users', async (req, res) => {
    const { name, email, address, phone } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Campos requeridos' });
    try {
        const [result] = await db.query(
            'INSERT INTO users (name, email, address, phone) VALUES (?, ?, ?, ?)',
            [name, email, address || null, phone || null]
        );
        res.status(201).json({ id: result.insertId, name, email, address, phone });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
});

// Actualizamos un usuario
app.put('/users/:id', async (req, res) => {
    const id = req.params.id;
    const { name, email, address, phone } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), address = COALESCE(?, address), phone = COALESCE(?, phone) WHERE id = ?',
            [name, email, address, phone, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ id: parseInt(id, 10), name, email, address, phone });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
});

// Eliminamos un usuario
app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado', id: parseInt(id, 10) });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
});

// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
})