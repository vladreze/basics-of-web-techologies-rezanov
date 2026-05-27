// ============================================================
// Завдання 1 — API Explorer (міні-Postman)
// ============================================================
// Вимоги:
//   1. Form → fetch: метод, URL, headers, body.
//      GET/HEAD без body (інакше TypeError).
//   2. Парсинг headers з textarea:
//      "Content-Type: application/json" → { "Content-Type": "application/json" }
//      Порожні рядки і "# коментар" — ігнорувати.
//   3. Валідація JSON body перед fetch.
//   4. Відображення response:
//      - Статус-код з кольоровим маркером (2xx/3xx/4xx/5xx).
//      - Response headers (всі).
//      - Тіло: JSON форматувати, text/html — як є.
//      - Час виконання (performance.now()).
//   5. AbortController при повторному кліку.
//   6. Історія останніх 10: метод + URL + status.
//      Клік → форма заповнюється цими значеннями.
//
// Тестові URL:
//   GET  https://httpbin.org/get
//   GET  https://httpbin.org/status/404
//   GET  https://httpbin.org/status/500
//   GET  https://httpbin.org/delay/3
//   POST https://jsonplaceholder.typicode.com/posts
//        body: { "title": "test", "body": "body", "userId": 1 }
// ============================================================

const methodSel = document.getElementById("method");
const urlInput = document.getElementById("url");
const sendBtn = document.getElementById("send");
const headersTA = document.getElementById("headers");
const bodyTA = document.getElementById("body");
const bodyErr = document.getElementById("body-error");

const responseDiv = document.getElementById("response");
const statusLine = document.getElementById("status-line");
const responseHeaders = document.getElementById("response-headers");
const responseBody = document.getElementById("response-body");

const historyEl = document.getElementById("history");

let currentController = null;
const history = []; // { method, url, status, headers, body }


function parseHeaders(text) {
  const headersObj = {};
  const lines = text.split('\n'); 

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    
    const parts = line.split(':'); 
    if (parts.length >= 2) {
      const key = parts[0].trim(); 
      const value = parts.slice(1).join(':').trim(); 
      headersObj[key] = value;
    }
  }
  return headersObj;
}


function renderHistory() {
  historyEl.innerHTML = ''; 

  if (history.length === 0) {
    historyEl.innerHTML = '<li style="background:#f6f8fa; color:#888; cursor: default;">Nothing</li>';
    return;
  }

  for (let i = 0; i < history.length; i++) {
    const item = history[i];
    const li = document.createElement('li');
    li.innerHTML = `<span class="method">${item.method}</span> ${item.url} <span class="status">${item.status}</span>`;
    
    li.addEventListener('click', () => {
      methodSel.value = item.method;
      urlInput.value = item.url;
      headersTA.value = item.headersInput;
      bodyTA.value = item.bodyInput;
    });
    
    historyEl.appendChild(li);
  }
}

// ============================================================
// ГОЛОВНА ЛОГІКА (КЛІК ПО КНОПЦІ SEND)
// ============================================================

sendBtn.addEventListener("click", async () => {
  const method = methodSel.value;
  const url = urlInput.value.trim();
  const headersInput = headersTA.value;
  const bodyInput = bodyTA.value.trim();

  if (url === "") {
    alert("Будь ласка, введіть URL.");
    return;
  }

  bodyErr.hidden = true;
  responseDiv.classList.remove("visible");

  const isGetOrHead = (method === 'GET' || method === 'HEAD');
  let requestBody = null;

  if (!isGetOrHead && bodyInput !== "") {
    try {
      JSON.parse(bodyInput); 
      requestBody = bodyInput; 
    } catch (error) {
      bodyErr.textContent = "unvalid JSON: " + error.message;
      bodyErr.hidden = false;
      return; 
    }
  }

  if (currentController !== null) {
    currentController.abort();
  }
  currentController = new AbortController();


  const options = {
    method: method,
    headers: parseHeaders(headersInput),
    signal: currentController.signal
  };

  if (!isGetOrHead && requestBody !== null) {
    options.body = requestBody;
  }

  sendBtn.disabled = true;
  const startTime = performance.now();
  let statusCode = "Error";

  try {
    const response = await fetch(url, options);
    const endTime = performance.now();
    const elapsed = Math.round(endTime - startTime);
    
    statusCode = response.status; 

    statusLine.className = "status-line"; 
    if (statusCode >= 200 && statusCode <= 299) statusLine.classList.add("s2");
    else if (statusCode >= 300 && statusCode <= 399) statusLine.classList.add("s3");
    else if (statusCode >= 400 && statusCode <= 499) statusLine.classList.add("s4");
    else if (statusCode >= 500) statusLine.classList.add("s5");

    statusLine.innerHTML = `<span>${response.status} ${response.statusText}</span> <span class="elapsed">${elapsed} ms</span>`;

    let headersOutput = "";
    for (const [key, value] of response.headers.entries()) {
      headersOutput += `${key}: ${value}\n`;
    }
    responseHeaders.textContent = headersOutput || "No headers";

    const contentType = response.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      const dataObj = await response.json();
      responseBody.textContent = JSON.stringify(dataObj, null, 2);
    } else {
      const textData = await response.text();
      responseBody.textContent = textData;
    }

    responseDiv.classList.add("visible");

  } catch (error) {
    if (error.name === 'AbortError') {
      return; 
    }
    
    statusLine.className = "status-line s5";
    statusLine.innerHTML = `<span>Network error: ${error.message}</span>`;
    responseHeaders.textContent = "";
    responseBody.textContent = "";
    responseDiv.classList.add("visible");
    
  } finally {
    sendBtn.disabled = false;
    
    history.unshift({ method, url, status: statusCode, headersInput, bodyInput });
    
    if (history.length > 10) {
      history.pop();
    }
    renderHistory();
  }
});