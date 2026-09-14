/* ───────────────────────────────────────────────────────────────
   CONTENIDO DE DEMOSTRACIÓN

   Un proyecto de ejemplo por cada tipo de área, con la ficha
   completamente llena. Sirve para dos cosas:

   1. Probar la estructura de la web sin material exportado.
   2. Enseñarle al equipo qué tan largo debe ser cada campo y con
      qué tono se escribe.

   TODAS las piezas llevan `demo: true`. Antes de lanzar se apagan
   con una sola bandera — no queda rastro.

   La estructura de estos objetos es idéntica al frontmatter de
   _FICHA.md en 01_RECURSOS/00_NuevoOrden. Cuando conectemos Sanity,
   cambia de dónde salen los datos, no el resto del sitio.
   ─────────────────────────────────────────────────────────────── */

export type Rubro =
  | "marca"
  | "marca-express"
  | "reels"
  | "comercial"
  | "foto"
  | "diseno"
  | "web";

export type Formato = "vertical" | "horizontal" | "estatico";

/* Cómo se hizo la pieza. Solo aplica a los reels, y es lo que separa
   las dos listas del feed: un reel de animación y uno grabado se ven
   distinto y quien busca uno rara vez quiere el otro. */
export type Tecnica = "live-action" | "animacion";

export const TECNICAS: { id: Tecnica; nombre: string }[] = [
  { id: "live-action", nombre: "Live action" },
  { id: "animacion", nombre: "Animación" },
];

export type Metrica = { valor: string; etiqueta: string };

/* Quién trabajó en la pieza. Va al final del caso de estudio.
   El enlace es opcional: no todos tienen o quieren redes públicas. */
export type Colaborador = {
  nombre: string;
  rol: string;
  url?: string;
  /* Cómo se muestra el enlace. Si se omite se deduce del dominio. */
  red?: string;
};

export type Media =
  | { tipo: "local"; src: string; pesoMB: number }
  | { tipo: "youtube"; id: string }
  | { tipo: "ninguno" };

/* ── Una imagen dentro de un caso ──
   Guarda las medidas del ARCHIVO ORIGINAL, que casi nunca coinciden
   con la proporción que usa el layout. La rejilla recorta a cuadrada
   o a panorámica para que la interfaz quede ordenada; el visor a
   pantalla completa muestra la foto entera, sin recorte. */
export type Imagen = {
  /** Medidas del archivo tal como se exportó */
  w: number;
  h: number;
  pie?: string;
  /** Ruta del archivo. Sin ella se dibuja el marcador dimensionado. */
  src?: string;
  /** Animación opcional (MP4 mudo) que se reproduce sobre `src`.
      Los GIF de marca se convierten a MP4: mismo movimiento, una
      décima parte del peso, y `src` queda de póster. */
  video?: string;
};

/* ── Módulos del cuerpo del caso de estudio ──
   Se combinan libremente y en cualquier orden. Un proyecto puede ser
   solo cuadrículas; otro puede alternar texto e imagen. Lo decide
   cada proyecto según lo que haya que contar. */
export type Modulo =
  /* Dos imágenes recortadas a cuadrada, una al lado de la otra */
  | { tipo: "cuadricula"; imagenes: [Imagen, Imagen] }
  /* Una sola imagen que cubre el ancho de las dos anteriores */
  | { tipo: "completa"; imagen: Imagen; alto?: "normal" | "panoramico" | "cuadro" }
  /* Bloque de texto: título grande a la izquierda, párrafos a la
     derecha. Opcionalmente con una imagen al costado. */
  | { tipo: "texto"; titulo: string; parrafos: string[]; imagen?: Imagen };

/* Reúne, en orden de lectura, todas las imágenes de un caso.
   Es la lista que recorre el visor con las flechas. */
export const imagenesDe = (modulos: Modulo[] = []): Imagen[] =>
  modulos.flatMap((m) =>
    m.tipo === "cuadricula"
      ? m.imagenes
      : m.tipo === "completa"
      ? [m.imagen]
      : m.imagen
      ? [m.imagen]
      : []
  );

export type Pieza = {
  slug: string;
  titulo: string;
  cliente: string;
  clienteId: string;
  /* Categoría o giro del cliente — se muestra en la tarjeta */
  categoria: string;
  /* Logo reducido del cliente para el recuadro de la tarjeta.
     Si no hay archivo, se dibuja un monograma con sus iniciales. */
  logo?: string;
  /* El logo trae su propio fondo de color y llena la caja. Las
     reducciones sobre transparente se dejan con aire alrededor. */
  logoLleno?: boolean;
  /* Imágenes de la pieza. Donde falte una, se dibuja el marcador. */
  portada?: string;
  tarjeta?: string;
  tarjetaHover?: string;
  /** Animación de hover para piezas sin video propio (MP4 mudo).
      Si existe, manda sobre `tarjetaHover`, que queda de póster. */
  tarjetaHoverVideo?: string;
  campana?: string;
  /* Solo en reels. Si falta, se asume imagen real. */
  tecnica?: Tecnica;
  /* Agencias a través de las cuales se produjo la pieza.

     El cliente sigue siendo la marca —el trabajo se hizo para ella— y
     estas son las agencias que nos llamaron para hacerlo. Van aparte y
     no mezcladas en el nombre del cliente porque son dos relaciones
     distintas: una marca puede llegar por varias agencias, y la misma
     agencia puede traer varias marcas. */
  agencias?: string[];
  rubro: Rubro;
  formato: Formato;
  anio: number;
  resumen: string;
  /* Dónde se lee el resumen dentro del caso. Por omisión va pegado al
     título, antes de la portada. Las identidades exprés lo quieren
     después: ahí la portada es el logotipo terminado y conviene verlo
     antes de que nadie te lo explique. */
  resumenDespuesDePortada?: boolean;
  /* Contexto general del proyecto: un título y el párrafo que lo
     acompaña. Sustituye al bloque de tres métricas en el caso. */
  contexto?: { titulo: string; parrafos: string[] };
  descripcion: string[];
  servicios: string[];
  metricas: Metrica[];
  /* Párrafo de cierre. Va al final del caso, junto a la llamada a
     contacto: es lo último que se lee antes de decidir escribir. */
  cierre?: string;
  /* Créditos de la pieza, al cierre del caso */
  colaboradores?: Colaborador[];
  modulos?: Modulo[];
  destacado: boolean;
  orden: number;
  media: Media;
  galeria: number;
  demo: boolean;
};

/* Logotipos para la franja de "marcas con las que hemos trabajado".

   Van aparte de la pieza porque esa franja lista CLIENTES, no
   trabajos: un cliente con tres proyectos aparece una sola vez, y no
   tendría sentido repetir el mismo archivo en cada ficha. Donde no
   hay logo se sigue escribiendo el nombre, que es como estaba. */
export const LOGOS_CLIENTE: Record<string, string> = {
  "Don Neto": "/clientes/don-neto.svg",
  Minturina: "/clientes/minturina.svg",
  Shiny: "/clientes/shiny.svg",
  /* De las cuatro exprés solo Klevers va aquí: las tres marcas de
     Kevin se quedan fuera de la franja por decisión del cliente. */
  Klevers: "/clientes/klevers.svg",
};

/* "A", "A y B", "A, B y C" — para créditos que se leen como frase */
export const listar = (xs: string[]): string =>
  xs.length <= 1
    ? xs[0] ?? ""
    : xs.slice(0, -1).join(", ") + " y " + xs[xs.length - 1];

export const RUBROS: { id: Rubro; nombre: string; corto: string }[] = [
  { id: "marca", nombre: "Identidad completa", corto: "Completa" },
  { id: "marca-express", nombre: "Identidad exprés", corto: "Exprés" },
  { id: "reels", nombre: "Contenido vertical", corto: "Reels" },
  { id: "comercial", nombre: "Audiovisual comercial", corto: "Comercial" },
  { id: "foto", nombre: "Fotografía", corto: "Foto" },
  { id: "diseno", nombre: "Diseño gráfico", corto: "Diseño" },
  { id: "web", nombre: "Desarrollo web", corto: "Web" },
];

/* ── Secciones de la rejilla ──

   Un botón puede cubrir más de un rubro. La identidad completa y la
   exprés son el mismo servicio en dos tamaños, y separarlas en dos
   botones partía una sección que ya era corta: ahora comparten el
   botón "Marca" y por dentro se filtran entre ellas.

   Donde una sección cubre un solo rubro no aparece filtro interno. */
export const SECCIONES: {
  id: string;
  corto: string;
  rubros: Rubro[];
  /* Reels se subdivide por cómo se hizo la pieza, no por rubro: son
     todas el mismo servicio, pero grabar y animar son oficios
     distintos y quien busca uno rara vez quiere el otro. */
  porTecnica?: boolean;
}[] = [
  { id: "marca", corto: "Marca", rubros: ["marca", "marca-express"] },
  { id: "reels", corto: "Reels", rubros: ["reels"], porTecnica: true },
  { id: "comercial", corto: "Comercial", rubros: ["comercial"] },
  { id: "foto", corto: "Foto", rubros: ["foto"] },
  { id: "diseno", corto: "Diseño", rubros: ["diseno"] },
  { id: "web", corto: "Web", rubros: ["web"] },
];

/* Medidas del manual — se dibujan sobre cada placeholder para poder
   juzgar los tamaños reales en pantalla. */
export const MEDIDAS: Record<Formato, { w: number; h: number }> = {
  vertical: { w: 1080, h: 1920 },
  horizontal: { w: 1920, h: 1080 },
  estatico: { w: 1600, h: 1200 },
};

export const PIEZAS: Pieza[] = [
  /* ═══════════════════════════════════════════════════════════════
     REELS · diecisiete piezas, once grabadas y seis animadas

     El feed las mezcla todas; el filtro de arriba separa por técnica,
     que es la división que de verdad le importa a quien busca —un
     reel de animación y uno grabado son oficios distintos—.

     Los archivos viven en Cloudflare R2, no en el repositorio:
     01_REELS para lo grabado, 02_ANIMACIONES para lo animado. Aquí
     solo viaja la ruta. Las portadas sí son del repositorio y pesan
     unos 100 KB cada una.
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: "desvelados-otono-pumpkin-spice",
    titulo: "Pumpkin Spice Latte",
    cliente: "Desvelados",
    clienteId: "03_DESVELADOS",
    categoria: "Cafetería de especialidad",
    campana: "Otoño 2025",
    rubro: "reels",
    tecnica: "live-action",
    formato: "vertical",
    anio: 2025,
    resumen: "Presentación para bebida de temporada en octubre. Primera de tres piezas.",
    tarjeta: "/reels/desvelados-otono-pumpkin-spice.jpg",
    descripcion: [],
    servicios: ["contenido-vertical"],
    metricas: [],
    colaboradores: [{"nombre":"Omar Terrazas","rol":"Colorización"}],
    destacado: true,
    orden: 1,
    media: { tipo: "local", src: "/01_REELS/2025_Desvelados_PumkingSpicen.mp4", pesoMB: 17.9 },
    galeria: 0,
    demo: false,
  },
  {
    slug: "desvelados-otono-thai-latte",
    titulo: "Thai Latte",
    cliente: "Desvelados",
    clienteId: "03_DESVELADOS",
    categoria: "Cafetería de especialidad",
    campana: "Otoño 2025",
    rubro: "reels",
    tecnica: "live-action",
    formato: "vertical",
    anio: 2025,
    resumen: "Proceso con el tiempo justo para querer pedir uno. Segunda de tres piezas.",
    tarjeta: "/reels/desvelados-otono-thai-latte.jpg",
    descripcion: [],
    servicios: ["contenido-vertical"],
    metricas: [],
    colaboradores: [{"nombre":"Omar Terrazas","rol":"Colorización"}],
    destacado: true,
    orden: 2,
    media: { tipo: "local", src: "/01_REELS/2025-Desvelados_Thai Latte.mp4", pesoMB: 10.9 },
    galeria: 0,
    demo: false,
  },
  {
    slug: "desvelados-acercamiento-preparacion",
    titulo: "Acercamiento y preparación",
    cliente: "Desvelados",
    clienteId: "03_DESVELADOS",
    categoria: "Cafetería de especialidad",
    campana: "Otoño 2025",
    rubro: "reels",
    tecnica: "live-action",
    formato: "vertical",
    anio: 2025,
    resumen: "Cómo se siente la preparación. Tercera de tres piezas.",
    tarjeta: "/reels/desvelados-acercamiento-preparacion.jpg",
    descripcion: [],
    servicios: ["contenido-vertical"],
    metricas: [],
    colaboradores: [{"nombre":"Omar Terrazas","rol":"Colorización"}],
    destacado: false,
    orden: 3,
    media: { tipo: "local", src: "/01_REELS/2025-Desvelados-Que-Le-Puedo-Ofrecer.mp4", pesoMB: 13.8 },
    galeria: 0,
    demo: false,
  },
  {
    slug: "bricka-landmark-departamento-1404",
    titulo: "Landmark Reserve Dep.1404",
    cliente: "BRICKA",
    clienteId: "04_BRICKA",
    categoria: "Bienes raíces",
    rubro: "reels",
    tecnica: "live-action",
    formato: "vertical",
    anio: 2026,
    resumen: "¿Cómo se sentiría vivir en una de las torres más exclusivas de Guadalajara?",
    tarjeta: "/reels/bricka-landmark-departamento-1404.jpg",
    descripcion: [],
    servicios: ["contenido-vertical"],
    metricas: [],
    destacado: true,
    orden: 4,
    media: { tipo: "local", src: "/01_REELS/2026-BRICKA-Landmark-Departamento-140.mp4", pesoMB: 15.4 },
    galeria: 0,
    demo: false,
  },
  {
    slug: "bricka-casa-salon-eventos",
    titulo: "Casa, salón y eventos",
    cliente: "BRICKA",
    clienteId: "04_BRICKA",
    categoria: "Bienes raíces",
    rubro: "reels",
    tecnica: "live-action",
    formato: "vertical",
    anio: 2026,
    resumen: "Negocio y hogar en un mismo lugar.",
    tarjeta: "/reels/bricka-casa-salon-eventos.jpg",
    descripcion: [],
    servicios: ["contenido-vertical"],
    metricas: [],
    destacado: false,
    orden: 5,
    media: { tipo: "local", src: "/01_REELS/2026-Bricka-CasaSalonEvento.mp4", pesoMB: 20.1 },
    galeria: 0,
    demo: false,
  },
  {
    slug: "espolon-rollforcocktail",
    titulo: "Roll for Cocktail — Extra Añejo Edition",
    cliente: "Espolón Tequila",
    clienteId: "08_ESPOLON_TEQUILA",
    categoria: "Destilados",
    campana: "Roll for Cocktail",
    agencias: ["Diptongo","NewGen"],
    rubro: "reels",
    tecnica: "live-action",
    formato: "vertical",
    anio: 2026,
    resumen: "¡Tira, juega y prepara tu trago!",
    tarjeta: "/reels/espolon-rollforcocktail.jpg",
    descripcion: [],
    servicios: ["contenido-vertical"],
    metricas: [],
    destacado: true,
    orden: 6,
    media: { tipo: "local", src: "/01_REELS/2026-Espolontequila-Rollforcocktail.mp4", pesoMB: 11.3 },
    galeria: 0,
    demo: false,
  },
  {
    slug: "espolon-calle-espolon-nyc",
    titulo: "What does soccer mean to me?",
    cliente: "Espolón Tequila",
    clienteId: "08_ESPOLON_TEQUILA",
    categoria: "Destilados",
    campana: "Calle Espolón NYC",
    agencias: ["Diptongo","NewGen"],
    rubro: "reels",
    tecnica: "live-action",
    formato: "vertical",
    anio: 2026,
    resumen: "Qué significa el soccer para la gente, y el papel que juega el tequila en esos encuentros.",
    tarjeta: "/reels/espolon-calle-espolon-nyc.jpg",
    descripcion: [],
    servicios: ["contenido-vertical"],
    metricas: [],
    destacado: false,
    orden: 7,
    media: { tipo: "local", src: "/01_REELS/2026-Espolontequila-Calle-Espolon.mp4", pesoMB: 16.4 },
    galeria: 0,
    demo: false,
  },
  {
    slug: "espolon-rg-takes",
    titulo: "Ramon & Guadalupe Takes On Margaritas",
    cliente: "Espolón Tequila",
    clienteId: "08_ESPOLON_TEQUILA",
    categoria: "Destilados",
    agencias: ["Diptongo","NewGen"],
    rubro: "reels",
    tecnica: "live-action",
    formato: "vertical",
    anio: 2026,
    resumen: "Enfrentamiento para ver cuál margarita es la mejor. ¿La clásica o algo más arriesgado?",
    tarjeta: "/reels/espolon-rg-takes.jpg",
    descripcion: [],
    servicios: ["contenido-vertical"],
    metricas: [],
    destacado: false,
    orden: 8,
    media: { tipo: "local", src: "/01_REELS/e2026-Espolontequila-rg-takes.mp4", pesoMB: 15.5 },
    galeria: 0,
    demo: false,
  },
  {
    slug: "shiny-recorrido-detallados",
    titulo: "Recorrido Detallados",
    cliente: "Shiny",
    clienteId: "14_SHINY",
    categoria: "Limpieza de calzado",
    campana: "Apertura",
    rubro: "reels",
    tecnica: "live-action",
    formato: "vertical",
    anio: 2025,
    resumen: "Recorrido por los tres servicios estrella.",
    tarjeta: "/reels/shiny-recorrido-detallados.jpg",
    descripcion: [],
    servicios: ["contenido-vertical"],
    metricas: [],
    destacado: true,
    orden: 9,
    media: { tipo: "local", src: "/01_REELS/2025-Shiny-Servicios.mp4", pesoMB: 18.3 },
    galeria: 0,
    demo: false,
  },
  {
    slug: "electrificaciones-ramos-quienes-somos",
    titulo: "¿Quiénes somos y cómo lo hacemos?",
    cliente: "Electrificaciones Ramos",
    clienteId: "05_ELECTRIFICACIONES_RAMOS",
    categoria: "Instalaciones eléctricas",
    campana: "Servicios e instalación",
    rubro: "reels",
    tecnica: "live-action",
    formato: "vertical",
    anio: 2025,
    resumen: "Introducción a los servicios y a la filosofía detrás de cada proyecto.",
    tarjeta: "/reels/electrificaciones-ramos-quienes-somos.jpg",
    descripcion: [],
    servicios: ["contenido-vertical"],
    metricas: [],
    destacado: false,
    orden: 10,
    media: { tipo: "local", src: "/01_REELS/2025-Electrificaciones-Ramos.mp4", pesoMB: 10.6 },
    galeria: 0,
    demo: false,
  },
  {
    slug: "acrilexsa-recuerdos-mascotas",
    titulo: "Devuélvele la luz a tu espacio",
    cliente: "Acrilexsa",
    clienteId: "09_ACRILEXSA",
    categoria: "Acrílicos a medida",
    campana: "Recuerdos de mascotas",
    rubro: "reels",
    tecnica: "live-action",
    formato: "vertical",
    anio: 2026,
    resumen: "Campaña para recordar a esas mascotas que nos dejaron y se volvieron parte de la familia.",
    tarjeta: "/reels/acrilexsa-recuerdos-mascotas.jpg",
    descripcion: [],
    servicios: ["contenido-vertical"],
    metricas: [],
    destacado: true,
    orden: 11,
    media: { tipo: "local", src: "/01_REELS/Acrilicsa-Campaña-Mascotas.mp4", pesoMB: 17.3 },
    galeria: 0,
    demo: false,
  },
  {
    slug: "tecmilenio-que-buscan-las-empresas",
    titulo: "¿Qué buscan las empresas?",
    cliente: "Tecmilenio",
    clienteId: "06_TECMI",
    categoria: "Educación",
    campana: "Animaciones para dirección",
    rubro: "reels",
    tecnica: "animacion",
    formato: "vertical",
    anio: 2025,
    resumen: "Animación para la serie de piezas de dirección.",
    tarjeta: "/reels/tecmilenio-que-buscan-las-empresas.jpg",
    descripcion: [],
    servicios: ["contenido-vertical"],
    metricas: [],
    colaboradores: [{"nombre":"Bruno Zepeda","rol":"Dirección"}],
    destacado: true,
    orden: 12,
    media: { tipo: "local", src: "/02_ANIMACIONES/ANIMACION-TECMI-1.mp4", pesoMB: 5.5 },
    galeria: 0,
    demo: false,
  },
  {
    slug: "tecmilenio-peligro-oportunidad",
    titulo: "Peligro & Oportunidad",
    cliente: "Tecmilenio",
    clienteId: "06_TECMI",
    categoria: "Educación",
    campana: "Animaciones para dirección",
    rubro: "reels",
    tecnica: "animacion",
    formato: "vertical",
    anio: 2025,
    resumen: "Animación para la serie de piezas de dirección.",
    tarjeta: "/reels/tecmilenio-peligro-oportunidad.jpg",
    descripcion: [],
    servicios: ["contenido-vertical"],
    metricas: [],
    colaboradores: [{"nombre":"Bruno Zepeda","rol":"Dirección"}],
    destacado: false,
    orden: 13,
    media: { tipo: "local", src: "/02_ANIMACIONES/ANIMACION-TECMI-2.mp4", pesoMB: 10.4 },
    galeria: 0,
    demo: false,
  },
  {
    slug: "escena-cuatro-cumpleanos-angel",
    titulo: "Cumpleaños Angel",
    cliente: "Escena Cuatro",
    clienteId: "07_CREW",
    categoria: "Producción audiovisual",
    campana: "Cumpleaños Crew",
    rubro: "reels",
    tecnica: "animacion",
    formato: "vertical",
    anio: 2025,
    resumen: "Felicitación animada para el equipo.",
    tarjeta: "/reels/escena-cuatro-cumpleanos-angel.jpg",
    descripcion: [],
    servicios: ["contenido-vertical"],
    metricas: [],
    destacado: false,
    orden: 14,
    media: { tipo: "local", src: "/02_ANIMACIONES/ANIMACION-CREW-1.mp4", pesoMB: 16.2 },
    galeria: 0,
    demo: false,
  },
  {
    slug: "escena-cuatro-cumpleanos-gerry",
    titulo: "Cumpleaños Gerry",
    cliente: "Escena Cuatro",
    clienteId: "07_CREW",
    categoria: "Producción audiovisual",
    campana: "Cumpleaños Crew",
    rubro: "reels",
    tecnica: "animacion",
    formato: "vertical",
    anio: 2025,
    resumen: "Felicitación animada para el equipo.",
    tarjeta: "/reels/escena-cuatro-cumpleanos-gerry.jpg",
    descripcion: [],
    servicios: ["contenido-vertical"],
    metricas: [],
    destacado: false,
    orden: 15,
    media: { tipo: "local", src: "/02_ANIMACIONES/ANIMACION-CREW-2.mp4", pesoMB: 6.3 },
    galeria: 0,
    demo: false,
  },
  {
    slug: "escena-cuatro-felices-fiestas",
    titulo: "¡Felices fiestas!",
    cliente: "Escena Cuatro",
    clienteId: "07_CREW",
    categoria: "Producción audiovisual",
    campana: "Cierre de año",
    rubro: "reels",
    tecnica: "animacion",
    formato: "vertical",
    anio: 2025,
    resumen: "Pieza de cierre de año para redes.",
    tarjeta: "/reels/escena-cuatro-felices-fiestas.jpg",
    descripcion: [],
    servicios: ["contenido-vertical"],
    metricas: [],
    destacado: false,
    orden: 16,
    media: { tipo: "local", src: "/02_ANIMACIONES/GIF-NAVIDAD ESCEN4.mp4", pesoMB: 16.5 },
    galeria: 0,
    demo: false,
  },
  {
    slug: "intelisis-animacion-logo",
    titulo: "Propuesta Animación Logo Intelisis",
    cliente: "Intelisis",
    clienteId: "10_INTELISIS",
    categoria: "Software empresarial",
    rubro: "reels",
    tecnica: "animacion",
    formato: "vertical",
    anio: 2025,
    resumen: "Ejercicio de animación para la marca Intelisis software.",
    tarjeta: "/reels/intelisis-animacion-logo.jpg",
    descripcion: [],
    servicios: ["contenido-vertical"],
    metricas: [],
    destacado: false,
    orden: 17,
    media: { tipo: "local", src: "/02_ANIMACIONES/ANIMACION-LOGO-INTELISIS.mp4", pesoMB: 2 },
    galeria: 0,
    demo: false,
  },

  /* ─── COMERCIAL 16:9 ─── */
  {
    slug: "eci-pieza-comercial-demo",
    titulo: "Pieza comercial de referencia",
    cliente: "ECI",
    clienteId: "00_ECI",
    categoria: "Marca propia",
    logo: "/marca/logos/ECI_Secundario_Crema.svg",
    rubro: "comercial",
    formato: "horizontal",
    anio: 2026,
    resumen: "Formato cine 16:9 servido desde YouTube sin listar, cargado solo al hacer clic.",
    contexto: {
      titulo: "El video vive fuera del sitio",
      parrafos: [
        "Esta pieza está aquí para probar el comportamiento del reproductor 16:9 dentro del caso de estudio: el video no se carga hasta que alguien lo pide, de modo que la página abre en el mismo tiempo tenga o no tenga video.",
        "En producción, cada comercial vive en Vimeo o YouTube sin listar y en la carpeta del proyecto solo queda su identificador. Un comercial de dos minutos pesa cientos de megas y no hay razón para duplicarlo en el disco del sitio.",
      ],
    },
    descripcion: [],
    servicios: ["audiovisual-comercial"],
    metricas: [],
    /* CRÉDITOS DE EJEMPLO — sustituir por el equipo real */
    colaboradores: [
      { nombre: "Elihu Arrieta", rol: "Dirección", url: "https://instagram.com/eci.estudio" },
      { nombre: "Nombre por definir", rol: "Cámara" },
      { nombre: "Nombre por definir", rol: "Edición y color", url: "https://vimeo.com/" },
      { nombre: "Nombre por definir", rol: "Diseño sonoro" },
    ],
    destacado: true,
    orden: 6,
    media: { tipo: "youtube", id: "9O3Rb37micI" },
    galeria: 0,
    demo: true,
  },

  /* ═══════════════════════════════════════════════════════════════
     MARCA · Don Neto — MATERIAL REAL
     Primer cliente montado con sus archivos definitivos. Alterna
     cuadrículas y cajas a lo ancho, y estrena la capa animada: los
     GIF del manual convertidos a MP4, tanto en el hover de la
     tarjeta como dentro del caso. Faltan los textos.
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: "don-neto-identidad",
    titulo: "Identidad Don Neto",
    cliente: "Don Neto",
    clienteId: "02_DONNETO",
    categoria: "Repostería y panadería",
    /* La reducción trae su propio fondo crema: llena la caja */
    logo: "/trabajo/don-neto-identidad/logo.svg",
    logoLleno: true,
    portada: "/trabajo/don-neto-identidad/portada.jpg",
    /* La tarjeta es vector: 3 KB y nítida a cualquier tamaño */
    tarjeta: "/trabajo/don-neto-identidad/tarjeta.svg",
    /* La papelería, que también se repite dentro del caso */
    tarjetaHover: "/trabajo/don-neto-identidad/tarjeta-hover.jpg",
    rubro: "marca",
    formato: "estatico",
    anio: 2024,
    resumen:
      "Re-Branding para una panadería en la ciudad de Chihuahua, activa desde 1987.",
    contexto: {
      titulo: "Sobre el proyecto",
      parrafos: [
        "Este proyecto llegó con el reto principal de generar un cambio de identidad que renovara la marca, pero que a su vez siguiera manteniendo la esencia representativa de todos sus años de trayectoria.",
        "Uno de los conceptos más importantes que descubrimos al escuchar a nuestro cliente fue el de “del ver nace el amor”. Por lo cual vimos que la identidad no solo debía representar esa tradición que mantienen desde muchos años atrás, sino también una limpieza y calidad que empate con los productos que hornean.",
      ],
    },
    descripcion: [],
    servicios: ["identidad-completa"],
    metricas: [],
    /* El recorrido: se abre con dos aplicaciones y un producto para que
       el primer texto no llegue solo, luego el sistema completo y al
       final el oficio, que es lo que le da sentido a todo lo anterior. */
    modulos: [
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 700, h: 955, src: "/trabajo/don-neto-identidad/galeria/01-mandil.jpg", pie: "Mandil de mostrador" },
          { w: 1500, h: 1250, src: "/trabajo/don-neto-identidad/galeria/02-playera.jpg", pie: "Playera de equipo" },
        ],
      },
      {
        tipo: "completa",
        alto: "cuadro",
        imagen: { w: 1066, h: 1600, src: "/trabajo/don-neto-identidad/galeria/03-foto-conchas.jpg", pie: "Conchas de la casa" },
      },

      {
        tipo: "texto",
        titulo: "Personalidad",
        parrafos: [
          "Si la marca fuera una persona definitivamente sería el sr. Gamboa, la persona que comenzó toda esta tradición. Es alguien cercano con sus clientes, que se empeña en hornear cada producto con calidad y lo hace a mano en su horno tradicional.",
          "Todo esto fue la base para plantear qué mantener en el logo, qué era necesario cambiar y cómo hacerlo.",
        ],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          {
            w: 900,
            h: 900,
            src: "/trabajo/don-neto-identidad/galeria/04-logo-animado.jpg",
            video: "/trabajo/don-neto-identidad/galeria/04-logo-animado.mp4",
            pie: "El logotipo construyéndose",
          },
          { w: 1999, h: 2000, src: "/trabajo/don-neto-identidad/galeria/05-reducciones.png", pie: "Logotipo y sus reducciones" },
        ],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 2000, h: 2000, src: "/trabajo/don-neto-identidad/galeria/06-colores.png", pie: "Paleta con equivalencias Pantone y CMYK" },
          { w: 988, h: 928, src: "/trabajo/don-neto-identidad/galeria/07-graficos.jpg", pie: "Repertorio gráfico de panes" },
        ],
      },
      {
        tipo: "completa",
        alto: "cuadro",
        imagen: {
          w: 1600,
          h: 1202,
          src: "/trabajo/don-neto-identidad/galeria/08-bolsa.jpg",
          video: "/trabajo/don-neto-identidad/galeria/08-bolsa.mp4",
          pie: "Bolsa de tela",
        },
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1151, h: 1081, src: "/trabajo/don-neto-identidad/galeria/09-patron.jpg", pie: "Patrón para empaque" },
          { w: 1503, h: 1679, src: "/trabajo/don-neto-identidad/galeria/10-papeleria.jpg", pie: "Papelería" },
        ],
      },
      {
        tipo: "completa",
        alto: "cuadro",
        imagen: {
          w: 1400,
          h: 1052,
          src: "/trabajo/don-neto-identidad/galeria/11-stickers.jpg",
          video: "/trabajo/don-neto-identidad/galeria/11-stickers.mp4",
          pie: "Stickers del sistema",
        },
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1368, h: 1172, src: "/trabajo/don-neto-identidad/galeria/12-vasos.jpg", pie: "Vasos para llevar" },
          { w: 1400, h: 960, src: "/trabajo/don-neto-identidad/galeria/13-pan.jpg", pie: "Papel de empaque en uso" },
        ],
      },

      {
        tipo: "texto",
        titulo: "Dirección",
        parrafos: [
          "Lo primero fue decidir mantener la ilustración del panadero, ya que justo representa esa tradición y tiene un gran peso en el reconocimiento de la marca.",
          "Lo que decidimos modificar fueron los colores y reducir el logo a lo más esencial, para que funcione en diferentes aplicaciones y reducciones. Además creamos sus letras totalmente a la medida.",
        ],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1066, h: 1600, src: "/trabajo/don-neto-identidad/galeria/14-foto-masa.jpg", pie: "Masa en charola, antes del horno" },
          { w: 1066, h: 1600, src: "/trabajo/don-neto-identidad/galeria/15-foto-glaseado.jpg", pie: "Pan glaseado recién salido" },
        ],
      },
      {
        tipo: "completa",
        imagen: { w: 1600, h: 1066, src: "/trabajo/don-neto-identidad/galeria/16-foto-horno.jpg", pie: "El horno tradicional, encendido" },
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1066, h: 1600, src: "/trabajo/don-neto-identidad/galeria/17-foto-reposo.jpg", pie: "Reposo en los anaqueles" },
          { w: 1066, h: 1600, src: "/trabajo/don-neto-identidad/galeria/18-foto-azucarado.jpg", pie: "Pan azucarado" },
        ],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1066, h: 1600, src: "/trabajo/don-neto-identidad/galeria/19-foto-baguettes.jpg", pie: "Baguettes del día" },
          { w: 1066, h: 1600, src: "/trabajo/don-neto-identidad/galeria/20-foto-roles.jpg", pie: "Roles de canela" },
        ],
      },
      {
        tipo: "completa",
        imagen: { w: 1600, h: 1066, src: "/trabajo/don-neto-identidad/galeria/21-foto-harina.jpg", pie: "Harina y masa, hecho a mano" },
      },
    ],
    cierre:
      "Este es un proyecto con alma y con mucha historia que tenía un gran potencial de ser contada. Trabajar y reestructurar la marca Don Neto fue un honor para ECI como estudio.",
    destacado: true,
    orden: 7,
    media: { tipo: "ninguno" },
    galeria: 0,
    demo: false,
  },

  /* ═══════════════════════════════════════════════════════════════
     MARCA · Minturina — MATERIAL REAL, CASI TODO EN VECTOR
     El sistema entero llegó en SVG: tarjeta, portada, reducciones,
     paleta y tipografías. Suman 40 KB y no se pixelean nunca.
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: "minturina-identidad",
    titulo: "Identidad Minturina",
    cliente: "Minturina",
    clienteId: "13_MINTURINA",
    categoria: "Joyería y bisutería",
    /* De las cuatro reducciones, la de fondo morado es la única con
       contraste contra el recuadro oscuro de la tarjeta. Dentro del
       caso ya no se enseña —es redundante con las de color—, pero
       aquí sigue siendo la que se lee. */
    logo: "/trabajo/minturina-identidad/logo.svg",
    logoLleno: true,
    portada: "/trabajo/minturina-identidad/portada.jpg",
    tarjeta: "/trabajo/minturina-identidad/tarjeta.svg",
    tarjetaHover: "/trabajo/minturina-identidad/tarjeta-hover.jpg",
    rubro: "marca",
    formato: "estatico",
    anio: 2024,
    /* RESUMEN PROPUESTO: el documento de textos no trae uno. Sale de
       describir lo que cuentan las secciones 1 y 3. */
    resumen:
      "Naming e identidad para una marca de joyería y bisutería que buscaba diferenciarse en una categoría llena de nombres iguales.",
    contexto: {
      titulo: "Sobre el proyecto",
      parrafos: [
        "Este proyecto llegó sin nombre y sin una voz clara, pero con un enfoque definido: mantener el concepto de lo elegante y delicado que se suele encontrar dentro de la categoría de joyería, y a la vez representar la creatividad y la energía con que se expresa cada creación.",
        "Es aquí donde surge Minturina.",
      ],
    },
    descripcion: [],
    servicios: ["identidad-completa"],
    metricas: [],
    /* El recorrido: las tarjetas y el producto abren, el sistema va en
       medio y el catálogo cierra. Dentro del sistema, los estampados
       van enfrentados —es la comparación la que los explica— y el
       bloque termina con las dos manos, a lo ancho. */
    modulos: [
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 2000, h: 1333, src: "/trabajo/minturina-identidad/galeria/01-tarjetas.jpg", pie: "Tarjetas de presentación" },
          { w: 2000, h: 1600, src: "/trabajo/minturina-identidad/galeria/02-tarjetas-lote.jpg", pie: "El tiraje completo" },
        ],
      },
      {
        tipo: "completa",
        alto: "cuadro",
        imagen: { w: 1600, h: 1200, src: "/trabajo/minturina-identidad/galeria/03-foto-pulseras.jpg", pie: "Pulseras en azul y dorado" },
      },

      {
        tipo: "texto",
        titulo: "Personalidad",
        parrafos: [
          "Minturina es un reflejo de los valores y del cómo aborda los proyectos la dueña del negocio, Mirna Vela.",
          "Es una marca cercana, divertida y comprometida con la calidad de cada una de sus piezas.",
        ],
      },
      {
        tipo: "completa",
        imagen: {
          w: 1600,
          h: 900,
          src: "/trabajo/minturina-identidad/galeria/04-logo-animado.jpg",
          video: "/trabajo/minturina-identidad/galeria/04-logo-animado.mp4",
          pie: "El logotipo escribiéndose",
        },
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1109, h: 1104, src: "/trabajo/minturina-identidad/galeria/05-reduccion-rosa.svg", pie: "Reducción en rosa" },
          { w: 1104, h: 1104, src: "/trabajo/minturina-identidad/galeria/06-reduccion-cyan.svg", pie: "Reducción en cian" },
        ],
      },
      {
        /* Enfrentados: es la comparación la que enseña el sistema,
           cada uno por su cuenta solo es un papel. */
        tipo: "cuadricula",
        imagenes: [
          { w: 1711, h: 2000, src: "/trabajo/minturina-identidad/galeria/07-estampado-cyan.jpg", pie: "Estampado en cian" },
          { w: 1711, h: 2000, src: "/trabajo/minturina-identidad/galeria/08-estampado-rosa.jpg", pie: "Estampado en rosa" },
        ],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1504, h: 1507, src: "/trabajo/minturina-identidad/galeria/09-colores.jpg", pie: "Paleta con sus valores" },
          { w: 1504, h: 1507, src: "/trabajo/minturina-identidad/galeria/10-tipografias.jpg", pie: "Voga y Open Sans" },
        ],
      },
      {
        tipo: "completa",
        imagen: { w: 1600, h: 900, src: "/trabajo/minturina-identidad/galeria/11-foto-manos.jpg", pie: "De una mano a otra" },
      },

      {
        tipo: "texto",
        titulo: "Dirección",
        parrafos: [
          "Decidimos alejarnos de los nombres más utilizados en este tipo de áreas, que suelen ser el nombre del fundador más la palabra joyería, para diferenciarnos.",
          "Es así como nace Minturina, evocando una palabra cercana a las terminaciones de algunos de los minerales que se utilizan para sus creaciones, como la aventurina.",
        ],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1066, h: 1600, src: "/trabajo/minturina-identidad/galeria/12-foto-ojos.jpg", pie: "Pulsera de ojos" },
          { w: 1066, h: 1600, src: "/trabajo/minturina-identidad/galeria/13-foto-pulsera.jpg", pie: "Pulsera en rojo" },
        ],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1067, h: 1600, src: "/trabajo/minturina-identidad/galeria/14-foto-ajuste.jpg", pie: "El ajuste, pieza por pieza" },
          { w: 1067, h: 1600, src: "/trabajo/minturina-identidad/galeria/15-foto-parejas.jpg", pie: "Piezas de a dos" },
        ],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1600, h: 1567, src: "/trabajo/minturina-identidad/galeria/16-foto-parque.jpg", pie: "En el parque" },
          { w: 1600, h: 1066, src: "/trabajo/minturina-identidad/galeria/17-foto-cancha.jpg", pie: "En la cancha" },
        ],
      },
    ],
    cierre:
      "Este proyecto nos hizo descubrir que una categoría como la joyería podía tener una personalidad divertida y fuerte, y demostrar a la vez la calidad y delicadeza de sus creaciones.",
    destacado: true,
    orden: 7,
    media: { tipo: "ninguno" },
    galeria: 0,
    demo: false,
  },

  /* ═══════════════════════════════════════════════════════════════
     MARCA · Shiny — el caso más largo hasta ahora
     Sistema, aplicaciones, piezas de diseño y una sesión de foto
     propia. 127 MB de origen en 3.5 MB.
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: "shiny-identidad",
    titulo: "Identidad Shiny",
    cliente: "Shiny",
    clienteId: "14_SHINY",
    categoria: "Limpieza de calzado",
    /* La reducción trae su propio fondo menta: llena la caja */
    logo: "/trabajo/shiny-identidad/logo.svg",
    logoLleno: true,
    portada: "/trabajo/shiny-identidad/portada.jpg",
    tarjeta: "/trabajo/shiny-identidad/tarjeta.jpg",
    tarjetaHover: "/trabajo/shiny-identidad/tarjeta-hover.jpg",
    rubro: "marca",
    formato: "estatico",
    anio: 2025,
    /* RESUMEN PROPUESTO: el documento de textos no trae uno. Sale de
       describir lo que cuentan las secciones 2 y 3. */
    resumen:
      "Identidad para un estudio de limpieza y detallado de calzado de alta gama, construida sobre el contraste entre la luz y la sombra.",
    contexto: {
      titulo: "Sobre el proyecto",
      parrafos: [
        "El proyecto de Shiny venía con un concepto y un lugar al cual se quería llegar muy claro; sin embargo, no había podido aterrizar esa identidad y forma de comunicar que tanto lo podía diferenciar.",
        "Apoyamos y co-creamos junto con Kevin, el dueño y creador de la marca, cada una de las piezas que poco a poco comenzaron a formar a Shiny desde dentro hacia fuera.",
      ],
    },
    descripcion: [],
    servicios: ["identidad-completa"],
    metricas: [],
    /* ORDEN PROPUESTO: este caso llegó sin ORDEN.txt. Las cajas se
       eligieron por la proporción nativa de cada archivo, para
       recortar lo menos posible. Las fotos cierran porque el tercer
       texto habla justo de cómo se iluminan. */
    modulos: [
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 2000, h: 1271, src: "/trabajo/shiny-identidad/galeria/01-tarjetas.jpg", pie: "Tarjetas de presentación" },
          { w: 2000, h: 1166, src: "/trabajo/shiny-identidad/galeria/02-privilege-pass.jpg", pie: "Privilege Pass" },
        ],
      },
      {
        tipo: "completa",
        imagen: { w: 1600, h: 900, src: "/trabajo/shiny-identidad/galeria/03-marca-puesta.jpg", pie: "La marca en el local" },
      },

      {
        tipo: "texto",
        titulo: "Personalidad",
        parrafos: [
          "Shiny es como el portero de una sala VIP: está al pendiente de cada detalle, es callado, se mueve entre las sombras y siempre cuida su imagen y su trato con los clientes que deja pasar.",
          "Se encarga de dar mantenimiento, tratar y restaurar pares de todo tipo, pero se especializa en detallado para calzado de alta gama.",
        ],
      },
      {
        tipo: "completa",
        imagen: { w: 1921, h: 1081, src: "/trabajo/shiny-identidad/galeria/04-reducciones.png", pie: "Logotipo y sus reducciones" },
      },
      {
        tipo: "completa",
        alto: "cuadro",
        imagen: { w: 2000, h: 1500, src: "/trabajo/shiny-identidad/galeria/05-logo-relieve.jpg", pie: "El logotipo en relieve" },
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1504, h: 1507, src: "/trabajo/shiny-identidad/galeria/06-colores.png", pie: "Paleta" },
          { w: 1505, h: 1507, src: "/trabajo/shiny-identidad/galeria/07-tipografias.png", pie: "Playball y Barlow" },
        ],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1504, h: 1507, src: "/trabajo/shiny-identidad/galeria/08-iconos.png", pie: "Sistema de iconos" },
          { w: 2000, h: 1500, src: "/trabajo/shiny-identidad/galeria/09-pines.jpg", pie: "Pines" },
        ],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 2000, h: 1333, src: "/trabajo/shiny-identidad/galeria/10-gorra.jpg", pie: "Gorra" },
          { w: 2000, h: 1333, src: "/trabajo/shiny-identidad/galeria/11-playera-clara.jpg", pie: "Playera clara" },
        ],
      },
      {
        tipo: "completa",
        imagen: { w: 2000, h: 1091, src: "/trabajo/shiny-identidad/galeria/12-uniforme.jpg", pie: "El uniforme en el estudio" },
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1998, h: 2000, src: "/trabajo/shiny-identidad/galeria/13-playera-oscura.jpg", pie: "Playera oscura" },
          { w: 1294, h: 2000, src: "/trabajo/shiny-identidad/galeria/14-invitacion.jpg", pie: "Invitación de apertura" },
        ],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1125, h: 2000, src: "/trabajo/shiny-identidad/galeria/15-menu.jpg", pie: "Menú de servicios" },
          { w: 1118, h: 2000, src: "/trabajo/shiny-identidad/galeria/16-menu-historia.jpg", pie: "El menú en historias" },
        ],
      },

      {
        tipo: "texto",
        titulo: "Dirección",
        parrafos: [
          "Una mezcla de speakeasy, lo industrial y la atención por los detalles fue la base de este proyecto. De ahí se desglosa una dirección que busca representar un contraste entre la luz —la limpieza— y las sombras —lo sucio—.",
          "Este concepto se repite tanto en la construcción del logo como en los gráficos y en la forma de iluminar las fotografías.",
        ],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1600, h: 1600, src: "/trabajo/shiny-identidad/galeria/17-foto-lavado.jpg", pie: "El lavado" },
          { w: 1600, h: 1600, src: "/trabajo/shiny-identidad/galeria/18-foto-cepillo.jpg", pie: "Cepillo y detalle" },
        ],
      },
      {
        tipo: "completa",
        alto: "cuadro",
        imagen: { w: 1600, h: 1200, src: "/trabajo/shiny-identidad/galeria/19-foto-agua.jpg", pie: "Agua sobre negro" },
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1273, h: 1600, src: "/trabajo/shiny-identidad/galeria/20-foto-pares.jpg", pie: "Pares en prueba" },
          { w: 1201, h: 1600, src: "/trabajo/shiny-identidad/galeria/21-foto-par-cenital.jpg", pie: "El par, desde arriba" },
        ],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1321, h: 1600, src: "/trabajo/shiny-identidad/galeria/22-foto-detalle.jpg", pie: "El detalle" },
          { w: 900, h: 1600, src: "/trabajo/shiny-identidad/galeria/23-foto-llavero.jpg", pie: "Terminado y entregado" },
        ],
      },
    ],
    cierre:
      "Este proyecto es un ejemplo de la atención al detalle y de cómo no solo de forma visual se genera una experiencia, sino también cuidando cada aspecto del recorrido del consumidor cuando está en contacto con la marca.",
    destacado: true,
    orden: 7,
    media: { tipo: "ninguno" },
    galeria: 0,
    demo: false,
  },

  /* ═══════════════════════════════════════════════════════════════
     MARCA · Desvelados — composición SOLO CUADRÍCULA
     El mismo sistema de módulos, usado en su versión más simple:
     puras imágenes, sin bloques de texto. Demuestra el punto 4 —
     el layout depende de lo que cada proyecto tenga que contar.
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: "desvelados-identidad",
    titulo: "Identidad Desvelados",
    cliente: "Desvelados",
    clienteId: "31_DESVELADOS",
    categoria: "Cafetería de especialidad",
    rubro: "marca",
    formato: "estatico",
    anio: 2025,
    resumen: "Una cafetería que abre de noche y necesitaba que eso se notara desde la fachada.",
    contexto: {
      titulo: "Una marca para las horas raras",
      parrafos: [
        "Desvelados abre cuando las demás cafeterías cierran. Su público no busca el ritual de la mañana sino el turno nocturno: estudiantes en examen, gente que sale tarde del trabajo, insomnes con laptop. La identidad tenía que decir eso sin explicarlo.",
      ],
    },
    descripcion: [],
    servicios: ["identidad-completa"],
    metricas: [],
    modulos: [
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 2400, h: 2400, pie: "Logotipo" },
          { w: 2400, h: 2400, pie: "Isotipo nocturno" },
        ],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 3000, h: 2000, pie: "Paleta" },
          { w: 2000, h: 2500, pie: "Tipografía aplicada" },
        ],
      },
      {
        tipo: "completa",
        imagen: { w: 3600, h: 2025, pie: "Fachada y letrero luminoso" },
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 2000, h: 3000, pie: "Vasos y sleeves" },
          { w: 3000, h: 2000, pie: "Carta de temporada" },
        ],
      },
    ],
    destacado: false,
    orden: 8,
    media: { tipo: "ninguno" },
    galeria: 0,
    demo: true,
  },

  /* ─── MARCA EXPRÉS ─── */
  /* ═══════════════════════════════════════════════════════════════
     MARCA EXPRÉS · cuatro proyectos

     Klevers lleva su propia maquetación —texturas y la presentación
     de ventas, que es el entregable— y las tres de Kevin comparten
     una: el antes y el después del logotipo, el sistema mínimo y las
     fotos que se fueron a la web.
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: "klevers-identidad-express",
    titulo: "Arranque de marca Klevers",
    cliente: "Klevers",
    clienteId: "15_KLEVERS",
    categoria: "Inversiones y finanzas",
    logo: "/trabajo/klevers-identidad-express/logo.svg",
    logoLleno: true,
    portada: "/trabajo/klevers-identidad-express/portada.jpg",
    tarjeta: "/trabajo/klevers-identidad-express/tarjeta.svg",
    tarjetaHover: "/trabajo/klevers-identidad-express/tarjeta-hover.jpg",
    rubro: "marca-express",
    formato: "estatico",
    anio: 2025,
    resumen: "Identidad exprés para realizar una presentación de ventas.",
    contexto: {
      titulo: "Sobre el proyecto",
      parrafos: [
        "El objetivo era crear una presentación de ventas que dejara ver de forma sencilla y elegante el modelo de negocio que propone la marca para invertir en ella.",
        "Llegaron sin un logo vectorizado ni una identidad de marca, y además con poco tiempo para tener la presentación lista. Nos enfocamos en lo más indispensable para cumplir ese objetivo.",
      ],
    },
    descripcion: [],
    servicios: ["identidad-express"],
    metricas: [],
    modulos: [
      {
        tipo: "completa",
        imagen: { w: 1921, h: 1081, src: "/trabajo/klevers-identidad-express/galeria/01-textura-1.jpg", pie: "La textura principal" },
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1505, h: 1506, src: "/trabajo/klevers-identidad-express/galeria/02-textura-2.jpg", pie: "Textura" },
          { w: 1504, h: 1506, src: "/trabajo/klevers-identidad-express/galeria/03-textura-3.jpg", pie: "Textura" },
        ],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1504, h: 1506, src: "/trabajo/klevers-identidad-express/galeria/04-textura-4.jpg", pie: "Textura" },
          { w: 1505, h: 1506, src: "/trabajo/klevers-identidad-express/galeria/05-textura-5.jpg", pie: "Textura" },
        ],
      },
      {
        tipo: "texto",
        titulo: "Dirección",
        parrafos: [
          "Lo principal a transmitir fue riqueza, pero desde un punto donde la abundancia y lo aspiracional fueran lo primero.",
          "Así elegimos un nuevo degradado de oro para el logo, texturas que juegan con la luz y unas tarjetas sólidas para presentar la información.",
        ],
      },
      /* La presentación cierra el caso y va a lo ancho, en orden: es
         el entregable, y una diapositiva se lee completa o no se lee. */
      {
        tipo: "completa",
        imagen: { w: 1920, h: 1080, src: "/trabajo/klevers-identidad-express/galeria/06-diapositiva-1.jpg", pie: "La presentación de ventas" },
      },
      {
        tipo: "completa",
        imagen: { w: 1920, h: 1080, src: "/trabajo/klevers-identidad-express/galeria/07-diapositiva-2.jpg" },
      },
      {
        tipo: "completa",
        imagen: { w: 1920, h: 1080, src: "/trabajo/klevers-identidad-express/galeria/08-diapositiva-3.jpg" },
      },
      {
        tipo: "completa",
        imagen: { w: 1920, h: 1080, src: "/trabajo/klevers-identidad-express/galeria/09-diapositiva-4.jpg" },
      },
      {
        tipo: "completa",
        imagen: { w: 1920, h: 1080, src: "/trabajo/klevers-identidad-express/galeria/10-diapositiva-5.jpg" },
      },
    ],
    destacado: true,
    orden: 8,
    media: { tipo: "ninguno" },
    galeria: 0,
    demo: false,
  },
  {
    slug: "aneu-identidad-express",
    titulo: "Identidad Aneu",
    cliente: "Aneu",
    clienteId: "16_KEVIN_EMPRESA_1",
    categoria: "Inversiones y finanzas",
    logo: "/trabajo/aneu-identidad-express/logo.svg",
    logoLleno: true,
    portada: "/trabajo/aneu-identidad-express/portada.jpg",
    tarjeta: "/trabajo/aneu-identidad-express/tarjeta.svg",
    tarjetaHover: "/trabajo/aneu-identidad-express/tarjeta-hover.jpg",
    rubro: "marca-express",
    formato: "estatico",
    anio: 2025,
    resumen:
      "Vectorización y creación de identidad exprés para lanzar la empresa a la web.",
    /* La portada es el logotipo terminado: se ve antes de leerlo */
    resumenDespuesDePortada: true,
    descripcion: [],
    servicios: ["identidad-express"],
    metricas: [],
    modulos: [
      {
        /* El antes y el después, enfrentados: es la comparación la que
           cuenta el trabajo, no cada uno por su lado. */
        tipo: "cuadricula",
        imagenes: [
          { w: 1504, h: 1507, src: "/trabajo/aneu-identidad-express/galeria/01-logo-antes.jpg", pie: "El logotipo como llegó" },
          { w: 1505, h: 1507, src: "/trabajo/aneu-identidad-express/galeria/02-logo-despues.jpg", pie: "El logotipo vectorizado" },
        ],
      },
      {
        tipo: "completa",
        imagen: { w: 1921, h: 1081, src: "/trabajo/aneu-identidad-express/galeria/03-reducciones.jpg", pie: "Reducciones" },
      },
      {
        tipo: "texto",
        titulo: "Sobre el proyecto",
        parrafos: ["Este proyecto surge de la necesidad de la empresa por crear una web para mantener su negocio de forma digital. Tenían un logo, pero faltaba todo lo demás.","Vectorizamos, seleccionamos colores y tipografías, y terminamos con la edición de las imágenes que después irían en la web."],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1505, h: 1506, src: "/trabajo/aneu-identidad-express/galeria/04-tipografias.jpg", pie: "Tipografías" },
          { w: 1504, h: 1506, src: "/trabajo/aneu-identidad-express/galeria/05-colores.jpg", pie: "Paleta" },
        ],
      },
      {
        tipo: "completa",
        imagen: { w: 1921, h: 1081, src: "/trabajo/aneu-identidad-express/galeria/06-fotografias.jpg", pie: "Las imágenes que fueron a la web" },
      },
    ],
    destacado: false,
    orden: 9,
    media: { tipo: "ninguno" },
    galeria: 0,
    demo: false,
  },
  {
    slug: "alis-identidad-express",
    titulo: "Identidad Alis",
    cliente: "Alis",
    clienteId: "17_KEVIN_EMPRESA_2",
    categoria: "Consultoría administrativa",
    logo: "/trabajo/alis-identidad-express/logo.svg",
    logoLleno: true,
    portada: "/trabajo/alis-identidad-express/portada.jpg",
    tarjeta: "/trabajo/alis-identidad-express/tarjeta.svg",
    tarjetaHover: "/trabajo/alis-identidad-express/tarjeta-hover.jpg",
    rubro: "marca-express",
    formato: "estatico",
    anio: 2025,
    resumen:
      "Vectorización y creación de identidad exprés para lanzar la empresa a la web.",
    /* La portada es el logotipo terminado: se ve antes de leerlo */
    resumenDespuesDePortada: true,
    descripcion: [],
    servicios: ["identidad-express"],
    metricas: [],
    modulos: [
      {
        /* El antes y el después, enfrentados: es la comparación la que
           cuenta el trabajo, no cada uno por su lado. */
        tipo: "cuadricula",
        imagenes: [
          { w: 1505, h: 1507, src: "/trabajo/alis-identidad-express/galeria/01-logo-antes.jpg", pie: "El logotipo como llegó" },
          { w: 1504, h: 1507, src: "/trabajo/alis-identidad-express/galeria/02-logo-despues.jpg", pie: "El logotipo vectorizado" },
        ],
      },
      {
        tipo: "completa",
        imagen: { w: 1921, h: 1081, src: "/trabajo/alis-identidad-express/galeria/03-reducciones.jpg", pie: "Variaciones del logotipo" },
      },
      {
        tipo: "texto",
        titulo: "Sobre el proyecto",
        parrafos: ["Este proyecto forma parte de una cadena de marcas que necesitaban una web para mantener su negocio de forma digital. Tenían un logo, pero faltaba todo lo demás.","Vectorizamos, seleccionamos colores y tipografías, y terminamos con la edición de las imágenes que después irían en la web."],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1504, h: 1506, src: "/trabajo/alis-identidad-express/galeria/04-tipografias.jpg", pie: "Tipografías" },
          { w: 1505, h: 1506, src: "/trabajo/alis-identidad-express/galeria/05-colores.jpg", pie: "Paleta" },
        ],
      },
      {
        tipo: "completa",
        imagen: { w: 1921, h: 1081, src: "/trabajo/alis-identidad-express/galeria/06-fotografias.jpg", pie: "Las imágenes que fueron a la web" },
      },
    ],
    destacado: false,
    orden: 10,
    media: { tipo: "ninguno" },
    galeria: 0,
    demo: false,
  },
  {
    slug: "emp-identidad-express",
    titulo: "Identidad EMP",
    cliente: "EMP",
    clienteId: "18_KEVIN_EMPRESA_3",
    categoria: "Proyectos electromecánicos",
    logo: "/trabajo/emp-identidad-express/logo.svg",
    logoLleno: true,
    portada: "/trabajo/emp-identidad-express/portada.jpg",
    tarjeta: "/trabajo/emp-identidad-express/tarjeta.svg",
    tarjetaHover: "/trabajo/emp-identidad-express/tarjeta-hover.jpg",
    rubro: "marca-express",
    formato: "estatico",
    anio: 2025,
    resumen:
      "Vectorización y creación de identidad exprés para lanzar la empresa a la web.",
    /* La portada es el logotipo terminado: se ve antes de leerlo */
    resumenDespuesDePortada: true,
    descripcion: [],
    servicios: ["identidad-express"],
    metricas: [],
    modulos: [
      {
        /* El antes y el después, enfrentados: es la comparación la que
           cuenta el trabajo, no cada uno por su lado. */
        tipo: "cuadricula",
        imagenes: [
          { w: 1504, h: 1507, src: "/trabajo/emp-identidad-express/galeria/01-logo-antes.jpg", pie: "El logotipo como llegó" },
          { w: 1504, h: 1507, src: "/trabajo/emp-identidad-express/galeria/02-logo-despues.jpg", pie: "El logotipo vectorizado" },
        ],
      },
      {
        tipo: "completa",
        imagen: { w: 1921, h: 1081, src: "/trabajo/emp-identidad-express/galeria/03-reducciones.jpg", pie: "Reducciones" },
      },
      {
        tipo: "texto",
        titulo: "Sobre el proyecto",
        parrafos: ["Este proyecto forma parte de una cadena de marcas que necesitaban una web para mantener su negocio de forma digital. Tenían un logo, pero faltaba todo lo demás.","Vectorizamos, seleccionamos colores y tipografías, y terminamos con la edición de las imágenes que después irían en la web."],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1504, h: 1506, src: "/trabajo/emp-identidad-express/galeria/04-tipografias.jpg", pie: "Tipografías" },
          { w: 1504, h: 1506, src: "/trabajo/emp-identidad-express/galeria/05-colores.jpg", pie: "Paleta" },
        ],
      },
      {
        tipo: "completa",
        imagen: { w: 1921, h: 1081, src: "/trabajo/emp-identidad-express/galeria/06-fotografias.jpg", pie: "Las imágenes que fueron a la web" },
      },
    ],
    cierre: "Fueron más de diez proyectos para crear la identidad y los recursos de estas marcas en menos de un mes. Adaptamos los procesos y los esfuerzos para poner atención en lo que era más importante, y así lograrlo.",
    destacado: false,
    orden: 11,
    media: { tipo: "ninguno" },
    galeria: 0,
    demo: false,
  },

  /* ═══════════════════════════════════════════════════════════════
     FOTO · Athípico — PRIMERA PIEZA CON MATERIAL REAL

     Los textos son una PROPUESTA, escrita a partir de las imágenes.
     Elihu los reescribe con lo que realmente se acordó con el cliente.
     ═══════════════════════════════════════════════════════════════ */
  {
    slug: "athipico-producto",
    titulo: "Antes de la taza",
    cliente: "Athípico",
    clienteId: "01_ATHIPICO",
    categoria: "Café de especialidad",
    rubro: "foto",
    formato: "estatico",
    anio: 2025,
    resumen:
      "La molienda, la extracción y el vertido, fotografiados con la misma precisión con que se ejecutan.",
    portada: "/trabajo/athipico-producto/portada.jpg",
    tarjeta: "/trabajo/athipico-producto/tarjeta.jpg",
    tarjetaHover: "/trabajo/athipico-producto/tarjeta-hover.jpg",
    contexto: {
      titulo: "El precio se explica solo si se ve",
      parrafos: [
        "Un café de especialidad cuesta el doble que uno de cadena, y esa diferencia vive en pasos que el cliente nunca alcanza a ver: la molienda al gramo, la distribución pareja, los segundos exactos de extracción. Athípico necesitaba mostrar ese trabajo sin caer en el catálogo de producto.",
        "La sesión se resolvió como una secuencia de proceso y no como fotos sueltas: cada imagen es un momento del ritual, en el orden en que ocurre. La luz se mantuvo cálida y baja para que el metal y la madera conservaran su textura, y el fondo se dejó siempre fuera de foco para que nunca compitiera con las manos.",
      ],
    },
    descripcion: [],
    servicios: ["fotografia"],
    metricas: [],
    /* CRÉDITOS DE EJEMPLO — nombres y enlaces inventados, para ver el
       diseño. Sustituir por el equipo real de la sesión. */
    colaboradores: [
      { nombre: "Elihu Arrieta", rol: "Dirección y fotografía", url: "https://instagram.com/eci.estudio" },
      { nombre: "Nombre por definir", rol: "Asistencia de set" },
      { nombre: "Nombre por definir", rol: "Retoque digital", url: "https://behance.net/" },
    ],
    modulos: [
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1287, h: 2000, src: "/trabajo/athipico-producto/galeria/01.jpg", pie: "El resultado, antes de contar cómo se llega" },
          { w: 1333, h: 2000, src: "/trabajo/athipico-producto/galeria/04.jpg", pie: "Dosificación al portafiltro" },
        ],
      },
      {
        tipo: "texto",
        titulo: "La molienda es la mitad del café",
        parrafos: [
          "El primer bloque de la secuencia se dedica al molino porque es donde se decide casi todo: el grosor, el peso exacto, la distribución dentro del portafiltro. Es también el paso menos vistoso, así que se fotografió en plano cerrado para que la textura del café molido cargara la imagen.",
        ],
        imagen: { w: 1333, h: 2000, src: "/trabajo/athipico-producto/galeria/05.jpg", pie: "Molienda lista, antes del prensado" },
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1333, h: 2000, src: "/trabajo/athipico-producto/galeria/06.jpg", pie: "Extracción" },
          { w: 1333, h: 2000, src: "/trabajo/athipico-producto/galeria/07.jpg", pie: "Los primeros segundos, en detalle" },
        ],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1333, h: 2000, src: "/trabajo/athipico-producto/galeria/08.jpg", pie: "Vaporizado de la leche" },
          { w: 1333, h: 2000, src: "/trabajo/athipico-producto/galeria/09.jpg", pie: "La jarra, lista para verter" },
        ],
      },
      {
        tipo: "texto",
        titulo: "El vertido es lo que la gente fotografía",
        parrafos: [
          "El arte latte es el único paso que el cliente sí ve, y el que termina en redes. Se cubrió con dos tomas: el vertido en movimiento y la taza ya terminada, para que la marca tenga una imagen de proceso y otra de producto sin volver a montar el set.",
        ],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1390, h: 2000, src: "/trabajo/athipico-producto/galeria/10.jpg", pie: "El vertido" },
          { w: 1333, h: 2000, src: "/trabajo/athipico-producto/galeria/11.jpg", pie: "Taza terminada" },
        ],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1333, h: 2000, src: "/trabajo/athipico-producto/galeria/02.jpg", pie: "Bebida fría de temporada" },
          { w: 1333, h: 2000, src: "/trabajo/athipico-producto/galeria/03.jpg", pie: "Integrado frente al cliente" },
        ],
      },
    ],
    destacado: true,
    orden: 9,
    media: { tipo: "ninguno" },
    galeria: 0,
    demo: true,
  },

  /* ─── FOTO ─── */
  {
    slug: "desvelados-producto-otono",
    titulo: "Producto de temporada",
    cliente: "Desvelados",
    clienteId: "31_DESVELADOS",
    categoria: "Cafetería de especialidad",
    campana: "otono-2025",
    rubro: "foto",
    formato: "estatico",
    anio: 2025,
    resumen: "Las mismas tres bebidas del reel, en fijo, para carta y catálogo.",
    contexto: {
      titulo: "Aprovechar el set que ya estaba montado",
      parrafos: [
        "Se aprovechó el mismo día de grabación del contenido vertical: las luces ya estaban montadas y el barista ya estaba en set, así que la sesión de foto costó medio día adicional en vez de una jornada completa.",
        "La secuencia sigue el orden narrativo del manual: general del set, media distancia con las manos en cuadro, y cierre en detalle de textura.",
      ],
    },
    descripcion: [],
    servicios: ["fotografia"],
    metricas: [],
    /* Las medidas son las que pide el manual para galería de foto:
       lado largo 2000 px. La mezcla de horizontales, verticales y
       cuadradas es a propósito — así se ve la diferencia entre el
       recorte del layout y la foto completa en el visor. */
    modulos: [
      {
        tipo: "completa",
        imagen: { w: 2000, h: 1333, pie: "General del set" },
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1333, h: 2000, pie: "Thai Latte" },
          { w: 1333, h: 2000, pie: "Chisme Matcha" },
        ],
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 2000, h: 1333, pie: "Detalle de vertido" },
          { w: 2000, h: 2000, pie: "Textura de espuma" },
        ],
      },
    ],
    destacado: false,
    orden: 10,
    media: { tipo: "ninguno" },
    galeria: 0,
    demo: true,
  },

  /* ─── DISEÑO ─── */
  {
    slug: "acrilexsa-catalogo-industrial",
    titulo: "Catálogo industrial Acrilexsa",
    cliente: "Acrilexsa",
    clienteId: "15_ACRILEXSA",
    categoria: "Manufactura industrial",
    rubro: "diseno",
    formato: "estatico",
    anio: 2026,
    resumen: "Fichas técnicas que un vendedor puede usar en el celular, frente al cliente.",
    contexto: {
      titulo: "Del PDF de 40 páginas a la ficha suelta",
      parrafos: [
        "El catálogo anterior era un PDF pensado para imprimirse. Nadie lo imprimía y en el teléfono era ilegible, así que el equipo de ventas terminaba mandando fotos sueltas por WhatsApp y perdiendo la consistencia de marca en el camino.",
      ],
    },
    descripcion: [],
    servicios: ["identidad-completa"],
    metricas: [],
    modulos: [
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1600, h: 2000, pie: "Ficha de producto" },
          { w: 1600, h: 2000, pie: "Reverso técnico" },
        ],
      },
      {
        tipo: "completa",
        imagen: { w: 3000, h: 1688, pie: "La serie completa" },
      },
    ],
    destacado: false,
    orden: 11,
    media: { tipo: "ninguno" },
    galeria: 0,
    demo: true,
  },

  /* ─── WEB ─── */
  {
    slug: "tecmi-landing-campus",
    titulo: "Landing de campus",
    cliente: "Tecmi",
    clienteId: "03_TECMI",
    categoria: "Educación",
    rubro: "web",
    formato: "estatico",
    anio: 2026,
    resumen: "Una sola página con un solo trabajo: que agenden la visita.",
    contexto: {
      titulo: "Un objetivo por página",
      parrafos: [
        "La campaña de pauta llevaba tráfico a la página institucional, donde el visitante se perdía entre siete secciones antes de encontrar el formulario. La tasa de rebote lo decía todo.",
        "Se construyó una landing de una sola página, desplegada en Vercel, con un único objetivo de conversión y el botón de agenda visible en todo momento.",
      ],
    },
    descripcion: [],
    servicios: ["landing-express"],
    metricas: [],
    modulos: [
      {
        tipo: "completa",
        imagen: { w: 2560, h: 1440, pie: "Vista de escritorio" },
      },
      {
        tipo: "cuadricula",
        imagenes: [
          { w: 1170, h: 2532, pie: "Móvil · inicio" },
          { w: 1170, h: 2532, pie: "Móvil · formulario" },
        ],
      },
    ],
    destacado: false,
    orden: 12,
    media: { tipo: "ninguno" },
    galeria: 0,
    demo: true,
  },
];

/* ── Rubros ocultos en este primer lanzamiento ──
   No se borra nada: las piezas siguen en el archivo y su ficha queda
   intacta. Solo desaparecen de los listados, del menú de filtros y de
   las rutas generadas. Para volver a mostrarlas basta con sacar el
   rubro de esta lista. */
/* Rubros que existen en el modelo pero no se enseñan todavía. El
   audiovisual comercial se apaga a propósito: las piezas están, pero
   el estudio prefiere no ofrecerlo por ahora. */
export const RUBROS_OCULTOS: Rubro[] = ["web", "diseno", "comercial"];

export const esVisible = (p: Pieza) => !RUBROS_OCULTOS.includes(p.rubro);

/* Todas las piezas publicables. Es la lista que deben usar los
   listados; PIEZAS queda como archivo completo. */
export const visibles = () => PIEZAS.filter(esVisible).sort((a, b) => a.orden - b.orden);

export const piezasPorRubro = (r: Rubro | "todos") =>
  visibles().filter((p) => r === "todos" || p.rubro === r);

export const reels = () =>
  visibles().filter((p) => p.rubro === "reels");

export const piezaPorSlug = (slug: string) => PIEZAS.find((p) => p.slug === slug);

export const rubrosActivos = () =>
  RUBROS.filter(
    (r) => !RUBROS_OCULTOS.includes(r.id) && PIEZAS.some((p) => p.rubro === r.id)
  );

/* Las secciones que hoy tienen algo que enseñar: se descartan las de
   rubros ocultos y las que quedarían vacías. */
export const seccionesActivas = () =>
  SECCIONES.map((sec) => ({
    ...sec,
    rubros: sec.rubros.filter((r) => !RUBROS_OCULTOS.includes(r)),
  })).filter(
    (sec) => sec.rubros.length > 0 && PIEZAS.some((p) => sec.rubros.includes(p.rubro))
  );

/* Los reels separados por técnica, que es como los divide el feed */
export const reelsPorTecnica = (t?: Tecnica) =>
  reels().filter((p) => !t || (p.tecnica ?? "live-action") === t);

export const otrasDelCliente = (p: Pieza) =>
  visibles().filter((o) => o.clienteId === p.clienteId && o.slug !== p.slug);

/* Iniciales para el monograma que sustituye al logo mientras no
   tengamos el SVG del cliente. */
export const iniciales = (nombre: string) =>
  nombre
    .replace(/[^\p{L}\s·]/gu, "")
    .split(/[\s·]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
