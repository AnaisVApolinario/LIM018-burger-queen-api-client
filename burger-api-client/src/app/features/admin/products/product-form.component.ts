import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MENU_LABELS, MenuType } from 'src/app/core/models';
import { ProductsService } from 'src/app/core/services/products.service';
import { ToastService } from 'src/app/core/services/toast.service';

/** Formulario para crear (`/admin/products/new`) y editar (`/admin/products/:id`) productos. */
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
  readonly menus = (Object.keys(MENU_LABELS) as MenuType[]).map((value) => ({
    value,
    label: MENU_LABELS[value],
  }));

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    type: ['desayuno' as MenuType, Validators.required],
    image: [''],
  });

  id: string | null = null;
  loading = false;
  loadError = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productsApi: ProductsService,
    private toast: ToastService
  ) {}

  get isEdit(): boolean {
    return this.id !== null;
  }

  get name() {
    return this.form.controls.name;
  }

  get price() {
    return this.form.controls.price;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id === null) {
      return;
    }

    this.loading = true;
    this.productsApi.get(this.id).subscribe({
      next: (product) => {
        this.form.patchValue({
          name: product.name,
          price: product.price,
          type: product.type,
          image: product.image,
        });
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

    const data = this.form.getRawValue();
    const request$ =
      this.id === null
        ? this.productsApi.create(data)
        : this.productsApi.update(this.id, data);

    this.saving = true;
    request$.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Cambios guardados.' : 'Producto creado.');
        this.router.navigate(['/admin/products']);
      },
      error: () => {
        this.saving = false;
        this.toast.error('No se pudo guardar. Inténtalo de nuevo.');
      },
    });
  }
}