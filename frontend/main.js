async function sendJSON(route, options) {
  try {
    const res = await fetch(route, options);
    if (!res.ok) {
      console.error(`Server error: ${res.status} ${res.statusText}`);
      return { error: `Server error: ${res.status}` };
    }
    return res.json();
  } catch (err) {
    console.error('Network or parsing error:', err);
    return { error: 'Network or parsing error' };
  }
}
async function post(route, data = {}) {
  return sendJSON(route, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
async function get(route) {
  return sendJSON(route, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
}

function add(element, args) {
  const e = document.createElement(element);
  Object.assign(e, args);
  document.body.insertBefore(e, document.currentScript);
  return e;
}

