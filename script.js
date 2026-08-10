document.getElementById('year').textContent = new Date().getFullYear();
const button = document.getElementById('reserveButton');
const toast = document.getElementById('toast');
button.addEventListener('click', () => {
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
});
