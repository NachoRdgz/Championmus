import { useState, useEffect } from "react";
import { collection, doc, setDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";

// Definimos las parejas y las jornadas con los partidos correspondientes
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

// Inicializar resultados
const inicializarResultados = () =>
  Array(11)
    .fill()
    .map(() =>
      Array(6)
        .fill()
        .map(() =>
          Array(3).fill({
            local: 0,
            visitante: 0,
          })
        )
    );

function Jornadas() {
  const [jornadaActual, setJornadaActual] = useState(0);
  const [resultados, setResultados] = useState(inicializarResultados());
  const [cargando, setCargando] = useState(true);

  // Cargar resultados desde Firestore al iniciar
  useEffect(() => {
    const cargarResultados = async () => {
      try {
        const resultsRef = collection(db, "results");
        const q = query(resultsRef, orderBy("updatedAt", "desc"));
        const snapshot = await getDocs(q);
        
        const nuevosResultados = inicializarResultados();
        const partidosMap = new Map(); // Mapa para trackear el último resultado de cada partido

        snapshot.forEach((doc) => {
          const data = doc.data();
          const { jornada, partidoIndex, equipoLocal, equipoVisitante, resultados: resultadosPartido } = data;
          
          // Crear una clave única para el partido
          const partidoKey = `${jornada}-${partidoIndex}`;
          
          // Solo guardar el resultado si no hemos procesado este partido antes
          // (esto asegura que tomamos el más reciente debido al orderBy)
          if (!partidosMap.has(partidoKey) && jornada && partidoIndex !== undefined) {
            partidosMap.set(partidoKey, true);
            nuevosResultados[jornada - 1][partidoIndex] = resultadosPartido;
          }
        });
        
        setResultados(nuevosResultados);
      } catch (error) {
        console.error("Error al cargar resultados:", error);
        alert("Error al cargar los resultados. Por favor, intenta de nuevo más tarde.");
      } finally {
        setCargando(false);
      }
    };

    cargarResultados();
  }, []);

  // Manejar cambios en los resultados (solo en estado local)
  const handleResultadoChange = (jornadaIndex, partidoIndex, vacaIndex, equipo, valor) => {
    const nuevoValor = Math.max(0, Math.min(3, valor));
    
    setResultados(prevResultados => {
      const nuevosResultados = JSON.parse(JSON.stringify(prevResultados));
      nuevosResultados[jornadaIndex][partidoIndex][vacaIndex][equipo] = nuevoValor;
      return nuevosResultados;
    });
  };

  // Guardar resultados en Firestore y publicar en el blog
  const publicarResultado = async (partidoIndex) => {
    if (!auth.currentUser) {
      alert("Debes estar autenticado para publicar resultados");
      return;
    }

    try {
      const equipoLocal = jornadas[jornadaActual][partidoIndex][0];
      const equipoVisitante = jornadas[jornadaActual][partidoIndex][1];
      const resultadosPartido = resultados[jornadaActual][partidoIndex];

      // ID más simple pero que incluye timestamp para asegurar unicidad
      const docId = `${jornadaActual + 1}-${equipoLocal}-${equipoVisitante}-${Date.now()}`;

      // Guardar en la colección results
      await setDoc(doc(db, "results", docId), {
        jornada: jornadaActual + 1,
        partidoIndex,
        equipoLocal,
        equipoVisitante,
        resultados: resultadosPartido,
        updatedAt: new Date(),
        ultimaModificacionPor: auth.currentUser.email,
        version: Date.now()
      });

      // Publicar en el blog
      await setDoc(doc(collection(db, "messages")), {
        autor: auth.currentUser.email,
        mensaje: `Jornada ${jornadaActual + 1}: ${equipoLocal} vs ${equipoVisitante} - Resultados: ${resultadosPartido
          .map((vaca, index) => `Vaca ${index + 1}: ${vaca.local}-${vaca.visitante}`)
          .join(", ")}`,
        createdAt: new Date(),
        jornadaRef: docId,
        tipo: "resultado"
      });

      alert("Resultado guardado y publicado correctamente");
    } catch (error) {
      console.error("Error al publicar resultado:", error);
      alert("Error al guardar y publicar el resultado. Por favor, intenta de nuevo.");
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando resultados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Jornada {jornadaActual + 1}</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setJornadaActual((prev) => Math.max(0, prev - 1))}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={jornadaActual === 0}
          >
            Anterior
          </button>
          <button
            onClick={() => setJornadaActual((prev) => Math.min(10, prev + 1))}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={jornadaActual === 10}
          >
            Siguiente
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {jornadas[jornadaActual].map((partido, partidoIndex) => (
          <div key={partidoIndex} className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg text-white">{partido[0]}</span>
              <span className="text-gray-400">VS</span>
              <span className="font-semibold text-lg text-white">{partido[1]}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((vacaIndex) => (
                <div key={vacaIndex} className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-center mb-2 text-white">Vaca {vacaIndex + 1}</div>
                  <div className="flex justify-between items-center gap-4">
                    {/* Equipo Local */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() =>
                          handleResultadoChange(
                            jornadaActual,
                            partidoIndex,
                            vacaIndex,
                            "local",
                            resultados[jornadaActual][partidoIndex][vacaIndex].local + 1
                          )
                        }
                        className="w-8 h-8 bg-blue-500 rounded-t hover:bg-blue-600 text-white"
                      >
                        +
                      </button>
                      <div className="py-2 px-4 bg-gray-600 text-center w-12 text-white">
                        {resultados[jornadaActual][partidoIndex][vacaIndex].local}
                      </div>
                      <button
                        onClick={() =>
                          handleResultadoChange(
                            jornadaActual,
                            partidoIndex,
                            vacaIndex,
                            "local",
                            resultados[jornadaActual][partidoIndex][vacaIndex].local - 1
                          )
                        }
                        className="w-8 h-8 bg-blue-500 rounded-b hover:bg-blue-600 text-white"
                      >
                        -
                      </button>
                    </div>

                    <span className="text-gray-400">-</span>

                    {/* Equipo Visitante */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() =>
                          handleResultadoChange(
                            jornadaActual,
                            partidoIndex,
                            vacaIndex,
                            "visitante",
                            resultados[jornadaActual][partidoIndex][vacaIndex].visitante + 1
                          )
                        }
                        className="w-8 h-8 bg-blue-500 rounded-t hover:bg-blue-600 text-white"
                      >
                        +
                      </button>
                      <div className="py-2 px-4 bg-gray-600 text-center w-12 text-white">
                        {resultados[jornadaActual][partidoIndex][vacaIndex].visitante}
                      </div>
                      <button
                        onClick={() =>
                          handleResultadoChange(
                            jornadaActual,
                            partidoIndex,
                            vacaIndex,
                            "visitante",
                            resultados[jornadaActual][partidoIndex][vacaIndex].visitante - 1
                          )
                        }
                        className="w-8 h-8 bg-blue-500 rounded-b hover:bg-blue-600 text-white"
                      >
                        -
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
            <button
                onClick={() => publicarResultado(partidoIndex)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Publicar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jornadas;


