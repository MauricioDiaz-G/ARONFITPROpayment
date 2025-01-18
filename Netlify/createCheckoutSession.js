const stripe = require('stripe')(process.env.stripeSecretKeyARON); // Obtén la clave secreta desde las variables de entorno de Netlify

exports.handler = async function(event, context) {
  try {
    // Crear una sesión de pago
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Producto de prueba',
            },
            unit_amount: 2000, // Monto en centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://mi-sitio.com/success.html',  // Redirige a la página de éxito
      cancel_url: 'https://mi-sitio.com/cancel.html',    // Redirige a la página de cancelación
    });

    // Devuelve el sessionId para que el frontend lo utilice
    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
