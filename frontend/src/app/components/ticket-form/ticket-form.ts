import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Ticket } from '../../models/ticket';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css',
})
export class TicketForm implements OnInit {
  private fb = inject(FormBuilder);
  private servicio = inject(TicketService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  categorias = ['Hardware', 'Software', 'Red', 'Cuentas y accesos', 'Otro'];
  prioridades = ['Baja', 'Media', 'Alta'];
  estados = ['Abierto', 'En proceso', 'Cerrado'];

  id: number | null = null;
  error = signal('');
  guardando = signal(false);

  form = this.fb.nonNullable.group({
    asunto: ['', [Validators.required, Validators.minLength(5)]],
    solicitante: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    categoria: ['', Validators.required],
    prioridad: ['Media', Validators.required],
    estado: ['Abierto', Validators.required],
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.servicio.obtener(this.id).subscribe({
        next: (ticket) => this.form.patchValue(ticket),
        error: (err) => this.error.set(this.servicio.mensajeError(err)),
      });
    }
  }

  invalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set('');
    const datos = this.form.getRawValue() as Ticket;

    const peticion = this.id
      ? this.servicio.actualizar(this.id, datos)
      : this.servicio.crear(datos);

    peticion.subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.error.set(this.servicio.mensajeError(err));
        this.guardando.set(false);
      },
    });
  }
}