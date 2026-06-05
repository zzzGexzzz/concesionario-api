const express = require('express');
const router = express.Router();
const db = require('../db/mysql');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM cliente');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
    const { nombre, email, telefono, ciudad } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO cliente (nombre, email, telefono, ciudad) VALUES (?, ?, ?, ?)',
            [nombre, email, telefono, ciudad]
        );
        res.status(201).json({ id_cliente: result.insertId, ...req.body });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM cliente WHERE id_cliente = ?', [req.params.id]);
        res.json({ message: 'Cliente eliminado con éxito' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;