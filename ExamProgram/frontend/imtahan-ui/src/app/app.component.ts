import { Component } from '@angular/core';
import { RouterOutlet, Routes } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar.component';
import { NotificationComponent } from './components/shared/notification.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DerslerComponent } from './components/dersler/dersler.component';
import { SagirdlerComponent } from './components/sagirdler/sagirdler.component';
import { ImtahanlarComponent } from './components/imtahanlar/imtahanlar.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dersler', component: DerslerComponent },
  { path: 'sagirdler', component: SagirdlerComponent },
  { path: 'imtahanlar', component: ImtahanlarComponent },
  { path: '**', redirectTo: '/dashboard' }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NotificationComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
    <app-notifications></app-notifications>
  `
})
export class AppComponent {}
