import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

document.addEventListener("DOMContentLoaded", function () {
    const inputUS = document.getElementById("inputU");
    const ivaT = document.getElementById("ivaT");
    const profitT = document.getElementById("profitT");
    const wichT = document.getElementById("wichT");
    const iibbT = document.getElementById("iibbT");
    const woT = document.getElementById("woT");
    const totalT = document.getElementById("totalT");
    const totalR = document.getElementById("totalR");
    const addToCartBtn = document.getElementById("addToCartBtn");
    const cartItemsList = document.getElementById("cartItemsList");
    const cartTotal = document.getElementById("cartTotal");
    const copyTotal = document.getElementById("copyTotal");
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
        let beautifulTaxes = baseAmountInPesos;

        woT.textContent = `$ ${formatAmount(baseAmountInPesos)}`;

        let iva = beautifulTaxes * 0.21;
        let ganancias = beautifulTaxes * 0.30;
        let iibb = beautifulTaxes * (isNaN(parseFloat(wichT.value)) ? 0 : parseFloat(wichT.value) / 100);

        ivaT.textContent = `$ ${formatAmount(iva)}`;
        profitT.textContent = `$ ${formatAmount(ganancias)}`;
        iibbT.textContent = `$ ${formatAmount(iibb)}`;

        const totalImpuestos = iva + ganancias + iibb;
        totalT.textContent = `$ ${formatAmount(totalImpuestos)}`;
        const resumenTotal = baseAmountInPesos + totalImpuestos;
        totalR.textContent = `$ ${formatAmount(resumenTotal)}`;
        return resumenTotal;
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

            Toastify({
                text: "El ítem fue eliminado correctamente!",
                duration: 3000,
                close: true,
                gravity: "bottom",
                position: "right",
                backgroundColor: "linear-gradient(to right, #990000, #FF6666)",
                stopOnFocus: true,
            }).showToast();
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

    function copyTotalToClipboard() {
        const totalText = totalR.textContent.replace("$ ", "");
        navigator.clipboard.writeText(totalText).then(() => {
            Toastify({
                text: "Copiado al portapapeles!",
                duration: 3000,
                close: true,
                gravity: "bottom",
                position: "right",
                backgroundColor: "linear-gradient(to right, #7D7D7D, #A6A6A6)",
                stopOnFocus: true,
            }).showToast();
        }).catch(err => {
            console.error('Error al copiar el texto: ', err);
        });
    }

    inputUS.addEventListener("input", calculateTaxes);
    wichT.addEventListener("change", calculateTaxes);
    addToCartBtn.addEventListener("click", addToCart);
    copyTotal.addEventListener("click", copyTotalToClipboard);
});