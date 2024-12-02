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
