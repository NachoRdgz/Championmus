import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const jornadas = [
  [
    ["Nico y Alex", "Florido y Diego"],
    ["Juli y Enrique", "Serra y Gallardo"],
    ["Agraz y Chulo", "Andrés y Oscar"],
    ["Javi y Canal", "Diego y Rafa"],
    ["Miguel y Seijas", "Arévalo y Rubén"],
    ["Zopeque y Pareja", "Jorge y Nacho"]
  ],
  [
    ["Nico y Alex", "Serra y Gallardo"],
    ["Jorge y Nacho", "Miguel y Seijas"],
    ["Juli y Enrique", "Diego y Rafa"],
    ["Florido y Diego", "Agraz y Chulo"],
    ["Javi y Canal", "Arévalo y Rubén"],
    ["Andrés y Oscar", "Zopeque y Pareja"]
  ],
  [
    ["Miguel y Seijas", "Javi y Canal"],
    ["Jorge y Nacho", "Andrés y Oscar"],
    ["Florido y Diego", "Zopeque y Pareja"],
    ["Arévalo y Rubén", "Juli y Enrique"],
    ["Diego y Rafa", "Nico y Alex"],
    ["Serra y Gallardo", "Agraz y Chulo"]
  ],
  [
    ["Juli y Enrique", "Miguel y Seijas"],
    ["Florido y Diego", "Andrés y Oscar"],
    ["Agraz y Chulo", "Diego y Rafa"],
    ["Nico y Alex", "Arévalo y Rubén"],
    ["Serra y Gallardo", "Zopeque y Pareja"],
    ["Javi y Canal", "Jorge y Nacho"]
  ],
  [
    ["Arévalo y Rubén", "Agraz y Chulo"],
    ["Serra y Gallardo", "Andrés y Oscar"],
    ["Florido y Diego", "Jorge y Nacho"],
    ["Diego y Rafa", "Zopeque y Pareja"],
    ["Juli y Enrique", "Javi y Canal"],
    ["Nico y Alex", "Miguel y Seijas"]
  ],
  [
    ["Nico y Alex", "Javi y Canal"],
    ["Zopeque y Pareja", "Arévalo y Rubén"],
    ["Miguel y Seijas", "Agraz y Chulo"],
    ["Andrés y Oscar", "Diego y Rafa"],
    ["Florido y Diego", "Serra y Gallardo"],
    ["Juli y Enrique", "Jorge y Nacho"]
  ],
  [
    ["Nico y Alex", "Jorge y Nacho"],
    ["Diego y Rafa", "Serra y Gallardo"],
    ["Agraz y Chulo", "Juli y Enrique"],
    ["Miguel y Seijas", "Andrés y Oscar"],
    ["Florido y Diego", "Arévalo y Rubén"],
    ["Javi y Canal", "Zopeque y Pareja"]
  ],
  [
    ["Javi y Canal", "Agraz y Chulo"],
    ["Diego y Rafa", "Florido y Diego"],
    ["Arévalo y Rubén", "Andrés y Oscar"],
    ["Juli y Enrique", "Nico y Alex"],
    ["Miguel y Seijas", "Zopeque y Pareja"],
    ["Jorge y Nacho", "Serra y Gallardo"]
  ],
  [
    ["Nico y Alex", "Agraz y Chulo"],
    ["Javi y Canal", "Andrés y Oscar"],
    ["Miguel y Seijas", "Florido y Diego"],
    ["Jorge y Nacho", "Diego y Rafa"],
    ["Arévalo y Rubén", "Serra y Gallardo"],
    ["Juli y Enrique", "Zopeque y Pareja"]
  ],
  [
    ["Andrés y Oscar", "Juli y Enrique"],
    ["Nico y Alex", "Zopeque y Pareja"],
    ["Serra y Gallardo", "Miguel y Seijas"],
    ["Diego y Rafa", "Arévalo y Rubén"],
    ["Agraz y Chulo", "Jorge y Nacho"],
    ["Javi y Canal", "Florido y Diego"]
  ],
  [
    ["Agraz y Chulo", "Zopeque y Pareja"],
    ["Diego y Rafa", "Miguel y Seijas"],
    ["Arévalo y Rubén", "Jorge y Nacho"],
    ["Serra y Gallardo", "Javi y Canal"],
    ["Juli y Enrique", "Florido y Diego"],
    ["Nico y Alex", "Andrés y Oscar"]
  ]
];


const equipos = Array.from(new Set(
  jornadas.flatMap(jornada => 
    jornada.flatMap(partido => partido)
  )
));

const inicializarResultadosVacios = () => {
  return Array(11).fill(null).map(() => 
    Array(6).fill(null).map(() => 
      Array(3).fill(null).map(() => ({
        local: 0,
        visitante: 0
      }))
    )
  );
};

const premios = {
  oro: {
    primero: "Trofeos + 100€ por jugador",
    segundo: "50€ por jugador"
  },
  plata: {
    primero: "Trofeos + 30€ por jugador",
    segundo: "10€ por jugador"
  },
  bronce: {
    primero: "Trofeos + 10€ por jugador",
    segundo: "Juego de tapete y cartas por jugador"
  }
};

const ClasificacionYCopas = ({ resultados = inicializarResultadosVacios() }) => {
  const resultadosValidos = Array.isArray(resultados) ? resultados : inicializarResultadosVacios();

  const calcularEstadisticas = () => {
    const stats = {};
  
    equipos.forEach(equipo => {
      stats[equipo] = {
        nombre: equipo,
        partidosJugados: 0,
        partidosGanados: 0,
        partidosPerdidos: 0,
        vacasGanadas: 0,
        vacasPerdidas: 0,
        juegosGanados: 0,
        juegosPerdidos: 0
      };
    });
  
    resultadosValidos.forEach((jornada, jornadaIndex) => {
      if (!Array.isArray(jornada)) return;
  
      jornada.forEach((partido, partidoIndex) => {
        if (!Array.isArray(partido)) return;
        
        const local = jornadas[jornadaIndex]?.[partidoIndex]?.[0];
        const visitante = jornadas[jornadaIndex]?.[partidoIndex]?.[1];
  
        if (!local || !visitante) return;
  
        let vacasLocal = 0;
        let vacasVisitante = 0;
        let juegosLocal = 0;
        let juegosVisitante = 0;
  
        partido.forEach(vaca => {
          if (!vaca) return;
          
          if (vaca.local > vaca.visitante) {
            vacasLocal++;
            juegosLocal += vaca.local;
            juegosVisitante += vaca.visitante;
          } else if (vaca.visitante > vaca.local) {
            vacasVisitante++;
            juegosLocal += vaca.local;
            juegosVisitante += vaca.visitante;
          }
        });
  
        if (partido.some(vaca => vaca?.local > 0 || vaca?.visitante > 0)) {
          stats[local].partidosJugados++;
          stats[local].vacasGanadas += vacasLocal;
          stats[local].vacasPerdidas += vacasVisitante;
          stats[local].juegosGanados += juegosLocal;
          stats[local].juegosPerdidos += juegosVisitante;
          if (vacasLocal > vacasVisitante) {
            stats[local].partidosGanados++;
          } else if (vacasLocal < vacasVisitante) {
            stats[local].partidosPerdidos++;
          }
  
          stats[visitante].partidosJugados++;
          stats[visitante].vacasGanadas += vacasVisitante;
          stats[visitante].vacasPerdidas += vacasLocal;
          stats[visitante].juegosGanados += juegosVisitante;
          stats[visitante].juegosPerdidos += juegosLocal;
          if (vacasVisitante > vacasLocal) {
            stats[visitante].partidosGanados++;
          } else if (vacasVisitante < vacasLocal) {
            stats[visitante].partidosPerdidos++;
          }
        }
      });
    });
  
    return Object.values(stats);
  };

  const obtenerEnfrentamientoDirecto = (equipo1, equipo2) => {
    let resultado = null;
    
    for (let jornadaIndex = 0; jornadaIndex < jornadas.length; jornadaIndex++) {
      const jornada = jornadas[jornadaIndex];
      const partidoIndex = jornada.findIndex(partido => 
        (partido[0] === equipo1 && partido[1] === equipo2) ||
        (partido[0] === equipo2 && partido[1] === equipo1)
      );

      if (partidoIndex !== -1) {
        const partido = resultadosValidos[jornadaIndex]?.[partidoIndex];
        if (partido && partido.some(vaca => vaca.local > 0 || vaca.visitante > 0)) {
          const esLocal = jornadas[jornadaIndex][partidoIndex][0] === equipo1;
          let vacasEquipo1 = 0;
          let vacasEquipo2 = 0;

          partido.forEach(vaca => {
            if (esLocal) {
              if (vaca.local > vaca.visitante) vacasEquipo1++;
              else if (vaca.visitante > vaca.local) vacasEquipo2++;
            } else {
              if (vaca.local > vaca.visitante) vacasEquipo2++;
              else if (vaca.visitante > vaca.local) vacasEquipo1++;
            }
          });

          resultado = {
            jugado: true,
            vacasEquipo1,
            vacasEquipo2
          };
          break;
        }
      }
    }
    
    return resultado || { jugado: false, vacasEquipo1: 0, vacasEquipo2: 0 };
  };

  const ordenarEquipos = (equipos) => {
    return equipos.sort((a, b) => {
      // Si tienen diferentes victorias, ordenar por victorias
      if (b.partidosGanados !== a.partidosGanados) {
        return b.partidosGanados - a.partidosGanados;
      }

      // Si hay empate a victorias entre dos equipos, revisar el enfrentamiento directo
      if (equipos.filter(e => e.partidosGanados === a.partidosGanados).length === 2) {
        const enfrentamiento = obtenerEnfrentamientoDirecto(a.nombre, b.nombre);
        if (enfrentamiento.jugado) {
          if (enfrentamiento.vacasEquipo1 !== enfrentamiento.vacasEquipo2) {
            return enfrentamiento.vacasEquipo2 - enfrentamiento.vacasEquipo1;
          }
        }
      }

      // Si no hay enfrentamiento directo o hay más de dos equipos empatados,
      // seguir con los criterios existentes
      const difVacasA = a.vacasGanadas - a.vacasPerdidas;
      const difVacasB = b.vacasGanadas - b.vacasPerdidas;
      if (difVacasB !== difVacasA) {
        return difVacasB - difVacasA;
      }

      const difJuegosA = a.juegosGanados - a.juegosPerdidos;
      const difJuegosB = b.juegosGanados - b.juegosPerdidos;
      if (difJuegosB !== difJuegosA) {
        return difJuegosB - difJuegosA;
      }

      // Si sigue el empate, por vacas ganadas
      if (b.vacasGanadas !== a.vacasGanadas) {
        return b.vacasGanadas - a.vacasGanadas;
      }

      // Si sigue el empate, por juegos ganados
      return b.juegosGanados - a.juegosGanados;
    });
  };

  const estadisticas = ordenarEquipos(calcularEstadisticas());

  const BracketCopa = ({ equipos, titulo, premios, backgroundColor }) => (
    <Card className="mb-8">
      <CardHeader className={`${backgroundColor} text-white rounded-t-lg`}>
        <CardTitle className="text-xl font-bold">{titulo}</CardTitle>
        <div className="text-sm mt-2">
          <p>🏆 1º Clasificado: {premios.primero}</p>
          <p>🥈 2º Clasificado: {premios.segundo}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-semibold mb-4">Semifinales</h3>
            <div className="space-y-4">
              <div className="border rounded p-3">
                <div className="font-medium">{equipos[0]?.nombre || 'Por determinar'}</div>
                <div className="text-gray-500">vs</div>
                <div className="font-medium">{equipos[3]?.nombre || 'Por determinar'}</div>
              </div>
              <div className="border rounded p-3">
                <div className="font-medium">{equipos[1]?.nombre || 'Por determinar'}</div>
                <div className="text-gray-500">vs</div>
                <div className="font-medium">{equipos[2]?.nombre || 'Por determinar'}</div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="text-lg font-semibold mb-4">Final</h3>
            <div className="border rounded p-3">
              <div className="font-medium">Ganador SF1</div>
              <div className="text-gray-500">vs</div>
              <div className="font-medium">Ganador SF2</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Clasificación</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="p-2">Pos</th>
                <th className="p-2">Equipo</th>
                <th className="p-2">PJ</th>
                <th className="p-2">PG</th>
                <th className="p-2">PP</th>
                <th className="p-2">VG</th>
                <th className="p-2">VP</th>
                <th className="p-2">DV</th>
                <th className="p-2">JG</th>
                <th className="p-2">JP</th>
                <th className="p-2">DJ</th>
                <th className="p-2">Copa</th>
              </tr>
            </thead>
            <tbody>
              {estadisticas.map((equipo, index) => {
                let copaClass = '';
                let copaText = '';
                if (index < 4) {
                  copaClass = 'text-yellow-500';
                  copaText = 'Oro';
                } else if (index < 8) {
                  copaClass = 'text-gray-400';
                  copaText = 'Plata';
                } else {
                  copaClass = 'text-amber-700';
                  copaText = 'Bronce';
                }

                return (
                  <tr 
                    key={equipo.nombre} 
                    className="border-b border-gray-700 hover:bg-gray-700"
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2 font-medium">{equipo.nombre}</td>
                    <td className="p-2">{equipo.partidosJugados}</td>
                    <td className="p-2">{equipo.partidosGanados}</td>
                    <td className="p-2">{equipo.partidosPerdidos}</td>
                    <td className="p-2">{equipo.vacasGanadas}</td>
                    <td className="p-2">{equipo.vacasPerdidas}</td>
                    <td className="p-2">{equipo.vacasGanadas - equipo.vacasPerdidas}</td>
                    <td className="p-2">{equipo.juegosGanados}</td>
                    <td className="p-2">{equipo.juegosPerdidos}</td>
                    <td className="p-2">{equipo.juegosGanados - equipo.juegosPerdidos}</td>
                    <td className={`p-2 font-medium ${copaClass}`}>{copaText}</td>
                  </tr>
                   );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              <p>PJ: Partidos Jugados, PG: Partidos Ganados, PP: Partidos Perdidos</p>
              <p>VG: Vacas Ganadas, VP: Vacas Perdidas, DV: Diferencia de Vacas</p>
              <p>JG: Juegos Ganados, JP: Juegos Perdidos, DJ: Diferencia de Juegos</p>
            </div>
          </div>
    
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Fase Final - Copas</h2>
            
            <BracketCopa 
              equipos={estadisticas.slice(0, 4)}
              titulo="Copa Oro"
              premios={premios.oro}
              backgroundColor="bg-yellow-600"
            />
            
            <BracketCopa 
              equipos={estadisticas.slice(4, 8)}
              titulo="Copa Plata"
              premios={premios.plata}
              backgroundColor="bg-gray-600"
            />
            
            <BracketCopa 
              equipos={estadisticas.slice(8, 12)}
              titulo="Copa Bronce"
              premios={premios.bronce}
              backgroundColor="bg-amber-800"
            />
          </div>
        </div>
      );
    };
    
    export default ClasificacionYCopas;