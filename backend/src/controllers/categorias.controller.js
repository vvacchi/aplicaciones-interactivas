import * as categoriasService from '../services/categorias.service.js';

export const listar = async (req, res) => {
  const categorias = await categoriasService.listar();
  res.json(categorias);
};

export const obtener = async (req, res) => {
  const categoria = await categoriasService.obtenerPorId(req.params.id);
  res.json(categoria);
};

export const crear = async (req, res) => {
  const categoria = await categoriasService.crear(req.body);
  res.status(201).json(categoria);
};

export const actualizar = async (req, res) => {
  const categoria = await categoriasService.actualizar(req.params.id, req.body);
  res.json(categoria);
};

export const eliminar = async (req, res) => {
  await categoriasService.eliminar(req.params.id);
  res.status(204).end();
};
