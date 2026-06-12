EMAIL + PDF FIX

This version does two things when Submit Order is clicked:

1. Sends the order data to the Google Apps Script so the branded PDF can be generated and emailed as an attachment.
2. Opens the user's email app with a pre-filled material order email, like the older app did.

Important:
- A mailto email draft cannot attach a PDF by itself. Browser security does not allow webpages to automatically attach files to the user's email draft.
- The PDF attachment is handled by Google Apps Script.
- Make sure google_apps_script_v47_branded_pdf_email.js is copied into your Apps Script project and redeployed.
- After redeploying, update GOOGLE_SHEET_WEB_APP_URL in app.js if Google gives you a new Web App URL.
