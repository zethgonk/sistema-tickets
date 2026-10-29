import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-list',
  imports: [RouterLink],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css',
})
export class TicketList implements OnInit {
  private servicio = inject(TicketService);

  tickets = signal<Ticket[]>([]);
  cargando = signal(true);
  error = signal('');

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.error.set('');
    this.servicio.listar().subscribe({
      next: (datos) => {
        this.tickets.set(datos);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(this.servicio.mensajeError(err));
        this.cargando.set(false);
      },
    });
  }

  eliminar(ticket: Ticket) {
    if (!confirm(`¿Eliminar el ticket "${ticket.asunto}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    this.servicio.eliminar(ticket.id!).subscribe({
      next: () => this.cargar(),
      error: (err) => this.error.set(this.servicio.mensajeError(err)),
    });
  }
}