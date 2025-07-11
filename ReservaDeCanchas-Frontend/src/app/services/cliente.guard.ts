import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { map, take } from 'rxjs/operators';

export const clienteGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return authService.usuarioObservable().pipe(
    take(1),
    map(usuario => {
      // Verificar si el usuario está logueado
      if (!usuario) {
        notificationService.showWarning('Debes iniciar sesión para acceder a esta página');
        router.navigate(['/login']);
        return false;
      }

      // Verificar si el usuario es de tipo Cliente o Encargado
      if (usuario.tipo !== 'Cliente' && usuario.tipo !== 'Encargado') {
        notificationService.showError('No tienes permisos para acceder a esta página.');
        router.navigate(['/']);
        return false;
      }

      // Usuario autorizado
      return true;
    })
  );
}; 