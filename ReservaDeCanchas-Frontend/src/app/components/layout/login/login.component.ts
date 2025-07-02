import { Component, NgModule } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { correo, contrasena } = this.loginForm.value;
    this.authService.login(correo, contrasena).subscribe({
      next: (res) => {
        console.log('Respuesta del login:', res);
        if (res.status === 1) {
          localStorage.setItem('usuario', JSON.stringify({
            nombre: res.nombre,
            apellido: res.apellido,
            correo: res.correo,
            tipo: res.tipo,
            userid: res.userid
          }));
          this.authService.setUsuario({
            nombre: res.nombre,
            apellido: res.apellido,
            correo: res.correo,
            tipo: res.tipo,
            userid: res.userid
          });
          this.router.navigate(['/']);
        } else {
          alert('Credenciales incorrectas');
        }
      },
      error: () => alert('Error en el login')
    });
  }

  get correo() { return this.loginForm.get('correo'); }
  get contrasena() { return this.loginForm.get('contrasena'); }
}
