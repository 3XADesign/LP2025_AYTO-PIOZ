// app.js - carga de datos simulada y comportamientos UI

const DATA_URL = './data/news.json';
const TRAMITES_URL = './data/tramites.json';
const VILLA_URL = './data/villa.json';

async function loadData(){
  try{
    const res = await fetch(DATA_URL);
    const data = await res.json();
    renderNews(data.news);
    renderTeam(data.team);
    renderCalendar(data.events);
    // only initialize global map if map element exists
    if(document.getElementById('map')) initMap(data.map);
    // si existe la sección de trámites en la página, carga los datos de trámites
    if(document.getElementById('contracts-list') || document.getElementById('forms-list') || document.getElementById('ordenanzas-list')){
      loadTramites();
    }
    // si estamos en la página ayuntamiento, renderiza bandos/plenos y equipo
    if(document.getElementById('bandos-list') || document.getElementById('plenos-list') || document.getElementById('ayuntamiento-equipo')){
      renderBandosAndPlenos(data.news || []);
      // equipo en ayuntamiento puede reutilizar team
      if(document.getElementById('ayuntamiento-equipo') && data.team){
        renderAyuntamientoTeam(data.team);
      }
      // carga contratos también para perfil del contratante en ayuntamiento
      if(document.getElementById('contracts-list-ayto')){
        // fetch tramites.json
        try{
          const r2 = await fetch(TRAMITES_URL);
          const tdata = await r2.json();
          renderContractsAyto(tdata.contracts || []);
          const search = document.getElementById('search-contracts-ayto');
          if(search){
            search.addEventListener('input', ()=>{
              const q = search.value.trim().toLowerCase();
              const filtered = (tdata.contracts||[]).filter(c=>{
                return (c.title && c.title.toLowerCase().includes(q)) ||
                       (c.type && c.type.toLowerCase().includes(q)) ||
                       (c.status && c.status.toLowerCase().includes(q));
              });
              renderContractsAyto(filtered);
            });
          }
        }catch(e){console.error('Error cargando tramites para ayuntamiento',e)}
      }
    }
    // si estamos en la página cultura, renderiza eventos culturales y tablón
    if(document.getElementById('cultural-events') || document.getElementById('cultural-feed')){
      renderCulturalEvents(data.events || []);
      renderCulturalFeed(data.news || []);
    }
    // si estamos en la página Villa de Pioz, cargar datos específicos
    if(document.getElementById('villa-demographics') || document.getElementById('villa-map')){
      try{
        const r3 = await fetch(VILLA_URL);
        const vdata = await r3.json();
        renderVillaDemographics(vdata.demographics || {});
        renderVillaGeography(vdata.geography || {});
        renderVillaUrbanizaciones(vdata.urbanizations || []);
        renderVillaHeritage(vdata.heritage || {});
        renderVillaTraditions(vdata.traditions || []);
        renderVillaCompanies(vdata.companies || []);
        renderVillaPress(vdata.press_feed || []);
        initVillaMap(vdata.map_points || []);
      }catch(e){ console.error('Error cargando datos de la Villa', e); }
    }
    // si estamos en la página servicios, renderiza la lista y avisos
    if(document.getElementById('services-grid') || document.getElementById('service-notices')){
      renderServices();
      renderServiceNotices(data.news || []);
      const search = document.getElementById('service-search');
      if(search){
        search.addEventListener('input', ()=>{
          const q = search.value.trim().toLowerCase();
          renderServices(q);
        });
      }
    }
  }catch(e){
    console.error('Error cargando datos:', e);
    const nf = document.getElementById('news-feed');
    if(nf) nf.innerHTML = '<p>No se pudieron cargar las noticias.</p>';
  }
}

function renderCulturalEvents(events){
  const el = document.getElementById('cultural-events');
  if(!el) return;
  el.innerHTML='';
  // filtrar eventos relevantes para cultura: por defecto usamos todos y marcamos tradicionales
  const cultural = (events||[]).filter(ev=> true);
  if(cultural.length===0){ el.innerHTML='<p>No hay eventos culturales programados.</p>'; return; }
  const list = document.createElement('ul');
  cultural.sort((a,b)=> new Date(a.date)-new Date(b.date));
  cultural.forEach(ev=>{
    const li = document.createElement('li');
    li.innerHTML = `<strong>${escapeHtml(ev.title)}</strong> — ${new Date(ev.date).toLocaleDateString('es-ES')} ${ev.time? '· '+escapeHtml(ev.time): ''} <br><span class="muted">${escapeHtml(ev.location)}</span> <p>${escapeHtml(ev.description)}</p>`;
    list.appendChild(li);
  });
  el.appendChild(list);
}

function renderCulturalFeed(news){
  const el = document.getElementById('cultural-feed');
  if(!el) return;
  el.innerHTML='';
  const culturalItems = (news||[]).filter(n=> /cultura|school|rock|festival|medieval|teatro|migas/i.test(n.title));
  if(culturalItems.length===0){ el.innerHTML='<p>No hay comunicaciones culturales recientes.</p>'; return; }
  culturalItems.sort((a,b)=> new Date(b.date)-new Date(a.date));
  const ul = document.createElement('ul');
  culturalItems.forEach(n=>{ const li = document.createElement('li'); li.innerHTML = `<strong>${escapeHtml(n.title)}</strong> <span class="muted">(${new Date(n.date).toLocaleDateString('es-ES')})</span><p>${escapeHtml(n.excerpt || '')}</p>`; ul.appendChild(li); });
  el.appendChild(ul);
}

function renderBandosAndPlenos(news){
  const bandosEl = document.getElementById('bandos-list');
  const plenosEl = document.getElementById('plenos-list');
  if(bandosEl){
    const bandos = (news||[]).filter(n=> /bando/i.test(n.type) || /bando/i.test(n.title));
    if(bandos.length===0) bandosEl.innerHTML='<p>No hay bandos publicados.</p>';
    else{
      bandos.sort((a,b)=> new Date(b.date)-new Date(a.date));
      const ul = document.createElement('ul');
      bandos.forEach(b=>{
        const li = document.createElement('li');
        li.innerHTML = `<strong>${escapeHtml(b.title)}</strong> <span class="muted">(${new Date(b.date).toLocaleDateString('es-ES')})</span>`;
        ul.appendChild(li);
      });
      bandosEl.appendChild(ul);
    }
  }
  if(plenosEl){
    // aquí usamos las noticias que no sean bandos como ejemplo de plenos o añadimos items ficticios
    const plenos = (news||[]).filter(n=> /pleno|plenos|sesion/i.test(n.type) || /pleno/i.test(n.title));
    if(plenos.length===0){
      plenosEl.innerHTML = '<p>Últimos plenos: <em>No hay plenos recientes registrados en la fuente de datos.</em></p>';
    }else{
      plenos.sort((a,b)=> new Date(b.date)-new Date(a.date));
      const ul = document.createElement('ul');
      plenos.forEach(p=>{ const li = document.createElement('li'); li.innerHTML = `<strong>${escapeHtml(p.title)}</strong> <span class="muted">(${new Date(p.date).toLocaleDateString('es-ES')})</span>`; ul.appendChild(li); });
      plenosEl.appendChild(ul);
    }
  }
}

function renderAyuntamientoTeam(team){
  const el = document.getElementById('ayuntamiento-equipo');
  if(!el) return;
  el.innerHTML='';
  // show fixed list emphasizing those specified
  const important = [
    "Manuel López Carvajal",
    "Alejandro Porcar Rodríguez",
    "Susana Cisneros Granado",
    "Hilario Fernández Blázquez",
    "Antonino Delgado Menor",
    "Carlos Alberto Torre del Olmo"
  ];
  // map provided team or fallback
  const byName = (team||[]).reduce((acc,p)=>{acc[p.name]=p;return acc;},{})
  important.forEach(name=>{
    const p = byName[name] || {name:name, role:'Concejal/Alcalde', delegations:''};
    const card = document.createElement('div'); card.className='team-card';
    card.innerHTML = `<h4>${escapeHtml(p.name)}</h4><p class="muted">${escapeHtml(p.role)}</p><p>${escapeHtml(p.delegations || '')}</p>`;
    el.appendChild(card);
  });
}

function renderContractsAyto(contracts){
  const container = document.getElementById('contracts-list-ayto');
  if(!container) return;
  container.innerHTML = '';
  if(!contracts || contracts.length===0){ container.innerHTML = '<p>No hay contratos publicados.</p>'; return; }
  const list = document.createElement('ul');
  contracts.sort((a,b)=> new Date(b.date)-new Date(a.date));
  contracts.forEach(c=>{
    const li = document.createElement('li');
    li.innerHTML = `<h3>${escapeHtml(c.title)}</h3><p class="muted">${escapeHtml(c.type)} · ${escapeHtml(c.status)} · ${new Date(c.date).toLocaleDateString('es-ES')}</p><p>Presupuesto: ${escapeHtml(c.budget || '')} € · Importe adjudicación: ${escapeHtml(c.awarded || '-') } €</p>`;
    if(c.documents && c.documents.length){ const docs = document.createElement('ul'); c.documents.forEach(d=>{ const dd = document.createElement('li'); dd.innerHTML=`<a href="${d.url}" target="_blank" rel="noopener">${escapeHtml(d.name)}</a>`; docs.appendChild(dd); }); li.appendChild(docs); }
    list.appendChild(li);
  });
  container.appendChild(list);
}

async function loadTramites(){
  try{
    const res = await fetch(TRAMITES_URL);
    const data = await res.json();
    renderContracts(data.contracts || []);
    renderForms(data.forms || []);
    renderOrdenanzas(data.ordenanzas || []);
    renderJobs(data.jobs || []);
    renderProcedures(data.procedures || []);
    // hookup search
    const search = document.getElementById('search-contracts');
    if(search){
      search.addEventListener('input', ()=>{
        const q = search.value.trim().toLowerCase();
        const filtered = (data.contracts||[]).filter(c=>{
          return (c.title && c.title.toLowerCase().includes(q)) ||
                 (c.type && c.type.toLowerCase().includes(q)) ||
                 (c.status && c.status.toLowerCase().includes(q));
        });
        renderContracts(filtered);
      });
    }
  }catch(err){
    console.error('Error cargando trámites:', err);
    const el = document.getElementById('contracts-list');
    if(el) el.innerHTML = '<p>No se pudieron cargar los datos de trámites.</p>';
  }
}

function renderNews(news){
  const container = document.getElementById('news-feed');
  if(!container) return; // safe-guard: no news container on this page
  container.innerHTML = '';
  (news||[]).sort((a,b)=> new Date(b.date)-new Date(a.date));
  news.forEach(item=>{
    const div = document.createElement('article');
    div.className = 'news-item';
    div.innerHTML = `<h3>${escapeHtml(item.title)}</h3>
      <p class="meta">${new Date(item.date).toLocaleDateString('es-ES')} · ${escapeHtml(item.type)}</p>
      <p>${escapeHtml(item.excerpt)}</p>
      <a href="#" data-id="${item.id}" class="read-more">Leer más</a>`;
    container.appendChild(div);
  });
  // event delegation for read-more (ensure only one handler) 
  if(!container._hasReadMoreHandler){
    container.addEventListener('click', (e)=>{
      const a = e.target.closest('.read-more');
      if(!a) return;
      e.preventDefault();
      const id = a.dataset.id;
      const item = (news||[]).find(n=>n.id==id);
      if(item) showNewsModal(item);
    });
    container._hasReadMoreHandler = true;
  }
}

function showNewsModal(item){
  // simple modal
  const modal = document.createElement('div');
  modal.className='news-modal';
  modal.innerHTML = `<div class="modal-inner" role="dialog" aria-modal="true" aria-label="Detalle noticia">
    <button class="modal-close">Cerrar</button>
    <h3>${escapeHtml(item.title)}</h3>
    <p class="meta">${new Date(item.date).toLocaleDateString('es-ES')}</p>
    <div>${escapeHtml(item.content)}</div>
  </div>`;
  Object.assign(modal.style,{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'grid',placeItems:'center',zIndex:9999});
  Object.assign(modal.querySelector('.modal-inner').style,{background:'#fff',padding:'1rem',maxWidth:'700px',width:'90%',borderRadius:'8px'});
  // accessibility: focus trap, esc close and close on overlay
  setupModal(modal);
}

function renderTeam(team){
  const container = document.getElementById('equipo');
  if(!container) return;
  container.innerHTML='';
  (team||[]).forEach(p=>{
    const card = document.createElement('div');
    card.className='team-card';
    card.innerHTML = `<h4>${escapeHtml(p.name)}</h4><p class="muted">${escapeHtml(p.role)}</p><p>${escapeHtml(p.delegations)}</p>`;
    container.appendChild(card);
  });
}

function renderContracts(contracts){
  const container = document.getElementById('contracts-list');
  if(!container) return;
  container.innerHTML = '';
  if(!contracts || contracts.length===0){
    container.innerHTML = '<p>No hay contratos en este momento.</p>';
    return;
  }
  const list = document.createElement('ul');
  list.className = 'contracts-list';
  contracts.forEach(c=>{
    const li = document.createElement('li');
    li.innerHTML = `<h3>${escapeHtml(c.title)}</h3>
      <p class="muted">${escapeHtml(c.type || '')} · ${escapeHtml(c.status || '')} · ${new Date(c.date||'').toLocaleDateString('es-ES') || ''}</p>
      <p>Presupuesto base: ${escapeHtml(c.budget || '')} € · Importe adjudicación: ${escapeHtml(c.awarded || '-') } €</p>`;
    // documentos
    if(c.documents && c.documents.length){
      const docs = document.createElement('ul');
      docs.className='doc-list';
      c.documents.forEach(d=>{
        const extra = document.createElement('li');
        const a = document.createElement('a');
        a.href = d.url || '#';
        a.textContent = d.name || 'Documento';
        a.target = '_blank';
        a.rel = 'noopener';
        extra.appendChild(a);
        docs.appendChild(extra);
      });
      li.appendChild(docs);
    }
    list.appendChild(li);
  });
  container.appendChild(list);
}

function renderForms(forms){
  const el = document.getElementById('forms-list');
  if(!el) return;
  el.innerHTML='';
  if(!forms || forms.length===0){ el.innerHTML='<p>No hay impresos disponibles.</p>'; return; }
  forms.forEach(f=>{
    const li = document.createElement('li');
    li.innerHTML = `<a href="${f.url}" target="_blank" rel="noopener">${escapeHtml(f.name)}</a>`;
    el.appendChild(li);
  });
}

function renderOrdenanzas(listData){
  const el = document.getElementById('ordenanzas-list');
  if(!el) return;
  el.innerHTML='';
  if(!listData || listData.length===0){ el.innerHTML='<p>No hay ordenanzas publicadas.</p>'; return; }
  listData.forEach(o=>{
    const li = document.createElement('li');
    li.innerHTML = `<a href="${o.url}" target="_blank" rel="noopener">${escapeHtml(o.title)}</a> <span class="muted">(${new Date(o.date).toLocaleDateString('es-ES')})</span>`;
    el.appendChild(li);
  });
}

function renderJobs(jobs){
  const el = document.getElementById('jobs-list');
  if(!el) return;
  el.innerHTML='';
  if(!jobs || jobs.length===0){ el.innerHTML='<p>No hay ofertas actualmente.</p>'; return; }
  jobs.forEach(j=>{
    const div = document.createElement('div');
    div.className='job-item';
    div.innerHTML = `<h4>${escapeHtml(j.title)}</h4><p class="muted">${new Date(j.date).toLocaleDateString('es-ES')}</p><p>${escapeHtml(j.description)}</p><p><a href="${j.link||'#'}" class="btn">Detalles</a></p>`;
    el.appendChild(div);
  });
}

function renderProcedures(procs){
  const el = document.getElementById('procedures-list');
  if(!el) return;
  el.innerHTML='';
  if(!procs || procs.length===0){ el.innerHTML='<p>No hay procedimientos definidos.</p>'; return; }
  const dl = document.createElement('dl');
  procs.forEach(p=>{
    const dt = document.createElement('dt'); dt.textContent = p.title;
    const dd = document.createElement('dd'); dd.textContent = `${p.category || ''} — ${p.summary || ''}`;
    dl.appendChild(dt); dl.appendChild(dd);
  });
  el.appendChild(dl);
}

function renderCalendar(events){
  const el = document.getElementById('calendar');
  if(!el) return; // safe-guard: algunas páginas no tienen calendario
  el.innerHTML='';
  // simple list grouped by month
  const list = document.createElement('ul');
  events.sort((a,b)=> new Date(a.date)-new Date(b.date));
  events.forEach(ev=>{
    const li = document.createElement('li');
    li.innerHTML = `<strong>${new Date(ev.date).toLocaleDateString('es-ES')}</strong> - <span>${escapeHtml(ev.title)}</span> <button data-id="${ev.id}">Detalles</button>`;
    li.querySelector('button').addEventListener('click', ()=> showEventDetails(ev));
    list.appendChild(li);
  });
  el.appendChild(list);
}

// Servicios list
const SERVICES = [
  {id:'atencion','title':'Atención al Ciudadano','desc':'Información y soporte para gestiones y consultas.'},
  {id:'empleo','title':'Empleo (Bolsa de Trabajo)','desc':'Bolsa de Trabajo y oportunidades. Referencia Concejal: Carlos Alberto Torre del Olmo.'},
  {id:'sanidad','title':'Sanidad','desc':'Cómo pedir cita médica y servicios sanitarios.'},
  {id:'bienestar','title':'Bienestar Social','desc':'Servicios sociales y atención a personas.'},
  {id:'imserso','title':'IMSERSO','desc':'Programas y ayudas específicas del IMSERSO.'},
  {id:'urbanismo','title':'Urbanismo','desc':'Normativa urbanística, licencias y documentación (Cédula Urbanística, Alineación Oficial). Responsable: Alejandro Porcar Rodríguez.'},
  {id:'medio-ambiente','title':'Medio Ambiente','desc':'Gestión de residuos, recogida de aceite usado, campañas ambientales.'},
  {id:'proteccion-civil','title':'Protección Civil','desc':'Organización de Protección Civil. Responsable: Hilario Fernández Blázquez.'},
  {id:'transporte','title':'Transporte','desc':'Horarios de autobuses y movilidad urbana. Responsable: Antonino Delgado Menor.'},
  {id:'piscina','title':'Piscina Municipal','desc':'Horarios, tarifas y tramitación de abonos.'},
  {id:'biblioteca','title':'Biblioteca Municipal «Miguel de Cervantes»','desc':'Servicios de préstamo, ordenadores y apoyo para gestiones por internet.'}
];

function renderServices(query){
  const grid = document.getElementById('services-grid');
  if(!grid) return;
  grid.innerHTML='';
  const q = (query||'').toLowerCase();
  SERVICES.filter(s=> !q || s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)).forEach(s=>{
    const card = document.createElement('article'); card.className='card service-card';
    card.innerHTML = `<h3 id="service-${s.id}">${escapeHtml(s.title)}</h3><p>${escapeHtml(s.desc)}</p><p><a href="#" class="btn" data-service="${s.id}">Más información</a></p>`;
    card.querySelector('a').addEventListener('click', (e)=>{ e.preventDefault(); showServiceDetails(s.id); });
    grid.appendChild(card);
  });
}

function showServiceDetails(id){
  // render modal o expandir con información básica
  const s = SERVICES.find(x=>x.id===id);
  if(!s) return;
  const modal = document.createElement('div'); modal.className='news-modal';
  modal.innerHTML = `<div class="modal-inner" role="dialog" aria-modal="true" aria-label="Detalle servicio">
    <button class="modal-close">Cerrar</button>
    <h3>${escapeHtml(s.title)}</h3>
    <p>${escapeHtml(s.desc)}</p>
    <div class="service-extra"></div>
  </div>`;
  const extra = modal.querySelector('.service-extra');
  // añadir contenidos específicos
  if(id==='urbanismo'){
    extra.innerHTML = `<h4>Urbanismo - Trámites frecuentes</h4>
      <ul><li>Licencia de Obra Mayor: proyecto básico y de ejecución.</li>
      <li>Licencia de Obra Menor: obras ≤ 20 m² que no afecten estructura.</li>
      <li>Cédula Urbanística y Alineación Oficial: documentos para licencias.</li></ul>`;
  }else if(id==='piscina'){
    extra.innerHTML = `<h4>Piscina Municipal</h4><p>Tramitación de abonos, tarifas y jornadas informativas.</p>`;
  }else if(id==='empleo'){
    extra.innerHTML = `<h4>Bolsa de Trabajo</h4><p>Consulta las ofertas y las descripciones de los puestos.</p>`;
  }else if(id==='medio-ambiente'){
    extra.innerHTML = `<h4>Medio Ambiente</h4><p>Recogida de aceite usado, campañas de control de plagas y gestión de residuos.</p>`;
  }else if(id==='biblioteca'){
    extra.innerHTML = `<h4>Biblioteca "Miguel de Cervantes"</h4><p>Horario y servicios: préstamo, 6 ordenadores, Wi-Fi y apoyo para gestiones por internet.</p>`;
  }
  Object.assign(modal.style,{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'grid',placeItems:'center',zIndex:9999});
  Object.assign(modal.querySelector('.modal-inner').style,{background:'#fff',padding:'1rem',maxWidth:'700px',width:'90%',borderRadius:'8px',maxHeight:'80vh',overflow:'auto'});
  setupModal(modal);
  document.body.appendChild(modal);
}

function renderServiceNotices(news){
  const el = document.getElementById('service-notices');
  if(!el) return;
  el.innerHTML='';
  const related = (news||[]).filter(n=> /piscina|abonos|moscas|mosquitos|tramitaci/i.test(n.title.toLowerCase()));
  if(related.length===0){ el.innerHTML='<p>No hay avisos recientes relacionados.</p>'; return; }
  related.sort((a,b)=> new Date(b.date)-new Date(a.date));
  const ul = document.createElement('ul');
  related.forEach(n=>{ const li = document.createElement('li'); li.innerHTML=`<strong>${escapeHtml(n.title)}</strong> <span class="muted">(${new Date(n.date).toLocaleDateString('es-ES')})</span><p>${escapeHtml(n.excerpt||'')}</p>`; ul.appendChild(li); });
  el.appendChild(ul);
}

function showEventDetails(ev){
  const modal = document.createElement('div');
  modal.className='event-modal';
  modal.innerHTML = `<div class="modal-inner" role="dialog" aria-modal="true" aria-label="Detalle evento">
    <button class="modal-close">Cerrar</button>
    <h3>${escapeHtml(ev.title)}</h3>
    <p>${new Date(ev.date).toLocaleDateString('es-ES')} · ${escapeHtml(ev.time || '')}</p>
    <p>Ubicación: ${escapeHtml(ev.location)}</p>
    <div>${escapeHtml(ev.description)}</div>
  </div>`;
  Object.assign(modal.style,{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'grid',placeItems:'center',zIndex:9999});
  Object.assign(modal.querySelector('.modal-inner').style,{background:'#fff',padding:'1rem',maxWidth:'700px',width:'90%',borderRadius:'8px'});
  modal.querySelector('.modal-close').addEventListener('click', ()=> modal.remove());
  document.body.appendChild(modal);
}

function initMap(mapData){
  try{
    const map = L.map('map').setView([40.4636, -3.3247], 14); // aproximado Guadalajara/Pioz
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
    if(mapData && mapData.points){
      mapData.points.forEach(p=>{
        L.marker([p.lat,p.lon]).addTo(map).bindPopup(`<strong>${p.title}</strong><br>${p.desc || ''}`);
      });
    }
  }catch(e){console.error('Error inicializando mapa',e)}
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c];
  });
}

// Nav toggle for small screens
document.addEventListener('DOMContentLoaded', ()=>{
  const btn = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  const menu = document.getElementById('main-menu');
  if(btn && nav && menu){
    // Ensure we only attach once
    if(!nav._hasNavHandler){
      btn.addEventListener('click', ()=>{
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        if(expanded){
          // close
          btn.setAttribute('aria-expanded','false');
          nav.classList.remove('open');
          document.body.classList.remove('nav-open');
        }else{
          // open
          btn.setAttribute('aria-expanded','true');
          nav.classList.add('open');
          document.body.classList.add('nav-open');
          // focus first link
          setTimeout(()=> menu.querySelector('a')?.focus(), 10);
        }
      });

      // close on Escape
      document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true'){ btn.click(); } });

      // close when clicking outside the menu (on overlay area)
      document.addEventListener('click', (e)=>{
        if(btn.getAttribute('aria-expanded') !== 'true') return;
        const withinNav = e.target.closest('.main-nav');
        if(!withinNav){ btn.click(); }
      });

      // prevent multiple bindings
      nav._hasNavHandler = true;
    }
  }
  loadData();
  // inicializar control de tema (claro/oscuro)
  initThemeToggle();
  // inicializar buscador en header
  initHeaderSearch();
  // inicializar menú de ajustes
  initSettingsMenu();
});

// Theme toggling: detect system preference, persist in localStorage, inject button in header
function applyTheme(dark){
  const root = document.documentElement || document.body;
  if(dark){
    root.classList.add('dark-mode');
    localStorage.setItem('site-theme','dark');
  }else{
    root.classList.remove('dark-mode');
    localStorage.setItem('site-theme','light');
  }
  // map tiles could be switched here if a darker tile set is available
  // example: re-init or switch layer for Leaflet (not implemented automatically here)
}

function initThemeToggle(){
  try{
    // solo aplicar tema inicial (no insertar UI aquí). El control se gestiona desde el menú de Ajustes.
    // preferir settings guardados en localStorage bajo 'site-settings'
    const storedSettings = localStorage.getItem('site-settings');
    if(storedSettings){
      try{
        const s = JSON.parse(storedSettings);
        if(typeof s.darkMode !== 'undefined'){
          applyTheme(!!s.darkMode);
          return;
        }
      }catch(e){}
    }
    // fallback al site-theme o preferencia del sistema
    const stored = localStorage.getItem('site-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if(stored){ applyTheme(stored === 'dark'); }
    else{ applyTheme(prefersDark); }
  }catch(e){ console.error('Error inicializando theme toggle', e); }
}

// Ajustes / Settings: tamaño de texto y contraste alto
function applySettings(settings){
  // font size: 'normal' | 'small' | 'large'
  document.documentElement.classList.remove('text-size-small','text-size-large');
  if(settings.textSize === 'small') document.documentElement.classList.add('text-size-small');
  if(settings.textSize === 'large') document.documentElement.classList.add('text-size-large');
  // high contrast
  if(settings.highContrast) document.documentElement.classList.add('high-contrast'); else document.documentElement.classList.remove('high-contrast');
}

function initSettingsMenu(){
  try{
    const header = document.querySelector('.site-header .header-top');
    if(!header) return;
    // Prevent multiple initializations
    if(header._hasSettings) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'settings-toggle';
    btn.setAttribute('aria-haspopup','menu');
    btn.setAttribute('aria-expanded','false');
    btn.setAttribute('aria-label','Ajustes de visualización');
    btn.innerHTML = '⚙️';

    const menu = document.createElement('div');
    menu.className = 'settings-menu';
    menu.setAttribute('role','menu');
    menu.setAttribute('aria-hidden','true');
    menu.innerHTML = `
      <h4>Ajustes</h4>
      <div class="settings-group">
        <div class="muted">Tamaño de texto</div>
        <div class="size-controls" role="radiogroup" aria-label="Tamaño de texto">
          <button role="radio" data-size="small">A-</button>
          <button role="radio" data-size="normal" aria-pressed="true">A</button>
          <button role="radio" data-size="large">A+</button>
        </div>
      </div>
      <div class="settings-group">
        <label><input type="checkbox" id="dark-mode-toggle"> Modo oscuro</label>
      </div>
      
      <div class="settings-actions"><button class="reset-btn">Restablecer</button></div>
    `;

    header.appendChild(btn);
    header.appendChild(menu);

  // load stored settings
  const stored = localStorage.getItem('site-settings');
  let settings = { textSize:'normal', darkMode: undefined };
  if(stored){ try{ settings = Object.assign(settings, JSON.parse(stored)); }catch(e){} }
  // if darkMode explicitly set in settings, apply it
  if(typeof settings.darkMode !== 'undefined') applyTheme(!!settings.darkMode);
  applySettings(settings);

  // reflect initial state on controls
  const rgButtons = menu.querySelectorAll('[role="radio"]');
  rgButtons.forEach(b=>{ b.setAttribute('aria-checked', b.dataset.size === settings.textSize ? 'true' : 'false'); b.setAttribute('aria-pressed', b.dataset.size === settings.textSize ? 'true' : 'false'); });
  // (Alto contraste eliminado por redundancia con modo oscuro)
  const dm = menu.querySelector('#dark-mode-toggle'); if(dm) dm.checked = !!settings.darkMode;

    function openMenu(){ menu.classList.add('open'); menu.setAttribute('aria-hidden','false'); btn.setAttribute('aria-expanded','true'); header.classList.add('settings-open');
      // focus first actionable control
      setTimeout(()=> menu.querySelector('button[role="radio"]')?.focus(), 10);
      // trap focus inside menu
      document.addEventListener('focus', focusTrap, true);
    }
    function closeMenu(){ menu.classList.remove('open'); menu.setAttribute('aria-hidden','true'); btn.setAttribute('aria-expanded','false'); header.classList.remove('settings-open');
      document.removeEventListener('focus', focusTrap, true);
      btn.focus();
    }

    btn.addEventListener('click', (e)=>{ const open = btn.getAttribute('aria-expanded') === 'true'; if(open) closeMenu(); else openMenu(); });

    // click outside to close
    document.addEventListener('click', (e)=>{ if(btn.getAttribute('aria-expanded') !== 'true') return; if(!e.target.closest('.settings-menu') && e.target !== btn){ closeMenu(); } });

    // keyboard handling
    menu.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape'){ closeMenu(); }
      // left/right or up/down to switch radio-like buttons
      if(e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowUp'){
        const radios = Array.from(menu.querySelectorAll('[role="radio"]'));
        const idx = radios.indexOf(document.activeElement);
        if(idx === -1) return;
        let next = idx;
        if(e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx +1) % radios.length;
        if(e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx -1 + radios.length) % radios.length;
        radios[next].focus();
      }
    });

    // radiogroup clicks
    menu.addEventListener('click', (e)=>{
      const btnRadio = e.target.closest('[role="radio"]');
      if(btnRadio){
        const size = btnRadio.dataset.size;
        settings.textSize = size;
        applySettings(settings);
        // update controls
        menu.querySelectorAll('[role="radio"]').forEach(b=>{ b.setAttribute('aria-checked', b.dataset.size === size ? 'true' : 'false'); b.setAttribute('aria-pressed', b.dataset.size === size ? 'true' : 'false'); });
        localStorage.setItem('site-settings', JSON.stringify(settings));
        return;
      }
      // dark mode toggle
      if(e.target.id === 'dark-mode-toggle' || e.target.closest('#dark-mode-toggle')){
        const dmInput = menu.querySelector('#dark-mode-toggle');
        settings.darkMode = !!dmInput.checked;
        applyTheme(!!settings.darkMode);
        localStorage.setItem('site-settings', JSON.stringify(settings));
        return;
      }
      // reset
      if(e.target.classList.contains('reset-btn')){
        settings = { textSize:'normal' };
        applySettings(settings);
        menu.querySelectorAll('[role="radio"]').forEach(b=>{ b.setAttribute('aria-checked', b.dataset.size === 'normal' ? 'true' : 'false'); b.setAttribute('aria-pressed', b.dataset.size === 'normal' ? 'true' : 'false'); });
        localStorage.setItem('site-settings', JSON.stringify(settings));
        return;
      }
    });

    // simple focus trap: if focus leaves menu, bring it back when open
    function focusTrap(e){ if(btn.getAttribute('aria-expanded') !== 'true') return; if(!e.target.closest('.settings-menu')){ e.stopPropagation(); menu.querySelector('[role="radio"]')?.focus(); } }

    header._hasSettings = true;
  }catch(e){ console.error('Error inicializando menú de Ajustes', e); }
}

// Inyectar barra de búsqueda en el header (visible en desktop, icon-expand en mobile)
function initHeaderSearch(){
  try{
    const header = document.querySelector('.site-header .header-top');
    if(!header) return;
    // create form
    const form = document.createElement('form');
    form.className = 'header-search';
    form.action = 'search.html';
    form.method = 'get';
    form.innerHTML = `<label class="visually-hidden" for="q">Buscar en el Ayuntamiento de Pioz</label>
      <input id="q" name="q" type="search" placeholder="Buscar noticias, trámites, servicios..." aria-label="Buscar en el Ayuntamiento de Pioz">
      <button type="submit" aria-label="Buscar">🔍</button>
      <button type="button" class="search-toggle" aria-label="Abrir búsqueda" aria-expanded="false">🔎</button>`;
    header.appendChild(form);

    // mobile toggle behavior
    const toggle = form.querySelector('.search-toggle');
    const input = form.querySelector('input[name="q"]');
    toggle.addEventListener('click', ()=>{
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      form.classList.toggle('open');
      if(!expanded) setTimeout(()=> input.focus(), 50);
    });
  }catch(e){ console.error('Error inicializando búsqueda en header', e); }
}

// sticky header behavior: add .scrolled class when user scrolls
window.addEventListener('scroll', ()=>{
  const header = document.querySelector('.site-header');
  if(!header) return;
  if(window.scrollY > 20) header.classList.add('scrolled'); else header.classList.remove('scrolled');
});

/* Calendario mensual interactivo */
class MiniCalendar{
  constructor(container, events){
    this.container = container;
    this.events = events || [];
    const now = new Date();
    this.year = now.getFullYear();
    this.month = now.getMonth();
    this.render();
  }
  render(){
    this.container.innerHTML = '';
    const header = document.createElement('div'); header.className='calendar-header';
    const title = document.createElement('div'); title.textContent = new Date(this.year, this.month).toLocaleString('es-ES',{month:'long',year:'numeric'});
    const nav = document.createElement('div'); nav.className='calendar-nav';
    const prev = document.createElement('button'); prev.textContent = '<';
    const next = document.createElement('button'); next.textContent = '>';
    prev.addEventListener('click', ()=>{ this.changeMonth(-1); });
    next.addEventListener('click', ()=>{ this.changeMonth(1); });
    nav.appendChild(prev); nav.appendChild(next);
    header.appendChild(title); header.appendChild(nav);
    this.container.appendChild(header);

    const weekdays = document.createElement('div'); weekdays.className='calendar-weekdays';
    ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].forEach(d=>{ const w = document.createElement('div'); w.textContent=d; weekdays.appendChild(w); });
    this.container.appendChild(weekdays);

    const grid = document.createElement('div'); grid.className='calendar-grid';
    const first = new Date(this.year,this.month,1);
    const startDay = (first.getDay()+6)%7; // make Monday=0
    const daysInMonth = new Date(this.year,this.month+1,0).getDate();
    // fill blanks
    for(let i=0;i<startDay;i++){ const cell = document.createElement('div'); cell.className='calendar-cell empty'; grid.appendChild(cell); }
    for(let d=1; d<=daysInMonth; d++){
      const cell = document.createElement('div'); cell.className='calendar-cell';
      const dateDiv = document.createElement('div'); dateDiv.className='date'; dateDiv.textContent = d;
      cell.appendChild(dateDiv);
      const y = this.year, m = this.month, dayStr = new Date(y,m,d).toISOString().slice(0,10);
      const events = this.events.filter(ev=> ev.date && ev.date.startsWith(dayStr));
      if(events.length){
        const evDiv = document.createElement('div'); evDiv.className='events';
        evDiv.textContent = `${events.length} evento(s)`;
        cell.appendChild(evDiv);
        cell.style.cursor='pointer';
        cell.addEventListener('click', ()=> this.openDayModal(dayStr, events));
      }
      grid.appendChild(cell);
    }
    this.container.appendChild(grid);
  }
  changeMonth(delta){ this.month += delta; if(this.month<0){ this.month=11; this.year--; } if(this.month>11){ this.month=0; this.year++; } this.render(); }
  openDayModal(dateStr, events){
    const modal = document.createElement('div'); modal.className='news-modal';
    modal.innerHTML = `<div class="modal-inner" role="dialog" aria-modal="true" aria-label="Eventos del día">
      <button class="modal-close">Cerrar</button>
      <h3>Eventos - ${new Date(dateStr).toLocaleDateString('es-ES')}</h3>
      <div class="day-events"></div>
    </div>`;
    const listEl = modal.querySelector('.day-events');
    events.forEach(ev=>{
      const item = document.createElement('div');
      item.innerHTML = `<h4>${escapeHtml(ev.title)}</h4><p class="muted">${escapeHtml(ev.time || '')} · ${escapeHtml(ev.location || '')}</p><p>${escapeHtml(ev.description || '')}</p>`;
      listEl.appendChild(item);
    });
    Object.assign(modal.style,{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'grid',placeItems:'center',zIndex:9999});
    Object.assign(modal.querySelector('.modal-inner').style,{background:'#fff',padding:'1rem',maxWidth:'700px',width:'90%',borderRadius:'8px',maxHeight:'80vh',overflow:'auto'});
    modal.querySelector('.modal-close').addEventListener('click', ()=> modal.remove());
    document.body.appendChild(modal);
  }
}

// inicializar calendario mensual si existe
function initMonthlyCalendar(events){
  const el = document.getElementById('monthly-calendar');
  if(!el) return;
  new MiniCalendar(el, events);
}

/* Villa de Pioz: renderizadores y mapa */
function renderVillaDemographics(d){
  const el = document.getElementById('villa-demographics');
  if(!el) return;
  const pop = d.population || 5131;
  const year = d.year || '';
  const women = d.women || 0;
  const men = d.men || 0;
  el.innerHTML = `
    <p>Población (último dato ${year}): <strong>${pop.toLocaleString('es-ES')}</strong> habitantes.</p>
    <p>Distribución por sexo: <strong>${women}</strong> mujeres · <strong>${men}</strong> hombres.</p>
    <p class="muted">${escapeHtml(d.note || 'El municipio ha experimentado un crecimiento poblacional notable en la última década.')}</p>
  `;
}

function renderVillaGeography(g){
  const el = document.getElementById('villa-geography');
  if(!el) return;
  el.innerHTML = `
    <p>Ubicación: ${escapeHtml(g.province || 'Guadalajara')}, comarca ${escapeHtml(g.comarca || 'Alcarria Baja')} · Altitud media: <strong>${g.altitude_m || 856} m</strong>.</p>
    <p>Terreno: asentado en el páramo alcarreño dentro de la Fosa del Tajo; suelos típicos de "terra rosa" (arcilla de descalcificación).</p>
    <p>Código Postal: <strong>${escapeHtml(g.postal_code || '19162')}</strong>. Accesos: ${escapeHtml((g.roads||[]).join(', ') || 'CM-2004, A-2 (desde Madrid)')}.</p>
  `;
}

function renderVillaUrbanizaciones(list){
  const el = document.getElementById('villa-urbanizaciones');
  if(!el) return;
  el.innerHTML = '';
  if(!list || list.length===0){ el.innerHTML='<p>No hay urbanizaciones registradas.</p>'; return; }
  const ul = document.createElement('ul');
  list.forEach(u=>{ const li = document.createElement('li'); li.textContent = u; ul.appendChild(li); });
  el.appendChild(ul);
}

function renderVillaHeritage(h){
  const el = document.getElementById('villa-heritage');
  if(!el) return;
  el.innerHTML = '';
  if(h.castle){
    const c = h.castle;
    const box = document.createElement('div'); box.className='heritage-item';
    box.innerHTML = `<h3>${escapeHtml(c.title)}</h3>
      <p>${escapeHtml(c.description)}</p>
      <p><strong>Estado y Visitas:</strong> ${escapeHtml(c.access)}</p>
      <p>${escapeHtml(c.notes)}</p>
      <p>${(c.links||[]).map(l=>`<a href="${l.url}">${escapeHtml(l.name)}</a>`).join(' · ')}</p>`;
    el.appendChild(box);
  }
  if(h.church){
    const ch = h.church;
    const box = document.createElement('div'); box.className='heritage-item';
    box.innerHTML = `<h3>${escapeHtml(ch.title)}</h3><p>${escapeHtml(ch.description)}</p><p><strong>Protección:</strong> ${escapeHtml(ch.protection || '')}</p>`;
    el.appendChild(box);
  }
}

function renderVillaTraditions(list){
  const el = document.getElementById('villa-traditions');
  if(!el) return;
  el.innerHTML = '';
  if(!list || list.length===0){ el.innerHTML='<p>No hay tradiciones registradas.</p>'; return; }
  const dl = document.createElement('dl');
  list.forEach(t=>{ const dt = document.createElement('dt'); dt.textContent = `${t.name} — ${t.date}`; const dd = document.createElement('dd'); dd.textContent = t.desc || ''; dl.appendChild(dt); dl.appendChild(dd); });
  el.appendChild(dl);
}

function renderVillaCompanies(list){
  const el = document.getElementById('villa-companies');
  if(!el) return;
  el.innerHTML = '';
  if(!list || list.length===0){ el.innerHTML='<p>No hay empresas registradas.</p>'; return; }
  const grid = document.createElement('div'); grid.className='companies-grid';
  list.forEach(c=>{
    const card = document.createElement('article'); card.className='card company-card';
    card.innerHTML = `<h4>${escapeHtml(c.name)}</h4><p class="muted">${escapeHtml(c.category || '')} · ${escapeHtml(c.address || '')}</p><p>${escapeHtml(c.desc || '')}</p>`;
    grid.appendChild(card);
  });
  el.appendChild(grid);
}

function renderVillaPress(feed){
  const el = document.getElementById('villa-press');
  if(!el) return;
  el.innerHTML = '';
  if(!feed || feed.length===0){ el.innerHTML='<p>No hay noticias locales.</p>'; return; }
  const ul = document.createElement('ul');
  feed.sort((a,b)=> new Date(b.date)-new Date(a.date));
  feed.forEach(n=>{ const li = document.createElement('li'); li.innerHTML = `<strong>${escapeHtml(n.title)}</strong> <span class="muted">(${new Date(n.date).toLocaleDateString('es-ES')})</span><p>${escapeHtml(n.excerpt || '')}</p>`; ul.appendChild(li); });
  el.appendChild(ul);
}

function initVillaMap(points){
  const el = document.getElementById('villa-map');
  if(!el) return;
  try{
    const center = points[0] ? [points[0].lat, points[0].lon] : [40.48, -3.262];
    const map = L.map(el).setView(center, 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
    points.forEach(p=>{
      L.marker([p.lat,p.lon]).addTo(map).bindPopup(`<strong>${escapeHtml(p.title)}</strong>`);
    });
  }catch(e){ console.error('Error inicializando mapa de la Villa', e); }
}

// Setup accessible modal behavior: focus trap, close on ESC, close on overlay click
function setupModal(modal){
  const inner = modal.querySelector('.modal-inner');
  const closeBtn = modal.querySelector('.modal-close');
  if(!inner) return;
  // hide rest of page to assistive tech
  const rootChildren = Array.from(document.body.children).filter(n=> n!==modal);
  rootChildren.forEach(n=> n.setAttribute('aria-hidden','true'));
  // focusable elements inside modal
  const focusable = inner.querySelectorAll('a[href],button,textarea,input,select,[tabindex]:not([tabindex="-1"])');
  const firstFocusable = focusable[0] || closeBtn;
  const lastFocusable = focusable[focusable.length-1] || closeBtn;
  // put focus
  firstFocusable && firstFocusable.focus();

  function keyHandler(e){
    if(e.key === 'Escape'){
      close();
    }else if(e.key === 'Tab'){
      // trap focus
      if(focusable.length===0){ e.preventDefault(); return; }
      if(e.shiftKey){ // shift+tab
        if(document.activeElement === firstFocusable){ e.preventDefault(); lastFocusable.focus(); }
      }else{ // tab
        if(document.activeElement === lastFocusable){ e.preventDefault(); firstFocusable.focus(); }
      }
    }
  }
  function overlayClick(e){ if(e.target === modal) close(); }
  function close(){
    modal.remove();
    rootChildren.forEach(n=> n.removeAttribute('aria-hidden'));
    document.removeEventListener('keydown', keyHandler);
    modal.removeEventListener('click', overlayClick);
  }
  closeBtn && closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', keyHandler);
  modal.addEventListener('click', overlayClick);
}
