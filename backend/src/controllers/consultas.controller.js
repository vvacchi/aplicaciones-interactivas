import * as consultasService from '../services/consultas.service.js';

export const listar = async (req, res) => {
  const resultado = await consultasService.listar(req.validado.query);
  res.json(resultado);
};

export const obtener = async (req, res) => {
  const consulta = await consultasService.obtenerPorId(req.validado.params.id);
  res.json(consulta);
};

export const crear = async (req, res) => {
  const consulta = await consultasService.crear(req.validado.body);
  res.status(201).json(consulta);
};

export const cambiarEstado = async (req, res) => {
  const consulta = await consultasService.cambiarEstado(
    req.validado.params.id,
    req.validado.body.estado
  );
  res.json(consulta);
};

export const eliminar = async (req, res) => {
  await consultasService.eliminar(req.validado.params.id);
  res.status(204).end();
};