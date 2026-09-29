import esriConfig from "@arcgis/core/config";
import esriId from "@arcgis/core/identity/IdentityManager";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import portalConfig from "./portalConfig.json";

/**
 * Initializes ArcGIS Enterprise Portal / AGOL OAuth authentication and trusted servers
 * if a portal is configured. If disabled, maintains default standard unauthenticated behavior.
 */
export function initPortalAuth(): void {
    if (!portalConfig || !portalConfig.enabled || !portalConfig.portal || !portalConfig.appId) {
        return;
    }

    const { portal, appId } = portalConfig;
    const cleanPortalUrl = portal.replace(/\/+$/, "");
    const portalVariants = Array.from(new Set([cleanPortalUrl, cleanPortalUrl.toLowerCase()]));

    esriConfig.request.trustedServers = esriConfig.request.trustedServers ?? [];

    // Also trust the portal host origin (ensures feature services at /server receive credentials/tokens)
    try {
        const portalOrigin = new URL(cleanPortalUrl).origin;
        if (!esriConfig.request.trustedServers.includes(portalOrigin)) {
            esriConfig.request.trustedServers.push(portalOrigin);
        }
    } catch {}

    const callbackOrigin = typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : "https://localtest.me:3001";

    for (const url of portalVariants) {
        if (!esriConfig.request.trustedServers.includes(url)) {
            esriConfig.request.trustedServers.push(url);
        }
        const oauthInfo = new OAuthInfo({
            appId,
            portalUrl: url,
            popup: true,
            popupCallbackUrl: `${callbackOrigin}/oauth_callback.html`,
        });
        esriId.registerOAuthInfos([oauthInfo]);
    }

    esriConfig.portalUrl = cleanPortalUrl;
}
