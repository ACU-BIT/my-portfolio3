const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// ===== الوضع الداكن / العادي (بيتحفظ في المتصفح) =====
const root = document.documentElement;
const themeBtn = $('#theme');

function setTheme(t) {
  root.dataset.theme = t;
  if (themeBtn) themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
  try { localStorage.setItem('theme', t); } catch (e) {}
}

let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
setTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

if (themeBtn) {
  themeBtn.onclick = () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
}

// ===== قائمة الموبايل =====
const links = $('#links');
const burger = $('#burger');

if (burger && links) {
  burger.onclick = () => {
    const o = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', o);
  };
  links.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    }
  });
}

// ===== تأثير الكتابة - غيّر الكلمات من المصفوفة words =====
const words = ['Front-End Developer', 'UI Builder', 'Problem Solver'];
let w = 0, c = 0, del = false;
const typed = $('#typed');

if (typed) {
  (function type() {
    const word = words[w];
    typed.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(type, 1600); }
    if (del && c === 0) { del = false; w = (w + 1) % words.length; }
    c += del ? -1 : 1;
    setTimeout(type, del ? 45 : 90);
  })();
}

// ===== ظهور العناصر وملء أشرطة المهارات عند التمرير =====
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  e.target.querySelectorAll('.fill').forEach(f => { f.style.width = f.dataset.w + '%'; });
  io.unobserve(e.target);
}), { threshold: .15 });

$$('.reveal').forEach(el => io.observe(el));

// ===== تمييز القسم الحالي في القائمة =====
const secs = $$('main section');
const navA = $$('.links a');

const so = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    navA.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }
}), { rootMargin: '-45% 0px -50% 0px' });

secs.forEach(s => so.observe(s));

// ===== فورم التواصل =====
function toast(message) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = message;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

const contactForm = $('#form');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;

    // التحقق من البيانات
    [
      ['name', 'Please enter your name.'],
      ['email', 'Please enter a valid email address.'],
      ['msg', 'Please write a message.']
    ].forEach(([id, message]) => {
      const el = $('#' + id);
      const err = el.nextElementSibling;
      const value = el.value.trim();
      let bad = !value;
      if (id === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) bad = true;
      err.textContent = bad ? message : '';
      if (bad) ok = false;
    });

    if (!ok) { toast('Please check the form and try again.'); return; }

    // تجهيز الإيميل وفتح برنامج البريد
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const message = $('#msg').value.trim();

    const subject = encodeURIComponent('Portfolio message from ' + name);
    const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message);

    window.location.href = 'mailto:mahmoudpx90@gmail.com?subject=' + subject + '&body=' + body;

    toast('Thanks! Your email app is opening.');
    contactForm.reset();
  });
}

// ===== السنة الحالية =====
const year = $('#year');
if (year) year.textContent = new Date().getFullYear();
