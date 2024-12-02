// server.js
const express = require('express');
const webPush = require('web-push');
const app = express();
const port = 3000;

// Middleware para permitir solicitudes desde otros orígenes
app.use(express.json());

// Rutas
app.post('/api/suscripciones', (req, res) => {
  // Lógica para manejar las suscripciones de usuarios
  console.log('Nueva suscripción:', req.body);
  
  // Aquí podrías manejar el envío de las notificaciones push.
  // Por ejemplo, usando web-push para enviar una notificación.

  res.status(200).send({ message: 'Suscripción recibida.' });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
