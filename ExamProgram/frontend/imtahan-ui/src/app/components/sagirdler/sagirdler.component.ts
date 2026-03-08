import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';
import { Sagird } from '../../models/sagird';

@Component({
  selector: 'app-sagirdler',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-title">
      <h2>Şagirdlər</h2>
      <div class="toolbar">
        <input class="input" placeholder="Ad, soyad və ya nömrə" (input)="onSearch($event)" />
        <button class="btn btn-primary" (click)="startCreate()">Yeni şagird</button>
      </div>
    </div>

    <div class="card">
      <table *ngIf="sagirdler.length">
        <thead>
          <tr>
            <th>No</th>
            <th>Ad Soyad</th>
            <th>Sinif</th>
            <th>Ortalama</th>
            <th>Əməliyyatlar</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let s of sagirdler">
            <td>{{ s.nomresi }}</td>
            <td>{{ s.adi }} {{ s.soyadi }}</td>
            <td><span class="badge">{{ s.sinif }}</span></td>
            <td>{{ s.ortalamaQiymet ?? '–' }}</td>
            <td>
              <button class="btn btn-outline" (click)="edit(s)">Dəyiş</button>
              <button class="btn btn-danger" (click)="remove(s)">Sil</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="!sagirdler.length" class="muted">Heç nə tapılmadı.</div>
    </div>

    <div class="card" *ngIf="formVisible" style="margin-top:12px;">
      <h3>{{ editing ? 'Şagirdi yenilə' : 'Yeni şagird' }}</h3>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="row">
          <div>
            <label>Nömrə</label>
            <input class="input" type="number" formControlName="nomresi" [readonly]="editing" />
          </div>
          <div>
            <label>Ad</label>
            <input class="input" formControlName="adi" />
          </div>
          <div>
            <label>Soyad</label>
            <input class="input" formControlName="soyadi" />
          </div>
          <div>
            <label>Sinif</label>
            <input class="input" type="number" min="1" max="12" formControlName="sinif" />
          </div>
        </div>
        <div class="toolbar" style="justify-content:flex-end;margin-top:12px;">
          <button class="btn btn-outline" type="button" (click)="cancel()">İmtina</button>
          <button class="btn btn-primary" type="submit" [disabled]="form.invalid">
            {{ editing ? 'Yenilə' : 'Əlavə et' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class SagirdlerComponent implements OnInit {
  sagirdler: Sagird[] = [];
  form!: FormGroup;
  formVisible = false;
  editing = false;
  keyword = '';

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.load();
  }

  buildForm() {
    this.form = this.fb.group({
      nomresi: [null, [Validators.required]],
      adi: ['', [Validators.required, Validators.maxLength(30)]],
      soyadi: ['', [Validators.required, Validators.maxLength(30)]],
      sinif: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
    });
  }

  load() {
    const asNumber = Number(this.keyword);
    const nomreFilter = (this.keyword.trim() !== '' && Number.isInteger(asNumber) && asNumber > 0)
      ? asNumber
      : undefined;
    this.api.getSagirdler({
      ad: this.keyword || undefined,
      soyad: this.keyword || undefined,
      nomre: nomreFilter
    }).subscribe(s => this.sagirdler = s);
  }

  onSearch(ev: Event) {
    this.keyword = (ev.target as HTMLInputElement).value;
    this.load();
  }

  startCreate() {
    this.formVisible = true;
    this.editing = false;
    this.form.reset({ sinif: 1 });
  }

  edit(s: Sagird) {
    this.formVisible = true;
    this.editing = true;
    this.form.patchValue(s);
  }

  cancel() {
    this.formVisible = false;
  }

  submit() {
    if (this.form.invalid) return;
    const payload = this.form.value as Sagird;
    if (this.editing) {
      this.api.updateSagird(payload.nomresi, payload).subscribe({
        next: () => { this.notify.success('Şagird yeniləndi'); this.afterSave(); },
        error: (err: any) => this.notify.error(this.extractError(err))
      });
    } else {
      this.api.createSagird(payload).subscribe({
        next: () => { this.notify.success('Şagird əlavə olundu'); this.afterSave(); },
        error: (err: any) => this.notify.error(this.extractError(err))
      });
    }
  }

  remove(s: Sagird) {
    if (!confirm(`${s.adi} ${s.soyadi} silinsin?`)) return;
    this.api.deleteSagird(s.nomresi).subscribe({
      next: () => { this.notify.success('Silindi'); this.load(); },
      error: (err: any) => this.notify.error(this.extractError(err))
    });
  }

  private afterSave() {
    this.formVisible = false;
    this.load();
  }

  private extractError(err: any): string {
    if (typeof err.error === 'string' && err.error.trim() !== '') return err.error;
    if (err.error?.title) return err.error.title;
    if (err.error?.errors) return Object.values(err.error.errors).flat().join(', ');
    return 'Xəta baş verdi';
  }
}
