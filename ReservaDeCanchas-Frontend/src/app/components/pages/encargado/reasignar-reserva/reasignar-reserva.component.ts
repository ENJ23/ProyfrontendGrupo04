import { Component, OnInit } from '@angular/core';
import { CanchasService } from '../../../../services/canchas.service';
import { ReservasService } from '../../../../services/reservas.service';
import { HorariosService } from '../../../../services/horarios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reasignar-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reasignar-reserva.component.html',
  styleUrl: './reasignar-reserva.component.css'
})
export class ReasignarReservaComponent implements OnInit {
  canchas: any[] = [];
  reservas: any[] = [];
  canchaSeleccionada: any = null;
  fechaSeleccionada: string = '';
  reservaSeleccionada: any = null;
  horariosDisponibles: any[] = [];
  nuevaFecha: string = '';
  nuevoHorario: string = '';
  loading: boolean = false;
  minFecha: string = '';
  maxFecha: string = '';

  constructor(
    private canchasService: CanchasService,
    private reservasService: ReservasService,
    private horariosService: HorariosService
  ) {}

  ngOnInit() {
    this.cargarCanchas();
    this.setFechasLimite();
  }

  setFechasLimite() {
    const hoy = new Date();
    const max = new Date();
    max.setMonth(hoy.getMonth() + 2); // Permite seleccionar hasta 2 meses adelante
    this.minFecha = hoy.toISOString().split('T')[0];
    this.maxFecha = max.toISOString().split('T')[0];
  }

  cargarCanchas() {
    this.canchasService.getCanchas().subscribe((resp: any) => {
      this.canchas = resp.data || resp;
    });
  }

  buscarReservas() {
    if (!this.canchaSeleccionada || !this.fechaSeleccionada) return;
    this.loading = true;
    this.reservasService.getReservas().subscribe((resp: any) => {
      // Filtra reservas por cancha y fecha
      this.reservas = (resp.data || resp).filter((r: any) =>
        r.cancha?._id === this.canchaSeleccionada && r.fecha === this.fechaSeleccionada
      );
      this.loading = false;
    });
  }

  abrirModalReasignar(reserva: any) {
    this.reservaSeleccionada = reserva;
    this.nuevaFecha = reserva.fecha;
    this.nuevoHorario = reserva.horaInicio;
    this.cargarHorariosDisponibles();
    // Aquí deberías abrir el modal con JS/Bootstrap
  }

  cargarHorariosDisponibles() {
    if (!this.canchaSeleccionada || !this.nuevaFecha) return;
    this.horariosService.getHorariosReservados(this.canchaSeleccionada, this.nuevaFecha).subscribe((resp: any) => {
      const ocupados = resp.data.map((h: any) => h.horaInicio);
      const bloques = this.generarBloquesHorarios(2); // O la duración que uses
      this.horariosDisponibles = bloques.filter(b =>
        !ocupados.includes(b.horaInicio) || b.horaInicio === this.reservaSeleccionada.horaInicio
      );
    });
  }

  confirmarReasignacion() {
    if (!this.reservaSeleccionada || !this.nuevaFecha || !this.nuevoHorario) return;
    // Validación extra: no permitir fechas pasadas
    if (this.nuevaFecha < this.minFecha) {
      alert('No puedes seleccionar una fecha pasada.');
      return;
    }
    this.reservasService.updateReserva(this.reservaSeleccionada._id, {
      fecha: this.nuevaFecha,
      horaInicio: this.nuevoHorario,
      horaFin: this.calcularHoraFin(this.nuevoHorario)
    }).subscribe(() => {
      alert('Reserva reasignada correctamente');
      this.buscarReservas();
      // Cierra el modal aquí
    });
  }

  calcularHoraFin(horaInicio: string): string {
    // Asume bloques de 2 horas
    const hora = parseInt(horaInicio.split(':')[0], 10) + 2;
    return hora.toString().padStart(2, '0') + ':00';
  }

  generarBloquesHorarios(duracion: number = 2): { horaInicio: string, horaFin: string }[] {
    const bloques: { horaInicio: string, horaFin: string }[] = [];
    for (let h = 10; h <= 22 - duracion; h++) {
      const horaInicio = h.toString().padStart(2, '0') + ':00';
      const horaFin = (h + duracion).toString().padStart(2, '0') + ':00';
      bloques.push({ horaInicio, horaFin });
    }
    return bloques;
  }
}
