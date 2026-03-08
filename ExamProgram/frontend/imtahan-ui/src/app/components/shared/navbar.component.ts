import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header>
      <nav>
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Dashboard</a>
        <a routerLink="/dersler" routerLinkActive="active">Dərslər</a>
        <a routerLink="/sagirdler" routerLinkActive="active">Şagirdlər</a>
        <a routerLink="/imtahanlar" routerLinkActive="active">İmtahanlar</a>
      </nav>
    </header>
  `
})
export class NavbarComponent {}
