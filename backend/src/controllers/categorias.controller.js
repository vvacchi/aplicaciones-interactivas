import * as categoriasService from '../services/categorias.service.js';

export const listar = async (req, res) => {
  const categorias = await categoriasService.listar(req.validado.query);
  res.json(categorias);
};

export const obtener = async (req, res) => {
  const categoria = await categoriasService.obtenerPorId(req.validado.params.id);
  res.json(categoria);
};

export const crear = async (req, res) => {
  const categoria = await categoriasService.crear(req.validado.body);
  res.status(201).json(categoria);
};

export const actualizar = async (req, res) => {
  const categoria = await categoriasService.actualizar(
    req.validado.params.id,
    req.validado.body
  );
  res.json(categoria);
};

export const eliminar = async (req, res) => {
  await categoriasService.eliminar(req.validado.params.id);
  res.status(204).end();
};