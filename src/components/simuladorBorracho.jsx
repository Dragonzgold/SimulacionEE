import React, { Component } from "react";
import '../style/simuladorEbrio.css'

class EbrioSimulacionConGraficoCuadriculado extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0, // Posición inicial en el eje X
      y: 0, // Posición inicial en el eje Y
      simulaciones: "", // Valor del input de simulaciones
      errorMensaje: "", // Mensaje de error
      resultado: "", // Resultado de la probabilidad
    };
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.ctx = this.canvasRef.current.getContext("2d");
    this.dibujarCuadricula();
  }

  // Función para dibujar la cuadrícula en el canvas
  dibujarCuadricula() {
    const ctx = this.ctx;
    const canvas = this.canvasRef.current;
    const paso = 20; // Tamaño de cada cuadro en píxeles

    // Dibujar líneas horizontales
    for (let y = 0; y < canvas.height; y += paso) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.strokeStyle = "#ccc";
      ctx.stroke();
    }

    // Dibujar líneas verticales
    for (let x = 0; x < canvas.width; x += paso) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.strokeStyle = "#ccc";
      ctx.stroke();
    }
  }

  // Función para calcular la probabilidad de terminar a dos calles de distancia
  calcularProbabilidadDosCalles(iteraciones) {
    let count = 0; // Contador de veces que termina a dos calles de distancia
    const pasos = 10; // Número de calles que camina
  
    for (let i = 0; i < iteraciones; i++) {
      let x = 0; // Posición inicial en el eje X
      let y = 0; // Posición inicial en el eje Y
  
      for (let j = 0; j < pasos; j++) {
        // Generar una dirección aleatoria (norte, sur, este u oeste)
        const direccion = Math.floor(Math.random() * 4);
  
        switch (direccion) {
          case 0: // Norte
            y++;
            break;
          case 1: // Sur
            y--;
            break;
          case 2: // Este
            x++;
            break;
          case 3: // Oeste
            x--;
            break;
          default:
            break;
        }
      }
  
      // Calcular distancia entre el punto azul y el punto rojo
      const distancia = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  
      // Verificar si termina a dos calles de distancia
      if (distancia <= 2) {
        count++;
      }
    }
  
    // Calcular la probabilidad aproximada
    return count / iteraciones;
  }

  // Función para actualizar el resultado
  actualizarResultado() {
    const valorSimulaciones = parseInt(this.state.simulaciones);

    if (isNaN(valorSimulaciones) || valorSimulaciones < 1 || valorSimulaciones > 100) {
      // Mostrar mensaje de error si el valor está fuera del rango deseado
      this.setState({
        errorMensaje: "Ingrese un valor entre 1 y 100",
        resultado: "",
      });
      // Limpiar el gráfico
      this.dibujarGrafico([]);
      return;
    } else {
      // Limpiar mensaje de error
      this.setState({
        errorMensaje: "",
      });
    }

    // Calcular la probabilidad de terminar a dos calles de distancia
    const probabilidad = this.calcularProbabilidadDosCalles(valorSimulaciones);

    // Actualizar el estado con el resultado
    this.setState({
      resultado: "La probabilidad de terminar a dos calles de donde empezó es: " + probabilidad.toFixed(4),
    });

    // Realizar el dibujo del gráfico
    const resultadosUbicacionFinal = this.simularEbrio(valorSimulaciones);
    this.dibujarGrafico(resultadosUbicacionFinal);
  }

  // Función para realizar la simulación del ebrio y obtener el recorrido
  simularEbrio(iteraciones) {
    const pasos = 10; // Número de calles que camina
    const resultadosUbicacionFinal = [];

    for (let i = 0; i < iteraciones; i++) {
      let x = 0; // Posición inicial en el eje X
      let y = 0; // Posición inicial en el eje Y

      for (let j = 0; j < pasos; j++) {
        // Generar una dirección aleatoria (norte, sur, este u oeste)
        const direccion = Math.floor(Math.random() * 4);

        switch (direccion) {
          case 0: // Norte
            y++;
            break;
          case 1: // Sur
            y--;
            break;
          case 2: // Este
            x++;
            break;
          case 3: // Oeste
            x--;
            break;
          default:
            break;
        }
      }

      // Registrar ubicación final
      const ubicacionFinal = { x, y };
      resultadosUbicacionFinal.push(ubicacionFinal);
    }

    return resultadosUbicacionFinal;
  }

  // Función para dibujar el gráfico
  dibujarGrafico(data) {
    const ctx = this.ctx;
    const canvas = this.canvasRef.current;
    const paso = 20; // Tamaño de cada cuadro en píxeles

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar cuadrícula
    for (let y = 0; y < canvas.height; y += paso) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.strokeStyle = "#ccc";
      ctx.stroke();
    }

    for (let x = 0; x < canvas.width; x += paso) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.strokeStyle = "#ccc";
      ctx.stroke();
    }

    if (data.length === 0) {
      // No se dibuja nada si no hay datos
      return;
    }

    // Dibujar puntos en el gráfico (ubicaciones finales) en verde
    data.forEach((ubicacion) => {
      ctx.beginPath();
      ctx.arc(
        200 + ubicacion.x * paso,
        200 - ubicacion.y * paso,
        3,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "green";
      ctx.fill();
      ctx.closePath();
    });

    // Dibujar el punto de inicio en rojo con nombre "Inicio"
    ctx.beginPath();
    ctx.arc(200, 200, 5, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
    ctx.font = "12px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Inicio", 200 - 20, 200 + 15);

    // Dibujar la posición final del borracho en azul con nombre "Final"
    const posicionFinal = data[data.length - 1];
    ctx.beginPath();
    ctx.arc(
      200 + posicionFinal.x * paso,
      200 - posicionFinal.y * paso,
      5,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
    ctx.font = "12px Arial";
    ctx.fillStyle = "blue";
    ctx.fillText(
      "Final",
      200 + posicionFinal.x * paso - 15,
      200 - posicionFinal.y * paso - 10
    );
  }

  render() {
    return (
      <div>
        <h1>Simulación de Ebrio con Gráfico Cuadriculado</h1>
        <div className="container">
          <div className="legend">
            {/* ... (leyenda del gráfico) */}
          </div>
          <canvas
            ref={this.canvasRef}
            width={400}
            height={400}
            style={{ border: "1px solid #333", marginTop: "20px" }}
          ></canvas>
          <label htmlFor="simulaciones">Número de simulaciones:</label>
          <input
            type="number"
            id="simulaciones"
            placeholder="Ingrese un número entre 1 y 100"
            max="100"
            value={this.state.simulaciones}
            onChange={(e) =>
              this.setState({ simulaciones: e.target.value })
            }
          />
          <button
            id="calcularBtn"
            onClick={() => this.actualizarResultado()}
          >
            Calcular Probabilidad
          </button>
          <p id="resultado">{this.state.resultado}</p>
          <p className="error" id="errorMensaje">
            {this.state.errorMensaje}
          </p>
        </div>
      </div>
    );
  }
}

export default EbrioSimulacionConGraficoCuadriculado;