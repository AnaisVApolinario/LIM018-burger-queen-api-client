import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ROLE_LABELS, Role } from 'src/app/core/models';
import { ToastService } from 'src/app/core/services/toast.service';
import { UsersService } from 'src/app/core/services/users.service';

/** Formulario para crear (`/admin/users/new`) y editar (`/admin/users/:id`) empleados. */
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  readonly roles = (Object.keys(ROLE_LABELS) as Role[]).map((value) => ({
    value,
    label: ROLE_LABELS[value],
  }));

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    rol: ['waiter' as Role, Validators.required],
    password: ['', [Validators.minLength(6)]],
  });

  id: string | null = null;
  loading = false;
  loadError = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private usersApi: UsersService,
    private toast: ToastService
  ) {}

  get isEdit(): boolean {
    return this.id !== null;
  }

  get nombre() {
    return this.form.controls.nombre;
  }

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id === null) {
      // Al crear, la contraseña es obligatoria; al editar, vacía significa "no cambiarla".
      this.password.addValidators(Validators.required);
      this.password.updateValueAndValidity();
      return;
    }

    this.loading = true;
    this.usersApi.get(this.id).subscribe({
      next: (user) => {
        this.form.patchValue({ nombre: user.nombre, email: user.email, rol: user.rol });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.loadError = true;
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, ...data } = this.form.getRawValue();
    const request$ =
      this.id === null
        ? this.usersApi.create({ ...data, password })
        : this.usersApi.update(this.id, password ? { ...data, password } : data);

    this.saving = true;
    request$.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Cambios guardados.' : 'Empleado creado.');
        this.router.navigate(['/admin/users']);
      },
      error: () => {
        this.saving = false;
        this.toast.error('No se pudo guardar. Inténtalo de nuevo.');
      },
    });
  }
}