const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')()
chromium.use(stealth)
(async () => {
  const browser = await chromium.launch({
     headless: false,
     executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
     });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Intercept WebSocket connections
  page.on('websocket', (webSocket) => {
    console.log('WebSocket opened:', webSocket.url());

    // Listen for incoming WebSocket messages
    webSocket.on('framereceived', (frame) => {
      const message = JSON.parse(frame.payload); // Parse the incoming JSON message
      console.log('WebSocket Message Received:', message);

      // Process game data
      if (message.t === 'GameState') {
        console.log('Game State Data:', message.gameState);
        // Further processing here
      }    });

    // Listen for outgoing WebSocket messages (if needed)
    webSocket.on('framesent', (frame) => {
      const message = JSON.parse(frame.payload); // Parse outgoing messages
      console.log('WebSocket Message Sent:', message);
    });
  });

  // Navigate to the poker platform
  await page.goto('https://stake.us'); // Replace with the actual URL

  // Keep the browser open to capture messages
  await page.waitForTimeout(60000); // Adjust as needed
 // await browser.close();
})();
