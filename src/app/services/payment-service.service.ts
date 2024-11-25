import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {

  private apiUrl = 'https://payment-hpbqd0bda3ehd4da.ukwest-01.azurewebsites.net/Payment'

  constructor(private httpClient: HttpClient) { }

  getPaymentTypes(): Observable<any> {
    return this.httpClient.get('http://localhost:5228/PaymentType')
  }

  getPayments(): Observable<any> {
    return this.httpClient.get('http://localhost:5228/Payment')
  }

  createPayment(payment: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post(this.apiUrl, payment, { headers });
  }

  updatePayment(id: number, payment: any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.put(`${this.apiUrl}/${id}`, payment, { headers });
  }

  deletePayment(id: number) {
    return this.httpClient.delete(`${this.apiUrl}/${id}`)
  }

  changeStatePayment(id: number, isActive: boolean) {
    return this.httpClient.get(`${this.apiUrl}/changestate/${id}/${isActive}`)
  }
}
