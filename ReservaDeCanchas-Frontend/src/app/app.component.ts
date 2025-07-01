import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./components/layout/footer/footer.component";
import { HeaderGerenteComponent } from "./components/layout/header-gerente/header-gerente.component";
import { HeaderComponent } from "./components/layout/header/header.component";
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderGerenteComponent, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'football';

  getTipoUsuario(): string | null {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) return null;
    try {
      return JSON.parse(usuario).tipo;
    } catch {
      return null;
    }
  }
}
