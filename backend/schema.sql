CREATE TABLE IF NOT EXISTS tickets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asunto TEXT NOT NULL,
  solicitante TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  categoria TEXT NOT NULL,
  prioridad TEXT NOT NULL CHECK (prioridad IN ('Baja', 'Media', 'Alta')),
  estado TEXT NOT NULL DEFAULT 'Abierto' CHECK (estado IN ('Abierto', 'En proceso', 'Cerrado')),
  fechaRegistro TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);