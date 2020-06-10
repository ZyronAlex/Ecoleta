import { Request, Response } from "express";
import knex from "../database/connection";
import Point from "../models/Point";
import Item from "../models/Item";

class PointController {
  async index(request: Request, response: Response) {
    try {
      let points: Point[];
      const { city, uf, items } = request.query;
      const parsedItems = String(items)
        .split(",")
        .map((item) => Number(item.trim()));

      points = await knex("points")
        .join("point_items", "points.id", "=", "point_items.point_id")
        .whereIn("point_items.item_id", parsedItems)
        .where("city", String(city))
        .where("uf", String(uf))
        .distinct()
        .select("points.*");

      const serializedPoints = await Promise.all(
        points.map(async (point) => {
          let items: Item[];
          items = await knex("items")
            .join("point_items", "items.id", "=", "point_items.item_id")
            .where("point_items.point_id", point.id)
            .select("items.id", "items.title");
          return { ...point, items };
        })
      );

      return response.json(serializedPoints);
    } catch (e) {
      return response.json(e);
    }
  }

  async show(request: Request, response: Response) {
    try {
      const { id } = request.params;

      let point: Point;
      point = await knex("points").where("id", id).first();

      if (!point) return response.status(400);
      let items: Item[];
      items = await knex("items")
        .join("point_items", "items.id", "=", "point_items.item_id")
        .where("point_items.point_id", id)
        .select("items.id", "items.title");

      return response.json({ ...point, items });
    } catch (e) {
      return response.json(e);
    }
  }

  async create(request: Request, response: Response) {      
    const trx = await knex.transaction();
    try {
      let point = new Point(
        "image-fake",
        request.body.name,
        request.body.email,
        request.body.whatsApp,
        request.body.latitude,
        request.body.longitude,
        request.body.city,
        request.body.uf
      );

      const insertIds = await trx("points").insert(point);

      point.id = insertIds[0];

      const point_items = request.body.items.map((item_id: number) => {
        return {
          item_id,
          point_id: point.id,
        };
      });

      await trx("point_items").insert(point_items);
      await trx.commit();

      return response.json(point);
    } catch (e) {
      return response.json(e);
      await trx.rollback();
    }
  }
}

export default PointController;
