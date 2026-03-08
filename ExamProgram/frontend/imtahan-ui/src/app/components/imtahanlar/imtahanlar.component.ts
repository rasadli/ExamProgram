import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';
import { Imtahan } from '../../models/imtahan';
import { Ders } from '../../models/ders';
import { Sagird } from '../../models/sagird';

@Component({
  selector: 'app-imtahanlar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-title">
      <h2>İmtahanlar</h2>
      <div class="toolbar">
        <select class="input" (change)="onFilterDers($event)">
          <option value="">Dərs (hamısı)</option>
          <option *ngFor="let d of dersler" [value]="d.dersKodu">{{ d.dersAdi }}</option>
        </select>
        <select class="input" (change)="onFilterSagird($event)">
          <option value="">Şagird (hamısı)</option>
          <option *ngFor="let s of sagirdler" [value]="s.nomresi">{{ s.nomresi }} - {{ s.adi }} {{ s.soyadi }}</option>
        </select>
        <button class="btn btn-primary" (click)="startCreate()">Yeni imtahan</button>
      </div>
    </div>

    <div class="card">
      <table *ngIf="imtahanlar.length">
        <thead>
          <tr>
            <th (click)="sortByDate()" style="cursor:pointer;">Tarix ⬍</th>
            <th>Dərs</th>
            <th>Şagird</th>
            <th>Qiymət</th>
            <th>Əməliyyatlar</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let i of imtahanlar">
            <td>{{ i.imtahanTarixi | date:'yyyy-MM-dd' }}</td>
            <td>{{ i.dersKodu }}</td>
            <td>{{ i.sagirdNomresi }}</td>
            <td><span class="badge">{{ i.qiymet }}</span></td>
            <td>
              <button class="btn btn-outline" (click)="edit(i)">Dəyiş</button>
              <button class="btn btn-danger" (click)="remove(i)">Sil</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="!imtahanlar.length" class="muted">Heç nə tapılmadı.</div>
    </div>

    <div class="card" *ngIf="formVisible" style="margin-top:12px;">
      <h3>{{ editing ? 'İmtahanı yenilə' : 'Yeni imtahan' }}</h3>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="row">
          <div>
            <label>Dərs</label>
            <select class="input" formControlName="dersKodu">
              <option *ngFor="let d of dersler" [value]="d.dersKodu">{{ d.dersAdi }} ({{ d.sinif }})</option>
            </select>
          </div>
          <div>
            <label>Şagird</label>
            <select class="input" formControlName="sagirdNomresi">
              <option *ngFor="let s of sagirdler" [value]="s.nomresi">{{ s.nomresi }} - {{ s.adi }} {{ s.soyadi }} ({{ s.sinif }})</option>
            </select>
          </div>
          <div>
            <label>Tarix</label>
            <input class="input" type="date" formControlName="imtahanTarixi" />
          </div>
          <div>
            <label>Qiymət (1-5)</label>
            <input class="input" type="number" min="1" max="5" formControlName="qiymet" />
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
export class ImtahanlarComponent implements OnInit {
  imtahanlar: Imtahan[] = [];
  dersler: Ders[] = [];
  sagirdler: Sagird[] = [];
  form!: FormGroup;
  formVisible = false;
  editing = false;
  filterDers?: string;
  filterSagird?: number;
  sortDesc = true;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadLookups();
    this.load();
  }

  buildForm() {
    this.form = this.fb.group({
      dersKodu: ['', Validators.required],
      sagirdNomresi: [null, Validators.required],
      imtahanTarixi: ['', Validators.required],
      qiymet: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  loadLookups() {
    this.api.getDersler().subscribe(d => this.dersler = d);
    this.api.getSagirdler().subscribe(s => this.sagirdler = s);
  }

  load() {
    this.api.getImtahanlar().subscribe(list => {
      let data = list;
      if (this.filterDers) data = data.filter(x => x.dersKodu === this.filterDers);
      if (this.filterSagird) data = data.filter(x => x.sagirdNomresi === this.filterSagird);
      this.imtahanlar = data.sort((a,b) =>
        this.sortDesc
          ? new Date(b.imtahanTarixi).getTime() - new Date(a.imtahanTarixi).getTime()
          : new Date(a.imtahanTarixi).getTime() - new Date(b.imtahanTarixi).getTime());
    });
  }

  sortByDate() {
    this.sortDesc = !this.sortDesc;
    this.load();
  }

  onFilterDers(ev: Event) {
    const val = (ev.target as HTMLSelectElement).value;
    this.filterDers = val || undefined;
    this.load();
  }

  onFilterSagird(ev: Event) {
    const val = (ev.target as HTMLSelectElement).value;
    this.filterSagird = val ? Number(val) : undefined;
    this.load();
  }

  startCreate() {
    this.formVisible = true;
    this.editing = false;
    this.form.reset({ qiymet: 1 });
  }

  edit(i: Imtahan) {
    this.formVisible = true;
    this.editing = true;
    this.form.setValue({
      dersKodu: i.dersKodu,
      sagirdNomresi: i.sagirdNomresi,
      imtahanTarixi: new Date(i.imtahanTarixi).toISOString().substring(0, 10),
      qiymet: i.qiymet
    });
  }

  cancel() {
    this.formVisible = false;
  }

  submit() {
    if (this.form.invalid) return;
    const payload: Imtahan = {
      ...this.form.value,
      imtahanTarixi: this.form.value.imtahanTarixi
    };
    if (this.editing) {
      this.api.updateImtahan(payload).subscribe({
        next: () => { this.notify.success('İmtahan yeniləndi'); this.afterSave(); },
        error: (err: any) => this.notify.error(this.extractError(err))
      });
    } else {
      this.api.createImtahan(payload).subscribe({
        next: () => { this.notify.success('İmtahan əlavə olundu'); this.afterSave(); },
        error: (err: any) => this.notify.error(this.extractError(err))
      });
    }
  }

  remove(i: Imtahan) {
    if (!confirm('Silinsin?')) return;
    this.api.deleteImtahan(i.dersKodu, i.sagirdNomresi, i.imtahanTarixi).subscribe({
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
