import { useCallback } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { listarPublicaciones, obtenerPublicacion } from '../../api/publicaciones.api.js';
import { usePedido } from '../../hooks/usePedido.js';
import Boton from '../../componentes/Boton.jsx';
import Carrusel from '../../componentes/Carrusel.jsx';
import Etiqueta from '../../componentes/Etiqueta.jsx';
import Nivel from '../../componentes/Nivel.jsx';
import RangoFechas from '../../componentes/RangoFechas.jsx';
import TarjetaPublicacion from '../../componentes/TarjetaPublicacion.jsx';
import { Cargando, ErrorCarga, Vacio } from '../../componentes/Estados.jsx';
import { contarDias, rangoDeUrl } from '../../utils/fechas.js';
import {
  formatearDuracion,
  formatearPrecio,
  formatearTemporadas,
  precioDePublicacion,
  unirLista,
} from '../../utils/formato.js';
import estilos from './DetallePublicacion.module.css';

const SECCION_POR_TIPO = {
  experiencia: 'Experiencias guiadas',
  curso: 'Escuela de montaña',
  alquiler: 'Alquiler de equipo',
};

const TEXTOS_EXPERIENCIA = {
  pregunta: '¿Cuándo te gustaría ir?',
  nota: 'Fechas tentativas: no reservan lugar, nos ayudan a responderte con la disponibilidad real.',
  desde: 'Desde',
  hasta: 'Hasta',
};

/** Datos de la ficha segun el tipo. Los vacios no se muestran. */
function datosDeFicha({ tipo, atributos = {} }) {
  if (tipo === 'experiencia') {
    return [
      ['Dificultad', <Nivel key="n" valor={atributos.dificultad} />],
      ['Duración', formatearDuracion(atributos.duracionHoras)],
      ['Temporada', formatearTemporadas(atributos.temporada)],
      ['Cupo máximo', `${atributos.cupoMaximo} personas`],
      ['Punto de encuentro', atributos.puntoEncuentro],
    ];
  }
  if (tipo === 'curso') {
    return [
      ['Nivel', <Nivel key="n" valor={atributos.nivel} />],
      ['Duración', formatearDuracion(atributos.duracionHoras)],
      ['Cupo', `${atributos.cupo} personas`],
      ['Certificación', atributos.certificacion],
    ];
  }
  return [
    ['Talles', atributos.talles?.length ? unirLista(atributos.talles) : null],
    ['Unidades disponibles', `${atributos.unidadesDisponibles} de ${atributos.unidadesTotales}`],
    ['Depósito', atributos.deposito != null ? formatearPrecio(atributos.deposito) : null],
  ];
}

/** Lista que acompaña a la ficha: lo que incluye o lo que se pide antes. */
function listaDeFicha({ tipo, atributos = {} }) {
  if (tipo === 'experiencia' && atributos.incluye?.length) {
    return { titulo: 'Qué incluye', items: atributos.incluye };
  }
  if (tipo === 'curso') {
    return {
      titulo: 'Requisitos previos',
      items: atributos.requisitosPrevios?.length ? atributos.requisitosPrevios : ['No hace falta experiencia previa.'],
    };
  }
  return null;
}

function textoPrecio(publicacion) {
  const precio = precioDePublicacion(publicacion);
  if (precio == null) return null;
  const etiquetas = { experiencia: 'Desde', curso: 'Curso completo', alquiler: 'Por día' };
  return { etiqueta: etiquetas[publicacion.tipo], monto: formatearPrecio(precio) };
}

function Relacionadas({ publicacion }) {
  const pedir = useCallback(
    () =>
      listarPublicaciones({ categoria: publicacion.categoria._id, limite: 4 }).then((r) =>
        r.datos.filter((p) => p._id !== publicacion._id).slice(0, 3)
      ),
    [publicacion.categoria._id, publicacion._id]
  );
  const { datos } = usePedido(pedir);

  // Es un agregado: si falla o no hay nada, la seccion simplemente no aparece.
  if (!datos?.length) return null;

  return (
    <section className={estilos.relacionadas} aria-labelledby="titulo-relacionadas">
      <h2 id="titulo-relacionadas" className={estilos.tituloSeccion}>
        También te puede interesar
      </h2>
      <div className={estilos.grilla}>
        {datos.map((p) => (
          <TarjetaPublicacion key={p._id} publicacion={p} conTipo />
        ))}
      </div>
    </section>
  );
}

function Ficha({ publicacion, rango, alCambiarRango }) {
  const { _id, tipo, disponible } = publicacion;
  const precio = textoPrecio(publicacion);
  const aceptaFechas = tipo === 'alquiler' || tipo === 'experiencia';
  const dias = rango ? contarDias(rango.desde, rango.hasta) : null;
  const total = tipo === 'alquiler' && dias && precio ? precioDePublicacion(publicacion) * dias : null;

  const consulta = new URLSearchParams({ publicacion: _id });
  if (rango) {
    consulta.set('desde', rango.desde);
    consulta.set('hasta', rango.hasta);
  }

  return (
    <div className={estilos.ficha}>
      {precio ? (
        <p className={estilos.precio}>
          <small>{precio.etiqueta}</small>
          {precio.monto}
        </p>
      ) : (
        <p className={estilos.precio}>
          <small>Precio</small>A consultar
        </p>
      )}

      <p className={disponible ? estilos.disponible : estilos.noDisponible}>
        {disponible ? 'Disponible' : 'No disponible por ahora'}
      </p>

      {aceptaFechas && (
        <RangoFechas
          key={rango ? `${rango.desde}_${rango.hasta}` : 'sin-fechas'}
          rango={rango}
          alAplicar={alCambiarRango}
          alQuitar={() => alCambiarRango(null)}
          textos={tipo === 'experiencia' ? TEXTOS_EXPERIENCIA : undefined}
          compacto
        />
      )}

      {total != null && (
        <p className={estilos.total}>
          Total estimado por {dias} {dias === 1 ? 'día' : 'días'}: <strong>{formatearPrecio(total)}</strong>
        </p>
      )}

      <Boton a={`/contacto?${consulta}`} className={estilos.consultar}>
        {disponible ? 'Consultar' : 'Consultar disponibilidad'}
      </Boton>
      <p className={estilos.ayuda}>
        Te respondemos por mail con la disponibilidad y los detalles. Consultar no tiene costo ni compromiso.
      </p>
    </div>
  );
}

export default function DetallePublicacion() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const pedir = useCallback(() => obtenerPublicacion(id), [id]);
  const { datos: publicacion, error, cargando, recargar } = usePedido(pedir);
  const rango = rangoDeUrl(params.get('desde'), params.get('hasta'));

  const cambiarRango = (nuevo) =>
    setParams(nuevo ? { desde: nuevo.desde, hasta: nuevo.hasta } : {}, { replace: true, preventScrollReset: true });

  if (cargando) {
    return (
      <div className="contenedor">
        <Cargando />
      </div>
    );
  }

  if (error) {
    // 404 (no existe o esta desactivada) y 400 (id mal formado) son lo mismo para el visitante.
    const noExiste = error.estado === 404 || error.estado === 400;
    return (
      <div className="contenedor">
        {noExiste ? (
          <Vacio titulo="No encontramos esta publicación" accion={<Boton a="/catalogo">Ver el catálogo</Boton>}>
            Puede que ya no esté publicada o que el enlace esté mal escrito.
          </Vacio>
        ) : (
          <ErrorCarga mensaje={error.message} alReintentar={recargar} />
        )}
      </div>
    );
  }

  const { nombre, tipo, categoria, descripcion, imagenes, destacada, disponible } = publicacion;
  const datos = datosDeFicha(publicacion).filter(([, valor]) => valor);
  const lista = listaDeFicha(publicacion);

  return (
    <div className="contenedor">
      <title>{`${nombre} · Andes Vertical`}</title>

      <nav aria-label="Ruta de navegación" className={estilos.migas}>
        <ol>
          <li><Link to="/catalogo">Catálogo</Link></li>
          <li><Link to={`/catalogo?tipo=${tipo}`}>{SECCION_POR_TIPO[tipo]}</Link></li>
          <li aria-current="page">{nombre}</li>
        </ol>
      </nav>

      <div className={estilos.disposicion}>
        <div className={estilos.cabecera}>
          <Carrusel imagenes={imagenes} alt={nombre} className={estilos.carrusel} miniaturas />

          <header className={estilos.encabezado}>
            <p className={estilos.categoria}>
              <Link to={`/catalogo?categoria=${categoria._id}`}>{categoria.nombre}</Link>
            </p>
            <h1>{nombre}</h1>
            <div className={estilos.etiquetas}>
              {destacada && <Etiqueta>Destacada</Etiqueta>}
              {!disponible && <Etiqueta variante="neutra">No disponible</Etiqueta>}
            </div>
          </header>
        </div>

        <div className={estilos.cuerpo}>
          <p className={estilos.descripcion}>{descripcion}</p>

          <section aria-labelledby="titulo-ficha">
            <h2 id="titulo-ficha" className={estilos.tituloSeccion}>Datos</h2>
            <dl className={estilos.datos}>
              {datos.map(([etiqueta, valor]) => (
                <div key={etiqueta}>
                  <dt>{etiqueta}</dt>
                  <dd>{valor}</dd>
                </div>
              ))}
            </dl>
          </section>

          {lista && (
            <section aria-labelledby="titulo-lista">
              <h2 id="titulo-lista" className={estilos.tituloSeccion}>{lista.titulo}</h2>
              <ul className={estilos.lista}>
                {lista.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className={estilos.lateral} aria-label="Precio y consulta">
          <Ficha publicacion={publicacion} rango={rango} alCambiarRango={cambiarRango} />
        </aside>
      </div>

      <Relacionadas publicacion={publicacion} />
    </div>
  );
}
