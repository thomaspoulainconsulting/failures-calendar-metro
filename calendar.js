const startButton = document.getElementById("startButton");
const startMenu = document.getElementById("startMenu");
const subtitle = document.getElementById("subtitle");
const breakdownsTitle = document.getElementById("breakdownsTitle");
const calendar = document.getElementById("calendar");

function toggleStartMenu() {
  const isOpen = startMenu.style.display === "block";
  startMenu.style.display = isOpen ? "none" : "block";
  startButton.classList.toggle("pressed", !isOpen);
}

function updateClock() {
  const now = new Date();
  const clockTime = document.getElementById("clockTime");
  clockTime.textContent = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}
setInterval(updateClock, 1000);
updateClock();

document.addEventListener("click", (e) => {
  const isClickInside = startButton.contains(e.target) || startMenu.contains(e.target);
  if (!isClickInside) {
    startMenu.style.display = "none";
    startButton.classList.remove("pressed");
  }
});

const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const breakdowns = [
  "2025-06-27", "2025-06-25", "2025-06-24", "2025-06-21", "2025-06-20", "2025-06-19",
  "2025-06-17", "2025-06-16", "2025-06-13", "2025-06-09", "2025-06-08", "2025-06-07",
  "2025-06-06", "2025-06-05", "2025-06-03", "2025-06-02", "2025-06-01", "2025-05-26",
  "2025-05-24", "2025-05-22", "2025-05-20", "2025-05-19", "2025-05-17", "2025-05-16",
  "2025-05-15", "2025-05-13", "2025-05-12", "2025-05-11", "2025-05-11", "2025-05-05",
  "2025-05-01", "2025-04-30", "2025-04-29", "2025-04-26", "2025-04-22", "2025-04-16",
  "2025-04-19", "2025-04-12", "2025-04-11", "2025-04-05", "2025-04-04", "2025-04-03",
  "2025-04-02", "2025-03-28", "2025-03-25", "2025-03-19", "2025-03-17", "2025-03-13",
  "2025-03-12", "2025-03-10", "2025-03-09", "2025-03-08", "2025-03-05", "2025-02-28",
  "2025-02-26", "2025-02-22", "2025-02-21", "2025-02-16", "2025-02-15", "2025-02-14",
  "2025-02-13", "2025-02-11", "2025-02-10", "2025-02-09", "2025-02-08", "2025-02-07",
  "2025-02-04", "2025-02-01", "2025-01-31", "2025-01-30", "2025-01-29", "2025-01-25",
  "2025-01-24", "2025-01-22", "2025-01-16", "2025-01-10", "2025-01-06", "2025-01-02",
  "2025-01-01",
];

// Déterminer la plus longue période sans panne
const sorted = [...new Set(breakdowns)].map(d => new Date(d)).sort((a, b) => a - b);
let maxDiff = 0, from = null, to = null;

for (let i = 1; i < sorted.length; i++) {
  const diff = (sorted[i] - sorted[i - 1]) / (1000 * 60 * 60 * 24);
  if (diff > maxDiff) {
    maxDiff = diff;
    from = sorted[i - 1];
    to = sorted[i];
  }
}

const today = new Date();
const startOfYear = new Date(today.getFullYear(), 0, 1);
const daysSinceStart = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
const joursSansPanne = maxDiff - 2;

subtitle.textContent = `Période maximale sans panne : ${joursSansPanne} jours (du ${from.toLocaleDateString()} au ${to.toLocaleDateString()})`;
breakdownsTitle.textContent = `Nombre de jours avec au moins une panne: ${breakdowns.length} / ${daysSinceStart} (${Math.round(breakdowns.length / daysSinceStart * 100)}% du temps)`;

function showErrorPopup(dateStr) {
  const popup = document.createElement("div");
  popup.className = "error-popup";
  popup.innerHTML = `
    <div class="error-header">Panne</div>
    <div class="error-body">⚠<div>Une panne a été enregistrée le ${dateStr}.</div></div>
    <div class="error-buttons">
      <button onclick="this.closest('.error-popup').remove()">OK</button>
    </div>`;
  document.body.appendChild(popup);
}

for (let m = 0; m < 12; m++) {
  const date = new Date(2025, m, 1);
  const monthDiv = document.createElement("div");
  monthDiv.className = "month";

  const header = document.createElement("h2");
  header.textContent = monthNames[m];
  monthDiv.appendChild(header);

  const daysDiv = document.createElement("div");
  daysDiv.className = "days";

  dayNames.forEach(name => {
    const dayName = document.createElement("div");
    dayName.className = "day-name";
    dayName.textContent = name;
    daysDiv.appendChild(dayName);
  });

  const firstDay = (date.getDay() + 6) % 7;
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "day";
    daysDiv.appendChild(empty);
  }

  const daysInMonth = new Date(2025, m + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const day = document.createElement("div");
    day.className = "day";
    day.textContent = d;

    const dateStr = `2025-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (breakdowns.includes(dateStr)) {
      day.classList.add("breakdown");
      day.addEventListener("click", () => showErrorPopup(dateStr));
    }

    daysDiv.appendChild(day);
  }

  monthDiv.appendChild(daysDiv);
  calendar.appendChild(monthDiv);
}
