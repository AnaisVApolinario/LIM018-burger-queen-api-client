import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MENU_LABELS, MenuType, NewOrder, Product } from 'src/app/core/models';
import { CartService } from 'src/app/core/services/cart.service';
import { OrdersService } from 'src/app/core/services/orders.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { SessionService } from 'src/app/core/services/session.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
})
export class NewOrderComponent implements OnInit {
  readonly menus = (Object.keys(MENU_LABELS) as MenuType[]).map((value) => ({
    value,
    label: MENU_LABELS[value],
  }));

  readonly form = this.fb.nonNullable.group({
    client: ['', Validators.required],
    table: ['', Validators.required],
  });

  readonly lines$ = this.cart.lines$;

  menu: MenuType = 'desayuno';
  products: Product[] = [];
  loading = true;
  loadError = false;
  sending = false;

  constructor(
    private fb: FormBuilder,
    private productsApi: ProductsService,
    private ordersApi: OrdersService,
    private session: SessionService,
    private toast: ToastService,
    public cart: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  get visibleProducts(): Product[] {
    return this.products.filter((product) => product.type === this.menu);
  }

  get canSend(): boolean {
    return this.form.valid && this.cart.count > 0 && !this.sending;
  }

  loadProducts(): void {
    this.loading = true;
    this.loadError = false;
    this.productsApi.list().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.loadError = true;
      },
    });
  }

  selectMenu(menu: MenuType): void {
    this.menu = menu;
  }

  trackById(_index: number, product: Product): Product['id'] {
    return product.id;
  }

  send(): void {
    const user = this.session.user;
    if (!user || !this.canSend) {
      return;
    }

    const { client, table } = this.form.getRawValue();
    const order: NewOrder = {
      userId: user.id,
      waiterName: user.nombre,
      client: client.trim(),
      table: table.trim(),
      products: this.cart.toOrderItems(),
      total: this.cart.total,
      status: 'pending',
      dateEntry: new Date().toISOString(),
      dateProcessed: null,
      dateDelivered: null,
    };

    this.sending = true;
    this.ordersApi.create(order).subscribe({
      next: () => {
        this.sending = false;
        this.cart.clear();
        this.form.reset();
        this.toast.success(`Pedido de ${order.client} enviado a cocina.`);
      },
      error: () => {
        this.sending = false;
        this.toast.error('No se pudo enviar el pedido. Inténtalo de nuevo.');
      },
    });
  }
}