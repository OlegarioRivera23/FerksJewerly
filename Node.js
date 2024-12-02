const express = require('express');
const bodyParser = require('body-parser');
const webPush = require('web-push');

const app = express();
app.use(bodyParser.json());

// Configurar claves VAPID
const vapidKeys = {
    publicKey: 'BADAcgr5k_f9Tp-tf9mBPE95udM5MrFJAuHRg2p5wwnA7H97JMnfOFyPF7misM8qVz6otIyid8-QJdqEzT0LAhQ',
    privateKey: 'wfpestG9psZl_4GBFom2nZ5490r30DRyY9_EyJnvngs'
};

webPush.setVapidDetails(
    'mailto:riveragarza1@hotmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

let subscription; // Variable para almacenar la suscripción enviada por el cliente

if (!subscription) {
    console.error('Suscripción no creada correctamente');
    return;
}

// Ruta para almacenar suscripción
app.post('/api/suscripciones', (req, res) => {
    subscription = req.body; // Guardar suscripción en el servidor
    console.log('Suscripción recibida:', subscription);
    res.status(201).json({ message: 'Suscripción almacenada con éxito.' });
});

// Ruta para enviar notificación
app.post('/api/notificar', (req, res) => {
    const payload = JSON.stringify({
        title: '¡Hola!',
        body: 'Este es un mensaje push desde el servidor.',
        icon: '/images/icon-192x192.png',
        url: '/'
    });

    webPush.sendNotification(subscription, payload)
        .then(response => {
            console.log('Notificación enviada:', response);
            res.status(200).json({ message: 'Notificación enviada con éxito.' });
        })
        .catch(error => {
            console.error('Error enviando notificación:', error);
            res.status(500).json({ error });
        });
});
