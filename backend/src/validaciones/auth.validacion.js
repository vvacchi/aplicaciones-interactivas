import { z } from 'zod';

const nombre = z
  .string()
  .trim()
  .min(2, { error: 'El nombre debe tener al menos 2 caracteres' })
  .max(60, { error: 'El nombre no puede superar los 60 caracteres' });

const apellido = z
  .string()
  .trim()
  .min(2, { error: 'El apellido debe tener al menos 2 caracteres' })
  .max(60, { error: 'El apellido no puede superar los 60 caracteres' });

const email = z.email({ error: 'El correo electronico no es valido' });

const telefono = z
  .string()
  .trim()
  .min(6, { error: 'El telefono debe tener al menos 6 caracteres' })
  .max(30, { error: 'El telefono no puede superar los 30 caracteres' });

/**
 * Minimo ocho caracteres con al menos una letra y un numero. Es el piso
 * razonable sin volver el formulario del TP una carrera de obstaculos.
 */
const password = z
  .string()
  .min(8, { error: 'La contrasena debe tener al menos 8 caracteres' })
  .max(72, { error: 'La contrasena no puede superar los 72 caracteres' })
  .regex(/[A-Za-z]/, { error: 'La contrasena debe incluir al menos una letra' })
  .regex(/\d/, { error: 'La contrasena debe incluir al menos un numero' });

/** POST /api/auth/registro */
export const registroSchema = z.strictObject({
  nombre,
  apellido,
  email,
  telefono,
  password,
});

/** POST /api/auth/login */
export const loginSchema = z.strictObject({
  email,
  // Sin reglas de formato: si la contrasena vieja no cumple el minimo
  // actual, igual tiene que poder entrar para cambiarla.
  password: z.string().min(1, { error: 'La contrasena es obligatoria' }),
});

/**
 * PUT /api/auth/perfil
 * Para cambiar la contrasena hay que mandar tambien la actual: tener el
 * token no alcanza si alguien dejo la sesion abierta.
 */
export const actualizarPerfilSchema = z
  .strictObject({
    nombre: nombre.optional(),
    apellido: apellido.optional(),
    email: email.optional(),
    telefono: telefono.optional(),
    passwordActual: z.string().min(1).optional(),
    password: password.optional(),
  })
  .check((ctx) => {
    const datos = ctx.value;

    if (Object.keys(datos).length === 0) {
      ctx.issues.push({
        code: 'custom',
        input: datos,
        message: 'Hay que enviar al menos un campo para actualizar',
      });
      return;
    }

    if (datos.password && !datos.passwordActual) {
      ctx.issues.push({
        code: 'custom',
        input: datos,
        path: ['passwordActual'],
        message: 'Para cambiar la contrasena hay que enviar la contrasena actual',
      });
    }

    if (datos.passwordActual && !datos.password) {
      ctx.issues.push({
        code: 'custom',
        input: datos,
        path: ['password'],
        message: 'Falta la contrasena nueva',
      });
    }
  });

/** POST /api/auth/recuperar-password */
export const recuperarPasswordSchema = z.strictObject({ email });

/** POST /api/auth/resetear-password */
export const resetearPasswordSchema = z.strictObject({
  token: z.string().min(1, { error: 'El token es obligatorio' }),
  password,
});