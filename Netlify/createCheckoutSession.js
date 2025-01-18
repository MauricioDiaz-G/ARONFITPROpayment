// netlify/functions/createCheckoutSession.js
const stripe = require('stripe')(process.env.stripeSecretKeyARON); // Obtén la clave secreta desde las variables de entorno

exports.handler = async (event) => {
    try {
        const { priceId } = JSON.parse(event.body); // Recibe el ID del precio

        // Crear una sesión de pago con Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'https://aronfitpro.com/success',
            cancel_url: 'https://aronfitpro.com/cancel',
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ id: session.id }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
