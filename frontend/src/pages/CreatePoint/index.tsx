import React, { useEffect, useState, ChangeEvent, FormEvent, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { toast } from 'react-toastify';
import Dropzone from '../../components/Dropzone';


import api from '../../services/api';
import ibge from '../../services/ibge';

import Item from '../../models/Item';
import State from '../../models/State';
import City from '../../models/City';

import logo from '../../assets/logo.svg';
import './styles.css';
import { LeafletMouseEvent } from 'leaflet';

const CreatePoint: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsApp: '',
  });

  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedState, setSelectedState] = useState<string>('0');
  const [selectedCity, setSelectedCity] = useState<string>('0');
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
  
  const history = useHistory();

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
    async function loadItems() {
      const response = await api.get('/items');

      setItems(response.data);
    }

    loadItems();
  }, []);

  // Load UFs
  useEffect(() => {
    async function loadUfs() {
      const response = await ibge.get<State[]>(
        'localidades/estados?orderBy=nome',
      );

      const states = response.data.map(state => {
        return {
          sigla: state.sigla,
          nome: state.nome,
        };
      });

      setStates(states);
    }

    loadUfs();
  }, []);

  // Load Cities
  useEffect(() => {
    async function loadCities() {
      if (selectedState === '0') return;

      const response = await ibge.get<City[]>(
        `localidades/estados/${selectedState}/municipios`,
      );

      const cityNames = response.data.map(city => {
        return { nome: city.nome };
      });

      setCities(cityNames);
    }

    loadCities();
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

    setFormData({ ...formData, [name]: value });
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
        const { name, email, whatsApp } = formData;
        const [latitude, longitude] = selectedPosition;

        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsApp', whatsApp);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('uf', selectedState);
        data.append('city', selectedCity);
        data.append('items', selectedItems.join(','));

        if (selectedFile) {
          data.append('image', selectedFile);
        }

        await api.post('points', data);
        toast('✅ Criado com sucesso!', toastOptions);

        history.push('/');
      } catch (err) {
        toast.error('❌ Erro!', toastOptions);
      }
    },
    [
      formData,
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
                <option value="0">Selecione um estado</option>
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
                <option value="0">Selecione uma cidade</option>
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
