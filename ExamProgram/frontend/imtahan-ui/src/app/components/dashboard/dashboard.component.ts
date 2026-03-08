import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Imtahan } from '../../models/imtahan';

interface StatCard {
  title: string;
  value: number | string;
  subtitle?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-title">
      <h2>Dashboard</h2>
      <span class="muted">Son məlumatlar</span>
    </div>

    <div class="cards">
      <div class="card" *ngFor="let c of cards">
        <div style="font-size:14px;color:var(--muted);">{{ c.title }}</div>
        <div style="font-size:28px;font-weight:700;">{{ c.value }}</div>
        <div class="muted">{{ c.subtitle }}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-top:16px;flex-wrap:wrap;">
      <div class="card" style="min-width:300px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h3>Son imtahanlar</h3>
          <span class="muted">son 10</span>
        </div>
        <table *ngIf="recentExams.length">
          <thead>
            <tr>
              <th>Dərs</th>
              <th>Şagird</th>
              <th>Tarix</th>
              <th>Qiymət</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let e of recentExams">
              <td>{{ e.dersKodu }}</td>
              <td>{{ e.sagirdNomresi }}</td>
              <td>{{ e.imtahanTarixi ? (e.imtahanTarixi | date:'yyyy-MM-dd') : '–' }}</td>
              <td><span class="badge">{{ e.qiymet }}</span></td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="!recentExams.length" class="muted">İmtahan yoxdur.</div>
      </div>

      <div class="card" style="min-width:260px;">
        <h3>Qiymət bölgüsü</h3>
        <div *ngFor="let g of gradeDistribution" style="margin:8px 0;">
          <div style="display:flex;justify-content:space-between;font-weight:600;">
            <span>{{ g.grade }}</span>
            <span>{{ g.count }}</span>
          </div>
          <div style="height:10px;background:#eef2ff;border-radius:6px;overflow:hidden;">
            <div [style.width.%]="g.percent" style="height:100%;background:var(--primary);"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  cards: StatCard[] = [];
  recentExams: Imtahan[] = [];
  gradeDistribution: { grade: number; count: number; percent: number }[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  private load() {
    this.api.getDersler().subscribe(ders => {
      this.cards = [
        { title: 'Dərslər', value: ders.length },
        { title: 'Şagirdlər', value: 0, subtitle: 'hesablanır...' },
        { title: 'İmtahanlar', value: 0, subtitle: 'hesablanır...' }
      ];
    });

    this.api.getSagirdler().subscribe(s => {
      const existing = this.cards.find(c => c.title === 'Şagirdlər');
      if (existing) existing.value = s.length;
    });

    this.api.getImtahanlar().subscribe(exams => {
      this.recentExams = exams
        .slice()
        .sort((a, b) => new Date(b.imtahanTarixi).getTime() - new Date(a.imtahanTarixi).getTime())
        .slice(0, 10);

      const examsCount = this.cards.find(c => c.title === 'İmtahanlar');
      if (examsCount) examsCount.value = exams.length;

      const counts = [1,2,3,4,5].map(g => ({
        grade: g,
        count: exams.filter(e => e.qiymet === g).length
      }));
      const total = exams.length || 1;
      this.gradeDistribution = counts.map(c => ({ ...c, percent: Math.round(c.count * 100 / total) }));
    });
  }
}
