import { Component, NgModule, AfterViewInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare const google: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule]
})
export class LoginComponent implements AfterViewInit {
  googleClientId = '989381766185-qqun9sbv6qk03guuar3n1inlps1cegbn.apps.googleusercontent.com';
  ngAfterViewInit(): void {
    // Cargar el script de Google si no está cargado
    if (!document.getElementById('google-signin-script')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.id = 'google-signin-script';
      script.onload = () => this.renderGoogleButton();
      document.body.appendChild(script);
    } else {
      this.renderGoogleButton();
    }
  }

  renderGoogleButton() {
    if ((window as any).google && google.accounts && google.accounts.id) {
      google.accounts.id.initialize({
        client_id: this.googleClientId,
        callback: (response: any) => this.handleGoogleCredential(response)
      });
      google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large', width: 300 }
      );
    }
  }

  handleGoogleCredential(response: any) {
    const credential = response.credential;
    this.authService.loginConGoogle(credential).subscribe({
      next: (res) => {
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
          alert('No se pudo iniciar sesión con Google');
        }
      },
      error: () => alert('Error en el login con Google')
    });
  }
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
