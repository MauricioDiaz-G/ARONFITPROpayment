const stripe = require('stripe')(process.env.stripeSecretKeyARON); // Usar la clave secreta desde las variables de entorno

exports.handler = async function (event, context) {
    try {
        const productos = await stripe.products.list();
        const precios = await stripe.prices.list();

        return {
            statusCode: 200,
            body: JSON.stringify({ productos, precios }),  // Asegúrate de que esto sea JSON
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),  // Esto debe devolver un JSON con el error
        };
    }
};
