const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.use('/api/tickets', require('./routes/tickets'));

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));