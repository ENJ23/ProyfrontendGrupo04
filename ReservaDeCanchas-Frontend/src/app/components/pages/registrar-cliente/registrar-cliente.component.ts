import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClientesService } from '../../../services/clientes.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar-cliente',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
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

  registrar() {
    this.enviado = true;
    this.errorMsg = '';
    this.exito = false;
    if (this.registroForm.invalid) return;

    const { nombre, apellido, telefono, correo, contraseña, newsletter } = this.registroForm.value;
    const nuevoCliente = {
      nombre,
      apellido,
      telefono,
      correo,
      contraseña,
      newsletter
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
