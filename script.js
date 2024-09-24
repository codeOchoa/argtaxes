document.addEventListener("DOMContentLoaded", function() {
    const baseAmountInput = document.getElementById("baseAmount");
    const ivaAmount = document.getElementById("ivaAmount");
    const countryAmount = document.getElementById("countryAmount");
    const profitAmount = document.getElementById("profitAmount");
    const iibbAmount = document.getElementById("iibbAmount");
    const totalWithoutTax = document.getElementById("totalWithoutTax");
    const totalTax = document.getElementById("totalTax");
    const provinceSelect = document.getElementById("provinceSelect");
    const dollarRate = 982; // Actualizar con el valor del dolar oficial
    const addToCartBtn = document.getElementById("addToCartBtn");
    const cartItemsList = document.getElementById("cartItemsList");
    const cartTotal = document.getElementById("cartTotal");

    let cartItems = [];
    let itemCount = 0;

    function formatAmount(amount) {
        return amount.toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function calculateTaxes() {
        let baseAmount = parseFloat(baseAmountInput.value) || 0;

        // Multiplicamos el valor ingresado por el usuario por el dólar y le agregamos un 10%
        let baseAmountInPesos = baseAmount * dollarRate;
        let baseAmountWith10Percent = baseAmountInPesos * 1.10;

        totalWithoutTax.textContent = `AR$ ${formatAmount(baseAmountWith10Percent)}`;

        let iva = baseAmountWith10Percent * 0.21;
        let pais = baseAmountWith10Percent * 0.08;
        let ganancias = baseAmountWith10Percent * 0.30;
        let iibb = baseAmountWith10Percent * (parseFloat(provinceSelect.value) / 100) || 0;

        ivaAmount.textContent = `AR$ ${formatAmount(iva)}`;
        countryAmount.textContent = `AR$ ${formatAmount(pais)}`;
        profitAmount.textContent = `AR$ ${formatAmount(ganancias)}`;
        iibbAmount.textContent = `AR$ ${formatAmount(iibb)}`;

        let totalImpuestos = iva + pais + ganancias + iibb;

        totalTax.textContent = `AR$ ${formatAmount(baseAmountWith10Percent + totalImpuestos)}`;
        return baseAmountWith10Percent + totalImpuestos;
    }

    baseAmountInput.addEventListener("input", calculateTaxes);
    provinceSelect.addEventListener("change", calculateTaxes);

// Función para agregar al carrito
function addToCart() {
    const amountWithTaxes = calculateTaxes();

    if (parseFloat(baseAmountInput.value) <= 0) {
        alert("Por favor ingresa un valor mayor a 0.");
        return;
    }

    if (cartItems.length >= 10) {
        alert("Has alcanzado la capacidad máxima del carrito.");
        return;
    }

    itemCount++;
    const newItem = `Item ${itemCount} - AR$${formatAmount(amountWithTaxes)}`;
    cartItems.push(amountWithTaxes);

    const listItem = document.createElement("li");
    listItem.textContent = newItem;
    listItem.style.alignItems = "center";
    listItem.style.color = "#121212";
    listItem.style.display = "flex";
    listItem.style.justifyContent = "center";
    listItem.style.margin = "0% 0% 2% 0%";
    listItem.style.width = "75%";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.style.backgroundColor = "#CC6D6D";
    deleteButton.style.border = "0px solid #12121200";
    deleteButton.style.borderRadius = "25px";
    deleteButton.style.color = "#121212";
    deleteButton.style.fontWeight = "bold";
    deleteButton.style.margin = "0% 2.5% 0% 2.5%";
    deleteButton.style.padding = "2.5% 2.5% 0.5% 2.5%";
    deleteButton.addEventListener("click", function() {
        cartItemsList.removeChild(listItem);
        cartItems = cartItems.filter((_, index) => index !== cartItems.indexOf(amountWithTaxes));
        updateCartTotal();
    });

    listItem.appendChild(deleteButton);
    cartItemsList.appendChild(listItem);

    updateCartTotal();
}

function updateCartTotal() {
    const total = cartItems.reduce((acc, curr) => acc + curr, 0);
    cartTotal.textContent = `Total: AR$ ${formatAmount(total)}`;
}

baseAmountInput.addEventListener("input", calculateTaxes);
provinceSelect.addEventListener("change", calculateTaxes);
addToCartBtn.addEventListener("click", addToCart);
});