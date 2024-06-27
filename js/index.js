const shopContent = document.querySelector("#shopContent");
const modalMasInfo = document.querySelector(".modal-informacion");
const modalMenu = document.querySelector(".modal-menu");
const modalSobreMi = document.querySelector(".modal-sobreMi");
const modalSeleccionarFecha = document.querySelector(".modal-seleccionarFecha");
const modalOver = document.querySelector("#modal-overlay");
const modalTarot = document.querySelector(".modal-tarot");
const buscador = document.querySelector(".buscadorProductos");
const contenedorCards = document.querySelector(".card-products-container");
const cartBTN = document.querySelector(".cart-btn");
const contadorCarrito = document.querySelector(".cart-counter");
const encabezado = document.querySelector(".encabezado");               
const menu = document.querySelector(".menu");
const w = document.querySelector(".wpp-enlace");
const contenedorBuscador = document.querySelector(".contenedorBuscador");
const footer = document.querySelector(".contenedorFooter");
export const cart = [];
export const fechas = [];

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = 
{
  apiKey: "AIzaSyB-cvjO5Ze1jUG5WRVd6pFPWHPq56vjJZc",
  authDomain: "espaciomelo-34e9a.firebaseapp.com",
  projectId: "espaciomelo-34e9a",
  storageBucket: "espaciomelo-34e9a.appspot.com",
  messagingSenderId: "90914534743",
  appId: "1:90914534743:web:fd53ebbe6384be9cc53a12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const agendaRef = collection(db, "agenda");


const mostrarProductos = (productosMostrados) => {
    shopContent.innerHTML = '';
    productosMostrados.forEach(p => {
        const content = document.createElement("div");
        content.className = "content";
        content.innerHTML = `
            <h3 class="nombreProducto">${p.productName}</h3>
            <img src="${p.img}">
            <p class="precio">$${p.price.toLocaleString('es-ES')}</p>
            <a class="MasInformacion" href="#">Más Información</a>
        `;

        const agregarButton = document.createElement("button");
        agregarButton.className = "botonComprar";
        agregarButton.innerText = "Agregar al 🛒";
        content.append(agregarButton);
        shopContent.append(content);

        agregarButton.addEventListener("click", async (e) => {
            
            e.preventDefault();
            modalSeleccionarFecha.innerHTML = "";
            modalSeleccionarFecha.style.display = "block"
            encabezado.style.display = "none";

            const headerCalendario = document.createElement("div");
            headerCalendario.className = "container";
            headerCalendario.innerHTML =  `

                <div class="calendar-header">
                    <button id="prev-month">&lt;</button>
                    <h2 id="month-year"></h2>
                    <button id="next-month">&gt;</button>
                </div>
                <div id="calendar-days"></div>
            `;

            const bodyCalendario = document.createElement("div");
            bodyCalendario.id = "schedule-container"
            bodyCalendario.style.display = "none";
            bodyCalendario.innerHTML = `
                <h2 id="selected-date"></h2>
                <div id="time-slots"></div>
                <div class="botonesCalendario">
                    <button id="back-to-calendar">Volvér</button>
                    <button id="confirm-selection">Confirmar</button>
                </div>
            `;

            const botonVolver = document.createElement("div");
            botonVolver.innerHTML = `
                 <button class="botonVolver">Volvér</button>
            `

            modalSeleccionarFecha.append(headerCalendario);
            modalSeleccionarFecha.append(bodyCalendario);
            modalSeleccionarFecha.append(botonVolver);

            botonVolver.addEventListener("click", (e)=>
            {
                e.preventDefault();
                document.querySelector(".modal-seleccionarFecha").style.display = "none";
                encabezado.style.display = "grid";
            });

            const deletePastData = async () => {
                try {
                    const today = new Date();
                    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                    const q = query(collection(db, "agenda"), where("date", "<", dateString));
                    const querySnapshot = await getDocs(q);
                    
                    const batch = [];
                    querySnapshot.forEach((doc) => {
                        batch.push(deleteDoc(doc.ref));
                    });
              
                    await Promise.all(batch);
                } 
                catch (error) 
                {
                    console.error('Error al eliminar datos antiguos:', error);
                }
              };
              
              // Llamar a deletePastData cuando la aplicación cargue o cuando el usuario interactúe
              window.onload = async () => {
                await deletePastData();
                renderCalendar(currentYear, currentMonth); // Vuelve a renderizar el calendario después de eliminar los datos antiguos
              };
              
              // Utility functions
              const getDaysInMonth = (year, month) => {
                  return new Date(year, month + 1, 0).getDate();
              };
              
              const getDayName = (year, month, day) => {
                  const date = new Date(year, month, day);
                  return date.toLocaleString('default', { weekday: 'long' });
              };
              
              let currentYear, currentMonth, monthDataCache = {}, dayDataCache = {};
              let selectedDate = null;
              let selectedTime = null;
              
              // Realiza una consulta a Firestore para obtener datos de reserva para un mes específico 
              const fetchMonthData = async (year, month) => 
              {
                  const startOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-01`;
                  const endOfMonth = `${year}-${String(month + 1).padStart(2, '0')}-${getDaysInMonth(year, month)}`;
                  const q = query(agendaRef, where("date", ">=", startOfMonth), where("date", "<=", endOfMonth));
                  const querySnapshot = await getDocs(q);
                  const monthData = {};
                  querySnapshot.forEach(doc => {
                      monthData[doc.id] = doc.data();
                  });
                  return monthData;
              };
              
              // Realiza una consulta a Firestore para obtener datos de reserva para un día específico 
              const fetchDayData = async (dateKey) => {
                  const q = query(agendaRef, where("date", "==", dateKey));
                  const querySnapshot = await getDocs(q);
                  const dayData = {};
                  querySnapshot.forEach(doc => {
                      dayData[doc.id] = doc.data();
                  });
                  return dayData;
              };
              
              // Renderiza dinámicamente los días del calendario para un mes y año específicos.
              const renderCalendar = async (year, month) => {
                  if (!monthDataCache[`${year}-${month}`]) {
                      monthDataCache[`${year}-${month}`] = await fetchMonthData(year, month);
                  }
                  const daysContainer = document.getElementById('calendar-days');
                  const monthYear = document.getElementById('month-year');
                  daysContainer.innerHTML = '';
                  monthYear.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
              
                  const daysInMonth = getDaysInMonth(year, month);
                  const today = new Date();
                  const isCurrentMonth = (year === today.getFullYear() && month === today.getMonth());
                  
                  for (let day = 1; day <= daysInMonth; day++) {
                      const dayDiv = document.createElement('div');
                      dayDiv.className = 'day';
              
                      const dayName = getDayName(year, month, day);
                      dayDiv.innerHTML = `<div class="day-number">${day}</div><div class="day-name">${dayName}</div>`;
              
                      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              
                      // Disable past days
                      if (isCurrentMonth && day < today.getDate()) {
                          dayDiv.classList.add('disabled');
                      } else if (monthDataCache[`${year}-${month}`][dateKey]) {
                          dayDiv.classList.add('occupied');
                      }
              
                      dayDiv.addEventListener('click', () => {
                          if (!dayDiv.classList.contains('occupied') && !dayDiv.classList.contains('disabled')) 
                          {
                              renderTimeSlots(dateKey);
                              document.querySelector(".calendar-header").style.display = "none";

                          }
                      });
              
                      daysContainer.appendChild(dayDiv);
                  }
              };
              
              // Renderiza los horarios disponibles para un día seleccionado.
              const renderTimeSlots = async (dateKey) => {
                  document.querySelector(".botonVolver").style.display = "none";
                  if (!dayDataCache[dateKey]) 
                  {
                      dayDataCache[dateKey] = await fetchDayData(dateKey);
                  }
                  
                  selectedDate = dateKey;
                  selectedTime = null;
                  
                  document.getElementById('calendar-days').style.display = 'none';
                  const scheduleContainer = document.getElementById('schedule-container');
                  scheduleContainer.style.display = 'block';
                  const partes = dateKey.split("-");
                  document.getElementById('selected-date').textContent = "Fecha: " + partes[2] + "/" + partes[1] + "/" + partes[0];
              
                  const timeSlotsContainer = document.getElementById('time-slots');
                  timeSlotsContainer.innerHTML = '';
              
                  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
                  const fragment = document.createDocumentFragment();
              
                  for (const time of timeSlots) {
                      const timeSlotDiv = document.createElement('div');
                      timeSlotDiv.className = 'time-slot';
                      timeSlotDiv.textContent = time;
              
                      const dateTimeKey = `${dateKey}-${time}`;
                      if (dayDataCache[dateKey][dateTimeKey]) {
                          timeSlotDiv.style.display = 'none';
                      }
              
                      timeSlotDiv.addEventListener('click', () => {
                          if (!timeSlotDiv.classList.contains('occupied')) 
                            {
                                
                                const previouslySelected = document.querySelector('.time-slot.selected');
                                if (previouslySelected) 
                                {
                                    previouslySelected.classList.remove('selected');
                                }
                                timeSlotDiv.classList.add('selected');
                                selectedTime = time;
                          }
                      });
              
                      fragment.appendChild(timeSlotDiv);
                  }
              
                  timeSlotsContainer.appendChild(fragment);
              };
              
              // Al hacer clic en el botón de confirmación, verifica si se ha seleccionado tanto una fecha (selectedDate) como un horario (selectedTime).
              document.getElementById('confirm-selection').addEventListener('click', async () => 
              {
                  if (selectedDate && selectedTime) {
                      const dateTimeKey = `${selectedDate}-${selectedTime}`;

                    //   await setDoc(doc(db, "agenda", dateTimeKey), { date: selectedDate, time: selectedTime, booked: true });
                      dayDataCache[selectedDate][dateTimeKey] = { booked: true };
                      renderCalendar(currentYear, currentMonth);
                      document.getElementById('schedule-container').style.display = 'none';
                      document.querySelector('.container').style.display = 'none';
                      document.querySelector(".modal-seleccionarFecha").style.display = 'none';
                      encabezado.style.display = "grid";

                      // Activamos modal para seleccionar fecha.

                        cartBTN.classList.add('glow');
                        const audio = document.querySelector("#buySound");
                        audio.currentTime = 0;
                        audio.play();
                        setTimeout(() => {
                            cartBTN.classList.remove('glow');
                        }, 2000);

                        const productoSeleccionado = productos.find(prod => prod.id === p.id);
                        
                        cart.push({
                            id: productoSeleccionado.id,
                            productName: productoSeleccionado.productName,
                            price: productoSeleccionado.price,
                            quantity: 1,
                            img: productoSeleccionado.img,
                            fecha_hora: dateTimeKey
                        });

                        await setDoc(doc(db, "agenda", dateTimeKey), { date: selectedDate, time: selectedTime, booked: true });
                        fechas.push(dateTimeKey)

                        displayCounter();
                  }
              });
              
              const currentDate = new Date();
              currentYear = currentDate.getFullYear();
              currentMonth = currentDate.getMonth();
              
              document.getElementById('prev-month').addEventListener('click', () => {
                  currentMonth--;
                  if (currentMonth < 0) {
                      currentMonth = 11;
                      currentYear--;
                  }
                  renderCalendar(currentYear, currentMonth);
              });
              
              document.getElementById('next-month').addEventListener('click', () => {
                  currentMonth++;
                  if (currentMonth > 11) {
                      currentMonth = 0;
                      currentYear++;
                  }
                  renderCalendar(currentYear, currentMonth);
              });
              
              document.getElementById('back-to-calendar').addEventListener('click', () => {
                  document.getElementById('schedule-container').style.display = 'none';
                  document.getElementById('calendar-days').style.display = 'grid';
                  document.querySelector(".botonVolver").style.display = "block";
                  document.querySelector(".calendar-header").style.display = "flex";
              });
              
              renderCalendar(currentYear, currentMonth);

            
        });

        const masInfoEl = content.querySelector(".MasInformacion");
        masInfoEl.addEventListener("click", function(e) {
            e.preventDefault();
            mostrarModalInfo(p);
        });
    });
};

const mostrarModalInfo = (p) => {

    modalMasInfo.innerHTML = ``;
    modalMasInfo.style.display = "block";
    modalOver.style.display = "block";
    encabezado.style.display = "none";

    const modalHeader = document.createElement("div");
    const modalClose = document.createElement("div");
    modalClose.innerText = "❌";
    modalClose.className = "modal-close";
    modalHeader.append(modalClose);

    modalClose.addEventListener("click", () => {
        modalMasInfo.style.display = "none";
        modalOver.style.display = "none";
        encabezado.style.display = "grid";
    });

    const body = document.createElement("div");
    body.className = "bodyInformacion";
    body.innerHTML = `
        <h1 class="tituloInformacion">${p.productName}</h1>
        <img class="imagenInformacion" src=${p.img}>
        <h2>¿Qué es?</h2>
        <p class="descripcionInformacion">${p.descripcion}</p>
        <h2>Características</h2>
        <div class="caracteristicasInformacion">
            <p>- Duración: ${p.duracion}</p>
            <p>- Modalidad: ${p.modalidad}</p>
            <p>- Valor: $${p.price.toLocaleString('es-ES')}</p> 
        </div>
    `;
    const footer = document.createElement("div");
    footer.className = "footerInformacion";
    footer.innerHTML = `
        <a href="https://www.instagram.com/espacio.melo/" target="_blank">
            <img id="insta" class="icono" src="./media/instagram.png">
        </a>
    `;

    modalMasInfo.append(modalHeader);
    modalMasInfo.append(body);
    modalMasInfo.append(footer);
};

mostrarProductos(productos);

buscador.addEventListener("input", (e) => {
    e.preventDefault();
    const valorBusqueda = e.target.value.trim().toLowerCase();
    const productosFiltrados = productos.filter(p => 
    {
        return p.productName.toLowerCase().includes(valorBusqueda);
    });
    mostrarProductos(productosFiltrados.length > 0 ? productosFiltrados : productos);
});

function displayCounter() 
{
    contadorCarrito.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

menu.addEventListener("click", (e) => {
    try {
        e.preventDefault();
        encabezado.style.display = "none";
        modalMenu.style.display = "block";
        modalOver.style.display = "block";
        w.style.display = "none";

        const close = document.createElement("div");
        close.innerText = "❌";
        close.className = "modal-close";

        const header = document.createElement("div");
        header.className = "headerMenu"
        header.append(close);

        close.addEventListener("click", () => {
            modalMenu.style.display = "none";
            modalOver.style.display = "none";
            encabezado.style.display = "grid";
            w.style.display = "initial";
        });

        const body = document.createElement("div");
        body.className = "bodyMenu"
        body.innerHTML = `
            <div class="contenedorOpcionesMenu">
                <a class="opcionMenu opcionSobreMi" href="#">Sobre mí</a>
                <a class="opcionMenu opcionTarot" href="#">Tarot</a>
                <a class="opcionMenu opcionOtrosServicios" href="#">Más Sesiones</a>
            </div>
        `;

        modalMenu.innerHTML = '';
        modalMenu.append(header);
        modalMenu.append(body);

    } catch (error) {
        console.log(error);
    }

    const opcionSobreMi = document.querySelector(".opcionSobreMi")

    opcionSobreMi.addEventListener("click", (e)=>
    {
        e.preventDefault();
        
        modalSobreMi.innerHTML = ``;
        
        contenedorBuscador.style.display = "none"
        // Oculto modal MENU.
        modalMenu.style.display = "none";
        // Hago que aparezca Encabezado.
        encabezado.style.display = "grid";
        encabezado.style.height = "10vh";
        w.style.display = "initial";
        // Hago que aparezca modal SOBRE MI.
        modalSobreMi.style.display = "block";
        modalOver.style.display = "block";

        const contenedorImgMama = document.createElement("div");
        contenedorImgMama.className = "contenedorImgSobreMi";
        contenedorImgMama.innerHTML = `
            <img src="./media/Mama.png" class="imgMama" alt="Nora Canciani">
        `;

        const tituloSobreMi = document.createElement("h1");
        tituloSobreMi.className = "contenedorTituloSobreMi";
        tituloSobreMi.innerHTML = `
            <h3 class="tituloSobreMi">Sobre mí</h3>
        `;

        const descripcionSobreMi = document.createElement("div");
        descripcionSobreMi.className = "descripcionSobreMi";
        descripcionSobreMi.innerHTML = `
            <p>Soy Nora. <br> Y me encanta del Tarot.</p>
        `;

        modalSobreMi.append(tituloSobreMi);
        modalSobreMi.append(contenedorImgMama);
        modalSobreMi.append(descripcionSobreMi)

        menu.addEventListener("click", (e) => {
            e.preventDefault();
            modalSobreMi.style.display = "none";
            encabezado.style.display = "none";
            modalMenu.style.display = "block";
            modalOver.style.display = "block";
            w.style.display = "none";

        });

        cartBTN.addEventListener("click", (e) => {
            e.preventDefault();
            modalSobreMi.style.display = "none";
            encabezado.style.display = "none";

            const close = document.querySelector(".modal-close");
            close.addEventListener("click", (e)=>{
                modalSobreMi.style.display = "block";
                encabezado.style.display = "grid";
            });
        })
        
    })

    const opcionTarot = document.querySelector(".opcionTarot");
    opcionTarot.addEventListener("click", (e)=>
    {
        e.preventDefault();
        opcionTarot.innerHTML = ``;
        
        contenedorBuscador.style.display = "none"
        // Oculto modal MENU.
        modalMenu.style.display = "none";
        // Hago que aparezca Encabezado.
        encabezado.style.display = "grid";
        encabezado.style.height = "10vh";
        w.style.display = "initial";
        // Hago que aparezca modal SOBRE MI.
        modalTarot.style.display = "flex";
        modalOver.style.display = "block";
        footer.style.display = "none"
        contenedorCards.style.display = "none"

        menu.addEventListener("click", (e) => {
            e.preventDefault();
            modalTarot.style.display = "none";
            encabezado.style.display = "none";
            modalMenu.style.display = "block";
            modalOver.style.display = "block";
            w.style.display = "none";
            footer.style.display = "block"
            contenedorCards.style.display = "block"

        });

        modalTarot.innerHTML = ""
        productos.forEach(p => {
            if (p.productName.includes("Tarot"))
            {
                const content = document.createElement("div");
                content.className = "content";
                content.innerHTML = `
                    <h3 class="nombreProducto">${p.productName}</h3>
                    <img src="${p.img}">
                    <p class="precio">$${p.price.toLocaleString('es-ES')}</p>
                    <a class="MasInformacion" href="#">Más Información</a>
                `;
        
                const agregarButton = document.createElement("button");
                agregarButton.className = "botonComprar";
                agregarButton.innerText = "Agregar al 🛒";
                content.append(agregarButton);
                modalTarot.append(content);
        
                agregarButton.addEventListener("click", async (e) => {
                    e.preventDefault();
                    cartBTN.classList.add('glow');
                    const audio = document.querySelector("#buySound");
                    audio.currentTime = 0;
                    audio.play();
                    setTimeout(() => {
                        cartBTN.classList.remove('glow');
                    }, 2000);
        
                    const productoSeleccionado = productos.find(prod => prod.id === p.id);
                    const existeEnCarrito = cart.some(item => item.id === productoSeleccionado.id);
        
                    if (existeEnCarrito) {
                        cart.forEach(item => {
                            if (item.id === productoSeleccionado.id) {
                                item.quantity++;
                            }
                        });
                    } else {
                        cart.push({
                            id: productoSeleccionado.id,
                            productName: productoSeleccionado.productName,
                            price: productoSeleccionado.price,
                            quantity: 1,
                            img: productoSeleccionado.img
                        });
                    }
                    displayCounter();
                });
        
                const masInfoEl = content.querySelector(".MasInformacion");
                masInfoEl.addEventListener("click", function(e) {
                    e.preventDefault();
                    mostrarModalInfo(p);
                });
            }
        });

    });
});

document.querySelector(".contenedorLogo").addEventListener("click", (e)=>{
    e.preventDefault();
    modalMasInfo.style.display = "none";
    modalMenu.style.display = "none";
    modalOver.style.display = "none";
    modalSeleccionarFecha.style.display = "none";
    modalSobreMi.style.display = "none";
    modalTarot.style.display = "none";
    contenedorCards.style.display = "flex";
    contenedorBuscador.style.display = "flex";
    encabezado.style.height = "16vh";
    shopContent.style.margin = "0px"
})