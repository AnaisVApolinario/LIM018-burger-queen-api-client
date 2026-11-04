import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { makeProduct } from 'src/testing/factories';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  const url = `${environment.api}/products`;
  let service: ProductsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ProductsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('list pide todos los productos', () => {
    const products = [makeProduct()];
    let result: unknown;
    service.list().subscribe((r) => (result = r));

    const req = http.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(products);

    expect(result).toEqual(products);
  });

  it('list filtra por tipo de menú', () => {
    service.list('almuerzo').subscribe();
    http.expectOne(`${url}?type=almuerzo`).flush([]);
  });

  it('get pide un producto por id', () => {
    service.get('01').subscribe();
    const req = http.expectOne(`${url}/01`);
    expect(req.request.method).toBe('GET');
    req.flush(makeProduct());
  });

  it('create envía el producto con fecha de ingreso', () => {
    const data = { name: 'Malteada', price: 12, image: '', type: 'almuerzo' as const };
    service.create(data).subscribe();

    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ ...data, dateEntry: jasmine.any(String) });
    req.flush(makeProduct());
  });

  it('update envía solo los cambios con PATCH', () => {
    service.update('01', { price: 6 }).subscribe();
    const req = http.expectOne(`${url}/01`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ price: 6 });
    req.flush(makeProduct({ price: 6 }));
  });

  it('remove elimina por id', () => {
    service.remove('01').subscribe();
    const req = http.expectOne(`${url}/01`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});