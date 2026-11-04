import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { UsersService } from 'src/app/core/services/users.service';
import { makeUser } from 'src/testing/factories';
import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let usersApi: jasmine.SpyObj<UsersService>;
  let toast: jasmine.SpyObj<ToastService>;
  let navigate: jasmine.Spy;
  let fixture: ComponentFixture<UserFormComponent>;
  let component: UserFormComponent;
  let root: HTMLElement;

  const setup = async (id: string | null): Promise<void> => {
    usersApi = jasmine.createSpyObj<UsersService>('UsersService', ['get', 'create', 'update']);
    toast = jasmine.createSpyObj<ToastService>('ToastService', ['success', 'error']);
    usersApi.get.and.returnValue(of(makeUser({ id: '2', nombre: 'Juan', email: 'juan@amero.com', rol: 'chef' })));

    await TestBed.configureTestingModule({
      declarations: [UserFormComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: UsersService, useValue: usersApi },
        { provide: ToastService, useValue: toast },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap(id ? { id } : {}) } },
        },
      ],
    }).compileComponents();

    navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    root = fixture.nativeElement;
    fixture.detectChanges();
  };

  describe('crear', () => {
    beforeEach(() => setup(null));

    it('muestra el título de creación y exige contraseña', () => {
      expect(component.isEdit).toBeFalse();
      expect(root.querySelector('h1')?.textContent).toContain('Nuevo empleado');
      expect(component.password.hasError('required')).toBeTrue();
      expect(usersApi.get).not.toHaveBeenCalled();
    });

    it('no guarda un formulario inválido y muestra los errores', () => {
      component.save();
      fixture.detectChanges();

      expect(usersApi.create).not.toHaveBeenCalled();
      expect(root.textContent).toContain('Ingresa el nombre.');
      expect(root.textContent).toContain('Ingresa el correo.');
      expect(root.textContent).toContain('Ingresa una contraseña.');
    });

    it('valida correo y largo de contraseña', () => {
      component.form.patchValue({ nombre: 'Rosa', email: 'no-es-correo', password: '123' });
      component.form.markAllAsTouched();
      fixture.detectChanges();

      expect(root.textContent).toContain('Escribe un correo válido.');
      expect(root.textContent).toContain('Debe tener al menos 6 caracteres.');
    });

    it('crea el empleado y vuelve a la lista', () => {
      usersApi.create.and.returnValue(of(makeUser()));
      component.form.setValue({ nombre: 'Rosa', email: 'rosa@amero.com', rol: 'chef', password: '123456' });

      component.save();

      expect(usersApi.create).toHaveBeenCalledWith({
        nombre: 'Rosa',
        email: 'rosa@amero.com',
        rol: 'chef',
        password: '123456',
      });
      expect(toast.success).toHaveBeenCalledWith('Empleado creado.');
      expect(navigate).toHaveBeenCalledWith(['/admin/users']);
    });

    it('si falla al crear avisa y permite reintentar', () => {
      usersApi.create.and.returnValue(throwError(() => new Error('sin red')));
      component.form.setValue({ nombre: 'Rosa', email: 'rosa@amero.com', rol: 'chef', password: '123456' });

      component.save();

      expect(toast.error).toHaveBeenCalled();
      expect(component.saving).toBeFalse();
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  describe('editar', () => {
    beforeEach(() => setup('2'));

    it('carga los datos del empleado sin pedir la contraseña', () => {
      expect(component.isEdit).toBeTrue();
      expect(usersApi.get).toHaveBeenCalledWith('2');
      expect(component.form.getRawValue()).toEqual({
        nombre: 'Juan',
        email: 'juan@amero.com',
        rol: 'chef',
        password: '',
      });
      expect(component.password.valid).toBeTrue();
      expect(root.querySelector('h1')?.textContent).toContain('Editar empleado');
    });

    it('si la contraseña queda vacía no la envía', () => {
      usersApi.update.and.returnValue(of(makeUser()));
      component.form.patchValue({ nombre: 'Juan P.' });

      component.save();

      expect(usersApi.update).toHaveBeenCalledWith('2', {
        nombre: 'Juan P.',
        email: 'juan@amero.com',
        rol: 'chef',
      });
      expect(toast.success).toHaveBeenCalledWith('Cambios guardados.');
      expect(navigate).toHaveBeenCalledWith(['/admin/users']);
    });

    it('si se escribe una contraseña nueva, la envía', () => {
      usersApi.update.and.returnValue(of(makeUser()));
      component.form.patchValue({ password: 'nueva-clave' });

      component.save();

      expect(usersApi.update.calls.mostRecent().args[1]).toEqual(
        jasmine.objectContaining({ password: 'nueva-clave' })
      );
    });
  });

  describe('editar un empleado que no existe', () => {
    beforeEach(async () => {
      await setup('99');
    });

    it('muestra el error de carga', () => {
      usersApi.get.and.returnValue(throwError(() => new Error('404')));
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.loadError).toBeTrue();
      expect(root.textContent).toContain('No se encontró al empleado.');
      expect(root.querySelector('form')).toBeNull();
    });
  });
});