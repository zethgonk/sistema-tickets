import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../models/ticket';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/api/tickets';

  listar(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.url);
  }

  obtener(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.url}/${id}`);
  }

  crear(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(this.url, ticket);
  }

  actualizar(id: number, ticket: Ticket): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.url}/${id}`, ticket);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  mensajeError(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'No se pudo conectar con el servidor. Verifica que la API esté en funcionamiento.';
    }
    const detalle = err.error?.errores?.join(', ');
    return detalle || err.error?.mensaje || 'Ocurrió un error inesperado.';
  }
}