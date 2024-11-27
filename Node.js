const webPush = require('web-push');

const vapidKeys = {
    publicKey: 'BADAcgr5k_f9Tp-tf9mBPE95udM5MrFJAuHRg2p5wwnA7H97JMnfOFyPF7misM8qVz6otIyid8-QJdqEzT0LAhQ',
    privateKey: 'wfpestG9psZl_4GBFom2nZ5490r30DRyY9_EyJnvngs'
};

webPush.setVapidDetails(
    'mailto:riveragarza1@hotmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const subscription = {/* Objeto de suscripción del cliente */};

const payload = JSON.stringify({
    title: '¡Hola!',
    body: 'Este es un mensaje push desde el servidor.',
    icon: '/images/icon-192x192.png',
    url: '/'
});

webPush.sendNotification(subscription, payload)
    .then(response => console.log('Notificación enviada:', response))
    .catch(error => console.error('Error enviando notificación:', error));
