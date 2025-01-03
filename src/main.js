import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

document.addEventListener("DOMContentLoaded", function () {
    const inputUS = document.getElementById("inputU");
    const ivaT = document.getElementById("ivaT");
    const profitT = document.getElementById("profitT");
    const iibbT = document.getElementById("iibbT");
    const woT = document.getElementById("woT");
    const totalT = document.getElementById("totalT");
    const wichT = document.getElementById("wichT");
    const addToCartBtn = document.getElementById("addToCartBtn");
    const cartItemsList = document.getElementById("cartItemsList");
    const cartTotal = document.getElementById("cartTotal");
    const dollarRate = 1058; // Actualizar con el valor del dolar tarjeta

    if (!inputUS || !ivaT || !addToCartBtn) {
        console.error("Algunos elementos del DOM no se encontraron.");
        return;
    }

    let cartItems = [];
    let itemCount = 0;

    function formatAmount(amount) {
        return amount.toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function calculateTaxes() {
        let inputU = parseFloat(inputUS.value) || 0;
        let baseAmountInPesos = inputU * dollarRate;
        let beautifulTaxes = baseAmountInPesos * 1.10;

        woT.textContent = `$ ${formatAmount(beautifulTaxes)}`;

        let iva = beautifulTaxes * 0.21;
        let ganancias = beautifulTaxes * 0.30;
        let iibb = beautifulTaxes * (isNaN(parseFloat(wichT.value)) ? 0 : parseFloat(wichT.value) / 100);

        ivaT.textContent = `$ ${formatAmount(iva)}`;
        profitT.textContent = `$ ${formatAmount(ganancias)}`;
        iibbT.textContent = `$ ${formatAmount(iibb)}`;

        const totalImpuestos = iva + ganancias + iibb;
        totalT.textContent = `$ ${formatAmount(beautifulTaxes + totalImpuestos)}`;
        return beautifulTaxes + totalImpuestos;
    }

    function addToCart() {
        const amountWithTaxes = calculateTaxes();
        if (amountWithTaxes <= 0) {
            alert("Por favor ingresa un valor mayor a 0.");
            return;
        }

        if (cartItems.length >= 10) {
            alert("Has alcanzado la capacidad máxima del carrito.");
            return;
        }

        itemCount++;
        const newItem = `Item ${itemCount} - $${formatAmount(amountWithTaxes)}`;
        cartItems.push(amountWithTaxes);

        const listItem = document.createElement("li");
        listItem.classList.add("cart-item");
        listItem.textContent = newItem;

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.textContent = "Eliminar";
        deleteButton.addEventListener("click", function () {
            cartItemsList.removeChild(listItem);
            cartItems = cartItems.filter((_, index) => index !== cartItems.indexOf(amountWithTaxes));
            updateCartTotal();
        });

        listItem.appendChild(deleteButton);
        cartItemsList.appendChild(listItem);

        updateCartTotal();

        Toastify({
            text: "Se agregó al carrito!",
            duration: 3000,
            close: true,
            gravity: "bottom",
            position: "right",
            backgroundColor: "linear-gradient(to right, #2C8A8C, #00B09B)",
            stopOnFocus: true,
        }).showToast();
    }

    function updateCartTotal() {
        const total = cartItems.reduce((acc, curr) => acc + curr, 0);
        cartTotal.textContent = `Total: $ ${formatAmount(total)}`;
    }

    inputUS.addEventListener("input", calculateTaxes);
    wichT.addEventListener("change", calculateTaxes);
    addToCartBtn.addEventListener("click", addToCart);
});