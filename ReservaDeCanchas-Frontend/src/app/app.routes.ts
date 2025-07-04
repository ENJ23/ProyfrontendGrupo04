import { Routes } from '@angular/router';
import { InicioComponent } from './components/pages/inicio/inicio.component';
import { ReservasComponent } from './components/pages/reservas/reservas.component';
import { CanchasComponent } from './components/pages/canchas/canchas.component';
import { RegistrarClienteComponent } from './components/pages/registrar-cliente/registrar-cliente.component';
import { BloquearHorariosComponent } from './components/pages/encargado/bloquear-horarios/bloquear-horarios.component';
import { CompletarPagoComponent } from './components/pages/encargado/completar-pago/completar-pago.component';
import { EstadisticasComponent } from './components/pages/encargado/estadisticas/estadisticas.component';
import { ReasignarReservaComponent } from './components/pages/encargado/reasignar-reserva/reasignar-reserva.component';
import { VerAntecedentesComponent } from './components/pages/encargado/ver-antecedentes/ver-antecedentes.component';
import { AgregarAntecedenteComponent } from './components/pages/encargado/agregar-antecedente/agregar-antecedente.component';
import { LoginComponent } from './components/layout/login/login.component';
import { authGuard } from './services/auth.guard';
import { FAQComponent } from './components/pages/faq/faq.component';
import { ConfiguracionComponent } from './components/pages/cliente/configuracion/configuracion.component';
import { MisReservasComponent } from './components/pages/cliente/mis-reservas/mis-reservas.component';
import { PerfilComponent } from './components/pages/cliente/perfil/perfil.component';
import { MisPagosComponent } from './components/pages/cliente/mis-pagos/mis-pagos.component';

export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'reservas', component: ReservasComponent, canActivate: [authGuard] },
    { path: 'canchas', component: CanchasComponent },
    { path: 'registrar-cliente', component: RegistrarClienteComponent },
    { path: 'bloquear-horarios', component: BloquearHorariosComponent },
    { path: 'completar-pago', component: CompletarPagoComponent },
    { path: 'estadisticas', component: EstadisticasComponent },
    { path: 'reasignar-reserva', component: ReasignarReservaComponent },
    { path: 'ver-antecedentes', component: VerAntecedentesComponent },
    { path: 'agregar-antecedente', component: AgregarAntecedenteComponent },
    { path: 'login', component: LoginComponent },
    { path: 'faq', component: FAQComponent },
    { path: 'mis-pagos', component: MisPagosComponent},
    { path: 'mis-reservas', component: MisReservasComponent },
    { path: 'perfil', component: PerfilComponent },
    { path: 'configuracion', component: ConfiguracionComponent},

];
