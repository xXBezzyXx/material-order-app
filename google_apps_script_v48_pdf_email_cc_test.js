const SHEET_NAME = "Sheet1";

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = JSON.parse(e.postData.contents || "{}");

  if (data.action === "updateStatus") {
    const row = Number(data.id);
    const status = data.status || "Pending";
    if (row && row >= 2) sheet.getRange(row, 7).setValue(status);
    return json_({ success: true, action: "updateStatus" });
  }

  if (data.action === "deleteOrder") {
    const row = Number(data.id);
    if (row && row >= 2) sheet.deleteRow(row);
    return json_({ success: true, action: "deleteOrder" });
  }

  sheet.appendRow([
    new Date(),
    data.job || "",
    data.requestedBy || "",
    data.priority || "Normal",
    JSON.stringify(data.items || []),
    data.notes || "",
    data.status || "Pending",
    data.orderNumber || ""
  ]);

  if (data.sendPdfEmail) {
    sendMaterialOrderEmail_(data);
  }

  return json_({ success: true, action: "createOrder" });
}

function doGet(e) {
  if (e && e.parameter && e.parameter.action === "testEmail") {
    const to = e.parameter.to || "nmcdonald@acgeneral.net";
    MailApp.sendEmail({
      to: to,
      subject: "Material Order App Test Email",
      body: "If you received this, Google Apps Script email permissions are working."
    });
    return json_({ success: true, action: "testEmail", to: to });
  }
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return json_({ orders: [] });
  values.shift();
  const orders = values.map((row, index) => ({
    id: index + 2,
    timestamp: row[0],
    job: row[1],
    requestedBy: row[2],
    priority: row[3],
    items: row[4],
    notes: row[5],
    status: row[6],
    orderNumber: row[7] || ""
  }));
  return json_({ orders });
}

function sendMaterialOrderEmail_(data) {
  const to = data.toEmail || "nmcdonald@acgeneral.net";
  const subject = data.emailSubject || ("Material Order - " + (data.job || "Job"));
  const body = data.emailBody || buildPlainTextOrder_(data);
  const pdf = buildMaterialOrderPdf_(data);

  const cc = data.ccEmail || "";
  const options = {
    to: to,
    subject: subject,
    body: body,
    attachments: [pdf]
  };
  if (cc && cc !== to) options.cc = cc;
  MailApp.sendEmail(options);
}

function buildPlainTextOrder_(data) {
  const items = Array.isArray(data.items) ? data.items : [];
  const lines = items.map(function(item) {
    return "- " + (item.name || item.material || "Material") + ": " + (item.qty || "") + " " + (item.unit || "");
  }).join("\n");

  return (defaultedLetterhead_(data.pdfLetterhead || {}).companyName || "Company") + "\nMaterial Order Form\n\n" +
    "Order #: " + (data.orderNumber || "") + "\n" +
    "Job: " + (data.job || "") + "\n" +
    "Date: " + new Date().toLocaleString() + "\n" +
    "Priority: " + (data.priority || "Normal") + "\n" +
    "Requested By: " + (data.requestedBy || "") + "\n\n" +
    "Items Needed:\n" + lines + "\n\n" +
    "Additional Notes:\n" + (data.notes || "None");
}

function buildMaterialOrderPdf_(data) {
  const letter = defaultedLetterhead_(data.pdfLetterhead || {});
  const items = Array.isArray(data.items) ? data.items : [];
  const orderNo = data.orderNumber || ("ORD-" + Date.now());
  const created = data.createdAt ? new Date(data.createdAt) : new Date();
  const dateText = Utilities.formatDate(created, Session.getScriptTimeZone(), "MM/dd/yyyy h:mm a");

  const rows = items.map(function(item, index) {
    const material = item.material || materialFromName_(item.name || "");
    const option = item.option || optionFromName_(item.name || "");
    return "<tr>" +
      "<td class='num'>" + (index + 1) + "</td>" +
      "<td>" + escapeHtml_(material) + "</td>" +
      "<td>" + escapeHtml_(option) + "</td>" +
      "<td class='qty'>" + escapeHtml_(String(item.qty || "")) + "</td>" +
      "<td class='unit'>" + escapeHtml_(item.unit || "") + "</td>" +
      "<td>" + (index === 0 && data.priority && data.priority !== "Normal" ? escapeHtml_(data.priority) : "") + "</td>" +
      "</tr>";
  }).join("") + blankRows_(Math.max(0, 6 - items.length));

  const html = "<!doctype html><html><head><meta charset='utf-8'>" +
    "<style>" +
    "@page{size:letter;margin:24px;}" +
    "body{font-family:Arial,Helvetica,sans-serif;color:#0f172a;margin:0;background:#fff;font-size:12px;}" +
    ".page{width:100%;}" +
    ".header{display:grid;grid-template-columns:145px 1fr 145px;align-items:start;gap:14px;margin-bottom:8px;}" +
    ".logo{width:130px;max-height:92px;object-fit:contain;}" +
    ".gator{width:138px;max-height:94px;object-fit:contain;justify-self:end;}" +
    ".headline{text-align:center;line-height:1.25;}" +
    ".headline .line{font-family:Georgia,serif;font-weight:bold;font-style:italic;color:#088aa6;font-size:24px;}" +
    ".headline .contact{font-size:13px;color:#111;margin-top:5px;line-height:1.35;}" +
    ".headline .site{color:#0b3a6e;font-weight:bold;}" +
    ".rule{border-top:3px solid #08356d;margin:8px 0 14px;}" +
    ".doc-title{text-align:center;color:#08356d;font-weight:800;letter-spacing:.5px;margin:0 0 12px;}" +
    ".doc-title .company{font-size:20px;}" +
    ".doc-title .title{font-size:28px;margin-top:4px;}" +
    ".box-grid{display:grid;grid-template-columns:1fr .85fr 1.2fr;border:1.5px solid #27588f;border-bottom:0;margin-bottom:0;}" +
    ".box-grid.two{grid-template-columns:1.45fr 1fr;border-top:0;border-bottom:1.5px solid #27588f;margin-bottom:12px;}" +
    ".box{padding:10px 12px;min-height:40px;border-right:1.5px solid #27588f;border-bottom:1.5px solid #27588f;}" +
    ".box:last-child{border-right:0;}" +
    ".box-grid.two .box{border-bottom:0;}" +
    ".label{font-size:12px;font-weight:800;color:#08356d;text-transform:uppercase;margin-bottom:6px;}" +
    ".value{font-size:16px;font-weight:700;color:#111;}" +
    ".section-title{background:#08356d;color:#fff;text-align:center;font-weight:800;font-size:17px;padding:7px 0;border:1.5px solid #08356d;}" +
    "table{width:100%;border-collapse:collapse;margin:0 0 13px;}" +
    "th,td{border:1px solid #6b8db5;padding:8px 9px;vertical-align:top;}" +
    "th{background:#f8fafc;color:#111;text-transform:uppercase;font-size:11px;}" +
    "td{height:21px;font-size:12.5px;}" +
    ".num{width:26px;text-align:center;font-weight:bold;} .qty{width:40px;text-align:center;font-weight:bold;} .unit{width:58px;text-align:center;}" +
    ".notes{border:1.5px solid #27588f;min-height:60px;padding:10px 12px;margin-bottom:14px;}" +
    ".notes .body{white-space:pre-wrap;font-size:13px;line-height:1.35;margin-top:5px;}" +
    ".received{border:1.5px solid #27588f;padding:12px 18px;margin-top:6px;}" +
    ".received h3{text-align:center;color:#08356d;margin:0 0 12px;font-size:16px;}" +
    ".line-row{margin:9px 0;font-size:13px;} .line-row span{display:inline-block;width:96px;font-weight:bold;} .fill{display:inline-block;border-bottom:1.5px solid #555;width:70%;height:14px;}" +
    ".footer{text-align:center;margin-top:12px;color:#08356d;font-style:italic;font-weight:bold;font-size:13px;}" +
    ".subfooter{text-align:center;font-family:Georgia,serif;font-style:italic;color:#111;font-size:11px;margin-top:3px;}" +
    "</style></head><body><div class='page'>" +
    "<div class='header'>" +
    imageTag_(letter.leftLogo, "logo") +
    "<div class='headline'><div class='line'>" + escapeHtml_(letter.titleLine1) + "</div><div class='line'>" + escapeHtml_(letter.titleLine2) + "</div>" +
    "<div class='contact'>" + escapeHtml_(letter.address) + "<br>" + escapeHtml_(letter.phoneFax) + "<br><span class='site'>" + escapeHtml_(letter.website) + "</span><br>" + escapeHtml_(letter.license) + "</div></div>" +
    imageTag_(letter.rightLogo, "gator") +
    "</div><div class='rule'></div>" +
    "<div class='doc-title'><div class='company'>" + escapeHtml_(letter.companyName) + "</div><div class='title'>" + escapeHtml_(letter.documentTitle) + "</div></div>" +
    "<div class='rule' style='margin-top:0;'></div>" +
    "<div class='box-grid'><div class='box'><div class='label'>Order #:</div><div class='value'>" + escapeHtml_(orderNo) + "</div></div>" +
    "<div class='box'><div class='label'>Date:</div><div class='value'>" + escapeHtml_(dateText) + "</div></div>" +
    "<div class='box'><div class='label'>Requested By:</div><div class='value'>" + escapeHtml_(data.requestedBy || "") + "</div></div></div>" +
    "<div class='box-grid two'><div class='box'><div class='label'>Job Name / Number:</div><div class='value'>" + escapeHtml_(data.job || "") + "</div></div>" +
    "<div class='box'><div class='label'>Delivery Location:</div><div class='value'>" + escapeHtml_(data.deliveryLocation || ((data.job || "") + " Jobsite")) + "</div></div></div>" +
    "<div class='section-title'>MATERIALS REQUESTED</div>" +
    "<table><thead><tr><th>#</th><th>Material</th><th>Size / Option</th><th>Qty</th><th>Unit</th><th>Notes</th></tr></thead><tbody>" + rows + "</tbody></table>" +
    "<div class='notes'><div class='label'>Additional Notes / Special Instructions:</div><div class='body'>" + escapeHtml_(data.notes || "None") + "</div></div>" +
    "<div class='received'><h3>RECEIVED BY / JOB SITE</h3><div class='line-row'><span>Received By:</span><div class='fill'></div></div><div class='line-row'><span>Date Received:</span><div class='fill'></div></div><div class='line-row'><span>Notes:</span><div class='fill'></div></div><div class='line-row'><span></span><div class='fill'></div></div></div>" +
    "<div class='footer'>" + escapeHtml_(letter.footerMessage) + "</div><div class='subfooter'>This is an electronically generated document.</div>" +
    "</div></body></html>";

  return Utilities
    .newBlob(html, "text/html", "material-order.html")
    .getAs(MimeType.PDF)
    .setName(makeSafeFileName_("Material Order - " + (data.job || "Job") + " - " + orderNo + ".pdf"));
}

function blankRows_(count) {
  let out = "";
  for (let i = 0; i < count; i++) {
    out += "<tr><td class='num'>&nbsp;</td><td></td><td></td><td class='qty'></td><td class='unit'></td><td></td></tr>";
  }
  return out;
}

function materialFromName_(name) {
  const parts = String(name || "").split(" - ");
  return parts[0] || name;
}

function optionFromName_(name) {
  const parts = String(name || "").split(" - ");
  return parts.length > 1 ? parts.slice(1).join(" - ") : "";
}

function defaultedLetterhead_(letter) {
  return {
    leftLogo: letter.leftLogo || "",
    rightLogo: letter.rightLogo || "",
    titleLine1: letter.titleLine1 || "Commercial Mechanical",
    titleLine2: letter.titleLine2 || "Industrial Refrigeration",
    address: letter.address || "401 Agmac Avenue, Jacksonville, FL 32254",
    phoneFax: letter.phoneFax || "Phone (904) 783-4200  Fax (904) 781-0806",
    website: letter.website || "acgeneral.net",
    license: letter.license || "CMC1250807",
    companyName: letter.companyName || "Company",
    documentTitle: letter.documentTitle || "MATERIAL PROCUREMENT REQUEST",
    footerMessage: letter.footerMessage || "Thank you for using the Material Order App!"
  };
}

function imageTag_(src, className) {
  return src ? "<img class='" + className + "' src='" + src + "'>" : "<div></div>";
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function makeSafeFileName_(value) {
  return String(value).replace(/[\\/:*?"<>|]/g, "-").slice(0, 140);
}

function json_(object) {
  return ContentService
    .createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}
