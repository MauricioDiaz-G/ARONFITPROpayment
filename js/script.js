const KEYS = { public: "pk_test_51QXTdzDleD0jqpl3oUTZiW3tdVjZzSG3JH8TGy1ghUPsNntgblBgRlHbWZMZwUvA9OOs2qhiP6f3O0BpEHS9MXK600yVZ49SnI" }; // Coloca tu clave pública de Stripe aquí

const $d = document;
const $arepas = $d.getElementById("arepas");
const $template = $d.getElementById("arepa-template").content;
const $fragment = $d.createDocumentFragment();

const FormatoDeMoneda = (num) => `€${num.slice(0, -2)}.${num.slice(-2)}`;

const obtenerProductosYPrecios = async () => {
  try {
    // Solicitar productos y precios desde el backend (Netlify Function)
    const res = await fetch('/.netlify/functions/get-products');
    const data = await res.json();

    const productos = data.productos;
    const precios = data.precios;

    // Ordenar precios de menor a mayor
    precios.sort((a, b) => a.unit_amount - b.unit_amount);

    precios.forEach((el) => {
      let productData = productos.find((product) => product.id === el.product);

      if (productData) {
        // Asignar datos al template
        $template.querySelector(".pricing-plan").textContent = productData.name || "Plan";
        $template.querySelector(".price .amount").textContent = FormatoDeMoneda(el.unit_amount_decimal);
        $template.querySelector(".price small").textContent = "/5 semanas";
        $template.querySelector(".description").textContent = productData.description || "Descripción no disponible";
        $template.querySelector(".btn").setAttribute("data-price", el.id);

        // Clonar y agregar al fragmento
        let $clone = $d.importNode($template, true);
        $fragment.appendChild($clone);
      } else {
        console.error(`No se encontró un producto para el precio con ID: ${el.id}`);
      }
    });

    $arepas.appendChild($fragment);
  } catch (error) {
    console.error("Error en la solicitud:", error);
    let message = error.statusText || "Ocurrió un error en la petición";
    $arepas.innerHTML = `Error: ${error.status || ""}: ${message}`;
  }
};

// Llamar a la función para obtener productos y precios
obtenerProductosYPrecios();

