import { Component, OnInit } from '@angular/core';
import { ROLE_LABELS, User } from 'src/app/core/models';
import { SessionService } from 'src/app/core/services/session.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit {
  readonly roleLabels = ROLE_LABELS;

  users: User[] = [];
  loading = true;
  error = false;

  constructor(
    private usersApi: UsersService,
    private session: SessionService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = false;
    this.usersApi.list().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }

  isSelf(user: User): boolean {
    return user.id === this.session.user?.id;
  }

  trackById(_index: number, user: User): User['id'] {
    return user.id;
  }

  remove(user: User): void {
    if (!window.confirm(`¿Eliminar a ${user.nombre}? Esta acción no se puede deshacer.`)) {
      return;
    }
    this.usersApi.remove(user.id).subscribe({
      next: () => {
        this.users = this.users.filter((item) => item.id !== user.id);
        this.toast.success(`${user.nombre} fue eliminado/a.`);
      },
      error: () => this.toast.error('No se pudo eliminar al empleado.'),
    });
  }
}