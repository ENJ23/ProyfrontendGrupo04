import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiUrl = `${environment.apiUrl}/clientes`; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  getClientes() {
    return this.http.get(this.apiUrl);
  }

  getClienteById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createCliente(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  updateCliente(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteCliente(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  buscarClientes(nombre: string, apellido: string) {
    return this.http.get(`${this.apiUrl}/buscar?nombre=${encodeURIComponent(nombre)}&apellido=${encodeURIComponent(apellido)}`);
  }
}
