import { DiscountSettings, Order, OrderItem } from "../type";
import { DiscountApplication } from "./discount-application";

export class Checkout {
  order: Order;
  discountSettings: DiscountSettings[] = [
    {
      customer: "Microsoft",
      discount: {
        type: "buyXGetYFree",
        x: 2,
        y: 1,
        size: "small",
      },
    },
    {
      customer: "Amazon",
      discount: {
        type: "fixedPrice",
        price: 19.99,
        size: "large",
      },
    },
    {
      customer: "Facebook",
      discount: {
        type: "buyXGetYFree",
        x: 4,
        y: 1,
        size: "medium",
      },
    },
  ];

  constructor(order: Order) {
    this.order = {...order, orderItems: []};
  }



  addToCart(orderItem: OrderItem) {
    if (this.order.orderItems.length === 0) {
      this.order = {...this.order, orderItems: [orderItem]};
      return;
    } 
    const newOrderItems = this.order.orderItems.map((item) => {
      if (item.size !== orderItem.size) return item;
      return { ...item, quantity: +item.quantity + +orderItem.quantity };
    });
    this.order = { ...this.order, orderItems: newOrderItems };
  }

  calculate() {
    const discountSetting: DiscountSettings | undefined = this.discountSettings.find((setting) => setting.customer === this.order.customer);

    if (discountSetting?.discount.type === "buyXGetYFree") {
      console.log({ discountSetting: discountSetting.discount });
      const { x, y, size } = discountSetting.discount;
      return DiscountApplication.buyXGetYFree(this.order.orderItems, x, y, size);
    }
    if (discountSetting?.discount.type === "fixedPrice") {
      const { price, size } = discountSetting.discount;
      return DiscountApplication.fixedPrice(this.order.orderItems, price, size);
    }
  }
}
