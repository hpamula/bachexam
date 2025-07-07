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

class Speak {
  constructor() {
    this.delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    this.synth = window.speechSynthesis;
    this.currentIndex = 0;
    (async () => {
      this.subjects = await get('/api/my_subjects');
      this.render();
    })();
  }
  render() {
    const subjectList = add('div', { style: 'float:left; width:40%;' });
    this.subjects.forEach((subject, i) => {
      const btn = add('textarea', {
        style: 'width:100%;',
        innerText: subject,
        rows: 1,
        onclick: async () => {
          this.synth.cancel();
          this.currentIndex = i;
          const subject = this.subjects[this.currentIndex];
          const data = await get(`/api/question?subject=${encodeURIComponent(subject)}`);
          this.output.value = JSON.stringify(data, null, 2);
        }
      });
      subjectList.appendChild(btn);
      // console.log(subject);
      // console.log(btn.scrollHeight);
      btn.style.height = btn.scrollHeight + 1 + 'px';
    });
    const main_content = add('div', { style: 'float:right; width:60%;' });
    const controls = add('div', { style: 'display: flex; justify-content: center; align-items: center; width:100%; height:60px' });
    main_content.appendChild(controls);
    const startButton = add('button', {
      innerText: 'play',
      onclick: () => { this.play(); }
    });
    controls.appendChild(startButton);
    const stopButton = add('button', {
      innerText: 'stop',
      onclick: () => { this.synth.cancel(); }
    });
    controls.appendChild(stopButton);
    this.output = add('textarea', {
      id: 'rawOutput',
      style: 'width:100%;',
      readOnly: true
    });
    main_content.appendChild(this.output);
    this.output.style.height = (document.documentElement.scrollHeight - 100) + 'px';
  }
  async speakText(text) {
    return new Promise(resolve => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pl-PL';
      utterance.onend = resolve;
      this.synth.speak(utterance);
    });
  }
  async play() {
    const subject = this.subjects[this.currentIndex];
    const data = await get(`/api/question?subject=${encodeURIComponent(subject)}`);
    this.output.value = JSON.stringify(data, null, 2);
    const qna = data[subject];
    if (!qna) {
      console.error(`No questions found for subject: ${subject}`);
      return;
    }
    await this.speakText(subject);
    await this.delay(500);
    for (const [question, answer] of Object.entries(qna)) {
      await this.speakText(question);
      await this.delay(1000);
      await this.speakText(answer);
      await this.delay(1000);
    }
    this.currentIndex = (this.currentIndex + 1) % this.subjects.length;
    this.play();
  }
}
const speak = new Speak();
