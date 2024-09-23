import {
  links,
  REDIRECTION,
  products
} from "../database/database-sample.mjs";
import Product  from "../models/product.mjs";
const getDataForPage = (page, route, title, req) => {
  const navigation = links.filter((link) => link.role.includes("user"));
  const pageObject = {
    redirection: route,
    title,
    navigation,
  };
  console.log("navigation", navigation);
  console.log("user id", req);
  switch (page) {
    case REDIRECTION.SEARCH:
      const searchField = req.query.key;
      const productData = products.filter((product) => {
        const { description, title } = product;
        return (
          description.toLowerCase().includes(searchField.toLowerCase()) ||
          title.toLowerCase().includes(searchField.toLowerCase())
        );
      });
      return { ...pageObject, data: productData };
    case REDIRECTION.PDP:
      const productCode = req.params.id;
      const product =
        productCode &&
        products.filter((item) => item.code === Number(productCode));
      return { ...pageObject, data: product };
    default:
      return pageObject;
  }
};

// const getPage = (req, res) => {
//   const { key, value: title } = LABELS[page];
//   const route = REDIRECTION[page];
//   const pageObject = {
//     ...getDataForPage(route, route, title, req),
//   };
//   res.status(200).render(key, pageObject);
// };
const getProducts = async (page, route, title, req, res) => {
  const navigation = links.filter((link) => link.role.includes("user"));
  const pageObject = {
    redirection: route,
    title,
    navigation
  };
  if (req.user && req.user._id) {
    pageObject['userId'] = req.user._id;
  }
  try {
    const products = await Product.find();
    //console.log("products", products);
    if(products)
      res.status(200).render('product', {...pageObject, data: products});
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
export const PageController = { 
    getDataForPage, getProducts
};
