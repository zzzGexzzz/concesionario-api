const express = require('express');
const router = express.Router();
const db = require('../db/mysql');

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vehiculo');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
    const { marca, modelo, ano, precio, color, kilometraje, estado } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO vehiculo (marca, modelo, ano, precio, color, kilometraje, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [marca, modelo, ano, precio, color, kilometraje, estado]
        );
        res.status(201).json({ id_vehiculo: result.insertId, ...req.body });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM vehiculo WHERE id_vehiculo = ?', [req.params.id]);
        res.json({ message: 'Vehículo eliminado con éxito' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;