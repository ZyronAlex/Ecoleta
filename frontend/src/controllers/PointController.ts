import api from "../services/api";
import ibge from "../services/ibge";

import Item from "../models/Item";
import State from "../models/State";
import City from "../models/City";
import Point from "../models/Point";

class PointController {
  async loadItems() {
    const response = await api.get<Item[]>("/items");
    const items: Item[] = response.data;
    return items;
  }
  async loadUfs() {
    const response = await ibge.get<State[]>(
      "localidades/estados?orderBy=nome"
    );
    const states: State[] = response.data.map((state) => {
      return {
        sigla: state.sigla,
        nome: state.nome,
      };
    });
    return states;
  }
  async loadCities(selectedState: string) {
    if (selectedState === "0") return [] as City[];

    const response = await ibge.get<City[]>(
      `localidades/estados/${selectedState}/municipios`
    );

    const cites: City[] = response.data.map((city) => {
      return { nome: city.nome };
    });
    return cites;
  }
  async savePoint(point: Point) {
    return await api.post("points", point);    
  }
}

export default PointController;
