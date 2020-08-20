import { Request, Response } from "express";
import knex from "../database/connection";
import Item from "../models/Item";
import Config from "../config/application.json";

class ItemController {
  async index(request: Request, response: Response) {
    try {
      let items: Item[];
      items = await knex("items").select("*");

      const serializedItems = items.map((item) => {
        return {
          id: item.id,
          title: item.title,
          image_url: Config.BaseUrl +`/res/${item.image}`,
        };
      });
      return response.json(serializedItems);
    } catch (e) {
      response.json(e);
    }
  }

  async show(request: Request, response: Response) {
    try {
      const { id } = request.params;

      let item: Item;
      item = await knex("items").where("id", id).first();

      if (!item) response.status(400);
      else response.json(item);
    } catch (e) {
      return response.json(e);
    }
  }
}

export default ItemController;
