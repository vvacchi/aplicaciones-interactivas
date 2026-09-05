import * as publicacionesService from '../services/publicaciones.service.js';

export const listar = async (req, res) => {
  const resultado = await publicacionesService.listar(req.validado.query);
  res.json(resultado);
};

export const obtener = async (req, res) => {
  const publicacion = await publicacionesService.obtenerPorId(req.validado.params.id);
  res.json(publicacion);
};

export const crear = async (req, res) => {
  const publicacion = await publicacionesService.crear(req.validado.body);
  res.status(201).json(publicacion);
};

export const actualizar = async (req, res) => {
  const publicacion = await publicacionesService.actualizar(
    req.validado.params.id,
    req.validado.body
  );
  res.json(publicacion);
};

export const eliminar = async (req, res) => {
  await publicacionesService.eliminar(req.validado.params.id);
  res.status(204).end();
};