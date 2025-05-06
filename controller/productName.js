import Product from "../model/products.model.js";
export const getProductNames = async () => {
    const products = await Product.find({});
    return products.map((product) => product.name);
};