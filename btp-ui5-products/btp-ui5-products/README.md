# btp-ui5-products

SAP BTP project: **CAP (Node.js) backend** + **SAPUI5 frontend** (Product Manager).

## Structure
- db/ - CDS data model + sample CSV data
- srv/ - OData V4 service (/odata/v4/product) + custom logic
- app/products/webapp/ - SAPUI5 app (Component, manifest, view, controller, fragment, i18n)
- approuter/ - SAP Approuter (BTP entry point, XSUAA auth)
- xs-security.json - XSUAA config
- mta.yaml - Multi-target app descriptor for Cloud Foundry

## Run locally (Node.js 18+)
    npm install
    npm start
Open http://localhost:4004/products/webapp/index.html
(Mocked auth, in-memory SQLite, sample data auto-loaded. UI5 loads from https://ui5.sap.com, so internet is needed.)

## Features
- List, search, add, delete products
- "Restock +10" calls a bound OData action (ProductService.restock)
- Stock status colours (red = 0, orange < 10, green)

## Deploy to SAP BTP (Cloud Foundry)
    npm install -g @sap/cds-dk mbt
    cf login
    npm run build
    npm run deploy
Requires SAP HANA Cloud + XSUAA entitlements. Open the approuter URL shown by `cf apps`.
