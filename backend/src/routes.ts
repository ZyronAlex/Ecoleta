import express from "express";
import ItemController from "./controllers/ItemController";
import PointController from "./controllers/PointController";

import multer from "multer";
import multerConfig from "./config/multer";

import { celebrate, Joi } from "celebrate";

const routes = express.Router();
const upload = multer(multerConfig);

// Controllers
const itemController = new ItemController();
const pointController = new PointController();

// Rotas
// --Item
routes.get("/items", itemController.index);
routes.get("/items/:id", itemController.show);

// Points
routes.get("/points", pointController.index);
routes.post(
  "/points",
  upload.single("image"),
  celebrate(
    {
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsApp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required(),
        items: Joi.string().required(),
      }),
    },
    {
      abortEarly: false,
    }
  ),
  pointController.create
);
routes.get("/points/:id", pointController.show);

export default routes;
