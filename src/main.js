import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        inputUS: document.getElementById("inputU"),
        ivaT: document.getElementById("ivaT"),
        profitT: document.getElementById("profitT"),
        menuTrigger: document.getElementById("menuTrigger"),
        listbox: document.getElementById("listbox"),
        wichT: document.getElementById("wichT"),
        iibbT: document.getElementById("iibbT"),
        woT: document.getElementById("woT"),
        totalT: document.getElementById("totalT"),
        totalR: document.getElementById("totalR"),
        addToCartBtn: document.getElementById("addToCartBtn"),
        cartItemsList: document.getElementById("cartItemsList"),
        cartTotal: document.getElementById("cartTotal"),
        copyTotal: document.getElementById("copyTotal"),
    };

    let dollarRate = 1058; // Valor inicial del dólar tarjeta
    const provinces = [
        { name: "Buenos Aires", rate: 2.0 },
        { name: "CABA", rate: 2.0 },
        { name: "Catamarca", rate: 0.0 },
        { name: "Chaco", rate: 5.5 },
        { name: "Chubut", rate: 0.0 },
        { name: "Córdoba", rate: 3.0 },
        { name: "Corrientes", rate: 0.0 },
        { name: "Entre Ríos", rate: 0.0 },
        { name: "Formosa", rate: 0.0 },
        { name: "Jujuy", rate: 0.0 },
        { name: "La Pampa", rate: 1.0 },
        { name: "La Rioja", rate: 0.0 },
        { name: "Mendoza", rate: 0.0 },
        { name: "Misiones", rate: 0.0 },
        { name: "Neuquén", rate: 4.0 },
        { name: "Río Negro", rate: 5.0 },
        { name: "Salta", rate: 3.6 },
        { name: "San Juan", rate: 0.0 },
        { name: "San Luis", rate: 0.0 },
        { name: "Santa Cruz", rate: 0.0 },
        { name: "Santa Fe", rate: 0.0 },
        { name: "Santiago del Estero", rate: 0.0 },
        { name: "Tierra del Fuego", rate: 3.0 },
        { name: "Tucumán", rate: 0.0 },
    ];

    if (!elements.inputUS || !elements.ivaT || !elements.addToCartBtn) {
        console.error("Algunos elementos del DOM no se encontraron.");
        return;
    }

    let selectedRate = 2.0;
    let cartItems = [];
    let itemCount = 0;

    const ul = elements.listbox.querySelector("ul");
    provinces.forEach(({ name, rate }) => {
        const li = document.createElement("li");
        li.classList.add("itemListbox");
        li.textContent = `${name} - ${rate}%`;
        li.dataset.rate = rate;
        li.addEventListener("click", () => {
            elements.wichT.textContent = `IIBB ${rate}%`;
            selectedRate = rate;
            elements.listbox.classList.add("hidden");
            calculateTaxes();
        });
        ul.appendChild(li);
    });

    elements.menuTrigger.addEventListener("click", () => {
        elements.listbox.classList.toggle("hidden");
    });

    document.addEventListener("click", (event) => {
        if (
            !elements.menuTrigger.contains(event.target) &&
            !elements.listbox.contains(event.target)
        ) {
            elements.listbox.classList.add("hidden");
        }
    });

    // Calculos
    const formatAmount = (amount) =>
        amount.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const calculateTaxes = () => {
        const inputU = parseFloat(elements.inputUS.value) || 0;
        const adjustedDollarRate = dollarRate * 1.0275;
        const baseAmountInPesos = inputU * adjustedDollarRate;

        elements.woT.textContent = `$ ${formatAmount(baseAmountInPesos)}`;
        const iva = baseAmountInPesos * 0.21;
        const ganancias = baseAmountInPesos * 0.3;
        const iibb = baseAmountInPesos * (selectedRate / 100);

        elements.ivaT.textContent = `$ ${formatAmount(iva)}`;
        elements.profitT.textContent = `$ ${formatAmount(ganancias)}`;
        elements.iibbT.textContent = `$ ${formatAmount(iibb)}`;

        const totalImpuestos = iva + ganancias + iibb;
        elements.totalT.textContent = `$ ${formatAmount(totalImpuestos)}`;
        const resumenTotal = baseAmountInPesos + totalImpuestos;
        elements.totalR.textContent = `$ ${formatAmount(resumenTotal)}`;
        return resumenTotal;
    };

    // Add Bottom
    const addToCart = () => {
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
        deleteButton.addEventListener("click", () => {
            elements.cartItemsList.removeChild(listItem);
            cartItems = cartItems.filter((item) => item !== amountWithTaxes);
            updateCartTotal();
            showToast("Eliminado!", "#990000", "#FF6666");
        });

        listItem.appendChild(deleteButton);
        elements.cartItemsList.appendChild(listItem);

        updateCartTotal();
        showToast("Agregado!", "#2C8A8C", "#00B09B");
    };

    //Total Refresh
    const updateCartTotal = () => {
        const total = cartItems.reduce((acc, curr) => acc + curr, 0);
        elements.cartTotal.textContent = `Total: $ ${formatAmount(total)}`;
    };

    //Portapapeles
    const copyTotalToClipboard = () => {
        const totalText = elements.totalR.textContent.replace("$ ", "");
        navigator.clipboard
            .writeText(totalText)
            .then(() => showToast("Copiado!", "#7D7D7D", "#A6A6A6"))
            .catch((err) => console.error("Error al copiar el texto: ", err));
    };

    //Toast
    const showToast = (text, startColor, endColor) => {
        Toastify({
            text,
            duration: 3000,
            close: true,
            gravity: "bottom",
            position: "right",
            backgroundColor: `linear-gradient(to right, ${startColor}, ${endColor})`,
            stopOnFocus: true,
        }).showToast();
    };

    // API Refresh
    const fetchDollarRate = async () => {
        try {
            const response = await fetch("https://api.exchangerate.host/live?access_key=84102ca1eec1c41b88c37e872750f601");
            const data = await response.json();
            if (data && data.quotes && data.quotes.USDARS) {
                dollarRate = data.quotes.USDARS;
                console.log(`Nuevo valor del dólar: ${dollarRate}`);
            } else {
                console.error("No se pudo obtener el valor del dólar.");
            }
        } catch (error) {
            console.error("Error al obtener el valor del dólar: ", error);
        }
    };

    // Delay
    fetchDollarRate();
    setInterval(fetchDollarRate, 15 * 60 * 1000);

    elements.inputUS.addEventListener("input", calculateTaxes);
    elements.addToCartBtn.addEventListener("click", addToCart);
    elements.copyTotal.addEventListener("click", copyTotalToClipboard);
});