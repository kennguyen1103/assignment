import { OrderItem } from "../type";

export class DiscountApplication {
  static buyXGetYFree(order: OrderItem[], x: number = 0, y: number = 0, size: string = "") {
    let afterDiscount: OrderItem[] = [];
    order.forEach((p) => {
      const numberOfDiscountItem = Math.floor(p.quantity / (x + y));

      if (p.size !== size || numberOfDiscountItem === 0) {
        afterDiscount.push(p);
        return;
      }
      console.log({ numberOfDiscountItem, p });
      afterDiscount.push({ ...p, quantity: p.quantity - numberOfDiscountItem });
      afterDiscount.push({ ...p, quantity: numberOfDiscountItem, price: 0 });
    });
    return afterDiscount;
  }

  static fixedPrice(order: OrderItem[], price: number = 0, size: string = "") {
    let afterDiscount: OrderItem[] = [];
    order.forEach((p) => {
      if (!size.includes(p.size)) {
        afterDiscount.push(p);
        return;
      }
      afterDiscount.push({ ...p, price });
    });
    return afterDiscount;
  }
}
