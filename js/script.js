import KEYS from "../assets/keys.js"; // Solo la clave pública

const $d = document;
const $arepas = $d.getElementById("arepas");
const $template = $d.getElementById("arepa-template").content;
const $fragment = $d.createDocumentFragment();

const FormatoDeMoneda = (num) => `€${num.slice(0, -2)}.${num.slice(-2)}`;

// Solicita productos y precios al backend
fetch('/.netlify/functions/getProductsAndPrices')
    .then(response => response.json())
    .then((data) => {
        const { products, prices } = data;

        // Ordenar precios de menor a mayor
        prices.sort((a, b) => a.unit_amount - b.unit_amount);

        prices.forEach((el) => {
            let productData = products.find((product) => product.id === el.product);

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
    })
    .catch((error) => {
        console.error("Error en la solicitud:", error);
        let message = error.statusText || "Ocurrió un error en la petición";
        $arepas.innerHTML = `Error: ${error.status || ""}: ${message}`;
    });

// Manejo de clics en los botones
$d.addEventListener("click", (e) => {
    if (e.target.matches(".btn[data-price]")) {
        e.preventDefault();
        let priceId = e.target.getAttribute("data-price");

        // Llamar a la función de Netlify para crear la sesión
        fetch('/.netlify/functions/createCheckoutSession', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priceId }),
        })
            .then(response => response.json())
            .then(session => {
                if (session.id) {
                    // Redirigir a Stripe Checkout
                    Stripe(KEYS.public).redirectToCheckout({
                        sessionId: session.id,
                    });
                } else {
                    alert('Error al crear sesión de pago.');
                }
            })
            .catch((err) => {
                console.error('Error al crear la sesión:', err);
                alert('Error en la solicitud de pago.');
            });
    }
});

