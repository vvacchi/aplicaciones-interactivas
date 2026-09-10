import * as comercioService from '../services/comercio.service.js';

export const obtener = async (req, res) => {
  const comercio = await comercioService.obtener();
  res.json(comercio);
};

export const guardar = async (req, res) => {
  const comercio = await comercioService.guardar(req.validado.body);
  res.json(comercio);
};