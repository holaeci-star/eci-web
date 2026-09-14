/* Configuración del sitio y catálogo de servicios.
   Los textos salen del Documento Maestro de Identidad de Marca (v2,
   22 ago 2026), de ECI — Paquetes de Servicios (Base) y de INFO
   GENERAL ECI, que es el que fijó los datos de contacto reales y los
   nombres con los que se anuncian hoy los servicios.
   Equivale al documento `configuracionSitio` del CMS. */

export const SITIO = {
  nombre: "ECI",
  nombreLargo: "Espacio de Creación e Innovación",

  // Tagline favorita del documento de identidad, sección 03.
  tagline: "El talento que empieza haciendo crecer negocios reales",
  taglineCorta: "Lo justo para resultados grandes",

  // Del manifiesto citado en la Alineación.
  manifiesto:
    "Existimos porque tenemos la misión de conectar, de comenzar a crear en comunidad y de crecer juntos.",

  // Propuesta de valor, sección 01.
  promesa:
    "Conectamos negocios que están creciendo con creativos que están empezando. Los negocios obtienen contenido de calidad a un precio que pueden costear; los creativos ganan experiencia real, pagada, con equipo profesional.",

  personalidad: ["Transparente", "Detallista", "Cercana", "Tecnológica", "Eficiente"],

  /* Datos reales de contacto. El teléfono se guarda en dos formas: la
     que se lee y la que se marca. wa.me y los enlaces tel: piden el
     número corrido con lada de país, y armarlo con un replace en cada
     página era una forma discreta de equivocarse. */
  correo: "hola.eci@gmail.com",
  telefono: "614 369 2987",
  telefonoE164: "+526143692987",
  instagram: "@eci.estudio",
  instagramUrl: "https://www.instagram.com/eci.estudio/",
  facebookUrl: "https://www.facebook.com/profile.php?id=61593985541605",
  // PENDIENTE de confirmar: la lada 614 es de Chihuahua.
  ciudad: "Chihuahua, México",
};

/* Introducción de la página de Servicios. Es de las pocas frases que
   dice en voz alta cómo se trabaja —el paquete es un punto de
   partida, no un menú cerrado—, así que vive junto al catálogo. */
export const INTRO_SERVICIOS =
  "Conectamos la necesidad de cada negocio con las soluciones que podemos crear e implementar. Estos paquetes son una guía de lo que podemos hacer, pero nos gusta entender a cada cliente y ver qué solución le queda a lo que necesita.";

export type Servicio = {
  id: string;
  /* El nombre con el que se anuncia la familia del servicio. Antes
     eran letras —Pilar A, Pilar C1— que solo significaban algo dentro
     del documento de paquetes. Dos servicios pueden compartir familia:
     las dos identidades van bajo "Identidad", y ahí el orden de la
     lista es la jerarquía. */
  familia: string;
  nombre: string;
  promesa: string;
  paraQuien: string;
  incluye: string[];
  noIncluye: string[];
  rubro: string;
  acento: "menta" | "naranja" | "azul";
};

/* El orden de esta lista es el orden en que se enseñan, y dentro de
   una familia es también su jerarquía: la identidad completa va antes
   que la exprés porque es la que se quiere vender.

   Los precios salieron del sitio por completo. La conversación de
   dinero se abre en el contacto, cuando ya se sabe qué necesita el
   cliente; un "desde tanto" en la portada la cierra antes de
   abrirla. Siguen vivos en el documento de paquetes. */
export const SERVICIOS: Servicio[] = [
  {
    id: "contenido-vertical",
    familia: "Visualiza",
    nombre: "Contenido Vertical",
    promesa:
      "Es el pilar para mantenerse visible: producción, grabación y edición de redes.",
    paraQuien:
      "Marcas personales, profesionistas independientes y clínicas que necesitan volumen constante de contenido vertical.",
    incluye: [
      "1 día (o medio día) de grabación, en locación del cliente o en espacio de ECI",
      "6 a 8 Reels o TikToks editados a partir de esa grabación",
      "Etalonaje de color y diseño sonoro en cada pieza",
      "Subtítulos dinámicos integrados",
      "Guion base y escaleta, dirigidos por ECI el día de la grabación",
      "2 rondas de ajustes menores por lote",
    ],
    noIncluye: [
      "Pauta y calendario de publicación",
      "Casting, actuación o vestuario de terceros",
      "Grabación fuera del área metropolitana",
    ],
    rubro: "reels",
    acento: "menta",
  },
  {
    id: "audiovisual-comercial",
    familia: "Eleva",
    nombre: "Audiovisual Comercial",
    promesa:
      "Ideal para lanzamientos de campaña o para compaginar con pago de pauta.",
    paraQuien:
      "Empresas sólidas, campañas de publicidad, videos de lanzamiento o piezas para la portada de un sitio.",
    incluye: [
      "Sesiones de grabación para la pieza comercial",
      "Edición de 1 video de 1 a 3 minutos",
      "Guion narrativo y guion técnico con storyboard, para aprobación",
      "B-roll",
      "Colorización y diseño sonoro avanzado",
    ],
    noIncluye: [
      "Crew ampliado (gaffer, sonidista dedicado, segunda cámara)",
      "Casting profesional o derechos de imagen de terceros",
    ],
    rubro: "comercial",
    acento: "naranja",
  },
  {
    id: "identidad-completa",
    familia: "Identidad",
    nombre: "Identidad de Marca Completa",
    promesa:
      "Aterrizamos tu negocio-idea y lo convertimos en una marca sólida y diferenciadora. Incluye desarrollo de concepto, desarrollo visual, manual y aplicaciones.",
    paraQuien:
      "PyMEs establecidas, corporativos y clínicas que necesitan una marca pensada desde la raíz.",
    incluye: [
      "Logotipo con variaciones: principal, isotipo, horizontal y negativo",
      "Manual de marca: uso del logo, paleta, tipografía, iconografía y aplicaciones",
      "Definición de tono y voz de comunicación",
      "3 mockups comerciales aplicados según el giro",
      "Papelería base: tarjetas, membretado y firma de correo",
    ],
    noIncluye: [
      "Impresión física de la papelería",
      "Estrategia de mercadotecnia o pauta",
      "Rondas de revisión ilimitadas",
    ],
    rubro: "marca",
    acento: "naranja",
  },
  {
    id: "identidad-express",
    familia: "Identidad",
    nombre: "Identidad de Marca Exprés",
    promesa:
      "Verse profesional en un periodo de tiempo corto y con un presupuesto menor. Ideal para lanzamientos de marca que quieran verse profesionales lo antes posible.",
    paraQuien:
      "Emprendedores nuevos, consultores o doctores que recién abren redes.",
    incluye: [
      "Vectorización del logotipo existente, con reducciones para avatar",
      "Si no hay logo: un wordmark simple",
      "Paleta de color",
      "2 familias tipográficas para redes",
      "Diseño del primer post destacado",
      "Set de iconos para historias",
    ],
    noIncluye: [
      "Manual de marca ni tono de voz redactado",
      "Papelería impresa o señalética",
      "Exploración abierta de conceptos de logo",
    ],
    rubro: "marca-express",
    acento: "azul",
  },
  {
    id: "fotografia",
    familia: "Documenta & Profesionaliza",
    nombre: "Fotografía de marca & eventos",
    promesa:
      "Ya sea para fotos de perfiles, portafolio, contenido mensual o documentar lo que sucede en un evento, nos encargamos de registrar el momento.",
    paraQuien:
      "Doctores, CEOs y marcas personales; también fotografía de producto y cobertura de eventos.",
    incluye: [
      "Sesión de medio día en el espacio del cliente o en el evento",
      "15 a 20 fotos retocadas",
      "Retratos corporativos tipo headshot",
      "B-roll fotográfico del cliente en su espacio",
    ],
    noIncluye: [
      "Locación externa o de estudio",
      "Maquillaje y peinado profesional",
      "Retoque avanzado pieza por pieza",
    ],
    rubro: "foto",
    acento: "menta",
  },
];

/* Los servicios agrupados por familia, en el orden del catálogo. Es
   como se leen en la portada: el nombre de la familia y debajo lo que
   incluye, que en el caso de Identidad son dos niveles. */
export const FAMILIAS = SERVICIOS.reduce<
  { familia: string; servicios: Servicio[] }[]
>((acc, s) => {
  const ya = acc.find((f) => f.familia === s.familia);
  if (ya) ya.servicios.push(s);
  else acc.push({ familia: s.familia, servicios: [s] });
  return acc;
}, []);
