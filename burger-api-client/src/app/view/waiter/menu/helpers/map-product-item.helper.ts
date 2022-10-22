import { CartItem } from "src/app/modelos/cartItem.interface";
import { Products } from "src/app/modelos/products.interface";

export function mapProductToCardItem(product: Products): CartItem{
  console.log(product)
  const { id, name, price, image, type, dateEntry } = product || {}; 

  return { id, name, price, image, type, dateEntry};
}