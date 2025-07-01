import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header-gerente',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header-gerente.component.html',
  styleUrls: ['./header-gerente.component.css']
})
export class HeaderGerenteComponent {
  usuario: any = null;

  constructor(private router: Router) {
    const usuarioStr = localStorage.getItem('usuario');
    if (usuarioStr) {
      try {
        this.usuario = JSON.parse(usuarioStr);
      } catch {
        this.usuario = null;
      }
    }
  }

  logout() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/']);
  }
}
