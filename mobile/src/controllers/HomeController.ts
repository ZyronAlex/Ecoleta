import ibge from "../services/ibge";

import State from "../models/State";
import City from "../models/City";

class HomeController { 
    static async loadUfs() {
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

    static async loadCities(selectedState: string) {
        if (selectedState === "0") return [] as City[];

        const response = await ibge.get<City[]>(
        `localidades/estados/${selectedState}/municipios`
        );

        const cites: City[] = response.data.map((city) => {
        return { nome: city.nome };
        });
        return cites;
    }
}

export default HomeController;
