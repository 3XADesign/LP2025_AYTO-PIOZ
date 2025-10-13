// js/search.js - buscador simulado que combina noticias, tramites, villa y servicios
const SEARCH_INDEX = [];

async function buildIndex(){
  try{
    const [nRes,tRes,vRes] = await Promise.all([
      fetch('./data/news.json').then(r=>r.json()).catch(()=>({news:[]})),
      fetch('./data/tramites.json').then(r=>r.json()).catch(()=>({contracts:[],forms:[],ordenanzas:[]})),
      fetch('./data/villa.json').then(r=>r.json()).catch(()=>({})),
    ]);
    // noticias
  (nRes.news||[]).forEach(n=> SEARCH_INDEX.push({id:`news-${n.id}`,title:n.title,excerpt:n.excerpt||'',category:'Noticias',date:n.date,source:n, url: `index.html#noticias`}));
    // bandos plenos también en news.json si su type lo indica
    // tramites: contracts, forms, ordenanzas
  (tRes.contracts||[]).forEach(c=> SEARCH_INDEX.push({id:`contract-${c.id}`,title:c.title,excerpt:c.type||'',category:'Trámites',date:c.date,source:c, url:'tramites.html#perfil'}));
  (tRes.forms||[]).forEach((f,i)=> SEARCH_INDEX.push({id:`form-${i}`,title:f.name,excerpt:'Impreso',category:'Trámites',source:f, url:'tramites.html#impresos'}));
  (tRes.ordenanzas||[]).forEach((o,i)=> SEARCH_INDEX.push({id:`ordenanza-${i}`,title:o.title,excerpt:'Ordenanza',category:'Trámites',date:o.date,source:o, url:'tramites.html#ordenanzas'}));
    // villa: heritage, urbanizations, companies
    const v = vRes || {};
  if(v.press_feed) (v.press_feed||[]).forEach(p=> SEARCH_INDEX.push({id:`villa-press-${p.id}`,title:p.title,excerpt:p.excerpt||'',category:'Prensa local',date:p.date,source:p, url:'villa_de_pioz.html#prensa'}));
  if(v.heritage){ if(v.heritage.castle) SEARCH_INDEX.push({id:'villa-castle',title:v.heritage.castle.title,excerpt:v.heritage.castle.description,category:'Patrimonio',source:v.heritage.castle, url:'villa_de_pioz.html#patrimonio'}); if(v.heritage.church) SEARCH_INDEX.push({id:'villa-church',title:v.heritage.church.title,excerpt:v.heritage.church.description,category:'Patrimonio',source:v.heritage.church, url:'villa_de_pioz.html#patrimonio'}); }
    // static services list (from app.js SERVICES) - duplicated here for search
    const SERVICES = [
      {id:'atencion',title:'Atención al Ciudadano'},{id:'empleo',title:'Empleo (Bolsa de Trabajo)'},{id:'sanidad',title:'Sanidad'},{id:'bienestar',title:'Bienestar Social'},{id:'imserso',title:'IMSERSO'},{id:'urbanismo',title:'Urbanismo'},{id:'medio-ambiente',title:'Medio Ambiente'},{id:'proteccion-civil',title:'Protección Civil'},{id:'transporte',title:'Transporte'},{id:'piscina',title:'Piscina Municipal'},{id:'biblioteca',title:'Biblioteca Municipal «Miguel de Cervantes»'}
    ];
    SERVICES.forEach(s=> SEARCH_INDEX.push({id:`service-${s.id}`,title:s.title,excerpt:'Servicio municipal',category:'Servicios',source:s, url:`servicios.html#service-${s.id}`}));
  }catch(e){ console.error('Error construyendo índice de búsqueda', e); }
}

function parseQuery(){
  const params = new URLSearchParams(location.search);
  return params.get('q') || '';
}

function renderResults(q){
  const container = document.getElementById('search-results');
  if(!container) return;
  container.innerHTML = '';
  const normalized = q.trim().toLowerCase();
  if(!normalized){ container.innerHTML = '<p>Introduce una consulta en la caja de búsqueda.</p>'; return; }
  const results = SEARCH_INDEX.filter(item=> (item.title||'').toLowerCase().includes(normalized) || (item.excerpt||'').toLowerCase().includes(normalized));
  if(results.length===0){ container.innerHTML = `<p>No se encontraron resultados para «${escapeHtml(q)}».</p>`; return; }
  const ul = document.createElement('ul');
  results.slice(0,50).forEach(r=>{
    const li = document.createElement('li');
    const url = r.url || '#';
    li.innerHTML = `<h3><a href="${url}">${escapeHtml(r.title)}</a></h3><p class="muted">${escapeHtml(r.category)} ${r.date? '· '+new Date(r.date).toLocaleDateString('es-ES'):''}</p><p>${escapeHtml(r.excerpt||'')}</p>`;
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

document.addEventListener('DOMContentLoaded', async ()=>{
  await buildIndex();
  const q = parseQuery();
  // prefill page input if present (robust selection: id, form-scoped, or fallback)
  let pageInput = document.getElementById('q-page');
  if(!pageInput) pageInput = document.querySelector('form.search-page-form input[name="q"]');
  if(!pageInput){
    // fallback: find input[name=q] inside a form with class search-page-form
    const inputs = Array.from(document.querySelectorAll('input[name="q"]'));
    pageInput = inputs.find(i=> i.closest('form') && i.closest('form').classList.contains('search-page-form')) || null;
  }
  if(pageInput){ pageInput.value = q; try{ pageInput.setAttribute('value', q); }catch(e){} }
  // determine final query: prefer URL param, otherwise use input's existing value (prop or attribute)
  let finalQ = q;
  if(!finalQ && pageInput){
    const prop = (pageInput.value || '').trim();
    const attr = (pageInput.getAttribute && pageInput.getAttribute('value')) || '';
    if(prop) finalQ = prop;
    else if((attr||'').trim()) finalQ = (attr||'').trim();
  }

  // if there is a final query, reflect it in the input's value/attribute
  if(pageInput && finalQ){
    try{ pageInput.value = finalQ; pageInput.setAttribute('value', finalQ); }catch(e){}
  }

  renderResults(finalQ);

  // live update from input (if present)
  if(pageInput && !pageInput._hasLiveHandler){
    pageInput.addEventListener('input', (e)=>{
      const v = (e.target.value||'').trim();
      renderResults(v);
    });
    pageInput._hasLiveHandler = true;
  }
});

// provide escapeHtml if not present globally (used by other scripts)
if(typeof escapeHtml === 'undefined'){
  function escapeHtml(s){
    return String(s||'').replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]; });
  }
  window.escapeHtml = escapeHtml;
}
