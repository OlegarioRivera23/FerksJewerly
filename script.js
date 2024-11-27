let loadMoreBtn = document.querySelector('#load-more');
let currentItem = 8;
//cargar mas boton
loadMoreBtn.onclick = () => {
    let boxes = [...document.querySelectorAll('.box-container .box')];
    for(var i = currentItem; i < currentItem + 4; i++){
        boxes[i].style.display = 'inline-block';
    }
    currentItem +=4;
    if (currentItem >= boxes.length) {
        loadMoreBtn.style.display = 'none'; 
    }
}

//carrito
const carrito = document.getElementById('carrito');
const elementos1 = document.getElementById('lista-1');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

cargarEventListeners();

function cargarEventListeners(){
    elementos1.addEventListener('click', comprarElemento);
    carrito.addEventListener('click', eliminarElemento);
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
}

function comprarElemento(e){
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const elemento = e.target.parentNode.parentNode;
        leerDatosElemento(elemento);
    }
}

function leerDatosElemento(elemento){
    const infoElemento = {
        imagen: elemento.querySelector('img').src,
        titulo: elemento.querySelector('h3').textContent,
        precio: elemento.querySelector('.precio').textContent,
        id: elemento.querySelector('a').getAttribute('data-id')
    }
    insertarCarrito(infoElemento);
}

function insertarCarrito(elemento){
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <img src="${elemento.imagen}" width="100" height="150">
        </td>
        <td>
            ${elemento.titulo}
        </td>
        <td>
            ${elemento.precio}
        </td>
        <td>
            <a href="#" class="borrar" data-id="${elemento.id}">X</a>
        </td>
    `;
    lista.appendChild(row);
}

function eliminarElemento(e){
    e.preventDefault();
    let elemento,
        elementoId;
    if (e.target.classList.contains('borrar')) {
        e.target.parentNode.parentNode.remove();
        elemento = e.target.parentNode.parentNode;
        elementoId = elemento.querySelector('a').getAttribute('data-id');
    }
}

function vaciarCarrito(){
    lista.innerHTML = '';
    return true;
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registrado:", registration);
        })
        .catch((error) => {
          console.error("Error al registrar el Service Worker:", error);
        });
    });
  }
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.register('/sw.js')
        .then(function(swReg) {
            console.log('Service Worker registrado', swReg);
        })
        .catch(function(error) {
            console.error('Error al registrar el Service Worker', error);
        });
}
function solicitarPermisoNotificaciones() {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('Permiso otorgado para notificaciones.');
        } else {
            console.log('Permiso denegado para notificaciones.');
        }
    });
}
solicitarPermisoNotificaciones();

navigator.serviceWorker.ready.then(function(swReg) {
    return swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: 'BADAcgr5k_f9Tp-tf9mBPE95udM5MrFJAuHRg2p5wwnA7H97JMnfOFyPF7misM8qVz6otIyid8-QJdqEzT0LAhQ'
    });
}).then(function(subscription) {
    console.log('Suscripción exitosa:', JSON.stringify(subscription));
    // Enviar esta suscripción al backend
}).catch(function(error) {
    console.error('Error al suscribirse al Push Manager', error);
});
fetch('/api/suscripciones', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
        'Content-Type': 'application/json'
    }
});
