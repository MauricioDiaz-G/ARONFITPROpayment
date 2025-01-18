const stripe = require('stripe')(process.env.stripeSecretKeyARON); // Usar la clave secreta desde las variables de entorno

exports.handler = async function (event, context) {
    try {
        // Obtener productos y precios desde Stripe
        const productos = await stripe.products.list();
        const precios = await stripe.prices.list();

        // Retornar los datos en formato JSON
        return {
            statusCode: 200,
            body: JSON.stringify({ productos: productos.data, precios: precios.data }),  // Asegúrate de que esto sea JSON
        };
    } catch (error) {
        // Manejo de errores
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),  // Esto debe devolver un JSON con el error
        };
    }
};


