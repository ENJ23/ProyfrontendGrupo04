import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
  ],
  templateUrl: './estadisticas.component.html',
})
export class EstadisticasComponent implements OnInit {
  reservas: any[] = [];

  // Gráfico de barras (Reservas por fecha)
  chartFechasLabels: string[] = [];
  chartFechasData: number[] = [];

  // Gráfico de torta (Reservas por cancha)
  chartCanchasLabels: string[] = [];
  chartCanchasData: number[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3000/reservas').subscribe(response => {
      this.reservas = response.data;

      this.generarGraficoPorFechas();
      this.generarGraficoPorCanchas();
    });
  }

  generarGraficoPorFechas(): void {
    const conteo: { [fecha: string]: number } = {};

    this.reservas.forEach(reserva => {
      const fecha = new Date(reserva.fecha).toLocaleDateString(); // formato corto
      conteo[fecha] = (conteo[fecha] || 0) + 1;
    });

    this.chartFechasLabels = Object.keys(conteo);
    this.chartFechasData = Object.values(conteo);
  }

  generarGraficoPorCanchas(): void {
    const conteo: { [cancha: string]: number } = {};

    this.reservas.forEach(reserva => {
      const nombreCancha = reserva.cancha?.nombre || 'Sin nombre';
      conteo[nombreCancha] = (conteo[nombreCancha] || 0) + 1;
    });

    this.chartCanchasLabels = Object.keys(conteo);
    this.chartCanchasData = Object.values(conteo);
  }
}