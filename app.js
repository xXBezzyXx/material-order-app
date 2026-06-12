
const DEFAULT_PDF_LETTERHEAD = {
  leftLogo: "pdf-assets/ac-general-logo.png",
  rightLogo: "pdf-assets/gator-100-logo.png",
  titleLine1: "Commercial Mechanical",
  titleLine2: "Industrial Refrigeration",
  address: "401 Agmac Avenue, Jacksonville, FL 32254",
  phoneFax: "Phone (904) 783-4200  Fax (904) 781-0806",
  website: "acgeneral.net",
  license: "CMC1250807",
  companyName: "AC General",
  documentTitle: "MATERIAL PROCUREMENT REQUEST",
  footerMessage: "Thank you for using the Material Order App!"
};

function mergePdfLetterhead(settings) {
  return { ...DEFAULT_PDF_LETTERHEAD, ...(settings && settings.pdfLetterhead ? settings.pdfLetterhead : {}) };
}

function getAppSettings() {
  const defaults = {
    companyTitle: "AC General",
    mainPageTitle: "Jobs",
    googleAppsScriptUrl: "",
    orderCcEmail: "nmcdonald@acgeneral.net",
    pdfLetterhead: DEFAULT_PDF_LETTERHEAD
  };

  const saved = localStorage.getItem("materialOrderSettings");
  if (!saved) {
    localStorage.setItem("materialOrderSettings", JSON.stringify(defaults));
    return defaults;
  }

  try {
    const parsed = JSON.parse(saved);
    return { ...defaults, ...parsed, pdfLetterhead: mergePdfLetterhead(parsed) };
  } catch {
    return defaults;
  }
}

function applyAppSettings() {
  const settings = getAppSettings();
  const companyTitle = document.getElementById("companyTitle");
  if (companyTitle) companyTitle.textContent = settings.companyTitle || DEFAULT_SETTINGS.companyTitle;

  const mainPageTitle = document.getElementById("mainPageTitle");
  if (mainPageTitle) mainPageTitle.textContent = settings.mainPageTitle || "Jobs";

  document.title = `${settings.companyTitle || DEFAULT_SETTINGS.companyTitle} - Material Orders`;
}

const ORDER_EMAIL = "nmcdonald@acgeneral.net";

const DEFAULT_JOBS = [
  { name: "DCPS Spring Park", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "UF Jax Bay Street", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "FSDB", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "NE Park", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "SMA", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "RR", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "Other Job", active: true, email: "nmcdonald@acgeneral.net" }
];

function getStoredJobs() {
  const saved = localStorage.getItem("materialOrderJobs");
  if (!saved) {
    localStorage.setItem("materialOrderJobs", JSON.stringify(DEFAULT_JOBS));
    return DEFAULT_JOBS;
  }

  try {
    const jobs = JSON.parse(saved);
    return Array.isArray(jobs) ? jobs : DEFAULT_JOBS;
  } catch {
    return DEFAULT_JOBS;
  }
}

function getActiveJobs() {
  return getStoredJobs().filter(job => job.active !== false).map(job => job.name);
}


function getJobEmail(jobName) {
  try {
    const savedJobs = localStorage.getItem("materialOrderJobs");
    const jobs = savedJobs ? JSON.parse(savedJobs) : [];
    const selected = jobs.find(job => String(job.name || "").trim() === String(jobName || "").trim());

    if (selected && selected.email && String(selected.email).trim()) {
      return String(selected.email).trim();
    }
  } catch (error) {
    console.warn("Could not find job email.", error);
  }

  return "nmcdonald@acgeneral.net";
}


const standardSizes = ['1/4"', '3/8"', '1/2"'];

const DEFAULT_CATEGORIES = {
  hanging: {
    label: "Hanging Material",
    items: [
      { icon: "🔩", name: "Nuts", options: standardSizes, units: ["Box", "Each"] },
      { icon: "🔧", name: "Bolts", options: ["TDC Bolt"], units: ["Box", "Each"] },
      { icon: "⚙️", name: "Washers", options: standardSizes, units: ["Box", "Each"] },
      { icon: "➖", name: "All Thread", options: standardSizes, units: ["Bundle", "Stick", "Each"] },
      { icon: "▰", name: "Unistrut", options: ["1-5/8 x 10 ft"], units: ["Bundle", "Stick", "Each"] },
      { icon: "⛓️", name: "Beam Clamps", options: standardSizes, units: ["Box", "Each"] }
    ]
  },
  fasteners: {
    label: "Fasteners",
    items: [
            { icon: "🪛", name: "Self Tapping Screws", options: ['5/16"', '#14 x 5" Self-Drilling TEK 5 Curb Screw'], units: ["Box", "Each"] },
      { icon: "🔩", name: "Tapcons", options: ['1/4" - 1"', '1/4" - 1.5"', '1/4" - 2"', '1/4" - 2.5"', '1/4" - 3"', '1/4" - 3.5"', '1/4" - 4"'], units: ["Box", "Each"] },
      { icon: "🔧", name: "Anchors", units: ["Box", "Each"] },
      { icon: "⚙️", name: "Fender Washers", units: ["Box", "Each"] }
    ]
  },
  duct: {
    label: "Duct Material",
    items: [
      { icon: "🪣", name: "Duct Seal", units: ["Bucket", "Pallet"] },
      { icon: "◻️", name: "Foil Tape", units: ["Each", "Box"] },
      { icon: "〰️", name: "Flex Duct", options: ['6"', '8"', '10"', '12"', '14"', '16"'], units: ["Each"] },
      { icon: "🧱", name: "Duct Wrap", units: ["Each"] },
      { icon: "▣", name: "Drive Cleat", units: ["Bundle", "Stick"] },
      { icon: "▣", name: "S-Lock", units: ["Bundle", "Stick"] },
      { icon: "▣", name: "Pittsburgh", units: ["Bundle", "Stick"] },
      { icon: "📦", name: "Hanger Strap", units: ["Roll", "Box"] }
    ]
  },
  pipe: {
    label: "Pipe & Fittings",
    items: [
      { icon: "│", name: "Copper Pipe", units: ["Stick", "Bundle", "Each"] },
      { icon: "│", name: "PVC Pipe", units: ["Stick", "Bundle", "Each"] },
      { icon: "◯", name: "Pipe Insulation", units: ["Box", "Stick", "Each"] },
      { icon: "🪣", name: "PVC Glue", units: ["Can", "Box", "Each"] },
      { icon: "🪣", name: "Primer", units: ["Can", "Box", "Each"] },
      { icon: "🔧", name: "Pipe Clamps", units: ["Box", "Each"] }
    ]
  },
  tools: {
    label: "Tools & Consumables",
    items: [
      { icon: "📌", name: "Pins", options: ['1"', '1-1/4"', '1-1/2"', '2"'], units: ["Box", "Each"] },
      { icon: "💥", name: "Shots", options: ["Green", "Yellow", "Red"], units: ["Box", "Each"] },
      { icon: "🪚", name: "Sawzall Blades", options: ["Metal", "Demo", "Fine Tooth"], units: ["Pack", "Each"] },
      { icon: "🌀", name: "Drill Bits", options: ['1/4"', '3/8"', '1/2"'], units: ["Each", "Pack"] },
      { icon: "⭕", name: "Hole Saws", options: ['2"', '3"', '4"', '6"'], units: ["Each"] },
      { icon: "🧻", name: "Blue Wrap", options: ['24"', '36"'], units: ["Roll", "Each"] },
      { icon: "🧤", name: "Gloves", units: ["Box", "Pair", "Each"] },
      { icon: "🥽", name: "Safety Glasses", units: ["Box", "Pair", "Each"] },
    ]
  }
};

function cleanCategories(categories) {
  const cleaned = categories && typeof categories === "object" ? { ...categories } : {};
  delete cleaned.other;
  return cleaned;
}

function getStoredCategories() {
  const saved = localStorage.getItem("materialOrderCategories");

  if (!saved) {
    localStorage.setItem("materialOrderCategories", JSON.stringify(cleanCategories(DEFAULT_CATEGORIES)));
    return JSON.parse(JSON.stringify(cleanCategories(DEFAULT_CATEGORIES)));
  }

  try {
    const categories = JSON.parse(saved);
    const cleaned = categories && typeof categories === "object" ? cleanCategories(categories) : cleanCategories(DEFAULT_CATEGORIES);
    localStorage.setItem("materialOrderCategories", JSON.stringify(cleaned));
    return cleaned;
  } catch {
    return JSON.parse(JSON.stringify(cleanCategories(DEFAULT_CATEGORIES)));
  }
}

let categories = getStoredCategories();

function refreshCategoriesFromStorage() {
  categories = getStoredCategories();
  renderCategories();
  renderMaterials();
}


let activeCategory = "hanging";
let selectedOptions = {};
let selectedUnits = {};
let draftQty = {};
let qtyResetLock = {};
let customDrafts = {};
let cart = [];
let selectedPriority = "Normal";
let currentSelectedJob = localStorage.getItem("materialOrderSelectedJob") || "";

function safeText(text) {
  return String(text || "")
    .split("&").join("&amp;")
    .split("<").join("&lt;")
    .split(">").join("&gt;")
    .split('"').join("&quot;")
    .split("'").join("&#039;");
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => screen.classList.remove("active"));
  const screen = document.getElementById(id);
  if (screen) screen.classList.add("active");

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.screen === id);
  });
}

window.showScreen = showScreen;

function setPriority(priority) {
  selectedPriority = priority;
  const select = document.getElementById("reviewPrioritySelect");
  if (select) {
    select.value = priority;
    updatePriorityColor();
  }
}

function updatePriorityColor() {
  const select = document.getElementById("reviewPrioritySelect");
  if (!select) return;
  select.classList.remove("priority-normal", "priority-rush", "priority-emergency");

  if (select.value === "Normal") {
    select.classList.add("priority-normal");
  } else if (select.value === "Rush") {
    select.classList.add("priority-rush");
  } else {
    select.classList.add("priority-emergency");
  }
}

function setSelectedJob(job) {
  currentSelectedJob = job || "";
  if (currentSelectedJob) {
    localStorage.setItem("materialOrderSelectedJob", currentSelectedJob);
  }
  const selectedJob = document.getElementById("selectedJob");
  if (selectedJob && currentSelectedJob) {
    selectedJob.value = currentSelectedJob;
  }
}

function selectJob(job) {
  setSelectedJob(job);
  showScreen("orderScreen");
}

function renderJobs() {
  const searchInput = document.getElementById("jobSearch");
  const q = searchInput ? searchInput.value.toLowerCase() : "";
  const list = getActiveJobs().filter(job => job.toLowerCase().includes(q));
  const jobList = document.getElementById("recentOrders") || document.getElementById("jobList");
  if (!jobList) return;

  jobList.innerHTML = list.slice(0, 8).map((job, index) => `
    <button class="job-card" data-job="${safeText(job)}" type="button">
      <div class="job-thumb">📋</div>
      <div>
        <h3>${safeText(job)}</h3>
        <span class="job-meta">Material order ready</span>
      </div>
      <span class="job-status">● Active</span>
      <div class="chev">›</div>
    </button>
  `).join("");

  document.querySelectorAll(".job-card").forEach(button => {
    button.addEventListener("click", () => selectJob(button.dataset.job));
  });
}

function renderJobSelect() {
  const selectedJob = document.getElementById("selectedJob");
  if (!selectedJob) return;

  const jobs = getActiveJobs();
  const previousValue = currentSelectedJob || selectedJob.value || localStorage.getItem("materialOrderSelectedJob") || jobs[0] || "";

  selectedJob.innerHTML = jobs.map(job => `<option value="${safeText(job)}">${safeText(job)}</option>`).join("");

  if (previousValue && jobs.includes(previousValue)) {
    selectedJob.value = previousValue;
    currentSelectedJob = previousValue;
  } else if (jobs.length) {
    selectedJob.value = jobs[0];
    currentSelectedJob = jobs[0];
  }

  if (currentSelectedJob) {
    localStorage.setItem("materialOrderSelectedJob", currentSelectedJob);
  }

  selectedJob.onchange = () => setSelectedJob(selectedJob.value);
}

function renderCategories() {
  if (!categories[activeCategory]) activeCategory = Object.keys(categories)[0] || "hanging";
  const tabs = document.getElementById("categoryTabs");
  if (tabs) {
    tabs.innerHTML = Object.entries(categories).map(([key, cat]) => `
      <button class="chip ${key === activeCategory ? "active" : ""}" data-category="${key}" type="button">${safeText(cat.label)}</button>
    `).join("");

    document.querySelectorAll(".chip").forEach(button => {
      button.addEventListener("click", () => setCategory(button.dataset.category));
    });
  }
  renderQuickOrder();
}

function renderQuickOrder() {
  const quick = document.getElementById("quickOrder");
  if (!quick) return;
  const icons = ["🔩", "▰", "│", "◉", "•••"];
  const entries = Object.entries(categories).slice(0, 5);
  quick.innerHTML = entries.map(([key, cat], index) => `
    <button class="quick-card ${key === activeCategory ? "active" : ""}" data-category="${key}" type="button">
      <span>${icons[index] || "📦"}</span>${safeText(cat.label)}
    </button>
  `).join("");
  document.querySelectorAll(".quick-card").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      showScreen("orderScreen");
      renderCategories();
      renderMaterials();
    });
  });
}

function setCategory(key) {
  activeCategory = key;
  renderCategories();
  renderMaterials();
}

function getItem(category, itemName) {
  return categories[category].items.find(i => i.name === itemName);
}

function baseKey(item) {
  return `${activeCategory}:${item.name}`;
}

function getSelectedOption(item) {
  if (!item.options) return "";
  const key = baseKey(item);
  if (!selectedOptions[key]) selectedOptions[key] = item.options[0];
  return selectedOptions[key];
}

function getSelectedUnit(item) {
  const key = baseKey(item);
  const units = item.units || ["Each"];
  if (!selectedUnits[key]) selectedUnits[key] = units[0];
  return selectedUnits[key];
}

function getDraftQty(item) {
  const key = baseKey(item);
  if (!draftQty[key]) draftQty[key] = 0;
  return draftQty[key];
}

function getCustomDraft(item) {
  const key = baseKey(item);
  return customDrafts[key] || "";
}

function changeCustomDraft(itemName, value) {
  const item = getItem(activeCategory, itemName);
  if (!item) return;
  customDrafts[baseKey(item)] = value;
}

function changeOption(itemName, value) {
  const item = getItem(activeCategory, itemName);
  if (!item) return;
  selectedOptions[baseKey(item)] = value;
  renderMaterials();
}

function changeUnit(itemName, value) {
  const item = getItem(activeCategory, itemName);
  if (!item) return;
  selectedUnits[baseKey(item)] = value;
}


function forceResetAllQtyInputs() {
  Object.keys(draftQty).forEach(key => {
    draftQty[key] = 0;
    qtyResetLock[key] = true;
  });

  document.querySelectorAll(".qty-number-input").forEach(input => {
    input.value = 0;
    input.defaultValue = 0;
    input.setAttribute("value", "0");
  });

  setTimeout(() => {
    document.querySelectorAll(".qty-number-input").forEach(input => {
      input.value = 0;
      input.defaultValue = 0;
      input.setAttribute("value", "0");
    });
  }, 100);

  setTimeout(() => {
    Object.keys(qtyResetLock).forEach(key => qtyResetLock[key] = false);
    Object.keys(draftQty).forEach(key => draftQty[key] = 0);
    renderMaterials();
  }, 300);
}

function changeDraftQty(itemName, amount) {
  const item = getItem(activeCategory, itemName);
  if (!item) return;
  const key = baseKey(item);
  const current = draftQty[key] || 0;
  draftQty[key] = Math.max(0, current + amount);
  renderMaterials();
}

function addToCart(itemName) {
  const item = getItem(activeCategory, itemName);
  if (!item) return;

  const key = baseKey(item);
  const qty = draftQty[key] || 0;
  if (qty <= 0) {
    const selectedJob = document.getElementById("selectedJob");
    if (selectedJob) setSelectedJob(selectedJob.value);
    alert("Please add a quantity before adding to cart.");
    showScreen("orderScreen");
    return;
  }

  const option = getSelectedOption(item);
  const unit = getSelectedUnit(item);
  const customText = item.custom ? getCustomDraft(item).trim() : "";

  if (item.custom && !customText) {
    alert("Please type the custom material you need before adding to cart.");
    showScreen("orderScreen");
    return;
  }

  const orderItemName = item.custom ? customText : item.name;
  const cartKey = item.custom
    ? `${activeCategory}:${item.name}:${customText}:${unit}`
    : `${activeCategory}:${item.name}:${option}:${unit}`;

  const existing = cart.find(line => line.cartKey === cartKey);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      cartKey,
      category: activeCategory,
      categoryLabel: categories[activeCategory].label,
      name: orderItemName,
      option: item.custom ? "" : option,
      unit,
      qty,
      custom: !!item.custom
    });
  }

  draftQty[key] = 0;
  if (item.custom) customDrafts[key] = "";
  renderMaterials();
  renderCartPreview();
}

function removeCartItem(cartKey) {
  cart = cart.filter(item => item.cartKey !== cartKey);
  renderCartPreview();
}

function displayName(item) {
  return item.option ? `${item.name} - ${item.option}` : item.name;
}

function renderCartPreview() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const countEl = document.getElementById("cartCount");
  const previewEl = document.getElementById("cartPreview");

  if (countEl) countEl.textContent = `${count} item${count === 1 ? "" : "s"}`;

  if (!previewEl) return;

  if (cart.length === 0) {
    previewEl.className = "cart-preview-empty";
    previewEl.innerHTML = "Nothing added yet.";
    return;
  }

  previewEl.className = "cart-preview-list";
  previewEl.innerHTML = cart.map(item => `
    <div class="cart-line">
      <div>
        <strong>${safeText(displayName(item))}</strong>
        <span>${safeText(item.categoryLabel)}</span>
      </div>
      <div class="cart-line-right">
        <b>${item.qty} ${safeText(item.unit)}</b>
        <button type="button" data-cart-key="${safeText(item.cartKey)}">×</button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-cart-key]").forEach(button => {
    button.addEventListener("click", () => removeCartItem(button.dataset.cartKey));
  });
}


function renderMaterialIcon(icon) {
  const value = String(icon || "");
  if (
    value.includes("/") ||
    value.endsWith(".png") ||
    value.endsWith(".jpg") ||
    value.endsWith(".jpeg") ||
    value.endsWith(".svg") ||
    value.endsWith(".webp")
  ) {
    return `<img class="material-icon-img" src="${safeText(value)}" alt="" loading="lazy" />`;
  }
  return safeText(value);
}

function renderMaterials() {
  if (!categories[activeCategory]) activeCategory = Object.keys(categories)[0] || "hanging";
  const items = categories[activeCategory].items;
  const materialList = document.getElementById("materialList");
  if (!materialList) return;

  materialList.innerHTML = items.map(item => {
    const qty = getDraftQty(item);

    const customInput = item.custom ? `
      <label class="select-label custom-material-label">
        Material Needed
        <textarea class="custom-material-input" data-item="${safeText(item.name)}" placeholder="${safeText(item.placeholder || "Type what material you need here...")}">${safeText(getCustomDraft(item))}</textarea>
      </label>
    ` : "";

    const sizeSelect = !item.custom && item.options ? `
      <label class="select-label">
        Size
        <select class="variant-select" data-item="${safeText(item.name)}">
          ${item.options.map(option => `<option ${getSelectedOption(item) === option ? "selected" : ""}>${safeText(option)}</option>`).join("")}
        </select>
      </label>
    ` : "";

    const unitSelect = `
      <label class="select-label unit-label">
        Unit
        <select class="unit-select" data-item="${safeText(item.name)}">
          ${(item.units || ["Each"]).map(unit => `<option ${getSelectedUnit(item) === unit ? "selected" : ""}>${safeText(unit)}</option>`).join("")}
        </select>
      </label>
    `;

    return `
      <div class="material-row cart-style-row">
        <div class="material-icon">${renderMaterialIcon(item.icon)}</div>
        <div class="material-info">
          <div class="material-name">${safeText(item.name)}</div>
          ${customInput}
          <div class="select-row mobile-full-controls">
            ${sizeSelect}
            ${unitSelect}
          </div>
        </div>

        <div class="qty-control">
          <button class="minus-btn" data-item="${safeText(item.name)}" type="button">−</button>
          <input class="qty-number-input" data-qty-number="${safeText(item.name)}" type="number" inputmode="numeric" pattern="[0-9]*" min="0" value="${qty}" />
          <button class="plus plus-btn" data-item="${safeText(item.name)}" type="button">+</button>
        </div>

        <button class="add-cart-btn add-cart-wide" data-item="${safeText(item.name)}" type="button">Add to Cart</button>
      </div>
    `;
  }).join("");

  document.querySelectorAll(".custom-material-input").forEach(input => {
    input.addEventListener("input", () => changeCustomDraft(input.dataset.item, input.value));
  });

  document.querySelectorAll(".variant-select").forEach(select => {
    select.addEventListener("change", () => changeOption(select.dataset.item, select.value));
  });

  document.querySelectorAll(".unit-select").forEach(select => {
    select.addEventListener("change", () => changeUnit(select.dataset.item, select.value));
  });

  document.querySelectorAll(".minus-btn").forEach(button => {
    button.addEventListener("click", () => changeDraftQty(button.dataset.item, -1));
  });

  document.querySelectorAll(".plus-btn").forEach(button => {
    button.addEventListener("click", () => changeDraftQty(button.dataset.item, 1));
  });


  document.querySelectorAll(".qty-number-input").forEach(input => {
    input.addEventListener("input", () => {
      const item = getItem(activeCategory, input.dataset.qtyNumber);
      if (!item) return;
      const key = baseKey(item);
      if (qtyResetLock[key]) {
        input.value = 0;
        draftQty[key] = 0;
        return;
      }
      let value = Number(input.value);
      if (!Number.isFinite(value) || value < 0) value = 0;
      draftQty[key] = Math.floor(value);
    });

    input.addEventListener("change", () => {
      const item = getItem(activeCategory, input.dataset.qtyNumber);
      if (!item) return;
      const key = baseKey(item);
      if (qtyResetLock[key]) {
        input.value = 0;
        draftQty[key] = 0;
        return;
      }
      let value = Number(input.value);
      if (!Number.isFinite(value) || value < 0) value = 0;
      value = Math.floor(value);
      draftQty[key] = value;
      input.value = value;
    });

    input.addEventListener("focus", () => {
      setTimeout(() => input.select(), 0);
    });
  });

  document.querySelectorAll(".add-cart-btn").forEach(button => {
    button.addEventListener("click", () => {
      const item = getItem(activeCategory, button.dataset.item);
      if (!item) return;

      const row = button.closest(".material-row");
      const input = row ? row.querySelector(".qty-number-input") : null;
      const key = baseKey(item);

      // Read the typed phone/keyboard value right before adding.
      if (input) {
        let value = Number(input.value);
        if (!Number.isFinite(value) || value < 0) value = 0;
        draftQty[key] = Math.floor(value);
        input.blur();
      }

      addToCart(button.dataset.item);
      forceResetAllQtyInputs();

      // Force this item back to zero after adding.
      draftQty[key] = 0;
      qtyResetLock[key] = true;

      setTimeout(() => {
        draftQty[key] = 0;
        qtyResetLock[key] = false;
        renderMaterials();
      }, 50);
    });
  });
}

function getOrderItems() {
  return cart.map(item => ({
    category: item.category,
    categoryLabel: item.categoryLabel,
    material: item.name,
    option: item.option || "",
    name: displayName(item),
    qty: item.qty,
    unit: item.unit
  }));
}

function goReview() {
  const requestedBy = document.getElementById("requestedBy").value.trim();
  if (!requestedBy) {
    alert("Please enter who is requesting the order.");
    return;
  }

  const items = getOrderItems();
  if (items.length === 0) {
    alert("Please add at least one item to cart.");
    return;
  }

  const job = document.getElementById("selectedJob").value;
  const notes = document.getElementById("notes").value.trim();

  document.getElementById("reviewJobName").textContent = job;

  const prioritySelect = document.getElementById("reviewPrioritySelect");
  if (prioritySelect) {
    prioritySelect.value = selectedPriority;
    updatePriorityColor();
  }

  document.getElementById("reviewNotes").textContent = notes || "None";
  document.getElementById("reviewTotal").textContent = items.reduce((sum, item) => sum + item.qty, 0);

  document.getElementById("reviewItems").innerHTML = items.map(item => `
    <div class="review-line">
      <span>${safeText(item.name)}</span>
      <strong>${item.qty} ${safeText(item.unit)}</strong>
    </div>
  `).join("");

  showScreen("reviewScreen");
}

function saveOrderToBoard(order) {
  try {
    const saved = localStorage.getItem("materialOrderBoardOrders");
    const orders = saved ? JSON.parse(saved) : [];
    const safeOrders = Array.isArray(orders) ? orders : [];
    safeOrders.unshift(order);
    localStorage.setItem("materialOrderBoardOrders", JSON.stringify(safeOrders));
  } catch (error) {
    console.warn("Could not save order to board.", error);
  }
}


function getGoogleAppsScriptUrl() {
  const settings = getAppSettings();
  return (settings.googleAppsScriptUrl || "").trim();
}

function saveOrderToGoogleSheet(order) {
  const url = getGoogleAppsScriptUrl();
  if (!url) {
    alert("Google Apps Script URL is missing. Open Admin and paste your /exec URL in the orange Email + PDF Sending Setup box on the dashboard.");
    return Promise.resolve(null);
  }
  try {
    return fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(order)
    }).catch(error => {
      console.warn("Google Sheet save failed.", error);
      return null;
    });
  } catch (error) {
    console.warn("Google Sheet save failed.", error);
    return Promise.resolve(null);
  }
}

function openEmailClientFallback(toEmail, subject, body) {
  try {
    const mailto = `mailto:${encodeURIComponent(toEmail || "")} ?subject=${encodeURIComponent(subject || "Material Order")}&body=${encodeURIComponent(body || "")}`.replace("%20?", "?");
    window.location.href = mailto;
  } catch (error) {
    console.warn("Could not open email app.", error);
  }
}


function makeOrderNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const short = String(Date.now()).slice(-5);
  return `ORD-${y}${m}${d}-${short}`;
}

function fileNameSafe(value) {
  return String(value || "Job").replace(/[\\/:*?"<>|]/g, "-").slice(0, 80);
}

async function imageToDataUrl(value) {
  if (!value) return "";
  if (String(value).startsWith("data:image/")) return value;

  try {
    const response = await fetch(value, { cache: "no-store" });
    if (!response.ok) return "";
    const blob = await response.blob();
    return await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result || "");
      reader.onerror = () => resolve("");
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn("Could not load PDF letterhead image.", error);
    return "";
  }
}

async function getPdfLetterheadForEmail() {
  const settings = getAppSettings();
  const pdfLetterhead = mergePdfLetterhead(settings);
  return {
    ...pdfLetterhead,
    leftLogo: await imageToDataUrl(pdfLetterhead.leftLogo),
    rightLogo: await imageToDataUrl(pdfLetterhead.rightLogo)
  };
}

function buildEmailBody(orderRecord) {
  const lines = (orderRecord.items || []).map(item => `- ${item.name}: ${item.qty} ${item.unit}`).join("\n");
  const companyName = orderRecord.pdfLetterhead && orderRecord.pdfLetterhead.companyName ? orderRecord.pdfLetterhead.companyName : (getAppSettings().companyTitle || "");
  return `${companyName ? companyName + "\n" : ""}Material Order Request

Job: ${orderRecord.job}
Order #: ${orderRecord.orderNumber}
Priority: ${orderRecord.priority}
Requested By: ${orderRecord.requestedBy}
Date: ${new Date(orderRecord.createdAt).toLocaleString()}

Items Needed:
${lines}

Notes:
${orderRecord.notes || "None"}

A branded PDF material form is attached.

Sent from Material Order App`;
}

async function sendEmail() {
  const prioritySelect = document.getElementById("reviewPrioritySelect");
  if (prioritySelect) selectedPriority = prioritySelect.value;

  const job = document.getElementById("selectedJob").value;
  const requestedBy = document.getElementById("requestedBy").value.trim();
  const notes = document.getElementById("notes").value.trim();
  const items = getOrderItems();

  if (!requestedBy || items.length === 0) {
    goReview();
    return;
  }

  const submitBtn = document.getElementById("submitEmailBtn");
  const originalText = submitBtn ? submitBtn.innerHTML : "";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Sending PDF Email...";
  }

  const orderNumber = makeOrderNumber();
  const orderRecord = {
    id: `order-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    orderNumber,
    job,
    deliveryLocation: `${job} Jobsite`,
    requestedBy,
    priority: selectedPriority,
    notes,
    items,
    status: "Pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  saveOrderToBoard(orderRecord);

  const subject = `${selectedPriority === "Emergency" ? "🚨 EMERGENCY - " : selectedPriority === "Rush" ? "RUSH - " : ""}Material Order - ${job} - ${orderNumber}`;
  const body = buildEmailBody(orderRecord);

  const payload = {
    ...orderRecord,
    toEmail: getJobEmail(job),
    ccEmail: (getAppSettings().orderCcEmail || "nmcdonald@acgeneral.net"),
    emailSubject: subject,
    emailBody: body,
    sendPdfEmail: true,
    pdfLetterhead: await getPdfLetterheadForEmail()
  };

  await saveOrderToGoogleSheet(payload);

  cart = [];
  renderCartPreview();
  document.getElementById("notes").value = "";

  alert("Order submitted. The branded PDF email was sent through Google Apps Script.");
  showScreen("jobsScreen");

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

function setupApp() {
  const jobSearch = document.getElementById("jobSearch");
  if (jobSearch) jobSearch.addEventListener("input", renderJobs);

  const reviewBtn = document.getElementById("reviewOrderBtn");
  if (reviewBtn) reviewBtn.addEventListener("click", goReview);

  const submitBtn = document.getElementById("submitEmailBtn");
  if (submitBtn) submitBtn.addEventListener("click", sendEmail);

  const reviewPrioritySelect = document.getElementById("reviewPrioritySelect");
  if (reviewPrioritySelect) {
    reviewPrioritySelect.addEventListener("change", () => {
      setPriority(reviewPrioritySelect.value);
      updatePriorityColor();
    });
  }

  applyAppSettings();
  renderJobSelect();
  renderJobs();
  renderCategories();
  renderMaterials();
  renderCartPreview();
  setTimeout(updatePriorityColor, 250);
}

setupApp();


window.addEventListener("storage", event => {
  if (event.key === "materialOrderJobs") {
    renderJobSelect();
    renderJobs();
  }
});

window.addEventListener("focus", () => {
  renderJobSelect();
  renderJobs();
});


window.addEventListener("storage", event => {
  if (event.key === "materialOrderSettings") {
    applyAppSettings();
  }
});

window.addEventListener("focus", () => {
  applyAppSettings();
});


window.addEventListener("storage", event => {
  if (event.key === "materialOrderCategories") {
    refreshCategoriesFromStorage();
  }
});

window.addEventListener("focus", () => {
  refreshCategoriesFromStorage();
});


/* V32 Load app-data.json as the master uploaded Netlify data */
async function loadAppDataJsonDefaults() {
  try {
    const response = await fetch(`app-data.json?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return;

    const data = await response.json();

    // Uploaded app-data.json is the master source.
    // This overwrites old browser localStorage so Netlify updates actually show.
    if (data.settings) {
      localStorage.setItem("materialOrderSettings", JSON.stringify(data.settings));
    }

    if (data.jobs) {
      localStorage.setItem("materialOrderJobs", JSON.stringify(data.jobs));
    }

    if (data.categories && Object.keys(data.categories).length > 0) {
      localStorage.setItem("materialOrderCategories", JSON.stringify(data.categories));
    }

    if (typeof applyAppSettings === "function") applyAppSettings();
    if (typeof renderJobSelect === "function") renderJobSelect();
    if (typeof renderJobs === "function") renderJobs();

    if (typeof refreshCategoriesFromStorage === "function") {
      refreshCategoriesFromStorage();
    } else {
      if (typeof getStoredCategories === "function") {
        categories = getStoredCategories();
      }
      if (typeof renderCategories === "function") renderCategories();
      if (typeof renderMaterials === "function") renderMaterials();
    }

    console.log("Loaded app-data.json from uploaded site.");
  } catch (error) {
    console.warn("No app-data.json loaded.", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadAppDataJsonDefaults();
});



/* V50 editable quantity real number input */
document.addEventListener("input", event => {
  const input = event.target.closest("[data-qty-input]");
  if (!input) return;

  const name = input.dataset.qtyInput;
  let value = Number(input.value);

  if (!Number.isFinite(value) || value < 0) value = 0;
  value = Math.floor(value);

  draftQty[name] = value;
});

document.addEventListener("change", event => {
  const input = event.target.closest("[data-qty-input]");
  if (!input) return;

  const name = input.dataset.qtyInput;
  let value = Number(input.value);

  if (!Number.isFinite(value) || value < 0) value = 0;
  value = Math.floor(value);

  draftQty[name] = value;
  input.value = value;
});

document.addEventListener("focusin", event => {
  const input = event.target.closest("[data-qty-input]");
  if (!input) return;
  setTimeout(() => input.select(), 0);
});


/* V54 mobile qty input enter support */
document.addEventListener("keydown", event => {
  const input = event.target.closest(".qty-number-input");
  if (!input) return;

  if (event.key === "Enter") {
    input.blur();
  }
});


/* V55 mobile qty blur before add */
document.addEventListener("touchstart", event => {
  const addBtn = event.target.closest(".add-cart-btn");
  if (!addBtn) return;

  const row = addBtn.closest(".material-row");
  const input = row ? row.querySelector(".qty-number-input") : null;
  if (input) input.blur();
}, { passive: true });


/* V57 reset after add cart touch */
document.addEventListener("touchend", event => {
  const addBtn = event.target.closest(".add-cart-btn");
  if (!addBtn) return;
  setTimeout(forceResetAllQtyInputs, 500);
}, { passive: true });
