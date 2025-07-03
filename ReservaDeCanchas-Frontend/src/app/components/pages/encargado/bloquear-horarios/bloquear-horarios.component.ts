import { Component, OnInit } from '@angular/core';
import { CanchasService } from '../../../../services/canchas.service';
import { HorariosService } from '../../../../services/horarios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-bloquear-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bloquear-horarios.component.html',
  styleUrl: './bloquear-horarios.component.css'
})
export class BloquearHorariosComponent implements OnInit {
  canchas: any[] = [];
  canchaSeleccionada: any = null;
  fechaSeleccionada: string = '';
  horaInicio: string = '';
  horaFin: string = '';
  horariosBloqueados: any[] = [];
  horariosOcupados: any[] = [];
  horariosDisponibles: string[] = [];
  loadingCanchas = false;
  loadingHorarios = false;
  error: string | null = null;

  constructor(
    private canchasService: CanchasService,
    private horariosService: HorariosService
  ) {}

  ngOnInit() {
    this.cargarCanchas();
  }

  cargarCanchas() {
    this.loadingCanchas = true;
    this.canchasService.getCanchas().subscribe({
      next: (resp: any) => {
        this.canchas = resp.data || resp;
        this.loadingCanchas = false;
      },
      error: () => {
        this.error = 'Error al cargar canchas';
        this.loadingCanchas = false;
      }
    });
  }

  onSeleccionarCanchaOFecha() {
    if (!this.canchaSeleccionada || !this.fechaSeleccionada) {
      this.horariosBloqueados = [];
      this.horariosOcupados = [];
      this.horariosDisponibles = [];
      return;
    }
    this.loadingHorarios = true;
    this.horariosService.getHorariosReservados(this.canchaSeleccionada._id, this.fechaSeleccionada).subscribe({
      next: (resp: any) => {
        const horarios = resp.data || [];
        this.horariosBloqueados = horarios.filter((h: any) => h.estado === 'bloqueado');
        this.horariosOcupados = horarios.filter((h: any) => h.estado !== 'bloqueado');
        this.horariosDisponibles = this.generarHorariosDisponibles();
        this.loadingHorarios = false;
      },
      error: () => {
        this.horariosBloqueados = [];
        this.horariosOcupados = [];
        this.horariosDisponibles = [];
        this.loadingHorarios = false;
      }
    });
  }

  generarHorariosDisponibles(): string[] {
    const bloques: string[] = [];
    for (let h = 10; h < 22; h++) {
      const hora = h.toString().padStart(2, '0') + ':00';
      // Solo agregar si no está ocupado ni bloqueado
      const ocupado = this.horariosOcupados.some(hor => hor.horaInicio === hora);
      const bloqueado = this.horariosBloqueados.some(hor => hor.horaInicio === hora);
      if (!ocupado && !bloqueado) {
        bloques.push(hora);
      }
    }
    return bloques;
  }

  bloquearHorario() {
    if (!this.canchaSeleccionada || !this.fechaSeleccionada || !this.horaInicio || !this.horaFin) {
      alert('Completa todos los campos');
      return;
    }
    // Validar que el rango esté disponible
    const horaInicioNum = parseInt(this.horaInicio.split(':')[0], 10);
    const horaFinNum = parseInt(this.horaFin.split(':')[0], 10);
    for (let h = horaInicioNum; h < horaFinNum; h++) {
      const bloque = h.toString().padStart(2, '0') + ':00';
      if (!this.horariosDisponibles.includes(bloque)) {
        alert(`El bloque ${bloque} no está disponible para bloquear.`);
        return;
      }
    }
    // Crear horarios bloqueados para cada bloque
    const peticiones = [];
    for (let h = horaInicioNum; h < horaFinNum; h++) {
      const bloqueInicio = h.toString().padStart(2, '0') + ':00';
      const bloqueFin = (h + 1).toString().padStart(2, '0') + ':00';
      peticiones.push(firstValueFrom(this.horariosService.createHorario({
        cancha: this.canchaSeleccionada._id,
        fecha: this.fechaSeleccionada,
        horaInicio: bloqueInicio,
        horaFin: bloqueFin,
        estado: 'bloqueado'
      })));
    }
    Promise.all(peticiones).then(() => {
      alert('Horario(s) bloqueado(s) correctamente');
      this.onSeleccionarCanchaOFecha();
      this.horaInicio = '';
      this.horaFin = '';
    }).catch(() => {
      alert('Error al bloquear horario(s)');
    });
  }

  desbloquearHorario(horario: any) {
    if (!confirm('¿Seguro que deseas desbloquear este horario?')) return;
    this.horariosService.deleteHorario(horario._id).subscribe({
      next: () => {
        alert('Horario desbloqueado');
        this.onSeleccionarCanchaOFecha();
      },
      error: () => {
        alert('Error al desbloquear horario');
      }
    });
  }
}
