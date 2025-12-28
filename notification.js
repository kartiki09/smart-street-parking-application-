/* =========================================
   MEMBER 3 – OFFLINE + SMART LOGIC (ADD-ON)
   DOES NOT MODIFY MEMBER 2 CODE
========================================= */

/* ---------- OFFLINE DETECTION ---------- */

window.addEventListener("offline", () => {
  alert("⚠️ You are offline. Parking updates will sync later.");
});

window.addEventListener("online", () => {
  alert("✅ Back online. Syncing parking updates...");
  syncOfflineActions();
});

function isOnline() {
  return navigator.onLine;
}

/* ---------- OFFLINE ACTION QUEUE ---------- */

function saveOfflineAction(action) {
  const queue = JSON.parse(localStorage.getItem("offlineQueue")) || [];
  queue.push(action);
  localStorage.setItem("offlineQueue", JSON.stringify(queue));
}

function syncOfflineActions() {
  const queue = JSON.parse(localStorage.getItem("offlineQueue")) || [];

  if (queue.length === 0) return;

  console.log("Synced offline actions:", queue);
  localStorage.removeItem("offlineQueue");
}

/* ---------- PARKING CONFIRMATION LOGIC ---------- */

function scheduleParkingConfirmation(slotNumber) {
  setTimeout(() => {
    sendParkingConfirmation(slotNumber);
  }, 30000); // demo delay
}

function sendParkingConfirmation(slotNumber) {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification("🚗 Parking Status Check", {
        body: `Is your vehicle still parked at Slot ${slotNumber}?`
      });
    } else {
      Notification.requestPermission();
    }
  } else {
    alert(`Is your vehicle still parked at Slot ${slotNumber}?`);
  }
}

/* ---------- LISTEN TO MEMBER-2 RESERVATIONS ---------- */
/*
   We DO NOT change confirmReservation().
   We just observe changes using MutationObserver.
*/

const observer = new MutationObserver(() => {
  document.querySelectorAll(".slot.yellow").forEach(slot => {
    const slotNumber = slot.textContent.match(/Slot (\w+)/)?.[1];
    if (slotNumber && !slot.dataset.notified) {
      slot.dataset.notified = "true";
      scheduleParkingConfirmation(slotNumber);

      if (!isOnline()) {
        saveOfflineAction({
          type: "RESERVE_SLOT",
          slot: slotNumber
        });
      }
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });
