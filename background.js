// set default state to OFF
let extState = 'OFF';


// on URL change reset the extension state to OFF
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  extState = 'OFF';
  chrome.action.setIcon({
    path: {
      "16": "icons/icon_16.png",
      "32": "icons/icon_32.png",
      "48": "icons/icon_48.png",
      "128": "icons/icon_128.png"
    }
  });
}); 

// user clicks on the extension icon
chrome.action.onClicked.addListener(async (tab) => {
  extState = extState === 'ON' ? 'OFF' : 'ON';

  if (extState === "ON") {
    // When user turns the extension on
    // add iframe to the current tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        const iframe = document.createElement('iframe');
        // use the same URL of the tab to keep the session alive
        iframe.src = window.location.href;
        iframe.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 1px;
          height: 1px;
          border: none;
          z-index: 999999;
        `;
        iframe.name = 'KeepAlivePro';
        document.body.appendChild(iframe);
      }
    });
    // make the iframe autorefresh every 10 seconds
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        setInterval(() => {
          const iframe = document.querySelector('iframe[name="KeepAlivePro"]');
          if (iframe) {
            iframe.src = iframe.src;
          }
        }, 15000);
      }
    });
    // change the extension icon to green
    chrome.action.setIcon({
      path: {
        "16": "icons/icon_16_on.png",
        "32": "icons/icon_32_on.png",
        "48": "icons/icon_48_on.png",
        "128": "icons/icon_128_on.png"
      }
    });

  } else if (extState === "OFF") {
    // When user turns the extension off
    // remove iframe 'KeepAlivePro' from the current tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        const iframe = document.querySelector('iframe[name="KeepAlivePro"]');
        if (iframe) {
          iframe.remove();
        }
      }
    });
    // change the extension icon back
    chrome.action.setIcon({
      path: {
        "16": "icons/icon_16.png",
        "32": "icons/icon_32.png",
        "48": "icons/icon_48.png",
        "128": "icons/icon_128.png"
      }
    });

  }

});


