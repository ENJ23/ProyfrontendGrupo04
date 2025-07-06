import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClientesService } from '../../../services/clientes.service';
import { CommonModule } from '@angular/common';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-registrar-cliente',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, RecaptchaModule],
  templateUrl: './registrar-cliente.component.html',
  styleUrl: './registrar-cliente.component.css'
})
export class RegistrarClienteComponent {
  registroForm: FormGroup;
  enviado = false;
  errorMsg = '';
  exito = false;
  mostrarPassword = false;
  mostrarConfirmPassword = false;
  captchaResuelta = false;
  captchaToken: string = '';
  siteKey: string = '6LehQHorAAAAAFk3eaHitiEeI80JFjnf-s2OsCN9';

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(8)]],
      confirmarContraseña: ['', Validators.required],
      terminos: [false, Validators.requiredTrue],
      newsletter: [false]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: FormGroup) {
    return form.get('contraseña')?.value === form.get('confirmarContraseña')?.value
      ? null : { mismatch: true };
  }

  onCaptchaResolved(token: string | null) {
    this.captchaResuelta = !!token;
    this.captchaToken = token || '';
  }

  registrar() {
    this.enviado = true;
    this.errorMsg = '';
    this.exito = false;
    if (this.registroForm.invalid || !this.captchaResuelta) {
      if (!this.captchaResuelta) {
        this.errorMsg = 'Por favor, resuelve el captcha';
      }
      return;
    }
    const { nombre, apellido, telefono, correo, contraseña, newsletter } = this.registroForm.value;
    const nuevoCliente = {
      nombre,
      apellido,
      telefono,
      correo,
      contraseña,
      newsletter,
      captchaToken: this.captchaToken
    };
    this.clientesService.createCliente(nuevoCliente).subscribe({
      next: () => {
        this.exito = true;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Error al registrar. Intenta nuevamente.';
      }
    });
  }
}
