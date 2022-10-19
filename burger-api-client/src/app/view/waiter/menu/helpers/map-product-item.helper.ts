import { CartItem } from "src/app/modelos/cartItem.interface";
import { Products } from "src/app/modelos/products.interface";

export function mapProductToCardItem(product: Products): CartItem{
  const { _id, name, price, image, type, dateEntry } = product; 

  return {_id, name, price, image, type, dateEntry};
}