import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Ders } from '../models/ders';
import { Sagird } from '../models/sagird';
import { Imtahan } from '../models/imtahan';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Dersler
  getDersler(filters?: { ad?: string; muellim?: string; sinif?: number }): Observable<Ders[]> {
    let params = new HttpParams();
    if (filters?.ad) params = params.set('ad', filters.ad);
    if (filters?.muellim) params = params.set('muellim', filters.muellim);
    if (filters?.sinif) params = params.set('sinif', filters.sinif);
    return this.http.get<Ders[]>(`${this.baseUrl}/dersler`, { params });
    }

  getDers(kod: string) {
    return this.http.get<Ders>(`${this.baseUrl}/dersler/${kod}`);
  }

  createDers(ders: Ders) {
    return this.http.post(`${this.baseUrl}/dersler`, ders);
  }

  updateDers(kod: string, ders: Ders) {
    return this.http.put(`${this.baseUrl}/dersler/${kod}`, ders);
  }

  deleteDers(kod: string) {
    return this.http.delete(`${this.baseUrl}/dersler/${kod}`);
  }

  // Şagirdlər
  getSagirdler(filters?: { ad?: string; soyad?: string; nomre?: number }): Observable<Sagird[]> {
    let params = new HttpParams();
    if (filters?.ad) params = params.set('ad', filters.ad);
    if (filters?.soyad) params = params.set('soyad', filters.soyad);
    if (filters?.nomre) params = params.set('nomre', filters.nomre);
    return this.http.get<Sagird[]>(`${this.baseUrl}/sagirdler`, { params });
  }

  createSagird(sagird: Sagird) {
    return this.http.post(`${this.baseUrl}/sagirdler`, sagird);
  }

  updateSagird(nomre: number, sagird: Sagird) {
    return this.http.put(`${this.baseUrl}/sagirdler/${nomre}`, sagird);
  }

  deleteSagird(nomre: number) {
    return this.http.delete(`${this.baseUrl}/sagirdler/${nomre}`);
  }

  // İmtahanlar
  getImtahanlar(): Observable<Imtahan[]> {
    return this.http.get<Imtahan[]>(`${this.baseUrl}/imtahanlar`);
  }

  getImtahanlarByDers(kod: string): Observable<Imtahan[]> {
    return this.http.get<Imtahan[]>(`${this.baseUrl}/imtahanlar/ders/${kod}`);
  }

  getImtahanlarBySagird(nomre: number): Observable<Imtahan[]> {
    return this.http.get<Imtahan[]>(`${this.baseUrl}/imtahanlar/sagird/${nomre}`);
  }

  createImtahan(imtahan: Imtahan) {
    return this.http.post(`${this.baseUrl}/imtahanlar`, imtahan);
  }

  updateImtahan(imtahan: Imtahan) {
    return this.http.put(`${this.baseUrl}/imtahanlar`, imtahan);
  }

  deleteImtahan(dersKodu: string, sagirdNomresi: number, tarix: string) {
    const dateOnly = tarix.length > 10 ? tarix.substring(0, 10) : tarix;
    const params = new HttpParams()
      .set('dersKodu', dersKodu)
      .set('sagirdNomresi', sagirdNomresi)
      .set('tarix', dateOnly);
    return this.http.delete(`${this.baseUrl}/imtahanlar`, { params });
  }
}
