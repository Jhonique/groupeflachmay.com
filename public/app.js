const calculator = document.querySelector('#calculator-form');
const result = document.querySelector('#estimate-result');
const estimateField = document.querySelector('#request-estimate');
const request = document.querySelector('#request-form');
let revision = 0;
function invalidate() {
  revision++;
  estimateField.value = 'Non calculée — paramètres modifiés';
  result.replaceChildren();
  const heading = document.createElement('h3');
  heading.textContent = 'Votre estimation';
  const text = document.createElement('p');
  text.textContent = 'Cliquez sur Calculer mon estimation pour actualiser le résultat.';
  result.append(heading, text);
}
calculator.addEventListener('input', invalidate);
calculator.querySelectorAll('[data-kind]').forEach(button => button.addEventListener('click', () => {
  const kind = button.dataset.kind;
  calculator.elements.kind.value = kind;
  calculator.querySelectorAll('[data-kind]').forEach(tab => tab.setAttribute('aria-pressed', String(tab === button)));
  for (const [selector, visible] of [['[data-area]',kind !== 'hourly'],['[data-bathrooms]',kind === 'residential'],['[data-condition]',kind !== 'hourly'],['[data-hours]',kind === 'hourly'],['[data-level]',kind === 'hourly']]) {
    const group = calculator.querySelector(selector);
    group.hidden = !visible;
    group.querySelectorAll('input,select').forEach(input => input.disabled = !visible);
  }
  const moveout = calculator.elements.condition.querySelector('[value="moveout"]');
  moveout.disabled = kind === 'commercial';
  if (kind === 'commercial' && calculator.elements.condition.value === 'moveout') calculator.elements.condition.value = 'standard';
  invalidate();
}));
calculator.addEventListener('submit', async event => {
  event.preventDefault();
  const button = document.querySelector('#calculate-button');
  const data = new FormData(calculator);
  const input = Object.fromEntries(data);
  input.extras = data.getAll('extras');
  const currentRevision = revision;
  button.disabled = true;
  button.textContent = 'Calcul en cours…';
  try {
    const response = await fetch('/.netlify/functions/calculate', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(input) });
    const output = await response.json();
    if (currentRevision !== revision) return;
    if (!response.ok) throw new Error(output.error || 'Le calcul est momentanément indisponible.');
    result.replaceChildren();
    const title = document.createElement('h3');
    const note = document.createElement('p');
    if (output.status === 'incomplete') {
      title.textContent = 'Sur soumission';
      note.textContent = 'Certains tarifs restent à confirmer. Aucun montant partiel ne vous est présenté comme un total.';
      const list = document.createElement('ul');
      output.missing.forEach(item => {const li=document.createElement('li');li.textContent=item;list.append(li);});
      result.append(title,note,list);
      estimateField.value = 'Sur soumission — ' + output.missing.join('; ');
    } else {
      title.className = 'amount';
      title.textContent = new Intl.NumberFormat('fr-CA',{style:'currency',currency:'CAD'}).format(output.estimate);
      note.textContent = output.formula + ' ' + output.disclaimer;
      result.append(title,note);
      estimateField.value = title.textContent + ' — ' + output.formula;
    }
    estimateField.value += ' | Paramètres : ' + JSON.stringify(input);
    if (input.sqft) request.elements.superficie.value = input.sqft;
    if (input.bathrooms) request.elements['salles-de-bain'].value = input.bathrooms;
    request.elements.service.value = input.kind === 'hourly' ? 'Nettoyage à l’heure' : ({standard:'Entretien régulier',deep:'Grand ménage',moveout:'Après déménagement'}[input.condition]);
    if (input.kind === 'commercial') request.elements.espace.value = 'Bureau';
  } catch(error) {
    if (currentRevision === revision) {
      result.textContent = error.message + ' Vous pouvez envoyer une demande de soumission ci-dessous.';
      estimateField.value = 'Calcul indisponible';
    }
  } finally {button.disabled=false;button.innerHTML='Calculer mon estimation <span>↗</span>';}
});
const date = request.elements['date-souhaitee'];
const now = new Date();
date.min = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
request.addEventListener('submit', async event => {
  event.preventDefault();
  const button = request.querySelector('button[type="submit"]');
  const status = document.querySelector('#request-status');
  button.disabled = true;
  button.textContent = 'Envoi en cours…';
  status.textContent = '';
  try {
    const response = await fetch('/', {method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(request)).toString()});
    if (!response.ok) throw new Error('Envoi impossible');
    window.location.assign('/merci');
  } catch {
    status.textContent = 'La demande n’a pas pu être envoyée. Réessayez ou écrivez à flachmay@groupeflachmay.com.';
    button.disabled = false;
    button.innerHTML = 'Envoyer ma demande <span>↗</span>';
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();
