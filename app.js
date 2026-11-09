const content = document.querySelector("#content");
const title = document.querySelector("#viewTitle");
const subtitle = document.querySelector("#viewSubtitle");
const navigation = document.querySelector("#navigation");

const countries = [
  { name: "Egypt", code: "EG", flag: "🇪🇬", capital: "Cairo", cities: ["Cairo", "Alexandria", "Giza"], currency: "EGP", language: "Arabic", region: "Africa" },
  { name: "France", code: "FR", flag: "🇫🇷", capital: "Paris", cities: ["Paris", "Lyon", "Nice"], currency: "EUR", language: "French", region: "Europe" },
  { name: "Japan", code: "JP", flag: "🇯🇵", capital: "Tokyo", cities: ["Tokyo", "Osaka", "Kyoto"], currency: "JPY", language: "Japanese", region: "Asia" },
  { name: "Italy", code: "IT", flag: "🇮🇹", capital: "Rome", cities: ["Rome", "Milan", "Venice"], currency: "EUR", language: "Italian", region: "Europe" },
  { name: "Spain", code: "ES", flag: "🇪🇸", capital: "Madrid", cities: ["Madrid", "Barcelona", "Seville"], currency: "EUR", language: "Spanish", region: "Europe" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧", capital: "London", cities: ["London", "Manchester", "Edinburgh"], currency: "GBP", language: "English", region: "Europe" },
  { name: "United States", code: "US", flag: "🇺🇸", capital: "Washington, D.C.", cities: ["New York", "Los Angeles", "Chicago"], currency: "USD", language: "English", region: "North America" },
  { name: "Turkey", code: "TR", flag: "🇹🇷", capital: "Ankara", cities: ["Istanbul", "Ankara", "Antalya"], currency: "TRY", language: "Turkish", region: "Asia" },
  { name: "Morocco", code: "MA", flag: "🇲🇦", capital: "Rabat", cities: ["Marrakesh", "Casablanca", "Rabat"], currency: "MAD", language: "Arabic", region: "Africa" },
  { name: "Canada", code: "CA", flag: "🇨🇦", capital: "Ottawa", cities: ["Toronto", "Vancouver", "Montreal"], currency: "CAD", language: "English, French", region: "North America" },
  { name: "Australia", code: "AU", flag: "🇦🇺", capital: "Canberra", cities: ["Sydney", "Melbourne", "Brisbane"], currency: "AUD", language: "English", region: "Oceania" },
  { name: "Germany", code: "DE", flag: "🇩🇪", capital: "Berlin", cities: ["Berlin", "Munich", "Hamburg"], currency: "EUR", language: "German", region: "Europe" },
  { name: "Greece", code: "GR", flag: "🇬🇷", capital: "Athens", cities: ["Athens", "Thessaloniki"], currency: "EUR", language: "Greek", region: "Europe" },
  { name: "India", code: "IN", flag: "🇮🇳", capital: "New Delhi", cities: ["Mumbai", "New Delhi", "Jaipur"], currency: "INR", language: "Hindi, English", region: "Asia" },
];

let selectedCountry = null;
let selectedCity = "";
let selectedYear = new Date().getFullYear();
let holidays = [];
let plans = JSON.parse(localStorage.getItem("wanderlustPlans") || "[]");

const views = ["Dashboard", "Holidays", "Events", "Weather", "Long Weekends", "Currency", "My Plans"];
const icons = ["⌂", "▦", "▣", "☼", "🏖", "＄", "♥"];

navigation.innerHTML = views.map((view, i) =>
  `<button class="nav-button" data-view="${view}"><span>${icons[i]}</span><span class="nav-text">${view}</span></button>`
).join("");

navigation.querySelectorAll("[data-view]").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.view));
});

function showPage(view) {
  document.querySelectorAll(".nav-button").forEach(button => {
    button.classList.toggle("active", button.dataset.view === view);
  });

  title.textContent = view;
  subtitle.textContent = view === "Dashboard"
    ? "Welcome back! Ready to plan your next adventure?"
    : `Explore ${view.toLowerCase()} for your trip`;

  if (view === "Dashboard") showDashboard();
  if (view === "Holidays" || view === "Long Weekends") showHolidays(view);
  if (view === "Events") showEvents();
  if (view === "Weather") showWeather();
  if (view === "Currency") showCurrency();
  if (view === "My Plans") showPlans();
}

function showDashboard() {
  content.innerHTML = `
    <div class="stats">
      ${[
        ["🌐", "90+", "Countries Available"],
        ["▣", "17", "Holidays This Year"],
        ["★", "500+", "Events Worldwide"],
        ["♥", plans.length, "Saved Plans"]
      ].map(item => `
        <article class="card stat">
          <div class="stat-icon">${item[0]}</div>
          <div><strong>${item[1]}</strong><small>${item[2]}</small></div>
        </article>`).join("")}
    </div>

    <div class="section-title">
      <h2>🌐 &nbsp; Select Your Destination</h2>
      <p>Choose a country to explore holidays, events, weather, and more</p>
    </div>

    <section class="card">
      <div class="chooser">
        <label>Country
          <select id="country">
            <option value="">Select Country</option>
            ${countries.map(c => `<option value="${c.code}" ${selectedCountry?.code === c.code ? "selected" : ""}>${c.flag} ${c.name}</option>`).join("")}
          </select>
        </label>
        <label>City (Optional)
          <select id="city" ${selectedCountry ? "" : "disabled"}>
            <option value="">${selectedCountry ? "Select City" : "Select Country First"}</option>
            ${(selectedCountry?.cities || []).map(c => `<option ${selectedCity === c ? "selected" : ""}>${c}</option>`).join("")}
          </select>
        </label>
        <label>Year
          <select id="year">
            ${[selectedYear, selectedYear + 1, selectedYear + 2].map(y => `<option ${y === selectedYear ? "selected" : ""}>${y}</option>`).join("")}
          </select>
        </label>
        <button class="primary" id="explore">⌕ &nbsp; Explore</button>
      </div>
    </section>

    <div class="section-title"><h2>⚑ &nbsp; Country Information</h2></div>
    <section class="card country-card">
      ${selectedCountry ? `
        <div class="country-details">
          <div>
            <div class="flag-title">${selectedCountry.flag} ${selectedCountry.name}</div>
            <p class="muted">${selectedCountry.region}</p>
            <p>Plan your visit to ${selectedCountry.name} and discover local holidays, events, and weather.</p>
          </div>
          <div class="facts">
            <p><small>CAPITAL</small><b>${selectedCountry.capital}</b></p>
            <p><small>LANGUAGE</small><b>${selectedCountry.language}</b></p>
            <p><small>CURRENCY</small><b>${selectedCountry.currency}</b></p>
            <p><small>YOUR CITY</small><b>${selectedCity || "Choose a city"}</b></p>
          </div>
        </div>` : `
        <div class="country-empty">
          <span>◎</span><p>Select a country to view detailed information</p>
        </div>`}
    </section>`;

  document.querySelector("#country").onchange = event => {
    selectedCountry = countries.find(c => c.code === event.target.value) || null;
    selectedCity = "";
    showDashboard();
  };
  document.querySelector("#city").onchange = event => selectedCity = event.target.value;
  document.querySelector("#year").onchange = event => selectedYear = Number(event.target.value);
  document.querySelector("#explore").onclick = () => {
    selectedCity ||= selectedCountry?.capital || "";
    showDashboard();
  };
}

async function showHolidays(view) {
  if (!selectedCountry) {
    content.innerHTML = `<section class="card empty">Choose a country on Dashboard first.</section>`;
    return;
  }

  content.innerHTML = `<section class="card empty">Loading holidays…</section>`;

  try {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${selectedYear}/${selectedCountry.code}`);
    holidays = await response.json();

    if (view === "Long Weekends") {
      holidays = holidays.filter(holiday => {
        const day = new Date(`${holiday.date}T12:00:00`).getDay();
        return day === 1 || day === 5;
      });
    }

    content.innerHTML = `
      <div class="section-title"><h2>${view} in ${selectedCountry.name} · ${selectedYear}</h2></div>
      <div class="list">
        ${holidays.map(h => `
          <article class="card list-row">
            <div class="date-tile">${new Date(`${h.date}T12:00:00`).toLocaleDateString("en", { month: "short", day: "numeric" })}</div>
            <div class="row-info"><h3>${h.localName}</h3><p>${h.name}</p></div>
            <button class="save-button" data-title="${h.localName}" data-date="${h.date}">＋ Save</button>
          </article>`).join("")}
      </div>`;

    bindSaveButtons();
  } catch {
    content.innerHTML = `<section class="card empty">Could not load holidays. Check your internet connection.</section>`;
  }
}

function showEvents() {
  const city = selectedCity || selectedCountry?.capital || "your city";
  const events = [
    ["City Music Festival", "June 18", "Music"],
    ["Open Air Arts Week", "August 7", "Arts"],
    ["International Food Fair", "October 3", "Culture"],
  ];

  content.innerHTML = `
    <div class="section-title"><h2>Events in ${city}</h2><p>Event suggestions for your destination</p></div>
    <div class="list">${events.map(e => `
      <article class="card list-row">
        <div class="date-tile">✦</div>
        <div class="row-info"><h3>${e[0]}</h3><p>${e[1]} · ${e[2]}</p></div>
        <button class="save-button" data-title="${e[0]}" data-date="${e[1]}">＋ Save</button>
      </article>`).join("")}
    </div>`;
  bindSaveButtons();
}

function bindSaveButtons() {
  document.querySelectorAll(".save-button").forEach(button => {
    button.onclick = () => {
      plans.push({ title: button.dataset.title, date: button.dataset.date });
      localStorage.setItem("wanderlustPlans", JSON.stringify(plans));
      button.textContent = "✓ Saved";
    };
  });
}

function showPlans() {
  content.innerHTML = plans.length
    ? `<div class="list">${plans.map((plan, index) => `
        <article class="card list-row">
          <div class="row-info"><h3>${plan.title}</h3><p>${plan.date}</p></div>
          <button class="save-button" data-delete="${index}">Delete</button>
        </article>`).join("")}</div>`
    : `<section class="card empty"><h2>Your saved plans will appear here</h2><p>Save a holiday or event to start planning.</p></section>`;

  document.querySelectorAll("[data-delete]").forEach(button => {
    button.onclick = () => {
      plans.splice(Number(button.dataset.delete), 1);
      localStorage.setItem("wanderlustPlans", JSON.stringify(plans));
      showPlans();
    };
  });
}

async function showWeather() {
  const city = selectedCity || selectedCountry?.capital;

  if (!city) {
    content.innerHTML = `<section class="card empty">Choose a country and city on Dashboard first.</section>`;
    return;
  }

  content.innerHTML = `<section class="card empty">Loading forecast…</section>`;

  try {
    const search = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const place = (await search.json()).results?.[0];
    if (!place) throw new Error("City not found");

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto&forecast_days=7`
    );
    const weather = await response.json();

    content.innerHTML = `
      <div class="section-title"><h2>7-day forecast · ${city}</h2></div>
      <section class="card">
        <p>Now ${Math.round(weather.current.temperature_2m)}°C · Humidity ${weather.current.relative_humidity_2m}% · Wind ${weather.current.wind_speed_10m} km/h</p>
        <div class="forecast">
          ${weather.daily.time.map((date, i) => `
            <article class="card day">
              <b>${new Date(`${date}T12:00:00`).toLocaleDateString("en", { weekday: "short" })}</b>
              <span>☀</span>
              <b>${Math.round(weather.daily.temperature_2m_max[i])}°C</b>
              <small>Low ${Math.round(weather.daily.temperature_2m_min[i])}°C</small>
              <small>Rain ${weather.daily.precipitation_probability_max?.[i] ?? 0}%</small>
            </article>`).join("")}
        </div>
      </section>`;
  } catch {
    content.innerHTML = `<section class="card empty">Weather is unavailable right now. Try again later.</section>`;
  }
}

function showCurrency() {
  const currencies = ["USD", "EUR", "GBP", "EGP", "JPY", "CAD", "AUD", "AED", "SAR", "TRY", "MAD", "INR"];

  content.innerHTML = `
    <section class="card">
      <div class="section-title"><h2>Currency Converter</h2><p>Live reference exchange rates</p></div>
      <div class="converter">
        <label>Amount<input id="amount" type="number" value="100" min="0"></label>
        <label>From<select id="from">${currencies.map(c => `<option ${c === "USD" ? "selected" : ""}>${c}</option>`).join("")}</select></label>
        <span></span>
        <label>To<select id="to">${currencies.map(c => `<option ${c === "EGP" ? "selected" : ""}>${c}</option>`).join("")}</select></label>
        <button class="primary" id="convert">Convert</button>
      </div>
      <div class="rate" id="rate">Choose currencies and press Convert.</div>
    </section>`;

  document.querySelector("#convert").onclick = async () => {
    const from = document.querySelector("#from").value;
    const to = document.querySelector("#to").value;
    const amount = Number(document.querySelector("#amount").value);

    try {
      const response = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
      const data = await response.json();
      document.querySelector("#rate").textContent =
        `${amount} ${from} = ${(amount * data.rates[to]).toFixed(2)} ${to} · Rate dated ${data.date}`;
    } catch {
      document.querySelector("#rate").textContent = "Exchange rate unavailable right now.";
    }
  };
}

document.querySelector("#clock").textContent = new Date().toLocaleString("en", {
  weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
});

setInterval(() => {
  document.querySelector("#clock").textContent = new Date().toLocaleString("en", {
    weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  });
}, 30000);

showPage("Dashboard");