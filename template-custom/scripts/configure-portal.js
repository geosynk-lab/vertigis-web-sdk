#!/usr/bin/env node
// @ts-check
"use strict";

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const projRoot = process.cwd();
const appJsonPath = path.join(projRoot, "app/app.json");
const portalJsonPath = path.join(projRoot, "app/auth/portal.json");
const portalConfigPath = path.join(projRoot, "src/auth/portalConfig.json");
const oauthCallbackPath = path.join(projRoot, "app/oauth_callback.html");

const args = process.argv.slice(2);

/**
 * Reads project.config from the project root.
 * Each KEY=VALUE line becomes one entry. Lines that start with "#" and empty lines are ignored.
 * An empty value means "not set".
 * See project.config for the description of each PORTAL_* value.
 * @returns {Record<string, string>}
 */
function readProjectConfig() {
    /** @type {Record<string, string>} */
    const values = {};
    for (const name of ["project.config"]) {
        const file = path.join(projRoot, name);
        if (!fs.existsSync(file)) {
            continue;
        }
        for (const line of fs.readFileSync(file, "utf-8").split(/\r?\n/)) {
            const idx = line.indexOf("=");
            if (!line || line.startsWith("#") || idx <= 0) {
                continue;
            }
            values[line.slice(0, idx)] = line.slice(idx + 1);
        }
    }
    return values;
}

const projectConfig = readProjectConfig();

function printHelp() {
    console.log(`
================================================================================
  VertiGIS Studio Web SDK - Portal Authentication Configurator
================================================================================

Usage:
  npm run auth:portal
  npm run auth:portal -- [options]

Values that you do not give as options come from project.config:
  PORTAL_URL, PORTAL_CLIENT_ID, PORTAL_ACCOUNT_ID, PORTAL_WEBMAP, PORTAL_PREVIEW_ORIGINS.
  If PORTAL_URL and PORTAL_CLIENT_ID both have a value, the script does not ask questions.

Options:
  --portal <url>        [Required] ArcGIS Enterprise Portal or AGOL URL (e.g. https://gis.{org}.com/portal)
  --client-id <id>      [Required] Portal OAuth Application Client ID
  --account-id <id>     [Optional] Account ID / Org slug (default: derived from hostname or "enterprise")
  --webmap <id-or-url>  [Optional] Web Map Item ID or full URL to update in app.json
  --reset               Revert back to public sample ArcGIS Online map and disable portal auth
  -h, --help            Show this help message

Examples:
  Interactive Mode:
    npm run auth:portal

  Direct CLI Mode:
    npm run auth:portal -- --portal https://gis.{org}.com/portal --client-id myClientId123

  Reset to Defaults:
    npm run auth:portal -- --reset
`);
}

function getArgValue(flag) {
    const idx = args.indexOf(flag);
    if (idx !== -1 && idx + 1 < args.length) {
        return args[idx + 1];
    }
    return null;
}

function prompt(rl, question, defaultValue = "") {
    return new Promise(resolve => {
        const query = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
        rl.question(query, answer => {
            const trimmed = answer.trim();
            resolve(trimmed || defaultValue);
        });
    });
}

const DEFAULT_WEBMAP = "https://www.arcgis.com/home/item.html?id=b834a68d7a484c5fb473d4ba90d35e71";

async function main() {
    if (args.includes("-h") || args.includes("--help")) {
        printHelp();
        process.exit(0);
    }

    if (args.includes("--reset")) {
        console.log("\n[AUTH] Resetting to standard ArcGIS Online default configuration...");

        // 1. Reset portalConfig.json
        if (fs.existsSync(portalConfigPath)) {
            fs.writeFileSync(portalConfigPath, JSON.stringify({
                enabled: false,
                portal: "",
                appId: "",
                clientId: "",
                accountId: "",
                webMap: ""
            }, null, 2) + "\n");
        }

        // 2. Remove app/auth/portal.json if exists
        if (fs.existsSync(portalJsonPath)) {
            fs.unlinkSync(portalJsonPath);
        }

        // 3. Reset app/app.json webMap
        if (fs.existsSync(appJsonPath)) {
            const appData = JSON.parse(fs.readFileSync(appJsonPath, "utf-8"));
            if (Array.isArray(appData.items)) {
                const mapItem = appData.items.find(it => it.$type === "map-extension");
                if (mapItem) {
                    mapItem.webMap = DEFAULT_WEBMAP;
                    fs.writeFileSync(appJsonPath, JSON.stringify(appData, null, 2) + "\n");
                }
            }
        }

        console.log("✔ Reset complete. Project restored to default public ArcGIS Online map.\n");
        process.exit(0);
    }

    // Priority: command-line option, then project.config.
    let portalUrl = getArgValue("--portal") || projectConfig.PORTAL_URL || null;
    let appId =
        getArgValue("--client-id") ||
        getArgValue("--clientId") ||
        getArgValue("--app-id") ||
        projectConfig.PORTAL_CLIENT_ID ||
        null;
    let accountId = getArgValue("--account-id") || projectConfig.PORTAL_ACCOUNT_ID || null;
    let webMap = getArgValue("--webmap") || getArgValue("--webMap") || projectConfig.PORTAL_WEBMAP || null;

    // Load existing values as defaults if available
    let existingConfig = {};
    if (fs.existsSync(portalConfigPath)) {
        try {
            existingConfig = JSON.parse(fs.readFileSync(portalConfigPath, "utf-8"));
        } catch {}
    }

    if (!portalUrl || !appId) {
        console.log("\n================================================================================");
        console.log("  VertiGIS Studio Web SDK - Configure ArcGIS Enterprise Portal Authentication");
        console.log("================================================================================\n");

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        try {
            portalUrl = portalUrl || await prompt(
                rl,
                "ArcGIS Enterprise Portal or AGOL URL",
                existingConfig.portal || "https://gis.{org}.com/portal"
            );

            appId = appId || await prompt(
                rl,
                "Portal OAuth Application Client ID",
                existingConfig.clientId || existingConfig.appId || ""
            );

            if (!appId) {
                console.error("\n✖ Error: Client ID is required to configure OAuth.");
                rl.close();
                process.exit(1);
            }

            const defaultAccount = existingConfig.accountId || (new URL(portalUrl).hostname.split(".")[0] || "enterprise");
            accountId = accountId || await prompt(
                rl,
                "Account ID (organization identifier)",
                defaultAccount
            );

            webMap = webMap || await prompt(
                rl,
                "Web Map Item ID or Full URL (leave empty to keep current)",
                existingConfig.webMap || ""
            );
        } finally {
            rl.close();
        }
    }

    // Clean portal URL (strip trailing slashes)
    portalUrl = portalUrl.trim().replace(/\/+$/, "");
    appId = appId.trim();
    accountId = (accountId || "enterprise").trim();
    webMap = (webMap || "").trim();

    // 1. Write app/auth/portal.json (required for VertiGIS Studio Web native detection)
    fs.mkdirSync(path.dirname(portalJsonPath), { recursive: true });
    const portalJsonData = {
        portal: portalUrl,
        appId: appId,
        clientId: appId,
        accountId: accountId,
    };
    fs.writeFileSync(portalJsonPath, JSON.stringify(portalJsonData, null, 2) + "\n");
    console.log(`\n✔ Wrote ${path.relative(projRoot, portalJsonPath)}`);

    // 2. Write src/auth/portalConfig.json (used by SDK runtime initialization)
    fs.mkdirSync(path.dirname(portalConfigPath), { recursive: true });
    const portalConfigData = {
        enabled: true,
        portal: portalUrl,
        appId: appId,
        clientId: appId,
        accountId: accountId,
        webMap: webMap || existingConfig.webMap || "",
    };
    fs.writeFileSync(portalConfigPath, JSON.stringify(portalConfigData, null, 2) + "\n");
    console.log(`✔ Wrote ${path.relative(projRoot, portalConfigPath)}`);

    // 3. Update app/app.json if webMap was provided
    if (webMap && fs.existsSync(appJsonPath)) {
        try {
            const appData = JSON.parse(fs.readFileSync(appJsonPath, "utf-8"));
            if (Array.isArray(appData.items)) {
                const mapItem = appData.items.find(it => it.$type === "map-extension");
                if (mapItem) {
                    // Normalize webMap: if it's just a 32-character GUID, format as full portal item URL if not AGOL
                    let targetWebMapUrl = webMap;
                    if (/^[0-9a-fA-F]{32}$/.test(webMap)) {
                        targetWebMapUrl = `${portalUrl}/home/item.html?id=${webMap}`;
                    }
                    mapItem.webMap = targetWebMapUrl;
                    fs.writeFileSync(appJsonPath, JSON.stringify(appData, null, 2) + "\n");
                    console.log(`✔ Updated webMap in ${path.relative(projRoot, appJsonPath)} -> ${targetWebMapUrl}`);
                }
            }
        } catch (e) {
            console.warn("[WARN] Could not update app/app.json:", e);
        }
    }

    // 4. Ensure oauth_callback.html exists
    if (!fs.existsSync(oauthCallbackPath)) {
        const callbackHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>OAuth Callback</title>
  <script>
    function loadHandler() {
      if (opener) {
        if (location.hash && opener.completeOAuth) {
          opener.completeOAuth(location.hash);
          close();
        } else if (location.search) {
          opener.dispatchEvent(new CustomEvent("arcgis:auth:location:search", { detail: location.search }));
          close();
        } else {
          close();
        }
      } else {
        close();
      }
    }
    window.addEventListener("load", loadHandler);
  </script>
</head>
<body></body>
</html>\n`;
        fs.writeFileSync(oauthCallbackPath, callbackHtml);
        console.log(`✔ Created ${path.relative(projRoot, oauthCallbackPath)}`);
    }

    console.log("\n================================================================================");
    console.log("  [SUCCESS] ArcGIS Enterprise Portal Authentication Configured!");
    console.log("================================================================================");
    console.log(`  - Portal:     ${portalUrl}`);
    console.log(`  - Client ID:  ${appId}`);
    console.log(`  - Account ID: ${accountId}`);
    if (webMap) {
        console.log(`  - Web Map:    ${webMap}`);
    }
    // Origins to register in the portal. Projects without PORTAL_PREVIEW_ORIGINS keep the earlier default.
    const previewOrigins = (projectConfig.PORTAL_PREVIEW_ORIGINS ?? "https://preview.kw11.org")
        .split(",")
        .map(origin => origin.trim().replace(/\/+$/, ""))
        .filter(Boolean);
    const origins = ["https://localtest.me:3001", ...previewOrigins];

    console.log("\n  IMPORTANT PREREQUISITES in your Portal Configuration:");
    console.log("  1. OAuth App Registration (Content > Add Item > Application):");
    console.log("     Ensure Redirect URIs include:");
    for (const origin of origins) {
        console.log(`       • ${origin}`);
        console.log(`       • ${origin}/oauth_callback.html`);
    }
    console.log("  2. Allowed Origins / CORS (Organization > Settings > Security > Allow Origins):");
    console.log("     If cross-domain requests are restricted, whitelist your development origin:");
    for (const origin of origins) {
        console.log(`       • ${origin}`);
    }
    console.log("     (Note: ArcGIS Enterprise requires an FQDN and rejects bare \"localhost\")");
    console.log("\n  Next Steps:");
    console.log("    Run: npm start (or ./start.sh)");
    console.log("================================================================================\n");
}

main().catch(err => {
    console.error("✖ Configuration failed:", err);
    process.exit(1);
});
