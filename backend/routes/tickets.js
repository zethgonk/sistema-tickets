const express = require('express');
const db = require('../db');

const router = express.Router();

const CATEGORIAS = ['Hardware', 'Software', 'Red', 'Cuentas y accesos', 'Otro'];
const PRIORIDADES = ['Baja', 'Media', 'Alta'];
const ESTADOS = ['Abierto', 'En proceso', 'Cerrado'];

function textoValido(valor) {
  return typeof valor === 'string' && valor.trim().length > 0;
}

function validar(t) {
  const errores = [];
  if (!textoValido(t.asunto)) errores.push('El asunto es obligatorio');
  if (!textoValido(t.solicitante)) errores.push('El solicitante es obligatorio');
  if (!textoValido(t.descripcion)) errores.push('La descripción es obligatoria');
  if (!CATEGORIAS.includes(t.categoria)) errores.push('Categoría inválida');
  if (!PRIORIDADES.includes(t.prioridad)) errores.push('Prioridad inválida');
  if (!ESTADOS.includes(t.estado)) errores.push('Estado inválido');
  return errores;
}

// GET /api/tickets -> listar todos
router.get('/', (req, res) => {
  const tickets = db.prepare('SELECT * FROM tickets ORDER BY id DESC').all();
  res.json(tickets);
});

// GET /api/tickets/:id -> obtener uno
router.get('/:id', (req, res) => {
  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
  if (!ticket) return res.status(404).json({ mensaje: 'Ticket no encontrado' });
  res.json(ticket);
});

// POST /api/tickets -> crear
router.post('/', (req, res) => {
  const datos = { ...req.body, estado: req.body.estado || 'Abierto' };
  const errores = validar(datos);
  if (errores.length) return res.status(400).json({ mensaje: 'Datos inválidos', errores });

  const info = db
    .prepare(
      `INSERT INTO tickets (asunto, solicitante, descripcion, categoria, prioridad, estado)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(
      datos.asunto.trim(),
      datos.solicitante.trim(),
      datos.descripcion.trim(),
      datos.categoria,
      datos.prioridad,
      datos.estado
    );

  const creado = db.prepare('SELECT * FROM tickets WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(creado);
});

// PUT /api/tickets/:id -> actualizar
router.put('/:id', (req, res) => {
  const errores = validar(req.body);
  if (errores.length) return res.status(400).json({ mensaje: 'Datos inválidos', errores });

  const t = req.body;
  const info = db
    .prepare(
      `UPDATE tickets
       SET asunto = ?, solicitante = ?, descripcion = ?, categoria = ?, prioridad = ?, estado = ?
       WHERE id = ?`
    )
    .run(
      t.asunto.trim(),
      t.solicitante.trim(),
      t.descripcion.trim(),
      t.categoria,
      t.prioridad,
      t.estado,
      req.params.id
    );

  if (info.changes === 0) return res.status(404).json({ mensaje: 'Ticket no encontrado' });
  res.json(db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id));
});

// DELETE /api/tickets/:id -> eliminar
router.delete('/:id', (req, res) => {
  const info = db.prepare('DELETE FROM tickets WHERE id = ?').run(req.params.id);
  if (info.changes === 0) return res.status(404).json({ mensaje: 'Ticket no encontrado' });
  res.status(204).send();
});

module.exports = router;