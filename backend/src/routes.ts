import express from 'express';
import ItemController from './controllers/ItemController';
import PointController from './controllers/PointController';

const routes = express.Router();

// Controllers
const itemController =  new ItemController();
const pointController = new PointController();

// Rotas
// --Item 
routes.get('/items', itemController.index);
routes.get('/items/:id', itemController.show);

// Points
routes.get('/points', pointController.index);
routes.post('/points', pointController.create);
routes.get('/points/:id', pointController.show);


export default routes;