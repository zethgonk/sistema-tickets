import { Routes } from '@angular/router';
import { TicketList } from './components/ticket-list/ticket-list';
import { TicketForm } from './components/ticket-form/ticket-form';

export const routes: Routes = [
  { path: '', component: TicketList, title: 'Tickets' },
  { path: 'nuevo', component: TicketForm, title: 'Nuevo ticket' },
  { path: 'editar/:id', component: TicketForm, title: 'Editar ticket' },
  { path: '**', redirectTo: '' },
];