const areaSelect = document.getElementById("areaSelect");
const slotsContainer = document.getElementById("slotsContainer");
const modal = document.getElementById("modal");

let selectedSlot = null;
let selectedSlotDiv = null; // Track the clicked slot element

/* ------------------------------
   MOCK DATA (Frontend Prototype)
--------------------------------*/
const parkingAreas = [
  { id: 1, name: "Main Campus" },
  { id: 2, name: "Library Area" },
  { id: 3, name: "Hostel Parking" }
];

const parkingSlots = {
  1: [
    { id: 101, number: "A1", status: "available" },
    { id: 102, number: "A2", status: "occupied" },
    { id: 103, number: "A3", status: "available" },
    { id: 104, number: "A4", status: "reserved" }
  ],
  2: [
    { id: 201, number: "B1", status: "available" },
    { id: 202, number: "B2", status: "occupied" },
    { id: 203, number: "B3", status: "available" }
  ],
  3: [
    { id: 301, number: "C1", status: "available" },
    { id: 302, number: "C2", status: "reserved" }
  ]
};

/* ------------------------------
   LOAD AREAS
--------------------------------*/
function loadAreas() {
  parkingAreas.forEach(area => {
    const option = document.createElement("option");
    option.value = area.id;
    option.textContent = area.name;
    areaSelect.appendChild(option);
  });
}

/* ------------------------------
   LOAD SLOTS
--------------------------------*/

function loadSlots(areaId) {
  slotsContainer.innerHTML = "";

  const slots = parkingSlots[areaId] || [];

  slots.forEach(slot => {
    const div = document.createElement("div");

    // Assign color class based on status
    if (slot.status === "available") div.className = "slot green";
    else if (slot.status === "reserved") div.className = "slot yellow";
    else if (slot.status === "occupied") div.className = "slot red";

    div.textContent = `Slot ${slot.number}`;

    const statusText = document.createElement("small");
    statusText.textContent = slot.status.charAt(0).toUpperCase() + slot.status.slice(1);
    div.appendChild(statusText);

    if (slot.status === "available") {
      div.addEventListener("click", () => openModal(slot, div));
    }

    slotsContainer.appendChild(div);
  });
}

function confirmReservation() {
  // Update data
  selectedSlot.status = "reserved";

  // Update slot element
  if (selectedSlotDiv) {
    selectedSlotDiv.className = "slot yellow"; // Reserved
    selectedSlotDiv.querySelector("small").textContent = "Reserved";
    selectedSlotDiv.style.cursor = "not-allowed";
  }

  alert(`Slot ${selectedSlot.number} Reserved Successfully ✅`);
  closeModal();
}

/* ------------------------------
   MODAL LOGIC
--------------------------------*/
function openModal(slot, slotDiv) {
  selectedSlot = slot;
  selectedSlotDiv = slotDiv;

  modal.innerHTML = `
    <div class="modal-box">
      <h3>Confirm Reservation</h3>
      <p>Do you want to reserve Slot <strong>${slot.number}</strong>?</p>
      <div style="margin-top:15px; display:flex; gap:10px; justify-content:center;">
        <button onclick="confirmReservation()" class="confirm-btn">Confirm</button>
        <button onclick="closeModal()" class="cancel-btn">Cancel</button>
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  modal.innerHTML = "";
  selectedSlot = null;
  selectedSlotDiv = null;
}

function confirmReservation() {
  // Update slot status in data
  selectedSlot.status = "reserved";

  // Update slot element class and text
  if (selectedSlotDiv) {
    selectedSlotDiv.className = "slot reserved"; // Apply reserved color class
    selectedSlotDiv.querySelector("small").textContent = "Reserved";
    selectedSlotDiv.style.cursor = "not-allowed"; // Prevent further clicks
  }

  alert(`Slot ${selectedSlot.number} Reserved Successfully ✅`);
  closeModal();
}

/* ------------------------------
   CLOSE MODAL ON BACKDROP CLICK
--------------------------------*/
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

/* ------------------------------
   EVENTS
--------------------------------*/
areaSelect.addEventListener("change", () => {
  const areaId = areaSelect.value;
  if (areaId) loadSlots(areaId);
});

/* ------------------------------
   INIT
--------------------------------*/
loadAreas();
