import { Component, OnInit } from '@angular/core';
import { MENU_LABELS, Product } from 'src/app/core/models';
import { ProductsService } from 'src/app/core/services/products.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
})
export class ProductsListComponent implements OnInit {
  readonly menuLabels = MENU_LABELS;

  products: Product[] = [];
  loading = true;
  error = false;

  constructor(private productsApi: ProductsService, private toast: ToastService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = false;
    this.productsApi.list().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }

  trackById(_index: number, product: Product): Product['id'] {
    return product.id;
  }

  remove(product: Product): void {
    if (!window.confirm(`¿Eliminar "${product.name}" del menú?`)) {
      return;
    }
    this.productsApi.remove(product.id).subscribe({
      next: () => {
        this.products = this.products.filter((item) => item.id !== product.id);
        this.toast.success(`"${product.name}" fue eliminado.`);
      },
      error: () => this.toast.error('No se pudo eliminar el producto.'),
    });
  }
}