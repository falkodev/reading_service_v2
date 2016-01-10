cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/src/windows/DeviceProxy.js",
        "id": "cordova-plugin-device.DeviceProxy",
        "merges": [
            ""
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/src/windows/InAppBrowserProxy.js",
        "id": "cordova-plugin-inappbrowser.InAppBrowserProxy",
        "merges": [
            ""
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.local-notification/www/local-notification.js",
        "id": "de.appplant.cordova.plugin.local-notification.LocalNotification",
        "clobbers": [
            "cordova.plugins.notification.local",
            "plugin.notification.local"
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.local-notification/www/local-notification-core.js",
        "id": "de.appplant.cordova.plugin.local-notification.LocalNotification.Core",
        "clobbers": [
            "cordova.plugins.notification.local.core",
            "plugin.notification.local.core"
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.local-notification/www/local-notification-util.js",
        "id": "de.appplant.cordova.plugin.local-notification.LocalNotification.Util",
        "merges": [
            "cordova.plugins.notification.local.core",
            "plugin.notification.local.core"
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.local-notification/src/windows/LocalNotificationProxy.js",
        "id": "de.appplant.cordova.plugin.local-notification.LocalNotification.Proxy",
        "merges": [
            ""
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.local-notification/src/windows/LocalNotificationCore.js",
        "id": "de.appplant.cordova.plugin.local-notification.LocalNotification.Proxy.Core",
        "merges": [
            ""
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.local-notification/src/windows/LocalNotificationUtil.js",
        "id": "de.appplant.cordova.plugin.local-notification.LocalNotification.Proxy.Util",
        "merges": [
            ""
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-device": "1.0.1",
    "cordova-plugin-inappbrowser": "1.0.1",
    "cordova-plugin-whitelist": "1.0.0",
    "de.appplant.cordova.plugin.local-notification": "0.8.2"
}
// BOTTOM OF METADATA
});