import * as authService from '../services/auth.service.js';

export const registrar = async (req, res) => {
  const sesion = await authService.registrar(req.validado.body);
  res.status(201).json(sesion);
};

export const login = async (req, res) => {
  const sesion = await authService.login(req.validado.body);
  res.json(sesion);
};

export const perfil = async (req, res) => {
  const usuario = await authService.obtenerPerfil(req.usuario);
  res.json(usuario);
};

export const actualizarPerfil = async (req, res) => {
  const usuario = await authService.actualizarPerfil(
    req.usuario,
    req.validado.body
  );
  res.json(usuario);
};

export const recuperarPassword = async (req, res) => {
  await authService.solicitarRecuperacion(req.validado.body);

  // Siempre la misma respuesta, exista o no el correo: distinguir los dos
  // casos permitiria averiguar que direcciones estan registradas.
  res.json({
    mensaje:
      'Si el correo esta registrado, vas a recibir las instrucciones para recuperar la contrasena',
  });
};

export const resetearPassword = async (req, res) => {
  const sesion = await authService.resetearPassword(req.validado.body);
  res.json(sesion);
};