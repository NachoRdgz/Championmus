import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase/firebase";
import Home from "./components/Home";
import Jornadas from "./components/Jornadas";
import Clasificacion from "./components/Clasificacion";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [user, setUser] = useState(null);
  const [resultados, setResultados] = useState(
    Array(11).fill(null).map(() =>
      Array(6).fill(null).map(() =>
        Array(3).fill({ local: 0, visitante: 0 })
      )
    )
  );
  const [loading, setLoading] = useState(true);

  // Función para cargar resultados desde Firebase
  const cargarResultados = async () => {
    try {
      const resultsRef = collection(db, "results");
      const q = query(resultsRef, orderBy("updatedAt", "desc"));
      const snapshot = await getDocs(q);
      
      const nuevosResultados = Array(11).fill(null).map(() =>
        Array(6).fill(null).map(() =>
          Array(3).fill({ local: 0, visitante: 0 })
        )
      );

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.jornada && data.partidoIndex !== undefined && data.resultados) {
          nuevosResultados[data.jornada - 1][data.partidoIndex] = data.resultados;
        }
      });

      setResultados(nuevosResultados);
    } catch (error) {
      console.error("Error al cargar resultados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Escuchar el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Cargar resultados iniciales
  useEffect(() => {
    cargarResultados();
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    await signOut(auth);
    alert("Sesión cerrada.");
  };

  if (loading) {
    return (
      <div className="bg-tapete min-h-screen p-6 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="bg-tapete min-h-screen p-6 text-white">
        <header className="bg-espadas text-white text-center p-4 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold">CHAMPIONMUS</h1>
          <nav className="mt-4">
            <Link className="mx-4 text-white hover:underline" to="/">Inicio</Link>
            <Link className="mx-4 text-white hover:underline" to="/jornadas">Jornadas</Link>
            <Link className="mx-4 text-white hover:underline" to="/clasificacion">Clasificación</Link>
            {user ? (
              <>
                <span className="mx-4">Bienvenido, {user.email}</span>
                <button
                  className="mx-4 text-red-500 hover:underline"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link className="mx-4 text-white hover:underline" to="/login">Iniciar Sesión</Link>
                <Link className="mx-4 text-white hover:underline" to="/register">Registrarse</Link>
              </>
            )}
          </nav>
        </header>

        <main className="mt-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/jornadas"
              element={
                <Jornadas 
                  resultados={resultados} 
                  setResultados={setResultados} 
                  onResultadosChange={cargarResultados}
                />
              }
            />
            <Route
              path="/clasificacion"
              element={<Clasificacion resultados={resultados} />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;