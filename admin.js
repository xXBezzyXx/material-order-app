const DEFAULT_PASSWORD = "password";

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

const DEFAULT_SETTINGS = {
  companyTitle: "AC General",
  mainPageTitle: "Jobs",
  adminPassword: DEFAULT_PASSWORD,
  pdfLetterhead: DEFAULT_PDF_LETTERHEAD
};

const DEFAULT_JOBS = [
  { name: "DCPS Spring Park", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "UF Jax Bay Street", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "FSDB", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "NE Park", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "SMA", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "RR", active: true, email: "nmcdonald@acgeneral.net" },
  { name: "Other Job", active: true, email: "nmcdonald@acgeneral.net" }
];

const DEFAULT_CATEGORIES = {
  hanging: {
    label: "Hanging Material",
    items: [
      { icon: "🔩", name: "Nuts", options: ['1/4"', '3/8"', '1/2"'], units: ["Box", "Each"] },
      { icon: "🔧", name: "Bolts", options: ["TDC Bolt"], units: ["Box", "Each"] },
      { icon: "⚙️", name: "Washers", options: ['1/4"', '3/8"', '1/2"'], units: ["Box", "Each"] },
      { icon: "➖", name: "All Thread", options: ['1/4"', '3/8"', '1/2"'], units: ["Bundle", "Stick", "Each"] },
      { icon: "▰", name: "Unistrut", options: ["1-5/8 x 10 ft"], units: ["Bundle", "Stick", "Each"] },
      { icon: "⛓️", name: "Beam Clamps", options: ['1/4"', '3/8"', '1/2"'], units: ["Box", "Each"] }
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
      { icon: "icons/blue-wrap.png", name: "Blue Wrap", options: ['24"', '36"'], units: ["Roll", "Each"] },
      { icon: "🧤", name: "Gloves", units: ["Box", "Pair", "Each"] },
      { icon: "🥽", name: "Safety Glasses", units: ["Box", "Pair", "Each"] },
    ]
  }
};

function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

function safeText(text) {
  return String(text || "")
    .split("&").join("&amp;")
    .split("<").join("&lt;")
    .split(">").join("&gt;")
    .split('"').join("&quot;")
    .split("'").join("&#039;");
}

function getJSON(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : copy(fallback);
  } catch {
    return copy(fallback);
  }
}

function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function mergePdfLetterhead(settings) {
  return { ...DEFAULT_PDF_LETTERHEAD, ...(settings && settings.pdfLetterhead ? settings.pdfLetterhead : {}) };
}

function getSettings() {
  const saved = getJSON("materialOrderSettings", DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS, ...saved, pdfLetterhead: mergePdfLetterhead(saved) };
}

function saveSettings(settings) {
  setJSON("materialOrderSettings", settings);
}

function getJobs() {
  const jobs = getJSON("materialOrderJobs", DEFAULT_JOBS);
  return Array.isArray(jobs) ? jobs : copy(DEFAULT_JOBS);
}

function saveJobs(jobs) {
  setJSON("materialOrderJobs", jobs);
}

function getCategories() {
  const categories = getJSON("materialOrderCategories", DEFAULT_CATEGORIES);
  return categories && typeof categories === "object" ? categories : copy(DEFAULT_CATEGORIES);
}

function saveCategories(categories) {
  setJSON("materialOrderCategories", categories);
}


function showAdminPage(pageId) {
  document.getElementById("adminScreen").classList.remove("hidden-admin");
  const materialScreen = document.getElementById("materialAdminScreen");
  if (materialScreen) materialScreen.classList.add("hidden-admin");

  document.querySelectorAll("#adminScreen .admin-page").forEach(page => {
    page.classList.toggle("active-admin-page", page.id === pageId);
  });

  document.querySelectorAll(".admin-nav button[data-admin-page]").forEach(button => {
    button.classList.toggle("active", button.dataset.adminPage === pageId);
  });
}

function showAdminHome() {
  showAdminPage("adminDashboardPage");
}

function showMaterialAdmin() {
  document.getElementById("adminScreen").classList.add("hidden-admin");
  document.getElementById("materialAdminScreen").classList.remove("hidden-admin");
  renderMaterialCategorySelect();
}

function showAdmin() {
  document.getElementById("loginScreen").classList.add("hidden-admin");
  document.getElementById("adminScreen").classList.remove("hidden-admin");
  const materialScreen = document.getElementById("materialAdminScreen");
  if (materialScreen) materialScreen.classList.add("hidden-admin");
  loadSettingsForm();
  renderJobs();
  renderAdminOrders();
  showAdminPage("adminDashboardPage");
}

function login() {
  const entered = document.getElementById("adminPassword").value.trim();
  const settings = getSettings();

  if (entered !== settings.adminPassword && entered !== DEFAULT_PASSWORD) {
    document.getElementById("loginError").textContent = "Incorrect password.";
    return;
  }

  if (entered === DEFAULT_PASSWORD) {
    settings.adminPassword = DEFAULT_PASSWORD;
    saveSettings(settings);
  }

  document.getElementById("loginError").textContent = "";
  sessionStorage.setItem("materialOrderAdmin", "true");
  showAdmin();
}

function resetAdminLogin() {
  localStorage.removeItem("materialOrderSettings");

  const settings = {
    companyTitle: "AC General",
    mainPageTitle: "Jobs",
    adminPassword: DEFAULT_PASSWORD,
    pdfLetterhead: DEFAULT_PDF_LETTERHEAD
  };

  saveSettings(settings);

  const passwordInput = document.getElementById("adminPassword");
  const error = document.getElementById("loginError");

  if (passwordInput) passwordInput.value = "";
  if (error) {
    error.textContent = "Admin login reset. Password is now: password";
    error.style.color = "#22c55e";
  }

  alert("Admin password reset to default.");
}

function setValueIfExists(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || "";
}

function loadSettingsForm() {
  const settings = getSettings();
  const pdf = mergePdfLetterhead(settings);
  document.getElementById("companyTitleInput").value = settings.companyTitle || DEFAULT_SETTINGS.companyTitle;
  const main = document.getElementById("mainPageTitleInput");
  if (main) main.value = settings.mainPageTitle || "Jobs";

  setValueIfExists("pdfTitleLine1Input", pdf.titleLine1);
  setValueIfExists("pdfTitleLine2Input", pdf.titleLine2);
  setValueIfExists("pdfAddressInput", pdf.address);
  setValueIfExists("pdfPhoneFaxInput", pdf.phoneFax);
  setValueIfExists("pdfWebsiteInput", pdf.website);
  setValueIfExists("pdfLicenseInput", pdf.license);
  setValueIfExists("pdfCompanyNameInput", pdf.companyName || settings.companyTitle);
  setValueIfExists("pdfDocumentTitleInput", pdf.documentTitle);
  setValueIfExists("pdfFooterMessageInput", pdf.footerMessage);
  updateLetterheadPreview();
}

function saveCompanyTitle() {
  const title = document.getElementById("companyTitleInput").value.trim();
  const mainPageTitle = document.getElementById("mainPageTitleInput").value.trim();

  if (!title) {
    alert("Company title cannot be blank.");
    return;
  }

  if (!mainPageTitle) {
    alert("Main page heading cannot be blank.");
    return;
  }

  const settings = getSettings();
  settings.companyTitle = title;
  settings.mainPageTitle = mainPageTitle;
  saveSettings(settings);
  alert("App settings saved.");
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result || "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function updateLetterheadPreview() {
  const settings = getSettings();
  const pdf = mergePdfLetterhead(settings);
  const left = document.getElementById("pdfLeftLogoPreview");
  const right = document.getElementById("pdfRightLogoPreview");
  if (left) left.src = pdf.leftLogo || DEFAULT_PDF_LETTERHEAD.leftLogo;
  if (right) right.src = pdf.rightLogo || DEFAULT_PDF_LETTERHEAD.rightLogo;
  const title = document.getElementById("letterheadPreviewTitle");
  if (title) title.innerHTML = `${safeText(pdf.titleLine1 || "")}<br />${safeText(pdf.titleLine2 || "")}`;
  const company = document.getElementById("letterheadPreviewCompany");
  if (company) company.textContent = `${pdf.companyName || getSettings().companyTitle || "Company"} Material Order PDF`;
}

function getPdfLetterheadFromForm(existing) {
  return {
    ...mergePdfLetterhead({ pdfLetterhead: existing || {} }),
    titleLine1: document.getElementById("pdfTitleLine1Input").value.trim() || DEFAULT_PDF_LETTERHEAD.titleLine1,
    titleLine2: document.getElementById("pdfTitleLine2Input").value.trim() || DEFAULT_PDF_LETTERHEAD.titleLine2,
    address: document.getElementById("pdfAddressInput").value.trim(),
    phoneFax: document.getElementById("pdfPhoneFaxInput").value.trim(),
    website: document.getElementById("pdfWebsiteInput").value.trim(),
    license: document.getElementById("pdfLicenseInput").value.trim(),
    companyName: document.getElementById("pdfCompanyNameInput").value.trim() || document.getElementById("companyTitleInput").value.trim() || DEFAULT_PDF_LETTERHEAD.companyName,
    documentTitle: document.getElementById("pdfDocumentTitleInput").value.trim() || DEFAULT_PDF_LETTERHEAD.documentTitle,
    footerMessage: document.getElementById("pdfFooterMessageInput").value.trim() || DEFAULT_PDF_LETTERHEAD.footerMessage
  };
}

async function savePdfLetterhead() {
  const settings = getSettings();
  let pdf = getPdfLetterheadFromForm(settings.pdfLetterhead);

  const leftInput = document.getElementById("pdfLeftLogoInput");
  const rightInput = document.getElementById("pdfRightLogoInput");

  if (leftInput && leftInput.files && leftInput.files[0]) {
    pdf.leftLogo = await readFileAsDataUrl(leftInput.files[0]);
  }

  if (rightInput && rightInput.files && rightInput.files[0]) {
    pdf.rightLogo = await readFileAsDataUrl(rightInput.files[0]);
  }

  settings.pdfLetterhead = pdf;
  saveSettings(settings);
  updateLetterheadPreview();
  alert("PDF letterhead saved.");
}

function resetPdfLetterhead() {
  const settings = getSettings();
  settings.pdfLetterhead = { ...DEFAULT_PDF_LETTERHEAD };
  saveSettings(settings);
  loadSettingsForm();
  alert("PDF letterhead reset to the default letterhead.");
}

function savePassword() {
  const settings = getSettings();
  const current = document.getElementById("currentPasswordInput").value.trim();
  const next = document.getElementById("newPasswordInput").value.trim();
  const confirmPassword = document.getElementById("confirmPasswordInput").value.trim();
  const message = document.getElementById("passwordMessage");

  message.classList.remove("error");
  message.textContent = "";

  if (current !== settings.adminPassword && current !== DEFAULT_PASSWORD) {
    message.textContent = "Current password is wrong.";
    message.classList.add("error");
    return;
  }

  if (next.length < 4) {
    message.textContent = "New password must be at least 4 characters.";
    message.classList.add("error");
    return;
  }

  if (next !== confirmPassword) {
    message.textContent = "New passwords do not match.";
    message.classList.add("error");
    return;
  }

  settings.adminPassword = next;
  saveSettings(settings);
  document.getElementById("currentPasswordInput").value = "";
  document.getElementById("newPasswordInput").value = "";
  document.getElementById("confirmPasswordInput").value = "";
  message.textContent = "Password updated.";
}

function addJob() {
  const input = document.getElementById("newJobName");
  const name = input.value.trim();
  if (!name) {
    alert("Enter a job name.");
    return;
  }
  const jobs = getJobs();
  if (jobs.some(job => job.name.toLowerCase() === name.toLowerCase())) {
    alert("That job already exists.");
    return;
  }
  jobs.push({ name, active: true, email: "nmcdonald@acgeneral.net" });
  saveJobs(jobs);
  input.value = "";
  renderJobs();
}

function updateJob(index, value, emailValue) {
  const jobs = getJobs();
  const name = value.trim();
  const email = (emailValue || "").trim() || "nmcdonald@acgeneral.net";

  if (!name) {
    alert("Job name cannot be blank.");
    renderJobs();
    return;
  }

  jobs[index].name = name;
  jobs[index].email = email;
  saveJobs(jobs);
  renderJobs();
}

function toggleJob(index) {
  const jobs = getJobs();
  jobs[index].active = jobs[index].active === false ? true : false;
  saveJobs(jobs);
  renderJobs();
}

function deleteJob(index) {
  const jobs = getJobs();
  const name = jobs[index].name;
  if (!confirm(`Delete job "${name}"?`)) return;
  jobs.splice(index, 1);
  saveJobs(jobs);
  renderJobs();
}

function resetJobs() {
  if (!confirm("Reset job list back to default?")) return;
  saveJobs(copy(DEFAULT_JOBS));
  renderJobs();
}

function renderJobs() {
  const jobs = getJobs();
  const list = document.getElementById("jobManagerList");

  if (!jobs.length) {
    list.innerHTML = "<p class='admin-note'>No jobs added yet.</p>";
    return;
  }

  list.innerHTML = jobs.map((job, index) => `
    <div class="job-manager-row ${job.active === false ? "inactive-job" : ""}">
      <div class="job-edit-fields">
        <label class="admin-label">Job Name
          <input value="${safeText(job.name)}" data-index="${index}" />
        </label>
        <label class="admin-label">Order Email
          <input value="${safeText(job.email || "nmcdonald@acgeneral.net")}" data-email-index="${index}" placeholder="orders@example.com" />
        </label>
      </div>
      <div class="job-actions">
        <button class="save-job" data-save="${index}" type="button">Save</button>
        <button class="toggle-job" data-toggle="${index}" type="button">${job.active === false ? "Activate" : "Hide"}</button>
        <button class="delete-job" data-delete="${index}" type="button">Delete</button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-save]").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.save);
      const input = document.querySelector(`input[data-index="${index}"]`);
      const emailInput = document.querySelector(`input[data-email-index="${index}"]`);
      updateJob(index, input.value, emailInput ? emailInput.value : "nmcdonald@acgeneral.net");
    });
  });

  document.querySelectorAll("[data-toggle]").forEach(button => {
    button.addEventListener("click", () => toggleJob(Number(button.dataset.toggle)));
  });

  document.querySelectorAll("[data-delete]").forEach(button => {
    button.addEventListener("click", () => deleteJob(Number(button.dataset.delete)));
  });
}

function parseCsvList(value) {
  return value.split(",").map(item => item.trim()).filter(Boolean);
}

function renderMaterialCategorySelect() {
  const select = document.getElementById("materialCategorySelect");
  const categories = getCategories();

  select.innerHTML = Object.entries(categories)
    .map(([key, category]) => `<option value="${safeText(key)}">${safeText(category.label || key)}</option>`)
    .join("");

  renderMaterialsForAdmin();
}

function addMaterial() {
  const categoryKey = document.getElementById("materialCategorySelect").value;
  const name = document.getElementById("materialNameInput").value.trim();
  const icon = document.getElementById("materialIconInput").value.trim() || "•";
  const options = parseCsvList(document.getElementById("materialOptionsInput").value);
  const units = parseCsvList(document.getElementById("materialUnitsInput").value);

  if (!categoryKey || !name) {
    alert("Select a category and enter a material name.");
    return;
  }

  const categories = getCategories();
  if (!categories[categoryKey]) {
    alert("Category not found.");
    return;
  }

  if (categories[categoryKey].items.some(item => item.name.toLowerCase() === name.toLowerCase())) {
    alert("That material already exists.");
    return;
  }

  const newItem = { icon, name, units: units.length ? units : ["Each"] };
  if (options.length) newItem.options = options;

  categories[categoryKey].items.push(newItem);
  saveCategories(categories);

  document.getElementById("materialNameInput").value = "";
  document.getElementById("materialIconInput").value = "";
  document.getElementById("materialOptionsInput").value = "";
  document.getElementById("materialUnitsInput").value = "";

  renderMaterialsForAdmin();
}


function saveMaterialEdit(index) {
  const categoryKey = document.getElementById("materialCategorySelect").value;
  const categories = getCategories();

  if (!categories[categoryKey] || !categories[categoryKey].items[index]) {
    alert("Material not found.");
    return;
  }

  const icon = document.querySelector(`[data-material-icon="${index}"]`).value.trim() || "•";
  const name = document.querySelector(`[data-material-name="${index}"]`).value.trim();
  const options = parseCsvList(document.querySelector(`[data-material-options="${index}"]`).value);
  const units = parseCsvList(document.querySelector(`[data-material-units="${index}"]`).value);

  if (!name) {
    alert("Material name cannot be blank.");
    return;
  }

  categories[categoryKey].items[index] = {
    icon,
    name,
    units: units.length ? units : ["Each"]
  };

  if (options.length) {
    categories[categoryKey].items[index].options = options;
  }

  saveCategories(categories);
  renderMaterialsForAdmin();
}

function deleteMaterial(index) {
  const categoryKey = document.getElementById("materialCategorySelect").value;
  const categories = getCategories();
  const item = categories[categoryKey].items[index];

  if (!confirm(`Delete material "${item.name}"?`)) return;

  categories[categoryKey].items.splice(index, 1);
  saveCategories(categories);
  renderMaterialsForAdmin();
}

function renderMaterialIcon(icon) {
  const value = String(icon || "");
  if (value.includes("/") || value.endsWith(".png") || value.endsWith(".jpg") || value.endsWith(".jpeg") || value.endsWith(".svg") || value.endsWith(".webp")) {
    return `<img class="material-icon-img" src="${safeText(value)}" alt="" loading="lazy" />`;
  }
  return safeText(value);
}

function renderMaterialsForAdmin() {
  const categoryKey = document.getElementById("materialCategorySelect").value;
  const list = document.getElementById("materialManagerList");
  const categories = getCategories();
  const items = (categories[categoryKey] && categories[categoryKey].items) || [];

  if (!items.length) {
    list.innerHTML = "<p class='admin-note'>No materials in this category.</p>";
    return;
  }

  list.innerHTML = items.map((item, index) => {
    const options = item.options && item.options.length ? item.options.join(", ") : "";
    const units = item.units && item.units.length ? item.units.join(", ") : "Each";

    return `
      <div class="material-manager-row editable-material-row">
        <div class="material-edit-grid">
          <label class="admin-label">Icon
            <input value="${safeText(item.icon || "•")}" data-material-icon="${index}" />
          </label>

          <label class="admin-label">Material Name
            <input value="${safeText(item.name)}" data-material-name="${index}" />
          </label>

          <label class="admin-label wide">Size Options
            <input value="${safeText(options)}" data-material-options="${index}" placeholder='Example: 1/4", 3/8", 1/2"' />
          </label>

          <label class="admin-label wide">Unit Options
            <input value="${safeText(units)}" data-material-units="${index}" placeholder="Example: Box, Each" />
          </label>
        </div>

        <div class="material-edit-actions">
          <button class="save-material" data-save-material="${index}" type="button">Save</button>
          <button class="delete-material" data-delete-material="${index}" type="button">Delete</button>
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll("[data-save-material]").forEach(button => {
    button.addEventListener("click", () => saveMaterialEdit(Number(button.dataset.saveMaterial)));
  });

  document.querySelectorAll("[data-delete-material]").forEach(button => {
    button.addEventListener("click", () => deleteMaterial(Number(button.dataset.deleteMaterial)));
  });
}


function getOrders() {
  try {
    const saved = localStorage.getItem("materialOrderBoardOrders");
    const orders = saved ? JSON.parse(saved) : [];
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem("materialOrderBoardOrders", JSON.stringify(orders));
}

function statusClass(status) {
  return String(status || "Pending").toLowerCase();
}

function formatOrderDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  } catch {
    return value;
  }
}

function renderAdminOrders() {
  const list = document.getElementById("adminOrdersList");
  if (!list) return;

  const orders = getOrders().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  if (!orders.length) {
    list.innerHTML = "<p class='admin-note'>No orders submitted yet.</p>";
    return;
  }

  list.innerHTML = orders.map(order => `
    <div class="admin-order-row">
      <div class="admin-order-head">
        <div>
          <strong>${safeText(order.job || "Unknown Job")}</strong>
          <span>Requested by ${safeText(order.requestedBy || "Unknown")} • ${safeText(formatOrderDate(order.createdAt))}</span>
        </div>
        <span class="status-badge ${statusClass(order.status)}">${safeText(order.status || "Pending")}</span>
      </div>
      <div class="admin-order-items">
        ${(order.items || []).map(item => `<div>${safeText(item.name)} <b>${safeText(item.qty)} ${safeText(item.unit)}</b></div>`).join("")}
      </div>
      ${order.notes ? `<p class="admin-order-notes"><b>Notes:</b> ${safeText(order.notes)}</p>` : ""}
      <div class="admin-order-actions">
        <button type="button" class="status-pending" data-order-status="Pending" data-order-id="${safeText(order.id)}">Pending</button>
        <button type="button" class="status-ordered" data-order-status="Ordered" data-order-id="${safeText(order.id)}">Ordered</button>
        <button type="button" class="status-delivered" data-order-status="Delivered" data-order-id="${safeText(order.id)}">Delivered</button>
        <button type="button" class="delete-order" data-delete-order="${safeText(order.id)}">Delete</button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-order-status]").forEach(button => {
    button.addEventListener("click", () => updateOrderStatus(button.dataset.orderId, button.dataset.orderStatus));
  });

  document.querySelectorAll("[data-delete-order]").forEach(button => {
    button.addEventListener("click", () => deleteAdminOrder(button.dataset.deleteOrder));
  });
}

function updateOrderStatus(orderId, newStatus) {
  const orders = getOrders();
  const order = orders.find(item => item.id === orderId);
  if (!order) return;

  order.status = newStatus;
  order.updatedAt = new Date().toISOString();
  saveOrders(orders);
  renderAdminOrders();
}

function deleteAdminOrder(orderId) {
  const orders = getOrders();
  const order = orders.find(item => item.id === orderId);
  if (!order) return;

  const label = `${order.job || "this order"} - ${order.requestedBy || "Unknown"}`;
  if (!confirm(`Delete ${label}? This cannot be undone.`)) return;

  saveOrders(orders.filter(item => item.id !== orderId));
  renderAdminOrders();
}

function setupAdmin() {
  document.querySelectorAll("[data-admin-page]").forEach(button => {
    button.addEventListener("click", () => showAdminPage(button.dataset.adminPage));
  });

  const openMaterialCard = document.getElementById("openMaterialManagerCard");
  if (openMaterialCard) openMaterialCard.addEventListener("click", showMaterialAdmin);

  document.getElementById("loginBtn").addEventListener("click", login);
  const resetButton = document.getElementById("resetAdminBtn");
  if (resetButton) {
    resetButton.addEventListener("click", resetAdminLogin);
    resetButton.onclick = resetAdminLogin;
  }

  document.getElementById("adminPassword").addEventListener("keydown", event => {
    if (event.key === "Enter") login();
  });

  document.getElementById("addJobBtn").addEventListener("click", addJob);
  document.getElementById("newJobName").addEventListener("keydown", event => {
    if (event.key === "Enter") addJob();
  });

  document.getElementById("resetJobsBtn").addEventListener("click", resetJobs);
  document.getElementById("saveCompanyTitleBtn").addEventListener("click", saveCompanyTitle);
  const savePdfLetterheadBtn = document.getElementById("savePdfLetterheadBtn");
  if (savePdfLetterheadBtn) savePdfLetterheadBtn.addEventListener("click", savePdfLetterhead);
  const resetPdfLetterheadBtn = document.getElementById("resetPdfLetterheadBtn");
  if (resetPdfLetterheadBtn) resetPdfLetterheadBtn.addEventListener("click", resetPdfLetterhead);
  document.getElementById("savePasswordBtn").addEventListener("click", savePassword);

  const openMaterialBtn = document.getElementById("openMaterialManagerBtn");
  if (openMaterialBtn) openMaterialBtn.addEventListener("click", showMaterialAdmin);

  const backToAdminBtn = document.getElementById("backToAdminBtn");
  if (backToAdminBtn) backToAdminBtn.addEventListener("click", showAdminHome);

  document.getElementById("materialCategorySelect").addEventListener("change", renderMaterialsForAdmin);
  document.getElementById("addMaterialBtn").addEventListener("click", addMaterial);
  document.getElementById("materialNameInput").addEventListener("keydown", event => {
    if (event.key === "Enter") addMaterial();
  });

  const refreshOrdersBtn = document.getElementById("refreshOrdersBtn");
  if (refreshOrdersBtn) refreshOrdersBtn.addEventListener("click", renderAdminOrders);

  window.addEventListener("storage", event => {
    if (event.key === "materialOrderBoardOrders") renderAdminOrders();
  });

  if (sessionStorage.getItem("materialOrderAdmin") === "true") {
    showAdmin();
  }
}

document.addEventListener("DOMContentLoaded", setupAdmin);

window.resetAdminLogin = resetAdminLogin;


/* V31 Export / Import App Data */
function exportAppData() {
  const settings = typeof getSettings === "function" ? getSettings() : {};
  const jobs = typeof getJobs === "function" ? getJobs() : [];
  const categories = typeof getCategories === "function" ? getCategories() : {};

  const data = {
    exportedAt: new Date().toISOString(),
    settings,
    jobs,
    categories
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "app-data.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function importAppData(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function() {
    try {
      const data = JSON.parse(reader.result);

      if (data.settings) {
        localStorage.setItem("materialOrderSettings", JSON.stringify(data.settings));
      }

      if (data.jobs) {
        localStorage.setItem("materialOrderJobs", JSON.stringify(data.jobs));
      }

      if (data.categories) {
        localStorage.setItem("materialOrderCategories", JSON.stringify(data.categories));
      }

      alert("App data imported. The admin page will refresh.");
      location.reload();
    } catch (error) {
      alert("Could not import app data. Make sure it is a valid app-data.json file.");
      console.error(error);
    }
  };

  reader.readAsText(file);
}

function setupExportImportButtons() {
  const exportBtn = document.getElementById("exportAppDataBtn");
  if (exportBtn) exportBtn.addEventListener("click", exportAppData);

  const importInput = document.getElementById("importAppDataInput");
  if (importInput) importInput.addEventListener("change", importAppData);
}

document.addEventListener("DOMContentLoaded", setupExportImportButtons);



async function reloadUploadedAppData() {
  try {
    const response = await fetch(`app-data.json?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) {
      alert("No app-data.json found in this upload.");
      return;
    }

    const data = await response.json();

    if (data.settings) localStorage.setItem("materialOrderSettings", JSON.stringify(data.settings));
    if (data.jobs) localStorage.setItem("materialOrderJobs", JSON.stringify(data.jobs));
    if (data.categories && Object.keys(data.categories).length > 0) {
      localStorage.setItem("materialOrderCategories", JSON.stringify(data.categories));
    }

    alert("Uploaded app-data.json loaded.");
    location.reload();
  } catch (error) {
    alert("Could not load uploaded app-data.json.");
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const reloadBtn = document.getElementById("reloadAppDataBtn");
  if (reloadBtn) reloadBtn.addEventListener("click", reloadUploadedAppData);
});



/* V44 Google Sheet Admin Orders */
const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx6eWkypZ_O_QoaldUrQvp3KfwsjoawjalQHLftzyI1e0hg2u1MbrQdlGTkDUnEYayFlA/exec";

function parseSheetItems(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatSheetDate(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  } catch {
    return value;
  }
}

function sheetStatusClass(status) {
  return String(status || "Pending").toLowerCase();
}

async function loadAdminSheetOrders() {
  const list = document.getElementById("adminOrdersList");
  if (!list) return;

  list.innerHTML = "<p class='admin-note'>Loading shared orders...</p>";

  try {
    const response = await fetch(GOOGLE_SHEET_WEB_APP_URL + "?v=" + Date.now());
    const data = await response.json();
    const orders = Array.isArray(data.orders) ? data.orders.reverse() : [];

    if (!orders.length) {
      list.innerHTML = "<p class='admin-note'>No orders submitted yet.</p>";
      return;
    }

    list.innerHTML = orders.map(order => {
      const items = parseSheetItems(order.items);
      const itemHtml = items.length ? items.map(item => `
        <div>${safeText(item.name || "Item")} <b>${safeText(item.qty || "")} ${safeText(item.unit || "")}</b></div>
      `).join("") : "<div>No item details found.</div>";

      const status = order.status || "Pending";

      return `
        <div class="admin-order-row">
          <div class="admin-order-head">
            <div>
              <strong>${safeText(order.job || "Unknown Job")}</strong>
              <span>Requested by ${safeText(order.requestedBy || "Unknown")} • ${safeText(formatSheetDate(order.timestamp))}</span>
            </div>
            <span class="status-badge ${sheetStatusClass(status)}">${safeText(status)}</span>
          </div>

          <div class="admin-order-items">
            ${itemHtml}
          </div>

          ${order.notes ? `<p class="admin-order-notes"><b>Notes:</b> ${safeText(order.notes)}</p>` : ""}

          <div class="admin-order-actions">
            <button type="button" class="status-pending" data-sheet-status="Pending" data-sheet-id="${safeText(order.id)}">Pending</button>
            <button type="button" class="status-ordered" data-sheet-status="Ordered" data-sheet-id="${safeText(order.id)}">Ordered</button>
            <button type="button" class="status-delivered" data-sheet-status="Delivered" data-sheet-id="${safeText(order.id)}">Delivered</button>
          </div>
        </div>
      `;
    }).join("");

    document.querySelectorAll("[data-sheet-status]").forEach(button => {
      button.addEventListener("click", () => updateSheetOrderStatus(button.dataset.sheetId, button.dataset.sheetStatus));
    });
  } catch (error) {
    console.error(error);
    list.innerHTML = "<p class='admin-error'>Could not load shared orders. Check Google Apps Script permissions.</p>";
  }
}

async function updateSheetOrderStatus(id, status) {
  try {
    await fetch(GOOGLE_SHEET_WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "updateStatus",
        id,
        status
      })
    });

    setTimeout(loadAdminSheetOrders, 800);
  } catch (error) {
    console.error(error);
    alert("Could not update order status.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const refreshBtn = document.getElementById("refreshAdminOrdersBtn");
  if (refreshBtn) refreshBtn.addEventListener("click", loadAdminSheetOrders);
  setTimeout(loadAdminSheetOrders, 500);
});
