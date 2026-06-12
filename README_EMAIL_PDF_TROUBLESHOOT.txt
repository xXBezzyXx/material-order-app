PDF email setup:
1. Open Google Apps Script.
2. Replace the code with google_apps_script_v48_pdf_email_cc_test.js.
3. Deploy > Manage deployments > Edit > New version > Deploy.
4. Copy the Web App URL ending in /exec.
5. In the app Admin > App Settings, paste that URL into Google Apps Script Web App URL and save.
6. Test this in your browser: YOUR_SCRIPT_URL?action=testEmail&to=nmcdonald@acgeneral.net
7. If the test email does not arrive, Apps Script permissions/deployment are the issue.

This version sends automatically through Google Apps Script and CCs nmcdonald@acgeneral.net on every order by default. It does not open the user's email app.
