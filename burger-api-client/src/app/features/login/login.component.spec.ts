import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Role } from 'src/app/core/models';
import { AuthService } from 'src/app/core/services/auth.service';
import { makeUser } from 'src/testing/factories';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let auth: AuthService;
  let navigate: jasmine.Spy;
  let root: HTMLElement;

  const fill = (email = 'ana@amero.com', password = '123456'): void => {
    component.form.setValue({ email, password });
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
    navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    root = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('no usa credenciales por defecto', () => {
    expect(component.form.getRawValue()).toEqual({ email: '', password: '' });
  });

  it('no envía el formulario vacío y muestra los errores', () => {
    const login = spyOn(auth, 'login');

    component.submit();
    fixture.detectChanges();

    expect(login).not.toHaveBeenCalled();
    expect(root.textContent).toContain('Ingresa tu correo.');
    expect(root.textContent).toContain('Ingresa tu contraseña.');
  });

  it('avisa si el correo no tiene formato válido', () => {
    fill('no-es-correo');
    component.email.markAsTouched();
    fixture.detectChanges();

    expect(root.textContent).toContain('Escribe un correo válido.');
  });

  const destinations: [Role, string][] = [
    ['waiter', '/waiter'],
    ['chef', '/kitchen'],
    ['admin', '/admin'],
  ];

  destinations.forEach(([rol, path]) => {
    it(`tras ingresar, un/a ${rol} va a ${path}`, () => {
      spyOn(auth, 'login').and.returnValue(of({ token: 't', user: makeUser({ rol }) }));
      fill();

      component.submit();

      expect(navigate).toHaveBeenCalledWith([path]);
    });
  });

  it('envía las credenciales escritas', () => {
    const login = spyOn(auth, 'login').and.returnValue(of({ token: 't', user: makeUser() }));
    fill('pame@gmail.com', 'secreta');

    component.submit();

    expect(login).toHaveBeenCalledWith({ email: 'pame@gmail.com', password: 'secreta' });
  });

  it('muestra un mensaje claro si las credenciales son incorrectas', () => {
    spyOn(auth, 'login').and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 400 }))
    );
    fill();

    component.submit();
    fixture.detectChanges();

    expect(component.loading).toBeFalse();
    expect(root.querySelector('[role="alert"]')?.textContent).toContain(
      'Correo o contraseña incorrectos.'
    );
    expect(navigate).not.toHaveBeenCalled();
  });

  it('distingue un problema de conexión', () => {
    spyOn(auth, 'login').and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 0 }))
    );
    fill();

    component.submit();

    expect(component.errorMessage).toContain('No se pudo conectar');
  });

  it('envía desde el formulario del DOM', () => {
    const login = spyOn(auth, 'login').and.returnValue(of({ token: 't', user: makeUser() }));
    fill();

    (root.querySelector('form') as HTMLFormElement).dispatchEvent(new Event('submit'));

    expect(login).toHaveBeenCalled();
  });
});