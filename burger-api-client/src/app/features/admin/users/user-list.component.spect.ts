import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { SessionService } from 'src/app/core/services/session.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { UsersService } from 'src/app/core/services/users.service';
import { makeUser } from 'src/testing/factories';
import { UsersListComponent } from './users-list.component';

describe('UsersListComponent', () => {
  let fixture: ComponentFixture<UsersListComponent>;
  let component: UsersListComponent;
  let usersApi: jasmine.SpyObj<UsersService>;
  let toast: jasmine.SpyObj<ToastService>;
  let root: HTMLElement;

  const admin = makeUser({ id: '4', nombre: 'Admin Amero', email: 'admin@amero.com', rol: 'admin' });
  const waiter = makeUser({ id: '1', nombre: 'Pamela', email: 'pame@amero.com', rol: 'waiter' });

  const rows = (): HTMLTableRowElement[] =>
    Array.from(root.querySelectorAll('tbody tr')) as HTMLTableRowElement[];

  beforeEach(async () => {
    localStorage.clear();
    usersApi = jasmine.createSpyObj<UsersService>('UsersService', ['list', 'remove']);
    toast = jasmine.createSpyObj<ToastService>('ToastService', ['success', 'error']);
    usersApi.list.and.returnValue(of([admin, waiter]));

    await TestBed.configureTestingModule({
      declarations: [UsersListComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: UsersService, useValue: usersApi },
        { provide: ToastService, useValue: toast },
      ],
    }).compileComponents();

    TestBed.inject(SessionService).start({ token: 't', user: admin });
    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    root = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('lista a los empleados con su rol, sin mostrar contraseñas', () => {
    expect(rows().length).toBe(2);
    expect(rows()[1].textContent).toContain('Pamela');
    expect(rows()[1].textContent).toContain('pame@amero.com');
    expect(rows()[1].textContent).toContain('Mesero/a');
    expect(root.textContent).not.toContain('Contraseña');
  });

  it('cada fila tiene un enlace para editar', () => {
    const link = rows()[1].querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toContain('/admin/users/1');
  });

  it('no deja eliminar la propia cuenta', () => {
    const buttons = rows().map((row) => row.querySelector('button') as HTMLButtonElement);
    expect(buttons[0].disabled).toBeTrue();
    expect(buttons[1].disabled).toBeFalse();
    expect(component.isSelf(admin)).toBeTrue();
    expect(component.isSelf(waiter)).toBeFalse();
  });

  it('elimina tras confirmar', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    usersApi.remove.and.returnValue(of(undefined));

    component.remove(waiter);
    fixture.detectChanges();

    expect(usersApi.remove).toHaveBeenCalledWith('1');
    expect(rows().length).toBe(1);
    expect(toast.success).toHaveBeenCalled();
  });

  it('no elimina si se cancela la confirmación', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.remove(waiter);

    expect(usersApi.remove).not.toHaveBeenCalled();
    expect(component.users.length).toBe(2);
  });

  it('si falla la eliminación conserva la fila y avisa', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    usersApi.remove.and.returnValue(throwError(() => new Error('sin red')));

    component.remove(waiter);

    expect(component.users.length).toBe(2);
    expect(toast.error).toHaveBeenCalled();
  });

  it('muestra un error si no carga y permite reintentar', () => {
    usersApi.list.and.returnValue(throwError(() => new Error('sin red')));
    component.load();
    fixture.detectChanges();

    expect(component.error).toBeTrue();
    expect(root.querySelector('[role="alert"]')).not.toBeNull();
    expect(root.querySelector('table')).toBeNull();

    usersApi.list.and.returnValue(of([admin]));
    (root.querySelector('[role="alert"] button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(component.error).toBeFalse();
    expect(rows().length).toBe(1);
  });

  it('trackById usa el id del empleado', () => {
    expect(component.trackById(0, waiter)).toBe('1');
  });
});