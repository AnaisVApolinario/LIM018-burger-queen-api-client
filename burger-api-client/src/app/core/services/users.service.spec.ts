import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { makeUser } from 'src/testing/factories';
import { UsersService } from './users.service';

describe('UsersService', () => {
  const url = `${environment.api}/users`;
  let service: UsersService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(UsersService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('list pide todos los empleados', () => {
    service.list().subscribe();
    const req = http.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush([makeUser()]);
  });

  it('get pide un empleado por id', () => {
    service.get('1').subscribe();
    http.expectOne(`${url}/1`).flush(makeUser());
  });

  it('create envía el nuevo empleado', () => {
    const data = { nombre: 'Rosa', email: 'rosa@amero.com', rol: 'chef' as const, password: '123456' };
    service.create(data).subscribe();

    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
    req.flush(makeUser());
  });

  it('update envía solo los cambios con PATCH', () => {
    service.update('1', { nombre: 'Rosa M.' }).subscribe();
    const req = http.expectOne(`${url}/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ nombre: 'Rosa M.' });
    req.flush(makeUser());
  });

  it('remove elimina por id', () => {
    service.remove('1').subscribe();
    const req = http.expectOne(`${url}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});