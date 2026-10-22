import fs from 'node:fs';
import path from 'node:path';

function json(statusCode, body) {
  return new Response(JSON.stringify(body), { status: statusCode, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
}
function money(value) { return Math.round((value + Number.EPSILON) * 100) / 100; }
function getBand(bands, sqft) {
  return bands.find(b => (b.minSqFt == null || sqft >= b.minSqFt) && (b.maxSqFt == null || sqft <= b.maxSqFt));
}
export default async (request) => {
  if (request.method !== 'POST') return json(405, { error: 'Méthode non autorisée.' });
  let input;
  try { input = await request.json(); } catch { return json(400, { error: 'Requête invalide.' }); }
  if (!input || typeof input !== 'object' || Array.isArray(input)) return json(400, { error: 'Requête invalide.' });
  const configPath = path.join(process.cwd(), 'pricing.json');
  const prices = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const missing = [];
  let base = 0, extras = 0, supplements = 0, formula = '';
  const selectedExtras = Array.isArray(input.extras) ? input.extras : [];
  const kind = input.kind;
  const condition = input.condition || 'standard';
  const allowedExtras = ['oven', 'fridgeInterior', 'interiorWindow'];
  if ((input.extras != null && !Array.isArray(input.extras)) || selectedExtras.some(key => !allowedExtras.includes(key)) || new Set(selectedExtras).size !== selectedExtras.length) return json(400, { error: 'Options invalides.' });
  if (!['standard', 'deep', 'moveout'].includes(condition) || (kind === 'commercial' && condition === 'moveout')) return json(400, { error: 'Service invalide.' });
  if (kind === 'hourly' && !['standard', 'demanding'].includes(input.level || 'standard')) return json(400, { error: 'Tarif horaire invalide.' });
  if (kind === 'residential' && (!Number.isInteger(Number(input.bathrooms)) || Number(input.bathrooms) < 1 || Number(input.bathrooms) > 100)) return json(400, { error: 'Indiquez entre 1 et 100 salles de bain.' });
  const addConfiguredExtras = (group) => {
    for (const key of selectedExtras) {
      if (!(key in group)) continue;
      if (group[key] == null || !Number.isFinite(Number(group[key]))) missing.push(`Tarif manquant pour l'extra : ${({oven: 'intérieur du four', fridgeInterior: 'intérieur du réfrigérateur', interiorWindow: 'fenêtres intérieures'})[key]}`);
      else extras += Number(group[key]);
    }
  };

  if (kind === 'residential') {
    const sqft = Number(input.sqft);
    if (!Number.isInteger(sqft) || sqft <= 0 || sqft > 10000000) return json(400, { error: 'Indiquez une superficie valide en pieds carrés.' });
    const band = getBand(prices.residential.basePrices, sqft);
    if (!band || band.price == null) missing.push(`Prix de base résidentiel non configuré pour ${band ? band.label : `${sqft} pi²`}`);
    else base = Number(band.price);
    const bathrooms = Math.max(1, Math.floor(Number(input.bathrooms) || 1));
    if (bathrooms > 1) {
      if (prices.residential.extraBathroomPrice == null) missing.push('Supplément par salle de bain supplémentaire non configuré');
      else supplements += (bathrooms - 1) * Number(prices.residential.extraBathroomPrice);
    }
    if (condition === 'deep') {
      if (prices.residential.deepCleanPercent == null) missing.push('Pourcentage de grand ménage non configuré');
      else supplements += base * Number(prices.residential.deepCleanPercent) / 100;
    }
    if (condition === 'moveout') {
      if (prices.residential.moveOutPercent == null) missing.push('Pourcentage après déménagement non configuré');
      else supplements += base * Number(prices.residential.moveOutPercent) / 100;
    }
    addConfiguredExtras(prices.residential.extras);
    formula = 'Prix de base selon la superficie + salle(s) de bain supplémentaire(s) + pourcentage applicable sur le prix de base + extras.';
  } else if (kind === 'commercial') {
    const sqft = Number(input.sqft);
    if (!Number.isInteger(sqft) || sqft <= 0 || sqft > 10000000) return json(400, { error: 'Indiquez une superficie commerciale valide en pieds carrés.' });
    const rate = condition === 'deep' ? prices.commercial.deepCleanPricePerSqFt : prices.commercial.regularPricePerSqFt;
    if (rate == null) missing.push(condition === 'deep' ? 'Tarif commercial approfondi au pi² non configuré' : 'Tarif commercial régulier au pi² non configuré');
    if (prices.commercial.minimumVisitPrice == null) missing.push('Montant minimum commercial non configuré');
    if (rate != null && prices.commercial.minimumVisitPrice != null) base = Math.max(sqft * Number(rate), Number(prices.commercial.minimumVisitPrice));
    addConfiguredExtras(prices.commercial.extras);
    formula = 'Maximum(superficie × tarif au pi², minimum par visite) + extras.';
  } else if (kind === 'hourly') {
    const hours = Number(input.hours);
    if (!Number.isFinite(hours) || hours <= 0 || hours > 24) return json(400, { error: 'Indiquez un nombre d’heures entre 0 et 24.' });
    const rate = input.level === 'demanding' ? prices.hourly.demandingRate : prices.hourly.standardRate;
    base = hours * rate;
    addConfiguredExtras(prices.hourly.extras);
    formula = `Nombre d’heures × ${rate} $/h + extras.`;
  } else return json(400, { error: 'Choisissez un type de service valide.' });

  if (missing.length) return json(200, { status: 'incomplete', estimate: null, currency: prices.currency, missing: [...new Set(missing)], formula });
  return json(200, { status: 'estimate', estimate: money(base + supplements + extras), breakdown: { base: money(base), supplements: money(supplements), extras: money(extras) }, currency: prices.currency, formula, disclaimer: 'Estimation indicative. La réservation reste en attente jusqu’à confirmation par Groupe Flachmay.' });
};
