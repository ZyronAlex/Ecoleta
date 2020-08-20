import { Request, Response } from "express";
import knex from "../database/connection";
import Point from "../models/Point";
import Item from "../models/Item";
import Config from "../config/application.json";

class PointController {
  async index(request: Request, response: Response) {
    try {
      let points: Point[];
      const { city, uf, items } = request.query;
      const parsedItems = String(items)
        .split(",")
        .map((item) => Number(item.trim()));

      let query = knex("points").join("point_items", "points.id", "=", "point_items.point_id");
      query.whereIn("point_items.item_id", parsedItems);
      if (city) query.where("city", String(city));
      if (uf) query.where("uf", String(uf));

      console.log(`parsedItems : ${items}, city : ${city}, uf : ${uf}`);
      points = await query.distinct().select("points.*");

      const serializedPoints = await Promise.all(
        points.map(async (point) => {
          let items: Item[];
          items = await knex("items")
            .join("point_items", "items.id", "=", "point_items.item_id")
            .where("point_items.point_id", point.id)
            .select("items.id", "items.title");
          return { ...point, image_url: Config.BaseUrl + `/uploads/${point.image}`, items };
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

      return response.json({ ...point, image_url: Config.BaseUrl +`/uploads/${point.image}`, items });
    } catch (e) {
      return response.json(e);
    }
  }

  async create(request: Request, response: Response) {
    const trx = await knex.transaction();
    try {
      console.log(request.body);

      let point = new Point(
        request.file.filename,
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
      console.log(e);
      await trx.rollback();
      return response.json(e);
    }
  }
}

export default PointController;
