import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, onSnapshot, deleteDoc, doc, getDoc } from "firebase/firestore";

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Usuario autenticado
  const [mensajes, setMensajes] = useState([]); // Mensajes desde Firestore
  const [mensaje, setMensaje] = useState(""); // Mensaje actual
  const [isAdmin, setIsAdmin] = useState(false); // Si el usuario es admin

  // Escuchar el usuario autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Verificar si el usuario es administrador
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().isAdmin || false);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Escuchar los mensajes en Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "messages"), (snapshot) => {
      const mensajesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMensajes(mensajesData);
    });

    return () => unsubscribe();
  }, []);

  // Manejar el envío de mensajes
  const handleEnviarMensaje = async (e) => {
    e.preventDefault();

    if (!mensaje.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        autor: user.email,
        mensaje,
        createdAt: new Date(),
      });
      setMensaje(""); // Limpiar campo de entrada
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  // Manejar la eliminación de mensajes
  const handleEliminarMensaje = async (id) => {
    try {
      await deleteDoc(doc(db, "messages", id));
    } catch (error) {
      console.error("Error al eliminar el mensaje:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      {/* Botones de navegación */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => navigate("/clasificacion")}
          className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          Ver Clasificación
        </button>
        <button
          onClick={() => navigate("/jornadas")}
          className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          Ver Jornadas
        </button>
      </div>

      {/* Descripción */}
      <div className="bg-gray-800 p-6 gap-4 mb-6 rounded-lg">
        <h2 className="text-1xl font-bold mb-4">
          La liguilla de mus de Arganzuela.
          11 Jornadas de Enero a Mayo. Semis y Final en Junio.
        </h2>

        <h2 className="text-1xl font-bold mb-4">
          Las partidas se jugarán al mejor de 5 juegos de 40 tantos al mejor de 3 vacas, es decir, el que gane 3 juegos 2 veces.
        </h2>

        <h2 className="text-1xl font-bold mb-4">
          En caso de empate entre dos parejas en la clasificación, contará el enfrentamiento directo, y en caso de triple o cuádruple empate, la posición más alta la tendrá la pareja con mejor diferencia de vacas, y posteriormente de juegos.
        </h2>

        <h2 className="text-1xl font-bold mb-4">
          Reglas: Se juega sin mus visto, sin perete y sin real. La primera mano es corrida y sin señas.
        </h2>
      </div>

      {/* Blog de mensajes */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Blog de Mensajes</h2>

        {user ? (
          <>
            {/* Formulario para enviar mensajes */}
            <form onSubmit={handleEnviarMensaje} className="mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Escribe tu mensaje (máximo 100 caracteres)"
                  className="flex-1 p-2 border rounded-md text-black"
                  maxLength="100"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
                >
                  Enviar
                </button>
              </div>
            </form>
          </>
        ) : (
          <p className="text-center text-red-500">
            Debes iniciar sesión para enviar mensajes.
          </p>
        )}

        {/* Listado de mensajes */}
        <ul className="space-y-2">
          {mensajes
            .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
            .map((msg) => (
              <li
                key={msg.id}
                className="p-2 bg-gray-700 rounded text-sm shadow flex justify-between items-center"
              >
                <div>
                  <strong>{msg.autor}:</strong> {msg.mensaje}
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleEliminarMensaje(msg.id)}
                    className="text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                )}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
