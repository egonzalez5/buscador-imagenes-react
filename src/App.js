import { useEffect, useState } from 'react';
import Formulario from './components/Formulario'
import ListadoImagenes from './components/ListadoImagenes'

function App() {

  const [busqueda, setBusqueda] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)

  useEffect(() => {
    const consultarApi = async () => {
      // la primera carga de la pagina no devuelve anda ya que el campo a buscar esta vacio
      if(busqueda  === '') return;

      const imagenesPorPagina = 30;
      const key = '19971890-894724cfb9ce428e453edf562';
      const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaActual}`;

      const respuesta = await fetch(url);
      const resultado = await respuesta.json();

      setImagenes(resultado.hits);

      // calcular total de paginas
      const calcularTotalPaginas = Math.ceil(resultado.totalHits / imagenesPorPagina);
      setTotalPaginas(calcularTotalPaginas);

      // mover pantalla hacia arriba
      const jumbotron = document.querySelector('.jumbotron');
      jumbotron.scrollIntoView({ behavior: 'smooth'})

    }
    consultarApi();
  }, [busqueda, paginaActual])

  // pagina anterior
  const paginaAnterior = () => {
    const nuevaPaginaActual = paginaActual - 1;
    // al momento de llegar a la pagina 0 se hace return ya que no se puede ir a -1, -2 etc
    if(nuevaPaginaActual === 0 ) return;

    setPaginaActual(nuevaPaginaActual);
  }

  const paginaSiguiente = () => {
    const nuevaPaginaActual = paginaActual + 1;
    // validamos que la ultima pagina no sea mayor al total disponible
    if(nuevaPaginaActual > totalPaginas) return;

    setPaginaActual(nuevaPaginaActual);
  }

  return (
    <div className="container">
      <div className="jumbotron">
        <p className="lead text-center">Buscador de imágenes</p>

        <Formulario
          setBusqueda={setBusqueda}
        />
      </div>
      <div className="row justify-content-center">
        <ListadoImagenes
          imagenes={imagenes}
        />
        {(paginaActual === 1) ? null : (
          <button
          type="button"
          className="btn btn-info mr-1"
          onClick={paginaAnterior}
        >&laquo; Anterior </button>
        )}
        {(paginaActual === totalPaginas) ? null : (
          <button
          type="button"
          className="btn btn-info"
          onClick={paginaSiguiente}
        >Siguiente &raquo;</button>
        )}
      </div>
    </div>
  );
}

export default App;
