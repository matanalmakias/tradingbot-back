import { Product } from "../db/models/product.js";
import { Order } from "../db/models/order.js";

export const getNextUniqueNumber = async (sign) => {
  let maxNumDoc;
  if (sign === `order`) {
    maxNumDoc = await Order.findOne({}).sort(`-orderNumber`).limit(1).exec();
    if (maxNumDoc && typeof maxNumDoc.orderNumber === "number") {
      return maxNumDoc.orderNumber + 1;
    } else {
      console.error("Invalid uniqueNum found or no documents in collection");
      // Handle error or default case here
      return 1; // default case, ensure this is appropriate
    }
  } else if (sign === `product`) {
    maxNumDoc = await Product.findOne({})
      .sort(`-productNumber`)
      .limit(1)
      .exec();
    if (maxNumDoc && typeof maxNumDoc.productNumber === "number") {
      return maxNumDoc.productNumber + 1;
    } else {
      console.error("Invalid uniqueNum found or no documents in collection");
      // Handle error or default case here
      return 1; // default case, ensure this is appropriate
    }
  }
};
