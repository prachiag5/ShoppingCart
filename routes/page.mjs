import express from "express";

import {links, LABELS, REDIRECTION, products, cart} from "../database/database-sample.mjs";
import { PageController } from "../controller/page.mjs";

export const pageRouter = express.Router();

for (const page in REDIRECTION) {
  if (Object.hasOwnProperty.call(REDIRECTION, page)) {
    const route = REDIRECTION[page];
    pageRouter.get(route, (req, res) => {
      const { key, value: title } = LABELS[page];
      const pageObject = {
        ...PageController.getDataForPage(route, route, title, req),
      };
      res.status(200).render(key, pageObject);
    });
  }
}
