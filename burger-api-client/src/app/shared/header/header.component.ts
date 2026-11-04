import { Component } from '@angular/core';
import { HOME_BY_ROLE, ROLE_LABELS, Role } from 'src/app/core/models';
import { AuthService } from 'src/app/core/services/auth.service';
import { SessionService } from 'src/app/core/services/session.service';

interface NavLink {
  path: string;
  label: string;
}

const LINKS_BY_ROLE: Record<Role, NavLink[]> = {
  waiter: [
    { path: '/waiter', label: 'Nuevo pedido' },
    { path: '/waiter/ready', label: 'Pedidos listos' },
  ],
  chef: [{ path: '/kitchen', label: 'Pedidos' }],
  admin: [
    { path: '/admin/users', label: 'Empleados' },
    { path: '/admin/products', label: 'Productos' },
  ],
};

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly user$ = this.session.user$;

  constructor(private session: SessionService, private auth: AuthService) {}

  linksFor(role: Role): NavLink[] {
    return LINKS_BY_ROLE[role];
  }

  homeFor(role: Role): string {
    return HOME_BY_ROLE[role];
  }

  roleLabel(role: Role): string {
    return ROLE_LABELS[role];
  }

  logout(): void {
    this.auth.logout();
  }
}