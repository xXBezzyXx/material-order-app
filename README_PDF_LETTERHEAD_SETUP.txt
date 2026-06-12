Material Order App - Branded PDF Email Setup

What changed:
1. Orders now send through Google Apps Script so a branded PDF can be attached to the email.
2. The PDF uses the letterhead settings from the Admin panel. Company name, header text, logos, contact info, document title, and footer are editable in Admin.
3. The admin panel now has a PDF Letterhead section where you can edit:
   - Left logo
   - Right logo
   - Header text
   - Address / Phone / Website / License
   - PDF document title
   - Footer message
4. The PDF removes the Warehouse / Purchasing section and keeps the Received By / Job Site section.

Required Google Apps Script update:
1. Open your Google Apps Script project.
2. Replace the current code with google_apps_script_v47_branded_pdf_email.js.
3. Save.
4. Deploy > Manage deployments > Edit deployment.
5. Choose New version.
6. Deploy.

Important:
- The app cannot attach PDFs using a normal mailto email link.
- The PDF attachment only works after the Google Apps Script v47 file is copied and redeployed.
- Keep uploaded logo images reasonably small so they send smoothly with the order.

Admin:
- Open admin.html.
- Log in.
- Go to PDF Letterhead.
- Edit the fields or upload replacement logos.
- Click Save PDF Letterhead.
- Export app-data.json if you want those changes to carry into a future upload.
