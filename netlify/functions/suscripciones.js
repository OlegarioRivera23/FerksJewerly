exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Método no permitido' }),
        };
    }

    const data = JSON.parse(event.body);
    console.log('Datos recibidos:', data);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Suscripción recibida correctamente' }),
    };
};

const webPush = require('web-push');

// Configura tus claves VAPID
const publicKey = 'BADAcgr5k_f9Tp-tf9mBPE95udM5MrFJAuHRg2p5wwnA7H97JMnfOFyPF7misM8qVz6otIyid8-QJdqEzT0LAhQ';
const privateKey = 'wfpestG9psZl_4GBFom2nZ5490r30DRyY9_EyJnvngs';
webPush.setVapidDetails(
    'mailto:riveragarza1@hotmail.com',
    publicKey,
    privateKey
);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Método no permitido' }),
        };
    }

    try {
        const data = JSON.parse(event.body); // Suscripción y mensaje
        const { subscription, notification } = data;

        // Envía la notificación
        await webPush.sendNotification(subscription, JSON.stringify(notification));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Notificación enviada correctamente' }),
        };
    } catch (error) {
        console.error('Error enviando notificación:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error enviando notificación' }),
        };
    }
};

