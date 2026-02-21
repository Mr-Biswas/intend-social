// ===============================
// INTEND SOCIAL - LIVE REVIEW SYSTEM
// Structure: Timestamp | Client Name | Review | Rating | Date
// ===============================

const sheetID = "10ti0TLwhXyOyLXF-5hgF1Pu-z7Vk8k1GGjAtT_4sIYs";
const sheetURL = `https://opensheet.elk.sh/${sheetID}/Form%20Responses%201`;

function loadData() {
  fetch(sheetURL)
    .then(res => res.json())
    .then(data => {

      const reviewsContainer = document.getElementById("reviewsContainer");
      const customerCount = document.getElementById("customerCount");

      if (!reviewsContainer || !customerCount) {
        console.log("Required HTML elements not found.");
        return;
      }

      reviewsContainer.innerHTML = "";

      // Update total client count
      customerCount.textContent = data.length + "+";

      // Sort newest first using Date column
      data.sort((a, b) => {
        return new Date(b["Date"]) - new Date(a["Date"]);
      });

      // Show only latest 4
      const latestFour = data.slice(0, 4);

      latestFour.forEach(client => {

        if (!client["Review"]) return;

        const reviewCard = document.createElement("div");
        reviewCard.classList.add("review-card");

        reviewCard.innerHTML = `
          <h3>${client["Client Name"]}</h3>
          <p class="review-text">"${client["Review"]}"</p>
          <div class="rating">${"⭐".repeat(parseInt(client["Rating"]))}</div>
          <small class="review-date">${formatDate(client["Date"])}</small>
        `;

        reviewsContainer.appendChild(reviewCard);
      });

    })
    .catch(error => console.error("Fetch error:", error));
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

loadData();

// Auto refresh every 5 minutes
setInterval(loadData, 300000);

// ===============================
// CONTACT FORM SUBMIT
// ===============================

// ===============================
// CONTACT FORM GOOGLE SHEET SUBMIT
// ===============================

document.addEventListener("DOMContentLoaded", function () {

  const contactForm = document.getElementById("contactForm");

  if (contactForm) {

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Create FormData directly from form
      const formData = new FormData(contactForm);

      fetch("https://script.google.com/macros/s/AKfycbwZj3o_gWy5vUegEkugjcRfSiX7QBlj-N3YtAUfO6KSic2BZSqtWC3usXUWDLtudqVfow/exec", {
        method: "POST",
        body: formData
      })
      .then(response => response.text())
      .then(data => {
        alert("Message sent successfully!");
        contactForm.reset();
      })
      .catch(error => {
        alert("Something went wrong. Please try again.");
        console.error(error);
      });

    });

  }

});