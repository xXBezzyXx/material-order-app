const SHEET_NAME = "Sheet1";

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = JSON.parse(e.postData.contents);

  if (data.action === "updateStatus") {
    const row = Number(data.id);
    const status = data.status || "Pending";

    if (row && row >= 2) {
      sheet.getRange(row, 7).setValue(status);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, action: "updateStatus" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (data.action === "deleteOrder") {
    const row = Number(data.id);

    if (row && row >= 2) {
      sheet.deleteRow(row);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, action: "deleteOrder" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  sheet.appendRow([
    new Date(),
    data.job || "",
    data.requestedBy || "",
    data.priority || "Normal",
    JSON.stringify(data.items || []),
    data.notes || "",
    data.status || "Pending"
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true, action: "createOrder" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return ContentService
      .createTextOutput(JSON.stringify({ orders: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  values.shift();

  const orders = values.map((row, index) => ({
    id: index + 2,
    timestamp: row[0],
    job: row[1],
    requestedBy: row[2],
    priority: row[3],
    items: row[4],
    notes: row[5],
    status: row[6]
  }));

  return ContentService
    .createTextOutput(JSON.stringify({ orders }))
    .setMimeType(ContentService.MimeType.JSON);
}
