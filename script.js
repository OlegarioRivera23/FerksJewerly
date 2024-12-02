// ===========================
//  Cargar Más Productos
// ===========================
let loadMoreBtn = document.querySelector('#load-more');
let currentItem = 8;

loadMoreBtn.onclick = () => {
    let boxes = [...document.querySelectorAll('.box-container .box')];
    for (let i = currentItem; i < currentItem + 4; i++) {
        if (boxes[i]) boxes[i].style.display = 'inline-block';
    }
    currentItem += 4;
    if (currentItem >= boxes.length) {
        loadMoreBtn.style.display = 'none';
    }
};

// ===========================
//  Gestión del Carrito
// ===========================
const carrito = document.getElementById('carrito');
const elementos1 = document.getElementById('lista-1');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

cargarEventListeners();

function cargarEventListeners() {
    elementos1.addEventListener('click', comprarElemento);
    carrito.addEventListener('click', eliminarElemento);
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
}

function comprarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const elemento = e.target.parentNode.parentNode;
        leerDatosElemento(elemento);
    }
}

function leerDatosElemento(elemento) {
    const infoElemento = {
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('h3').textContent,
        precio: elemento.querySelector('.precio').textContent,
        id: elemento.querySelector('a').getAttribute('data-id')
    };
    insertarCarrito(infoElemento);
}

function insertarCarrito(elemento) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><img src="${elemento.imagen}" width="100" height="150"></td>
        <td>${elemento.titulo}</td>
        <td>${elemento.precio}</td>
        <td><a href="#" class="borrar" data-id="${elemento.id}">X</a></td>
    `;
    lista.appendChild(row);
}

function eliminarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('borrar')) {
        e.target.parentNode.parentNode.remove();
    }
}

function vaciarCarrito() {
    lista.innerHTML = '';
}

// ===========================
//  Service Worker y Push
// ===========================
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
            console.log("Service Worker registrado:", registration);
        })
        .catch((error) => {
            console.error("Error al registrar el Service Worker:", error);
        });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready
        .then((registration) => {
            return registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    'BADAcgr5k_f9Tp-tf9mBPE95udM5MrFJAuHRg2p5wwnA7H97JMnfOFyPF7misM8qVz6otIyid8-QJdqEzT0LAhQ'
                )
            });
        })
        .then((subscription) => {
            console.log('Suscripción exitosa:', subscription);
            enviarSuscripcionAlServidor(subscription);
        })
        .catch((error) => {
            console.error('Error al suscribirse:', error);
        });
}

function solicitarPermisoNotificaciones() {
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Permiso otorgado para notificaciones.');
        } else {
            console.log('Permiso denegado para notificaciones.');
        }
    });
}
solicitarPermisoNotificaciones();

async function enviarSuscripcionAlServidor(subscription) {
    try {
        const response = await fetch('/.netlify/functions/suscripciones', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.statusText}`);
        }
        console.log('Suscripción enviada correctamente.');
    } catch (error) {
        console.error('Error al enviar la suscripción al servidor:', error);
    }
    
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}


// Datos de la notificación
const notification = {
    title: 'Nueva oferta',
    body: '¡No te pierdas nuestras ofertas especiales!',
    icon: '/images/offer-icon.png',
};

// Envía la solicitud al servidor
fetch('/.netlify/functions/suscripciones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription, notification }),
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al enviar la notificación');
        }
        return response.json();
    })
    .then(data => {
        console.log('Notificación enviada:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
