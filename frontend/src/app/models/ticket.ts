export interface Ticket {
  id?: number;
  asunto: string;
  solicitante: string;
  descripcion: string;
  categoria: string;
  prioridad: 'Baja' | 'Media' | 'Alta';
  estado: 'Abierto' | 'En proceso' | 'Cerrado';
  fechaRegistro?: string;
}