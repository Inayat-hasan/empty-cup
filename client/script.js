// Environment configuration
const API_BASE_URL = "http://127.0.0.1:5000";

// API endpoints
const API_ENDPOINTS = {
  GET_ALL_DESIGNERS: `${API_BASE_URL}/designer/getAll`,
  GET_SHORTLISTED: `${API_BASE_URL}/designer/getShortlisted`,
  TOGGLE_SHORTLISTED: `${API_BASE_URL}/designer/toggleShortlisted`,
};

// Loading state management
const showLoading = (container) => {
  container.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading designers...</p>
    </div>
  `;
};

const showError = (container, message, retryCallback) => {
  container.innerHTML = `
    <div class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <p>${message}</p>
      <button onclick="${retryCallback}" class="retry-button">
        <i class="fas fa-redo"></i> Retry
      </button>
    </div>
  `;
};

const showEmptyState = (container, message) => {
  container.innerHTML = `
    <div class="empty-state">
      <i class="fas fa-folder-open"></i>
      <p>${message}</p>
    </div>
  `;
};

// API calls with better error handling
const fetchDesigners = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.GET_ALL_DESIGNERS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching designers:", error);
    throw error;
  }
};

const fetchShortlistedDesigners = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.GET_SHORTLISTED, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching shortlisted designers:", error);
    throw error;
  }
};

const renderContent = async () => {
  const path = window.location.pathname;
  const designerListContainer = document.querySelector(
    ".designer-list-container"
  );

  showLoading(designerListContainer);

  try {
    let designers = [];
    if (path === "/shortlisted") {
      designers = await fetchShortlistedDesigners();
      document.querySelectorAll(".tab-item").forEach((tab) => {
        tab.classList.remove("active");
        if (tab.querySelector("span").textContent === "Shortlisted") {
          tab.classList.add("active");
        }
      });
    } else {
      designers = await fetchDesigners();
    }

    if (designers.length > 0) {
      renderDesignerCards(designers);
    } else {
      showEmptyState(designerListContainer, "No designers to display.");
    }
  } catch (error) {
    showError(
      designerListContainer,
      "Unable to load designers. Please try again later.",
      "renderContent()"
    );
  }
};

function generateStars(rating) {
  let starsHtml = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      starsHtml += '<i class="fas fa-star filled"></i>';
    } else if (i - 0.5 <= rating) {
      starsHtml += '<i class="fas fa-star-half-alt filled"></i>'; // Or use another way to show half stars if preferred
    } else {
      starsHtml += '<i class="far fa-star empty"></i>'; // Using far for empty for better distinction
    }
  }
  return starsHtml;
}

function renderDesignerCards(designers) {
  const designerListContainer = document.querySelector(
    ".designer-list-container"
  );
  designerListContainer.innerHTML = "";

  designers.forEach((designer) => {
    const card = document.createElement("div");
    card.classList.add("designer-card");
    card.dataset.id = designer._id;

    card.innerHTML = `
                <div class="designer-info">
                    <h3>${designer.name}</h3>
                    <div class="designer-rating">
                        ${generateStars(designer.ratings)}
                    </div>
                    <p class="designer-description">${designer.description}</p>
                    <div class="designer-stats">
                        <div class="stat-item">
                            <strong>${designer.projects}</strong>
                            <span>Projects</span>
                        </div>
                        <div class="stat-item">
                            <strong>${designer.years}</strong>
                            <span>Years</span>
                        </div>
                        <div class="stat-item designer-price">
                            <strong>$${designer.price}</strong>
                            <span>Price</span>
                        </div>
                    </div>
                    <div class="designer-contact">
                      <p>${designer.email}</p>
                      <p>${designer.phone}</p>
                    </div>
                </div>
                <div class="designer-actions">
                    <button class="action-button details-btn" aria-label="Details">
                        <i class="fas fa-arrow-right"></i>
                        <span>Details</span>
                    </button>
                    <button class="action-button hide-btn" aria-label="Hide">
                        <i class="fas fa-eye-slash"></i>
                        <span>Hide</span>
                    </button>
                    <button class="action-button shortlist-btn" aria-label="Shortlist">
                        <i class="fas fa-bookmark ${
                          designer.isShortlisted ? "shortlisted" : ""
                        }"></i>
                        <span>Shortlist</span>
                    </button>
                    <button class="action-button report-btn" aria-label="Report">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Report</span>
                    </button>
                </div>
            `;
    designerListContainer.appendChild(card);
  });

  addEventListenersToButtons(designers);
}

function addEventListenersToButtons() {
  const shortlistButtons = document.querySelectorAll(".shortlist-btn");

  shortlistButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const cardElement = this.closest(".designer-card");
      const designerId = cardElement.dataset.id;
      const originalIcon = this.querySelector("i").cloneNode(true);

      try {
        // Show loading state on button
        this.disabled = true;
        this.querySelector("i").className = "fas fa-spinner fa-spin";

        const response = await fetch(API_ENDPOINTS.TOGGLE_SHORTLISTED, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ designer_id: designerId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Restore the original icon with updated shortlisted state
        const icon = this.querySelector("i");
        icon.className = "fas fa-bookmark";
        if (data.designer.isShortlisted) {
          icon.classList.add("shortlisted");
        }

        // If we're on the shortlisted page, remove the card after unshortlisting
        if (
          window.location.pathname === "/shortlisted" &&
          !data.designer.isShortlisted
        ) {
          cardElement.remove();

          // Check if there are any cards left
          if (document.querySelectorAll(".designer-card").length === 0) {
            showEmptyState(
              document.querySelector(".designer-list-container"),
              "No shortlisted designers to display."
            );
          }
        }
      } catch (error) {
        console.error("Error toggling shortlist:", error);
        // Restore original icon on error
        this.querySelector("i").replaceWith(originalIcon);
        showError(
          document.querySelector(".designer-list-container"),
          "Failed to update shortlist. Please try again.",
          "renderContent()"
        );
      } finally {
        this.disabled = false;
      }
    });
  });
}

function handleInitialRoute() {
  const path = window.location.pathname;
  tabItems.forEach((tab) => {
    const tabText = tab.querySelector("span").textContent;
    if (
      (path === "/shortlisted" && tabText === "Shortlisted") ||
      (path === "/" && tabText === "Contacts")
    ) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });
}

const tabItems = document.querySelectorAll(".tab-item");

document.addEventListener("DOMContentLoaded", async () => {
  tabItems.forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabText = this.querySelector("span").textContent;

      // Remove active class from all tabs
      tabItems.forEach((t) => t.classList.remove("active"));
      // Add active class to clicked tab
      this.classList.add("active");

      if (tabText === "Shortlisted") {
        history.pushState({}, "", "/shortlisted");
        renderContent();
      } else if (tabText === "Contacts") {
        history.pushState({}, "", "/");
        renderContent();
      }
    });
  });

  // Handle browser back/forward buttons
  window.addEventListener("popstate", () => {
    handleInitialRoute();
    renderContent();
  });

  // Initial render based on current URL
  handleInitialRoute();
  renderContent();
});
