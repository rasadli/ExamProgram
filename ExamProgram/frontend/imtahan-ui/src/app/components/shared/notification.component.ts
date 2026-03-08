import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="(service.toasts$ | async) as toasts">
      <div *ngFor="let t of toasts" class="toast" [ngClass]="t.type">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;">
          <span>{{ t.message }}</span>
          <button class="btn btn-outline" style="padding:4px 8px;" (click)="service.dismiss(t.id)">x</button>
        </div>
      </div>
    </div>
  `
})
export class NotificationComponent {
  constructor(public service: NotificationService) {}
}
