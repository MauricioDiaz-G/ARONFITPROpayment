import KEYS from "./assets/keys.js"; // Solo la clave pública

const $d = document;
const $arepas = $d.getElementById("arepas");
const $template = $d.getElementById("arepa-template").content;
const $fragment = $d.createDocumentFragment();
const options = { headers: { Authorization: `Bearer ${KEYS.public}` } };
const FormatoDeMoneda = (num) => `€${num.slice(0, -2)}.${num.slice(-2)}`;

let products, prices;

Promise.all([
    fetch("https://api.stripe.com/v1/products", options),
    fetch("https://api.stripe.com/v1/prices", options),
])
    .then((responses) => Promise.all(responses.map((res) => res.json())))
    .then((json) => {
        products = json[0].data;
        prices = json[1].data;

        // Ordenar precios de menor a mayor
        prices.sort((a, b) => a.unit_amount - b.unit_amount);

        prices.forEach((el) => {
            let productData = products.filter((product) => product.id === el.product);

            if (productData.length > 0) {
                let product = productData[0];
                let price = el;

                // Asignar datos al template
                $template.querySelector(".pricing-plan").textContent = product.name || "Plan";
                $template.querySelector(".price .amount").textContent = FormatoDeMoneda(price.unit_amount_decimal);
                $template.querySelector(".price small").textContent = "/5 semanas";
                $template.querySelector(".description").textContent = product.description || "Descripción no disponible";
                $template.querySelector(".btn").setAttribute("data-price", price.id);

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



function asd()
{
alert("HOLAAA!!!")}

asd()
