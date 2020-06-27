import React, { useEffect, useState, ChangeEvent, FormEvent, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { toast } from 'react-toastify';
import Dropzone from '../../components/Dropzone';

import Point from '../../models/Point';
import PointForm from '../../models/PointForm';
import Item from '../../models/Item';
import State from '../../models/State';
import City from '../../models/City';
import PointController from '../../controllers/PointController';

import logo from '../../assets/logo.svg';
import './styles.css';
import { LeafletMouseEvent } from 'leaflet';

const CreatePoint: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const [pointForm, setPointForm] = useState<PointForm>();

  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedState, setSelectedState] = useState<string>('0');
  const [selectedCity, setSelectedCity] = useState<string>('0');
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

  const history = useHistory();
  const pointController = new PointController();

  // Get Current Position
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        setInitialPosition([latitude, longitude]);
      },
      () => {
        toast.error('❌ Oops! Algo deu errado =/', toastOptions);
      },
      {
        timeout: 30000,
        enableHighAccuracy: true,
      },
    );
  }, []);
  // Toastify configurations
  const toastOptions = {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  // Load items
  useEffect(() => {
    pointController.loadItems().then(items => {
      setItems(items);
    });
  }, []);

  // Load UFs
  useEffect(() => {
    pointController.loadUfs().then(states => {
      setStates(states);
    });
  }, []);

  // Load Cities
  useEffect(() => {
    pointController.loadCities(selectedState).then(cites => {
      setCities(cites);
    });
  }, [selectedState]);

  function handleSelectState(event: ChangeEvent<HTMLSelectElement>) {
    const state = event.target.value;
    setSelectedState(state);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value
    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    let point = pointForm ? pointForm : new Object() as PointForm;
    point[name] = value;

    console.log(point);

    setPointForm(point);
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item === id);

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      try {
        const [latitude, longitude] = selectedPosition;

        let point: Point = new Object() as Point;

        point.name = pointForm?.name ? pointForm.name : "";
        point.email = pointForm?.email ? pointForm.email : "";
        point.whatsApp = pointForm?.whatsApp ? pointForm.whatsApp : "";
        point.latitude = latitude;
        point.longitude = longitude;
        point.uf = selectedState;
        point.city = selectedCity;
        point.items = selectedItems;
        
        if (selectedFile) {
          point.image = selectedFile.name;
        }
        else{
          point.image = "";
        }

        pointController.savePoint(point);

        toast.success('✔️ Sucesso!', toastOptions);
        history.push('/');
      } catch (err) {
        toast.error('❌ Erro!', toastOptions);
      }
    },
    [
      pointForm,
      selectedCity,
      selectedItems,
      selectedPosition,
      selectedState,
      history,
      selectedFile,
    ],
  );


  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
            Voltar pra Home
          </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br /> ponto de coleta</h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsApp">WhatsApp</label>
              <input
                type="text"
                name="whatsApp"
                id="whatsApp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no map</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>
          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado</label>
              <select onChange={handleSelectState} name="uf" id="uf">
                <option value="">Selecione um estado</option>
                {states?.map(state => (
                  <option key={state.sigla} value={state.sigla}>
                    {state.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select onChange={handleSelectCity} name="city" id="city">
                <option value="">Selecione uma cidade</option>
                {cities.map(city => (
                  <option key={city.nome} value={city.nome}>
                    {city.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>
          <ul className="items-grid">
            {items.map(item => (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}>
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar novo ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
