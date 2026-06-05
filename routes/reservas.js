const express = require('express');
const router = express.Router();
const db = require('../db/mysql');

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT r.id_reserva, r.fecha_reserva, r.tipo_transaccion, 
                   c.nombre AS nombre_cliente, v.marca, v.modelo
            FROM reserva r
            JOIN cliente c ON r.id_cliente = c.id_cliente
            JOIN vehiculo v ON r.id_vehiculo = v.id_vehiculo
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
    const { fecha_reserva, tipo_transaccion, id_cliente, id_vehiculo } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO reserva (fecha_reserva, tipo_transaccion, id_cliente, id_vehiculo) VALUES (?, ?, ?, ?)',
            [fecha_reserva, tipo_transaccion, id_cliente, id_vehiculo]
        );
        res.status(201).json({ id_reserva: result.insertId, ...req.body });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM reserva WHERE id_reserva = ?', [req.params.id]);
        res.json({ message: 'Reserva eliminada con éxito' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;