/**
 * This will be loaded before starting the simulator.
 * If you wish to add custom javascript, 
 * ** make sure to add this line to pxt.json**
 * 
 *      "disableTargetTemplateFiles": true
 * 
 * otherwise MakeCode will override your changes.
 * 
 * To register a constrol simmessages, use addSimMessageHandler
 */

addSimMessageHandler("web", (data) => {
    switch(data.action) {
        case "open":
            const url = data.data;
            window.open(url, "_blank");
            break;
        case "event":
            const msg = data.data;
            window.parent.postMessage(msg, "http://127.0.0.1:8081");
            window.parent.postMessage(msg, "https://trendaro-stage.web.app");
            window.parent.postMessage(msg, "https://trendaro.cz");
            break;
    }                    
})
