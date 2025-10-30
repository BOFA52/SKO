document.addEventListener("DOMContentLoaded", () => {

  const ADMIN_PASSWORD = "1005542591";
  let modoAdmin = false;
  const categoria = document.body.dataset.category || "inicio";

  // ELEMENTOS
  const adminBtn = document.getElementById("admin-btn");
  const agregarBtn = document.getElementById("agregar-producto-btn");
  const formAgregar = document.getElementById("form-agregar-producto");
  const productosContainer = document.getElementById("productos-container");
  const modoTexto = document.getElementById("modo-edicion-texto");
  const carritoIcono = document.getElementById("carrito-icono");
  const carritoModal = document.getElementById("carrito-modal");
  const cerrarCarritoBtn = document.getElementById("cerrar-carrito");
  const carritoItems = document.getElementById("carrito-items");
  const totalSpan = document.getElementById("total");
  const contadorCarrito = document.getElementById("contador-carrito");
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  // PRODUCTOS Y CARRITO
  let productos = JSON.parse(localStorage.getItem(`productos_${categoria}`)) || [];
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // FUNCIONES
  function renderizarProductos() {
    productosContainer.innerHTML = "";
    if(productos.length === 0){ productosContainer.innerHTML="<p>No hay productos.</p>"; return; }

    productos.forEach((p,i)=>{
      const card = document.createElement("div");
      card.classList.add("producto-card");
      card.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p>${p.descripcion}</p>
        <span>$${p.precio}</span>
        ${modoAdmin ? `<button class="eliminar-btn" data-index="${i}">🗑 Eliminar</button>` :
        `<button class="agregar-btn" data-index="${i}">Agregar 🛒</button>`}
      `;
      productosContainer.appendChild(card);
    });

    if(modoAdmin){
      document.querySelectorAll(".eliminar-btn").forEach(btn=>btn.addEventListener("click", eliminarProducto));
    } else {
      document.querySelectorAll(".agregar-btn").forEach(btn=>btn.addEventListener("click", agregarAlCarrito));
    }
  }

  function guardarCarrito(){
    localStorage.setItem("carrito", JSON.stringify(carrito));
    contadorCarrito.textContent = carrito.length;
  }

  function agregarAlCarrito(e){
    const index = e.target.dataset.index;
    carrito.push(productos[index]);
    guardarCarrito();
    renderizarCarrito();
    alert("Producto agregado al carrito 🛒");
  }

  function eliminarProducto(e){
    const index = e.target.dataset.index;
    if(confirm("Eliminar este producto?")){
      productos.splice(index,1);
      localStorage.setItem(`productos_${categoria}`,JSON.stringify(productos));
      renderizarProductos();
    }
  }

  function abrirCarrito(){ carritoModal.style.display="flex"; renderizarCarrito(); }
  function cerrarCarrito(){ carritoModal.style.display="none"; }

  function renderizarCarrito(){
    carritoItems.innerHTML="";
    let total=0;
    if(carrito.length===0){ carritoItems.innerHTML="<p>Tu carrito está vacío.</p>"; }
    else{
      carrito.forEach((item,i)=>{
        total += parseFloat(item.precio);
        const div = document.createElement("div");
        div.classList.add("carrito-item");
        div.innerHTML=`
          <img src="${item.imagen}" alt="${item.nombre}">
          <p>${item.nombre}</p>
          <span>$${item.precio}</span>
          <button class="eliminar-carrito" data-index="${i}">❌</button>
        `;
        carritoItems.appendChild(div);
      });
    }
    totalSpan.textContent=`$${total.toFixed(2)}`;
    document.querySelectorAll(".eliminar-carrito").forEach(btn=>btn.addEventListener("click", eliminarDelCarrito));
  }

  function eliminarDelCarrito(e){
    const index = e.target.dataset.index;
    carrito.splice(index,1);
    guardarCarrito();
    renderizarCarrito();
  }

  // EVENTOS
  adminBtn.addEventListener("click", ()=>{
    if(!modoAdmin){
      const pass = prompt("Contraseña admin:");
      if(pass===ADMIN_PASSWORD){
        modoAdmin=true;
        modoTexto.style.display="block";
        agregarBtn.style.display="block";
        renderizarProductos();
      } else alert("Contraseña incorrecta");
    } else {
      modoAdmin=false;
      modoTexto.style.display="none";
      agregarBtn.style.display="none";
      renderizarProductos();
    }
  });

  agregarBtn.addEventListener("click", ()=> formAgregar.style.display = formAgregar.style.display==="block" ? "none" : "block");

  document.getElementById("guardar-producto-btn").addEventListener("click", ()=>{
    const nombre = document.getElementById("nombre-producto").value;
    const descripcion = document.getElementById("descripcion-producto").value;
    const precio = document.getElementById("precio-producto").value;
    const imagenInput = document.getElementById("imagen-producto");

    if(!nombre || !descripcion || !precio || !imagenInput.files[0]){
      alert("Completa todos los campos."); return;
    }

    const reader = new FileReader();
    reader.onload = function(e){
      const imagen = e.target.result;
      productos.push({nombre,descripcion,precio,imagen});
      localStorage.setItem(`productos_${categoria}`,JSON.stringify(productos));
      renderizarProductos();
      formAgregar.style.display="none";
      document.getElementById("nombre-producto").value="";
      document.getElementById("descripcion-producto").value="";
      document.getElementById("precio-producto").value="";
      imagenInput.value="";
    };
    reader.readAsDataURL(imagenInput.files[0]);
  });

  carritoIcono.addEventListener("click", abrirCarrito);
  cerrarCarritoBtn.addEventListener("click", cerrarCarrito);
  menuToggle.addEventListener("click", ()=> navLinks.classList.toggle("active"));

  // INICIALIZAR
  renderizarProductos();
  guardarCarrito();
});
