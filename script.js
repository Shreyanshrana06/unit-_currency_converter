document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "974d238937731029fcabbe7";
    const currenciesUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/codes`;
    const ratesUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest`;

    // Fetch currency codes
    async function fetchCurrencies() {
        try {
            const response = await fetch(currenciesUrl);
            const data = await response.json();
            if (!data?.supported_codes) throw new Error("No supported currencies.");
            const currencyFrom = document.getElementById("currency-from");
            const currencyTo = document.getElementById("currency-to");
            Object.entries(data.supported_codes).forEach(([code, name]) => {
                [currencyFrom, currencyTo].forEach(select => {
                    const option = document.createElement("option");
                    option.value = code;
                    option.text = `${name} (${code.toUpperCase()})`;
                    select.appendChild(option);
                });
            });
        } catch (error) {
            console.error(error);
            alert("Failed to load currencies.");
        }
    }

    // Currency conversion
    async function fetchConversion() {
        const from = document.getElementById("currency-from").value;
        const to = document.getElementById("currency-to").value;
        const amount = parseFloat(document.getElementById("currency-amount").value);
        if (!amount || isNaN(amount)) return alert("Please enter a valid amount.");

        try {
            const response = await fetch(ratesUrl);
            const rates = await response.json();
            if (!rates.conversion_rates[from] || !rates.conversion_rates[to]) return alert("Rate not available.");
            const rate = rates.conversion_rates[to] / rates.conversion_rates[from];
            const result = (amount * rate).toFixed(2);
            document.getElementById("currency-result").innerText = `Result: ${result} ${to.toUpperCase()}`;
            document.getElementById("currency-rate").innerText = `Rate: 1 ${from.toUpperCase()} = ${rate.toFixed(4)} ${to.toUpperCase()}`;
        } catch (error) {
            console.error(error);
            alert("Failed to perform conversion.");
        }
    }

    // Length conversion
    document.getElementById("convert-length").addEventListener("click", () => {
        const from = document.getElementById("unit-from-length").value;
        const to = document.getElementById("unit-to-length").value;
        const amount = parseFloat(document.getElementById("unit-amount-length").value);
        if (isNaN(amount)) return alert("Please enter a valid number.");
        const conversions = {
            meters: { kilometers: 0.001, miles: 0.000621371, centimeters: 100, inches: 39.3701, feet: 3.28084 },
            kilometers: { meters: 1000, miles: 0.621371, centimeters: 100000, inches: 39370.1, feet: 3280.84 },
            miles: { meters: 1609.34, kilometers: 1.60934, centimeters: 160934, inches: 63360, feet: 5280 }
        };
        const result = amount * conversions[from][to];
        document.getElementById("length-result").innerText = `Result: ${result}`;
    });

    // Weight conversion
    document.getElementById("convert-weight").addEventListener("click", () => {
        const from = document.getElementById("unit-from-weight").value;
        const to = document.getElementById("unit-to-weight").value;
        const amount = parseFloat(document.getElementById("unit-amount-weight").value);
        if (isNaN(amount)) return alert("Please enter a valid number.");
        const conversions = {
            grams: { kilograms: 0.001, pounds: 0.00220462, ounces: 0.035274 },
            kilograms: { grams: 1000, pounds: 2.20462, ounces: 35.274 },
            pounds: { grams: 453.592, kilograms: 0.453592, ounces: 16 },
            ounces: { grams: 28.3495, kilograms: 0.0283495, pounds: 0.0625 }
        };
        const result = amount * conversions[from][to];
        document.getElementById("weight-result").innerText = `Result: ${result}`;
    });

    // Temperature conversion
    document.getElementById("convert-temperature").addEventListener("click", () => {
        const from = document.getElementById("unit-from-temperature").value;
        const to = document.getElementById("unit-to-temperature").value;
        const amount = parseFloat(document.getElementById("unit-amount-temperature").value);
        if (isNaN(amount)) return alert("Please enter a valid number.");
        let result;
        if (from === "celsius") {
            result = to === "fahrenheit" ? (amount * 9/5) + 32 : amount + 273.15;
        } else if (from === "fahrenheit") {
            result = to === "celsius" ? (amount - 32) * 5/9 : ((amount - 32) * 5/9) + 273.15;
        } else if (from === "kelvin") {
            result = to === "celsius" ? amount - 273.15 : ((amount - 273.15) * 9/5) + 32;
        }
        document.getElementById("temperature-result").innerText = `Result: ${result}`;
    });

    // Volume conversion
    document.getElementById("convert-volume").addEventListener("click", () => {
        const from = document.getElementById("unit-from-volume").value;
        const to = document.getElementById("unit-to-volume").value;
        const amount = parseFloat(document.getElementById("unit-amount-volume").value);
        if (isNaN(amount)) return alert("Please enter a valid number.");
        const conversions = {
            liters: { milliliters: 1000, gallons: 0.264172, cubic_meters: 0.001 },
            milliliters: { liters: 0.001, gallons: 0.000264172, cubic_meters: 1e-6 },
            gallons: { liters: 3.78541, milliliters: 3785.41, cubic_meters: 0.00378541 },
            cubic_meters: { liters: 1000, milliliters: 1e6, gallons: 264.172 }
        };
        const result = amount * conversions[from][to];
        document.getElementById("volume-result").innerText = `Result: ${result}`;
    });

    // Fetch initial currencies
    fetchCurrencies();
    document.getElementById("convert-currency").addEventListener("click", fetchConversion);
});
// include api for currency change
const api = "https://api.exchangerate-api.com/v4/latest/USD";

// for selecting different controls
var search = document.querySelector(".searchBox");
var convert = document.querySelector(".convert");
var fromCurrecy = document.querySelector(".from");
var toCurrecy = document.querySelector(".to");
var finalValue = document.querySelector(".finalValue");
var finalAmount = document.getElementById("finalAmount");
var resultFrom;
var resultTo;
var searchValue;

// Event when currency is changed
fromCurrecy.addEventListener('change', (event) => {
	resultFrom = `${event.target.value}`;
});

// Event when currency is changed
toCurrecy.addEventListener('change', (event) => {
	resultTo = `${event.target.value}`;
});

search.addEventListener('input', updateValue);

// function for updating value
function updateValue(e) {
	searchValue = e.target.value;
}

// when user clicks, it calls function getresults
convert.addEventListener("click", getResults);

// function getresults
function getResults() {
    finalValue.innerHTML = "Converting..";
	fetch(`${api}`)
		.then(currency => {
			return currency.json();
		}).then(displayResults);
}

// display results after convertion
function displayResults(currency) {
	let fromRate = currency.rates[resultFrom];
	let toRate = currency.rates[resultTo];
	finalValue.innerHTML =
	((toRate / fromRate) * searchValue).toFixed(2);
	finalAmount.style.display = "block";
}

// when user click on reset button
function clearVal() {
	window.location.reload();
	document.getElementsByClassName("finalValue").innerHTML = "";
};
 