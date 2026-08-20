
// Funcion para obtener la fecha actual en formato "día de mes de año" en español (México)
function ObtenerFechaActual() {

    const fecha = new Date();

    return fecha.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

module.exports = {ObtenerFechaActual};