import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { PagosService } from '../../../../services/pagos.service';
import { CommonModule } from '@angular/common';
import { Pago } from '../../../../models/pago.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-pagos.component.html',
  styleUrl: './mis-pagos.component.css'
})
export class MisPagosComponent implements OnInit {
  pagos: Pago[] = [];
  pagosFiltrados: Pago[] = [];
  usuarioId: string = '';
  cargando = true;
  filtro = '';
  estadoFiltro = '';

  constructor(private pagoService: PagosService, private authService: AuthService) {}

  ngOnInit() {
    this.recargarPagos();
  }

  recargarPagos() {
    this.cargando = true;
    const usuario = this.authService.getUsuario();
    this.usuarioId = usuario?.userid;
    this.pagoService.obtenerPagosPorCliente(this.usuarioId).subscribe({
      next: (res: Pago[]) => {
        this.pagos = res;
        this.filtrarPagos();
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  filtrarPagos() {
    this.pagosFiltrados = this.pagos.filter(p =>
      (!this.filtro || p.estado.toLowerCase().includes(this.filtro.toLowerCase())) &&
      (!this.estadoFiltro || p.estado === this.estadoFiltro)
    );
  }

  verDetalle(pago: Pago) {
    // Lógica para mostrar modal con detalle
    alert('Detalle de pago: ' + JSON.stringify(pago, null, 2));
  }

  descargarComprobante(pago: Pago) {
    // Lógica para descargar comprobante
    alert('Descargar comprobante de pago: ' + pago._id);
  }

  enviarPorCorreo(pago: Pago) {
    // Lógica para enviar comprobante por correo
    alert('Comprobante enviado por correo');
  }

  verHistorial(pago: Pago) {
    // Lógica para ver historial de cambios del pago
    alert('Historial de pago');
  }
}
