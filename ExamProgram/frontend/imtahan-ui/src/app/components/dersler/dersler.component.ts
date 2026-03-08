import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Ders } from '../../models/ders';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-dersler',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-title">
      <h2>Dərslər</h2>
      <div class="toolbar">
        <input class="input" placeholder="Dərs adı və ya müəllim axtar" (input)="onSearch($event)" />
        <select class="input" (change)="onSinifChange($event)">
          <option value="">Sinif (hamısı)</option>
          <option *ngFor="let s of sinifler" [value]="s">{{ s }}</option>
        </select>
        <button class="btn btn-primary" (click)="startCreate()">Yeni dərs</button>
      </div>
    </div>

    <div class="card">
      <table *ngIf="dersler.length">
        <thead>
          <tr>
            <th>Kod</th>
            <th>Ad</th>
            <th>Sinif</th>
            <th>Müəllim</th>
            <th>Əməliyyatlar</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let d of dersler">
            <td>{{ d.dersKodu }}</td>
            <td>{{ d.dersAdi }}</td>
            <td><span class="badge">{{ d.sinif }}</span></td>
            <td>{{ d.muellimAdi }} {{ d.muellimSoyadi }}</td>
            <td>
              <button class="btn btn-outline" (click)="edit(d)">Dəyiş</button>
              <button class="btn btn-danger" (click)="remove(d)">Sil</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="!dersler.length" class="muted">Heç nə tapılmadı.</div>
    </div>

    <div class="card" *ngIf="formVisible" style="margin-top:12px;">
      <h3>{{ editing ? 'Dərsi yenilə' : 'Yeni dərs əlavə et' }}</h3>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="row">
          <div>
            <label>Kod</label>
            <input class="input" formControlName="dersKodu" [readonly]="editing" />
          </div>
          <div>
            <label>Ad</label>
            <input class="input" formControlName="dersAdi" />
          </div>
          <div>
            <label>Sinif</label>
            <input class="input" type="number" min="1" max="12" formControlName="sinif" />
          </div>
          <div>
            <label>Müəllim adı</label>
            <input class="input" formControlName="muellimAdi" />
          </div>
          <div>
            <label>Müəllim soyadı</label>
            <input class="input" formControlName="muellimSoyadi" />
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
export class DerslerComponent implements OnInit {
  dersler: Ders[] = [];
  form!: FormGroup;
  formVisible = false;
  editing = false;
  sinifFilter?: number;
  keyword = '';
  sinifler = [1,2,3,4,5,6,7,8,9,10,11,12];

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
      dersKodu: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      dersAdi: ['', [Validators.required, Validators.maxLength(30)]],
      sinif: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
      muellimAdi: ['', [Validators.required, Validators.maxLength(20)]],
      muellimSoyadi: ['', [Validators.required, Validators.maxLength(20)]],
    });
  }

  load() {
    this.api.getDersler({
      ad: this.keyword || undefined,
      muellim: this.keyword || undefined,
      sinif: this.sinifFilter
    }).subscribe(d => this.dersler = d);
  }

  onSearch(ev: Event) {
    const value = (ev.target as HTMLInputElement).value;
    this.keyword = value;
    this.load();
  }

  onSinifChange(ev: Event) {
    const val = (ev.target as HTMLSelectElement).value;
    this.sinifFilter = val ? Number(val) : undefined;
    this.load();
  }

  startCreate() {
    this.formVisible = true;
    this.editing = false;
    this.form.reset({ sinif: 1 });
  }

  edit(d: Ders) {
    this.formVisible = true;
    this.editing = true;
    this.form.patchValue(d);
  }

  cancel() {
    this.formVisible = false;
    this.form.reset();
  }

  submit() {
    if (this.form.invalid) return;
    const payload = this.form.value as Ders;
    if (this.editing) {
      this.api.updateDers(payload.dersKodu, payload).subscribe({
        next: () => { this.notify.success('Dərs yeniləndi'); this.afterSave(); },
        error: (err: any) => this.notify.error(this.extractError(err))
      });
    } else {
      this.api.createDers(payload).subscribe({
        next: () => { this.notify.success('Dərs əlavə olundu'); this.afterSave(); },
        error: (err: any) => this.notify.error(this.extractError(err))
      });
    }
  }

  remove(d: Ders) {
    if (!confirm(`${d.dersAdi} silinsin?`)) return;
    this.api.deleteDers(d.dersKodu).subscribe({
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
