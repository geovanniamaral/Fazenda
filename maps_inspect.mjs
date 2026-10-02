import fs from 'node:fs/promises';

const pages = await fetch('http://127.0.0.1:9223/json/list').then(response => response.json());
const page = pages.find(item => item.type === 'page');
if (!page) throw new Error('Página do Google Maps não encontrada.');

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let nextId = 0;
const pending = new Map();
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++nextId;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

await send('Runtime.enable');
await send('Page.enable');
await new Promise(resolve => setTimeout(resolve, 5000));

const before = await send('Runtime.evaluate', {
  expression: `({
    title: document.title,
    text: document.body.innerText,
    buttons: [...document.querySelectorAll('button')].map((button, index) => ({
      index,
      label: button.getAttribute('aria-label'),
      text: button.innerText
    })).filter(item => item.label || item.text)
  })`,
  returnByValue: true
});

console.log(JSON.stringify(before.result.value, null, 2));

await send('Runtime.evaluate', {
  expression: `(() => {
    const candidates = [...document.querySelectorAll('button')];
    const photoButton = candidates.find(button => /foto|photo|imagem/i.test((button.getAttribute('aria-label') || '') + ' ' + button.innerText));
    if (photoButton) {
      photoButton.click();
      return { clicked: 'button', label: photoButton.getAttribute('aria-label'), text: photoButton.innerText };
    }
    const target = document.elementFromPoint(280, 175);
    target?.click();
    return { clicked: 'coordinate', tag: target?.tagName, label: target?.getAttribute?.('aria-label') };
  })()`,
  returnByValue: true
});

await new Promise(resolve => setTimeout(resolve, 6000));
const screenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
await fs.writeFile('maps-fotos.png', Buffer.from(screenshot.data, 'base64'));

for (let step = 1; step <= 3; step += 1) {
  await send('Runtime.evaluate', {
    expression: `(() => {
      const panels = [...document.querySelectorAll('div')]
        .filter(element => element.scrollHeight > element.clientHeight + 150 && element.clientWidth < 620)
        .sort((a, b) => b.scrollHeight - a.scrollHeight);
      const panel = panels[0];
      if (!panel) return null;
      panel.scrollTop = Math.min(panel.scrollHeight, panel.scrollTop + panel.clientHeight * 0.85);
      return { top: panel.scrollTop, height: panel.scrollHeight, client: panel.clientHeight };
    })()`,
    returnByValue: true
  });
  await new Promise(resolve => setTimeout(resolve, 2500));
  const nextScreenshot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await fs.writeFile(`maps-fotos-${step + 1}.png`, Buffer.from(nextScreenshot.data, 'base64'));
}

const images = await send('Runtime.evaluate', {
  expression: `[...document.images].map(image => ({
    alt: image.alt,
    width: image.naturalWidth,
    height: image.naturalHeight
  })).filter(image => image.width >= 300 || image.height >= 300)`,
  returnByValue: true
});
console.log(JSON.stringify({ galleryImages: images.result.value }, null, 2));
await send('Browser.close');
socket.close();
