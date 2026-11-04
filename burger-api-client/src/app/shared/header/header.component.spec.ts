import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Role } from 'src/app/core/models';
import { AuthService } from 'src/app/core/services/auth.service';
import { SessionService } from 'src/app/core/services/session.service';
import { makeUser } from 'src/testing/factories';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let session: SessionService;
  let root: HTMLElement;

  const loginAs = (rol: Role, nombre = 'Ana Mesera'): void => {
    session.start({ token: 't', user: makeUser({ rol, nombre }) });
    fixture.detectChanges();
  };

  const linkTexts = (): string[] =>
    Array.from(root.querySelectorAll('nav a')).map((a) => a.textContent?.trim() ?? '');

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [HeaderComponent],
    }).compileComponents();

    session = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(HeaderComponent);
    root = fixture.nativeElement;
  });

  afterEach(() => localStorage.clear());

  it('no muestra nada sin sesión', () => {
    fixture.detectChanges();
    expect(root.querySelector('header')).toBeNull();
  });

  it('muestra el nombre y el rol del usuario', () => {
    loginAs('waiter', 'Pamela');
    expect(root.querySelector('.header__who')?.textContent).toContain('Pamela');
    expect(root.querySelector('.header__who')?.textContent).toContain('Mesero/a');
  });

  it('el mesero ve sus enlaces', () => {
    loginAs('waiter');
    expect(linkTexts()).toEqual(['Nuevo pedido', 'Pedidos listos']);
  });

  it('cocina ve sus enlaces', () => {
    loginAs('chef');
    expect(linkTexts()).toEqual(['Pedidos']);
  });

  it('administración ve sus enlaces', () => {
    loginAs('admin');
    expect(linkTexts()).toEqual(['Empleados', 'Productos']);
  });

  it('el logo lleva a la pantalla de inicio del rol', () => {
    loginAs('chef');
    expect(root.querySelector('.header__brand')?.getAttribute('href')).toContain('/kitchen');
  });

  it('cerrar sesión llama al servicio de autenticación', () => {
    const logout = spyOn(TestBed.inject(AuthService), 'logout');
    loginAs('waiter');

    (root.querySelector('.header__user button') as HTMLButtonElement).click();

    expect(logout).toHaveBeenCalled();
  });
});