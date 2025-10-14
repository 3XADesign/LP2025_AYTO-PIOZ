// Tablón de Anuncios — script.js (DOM puro)
(async function(){
  const container = document.getElementById('tablon-container');
  if(!container) return;

  async function fetchNoticias(){
    try{
      const res = await fetch('../data/noticias.json', {cache: 'no-store'});
      if(!res.ok) throw new Error('Error cargando noticias: ' + res.status);
      return await res.json();
    }catch(err){
      console.error(err);
      container.innerHTML = '<p role="alert">No se han podido cargar las noticias. Inténtelo más tarde.</p>';
      return [];
    }
  }

  function crearTarjeta(noticia){
    const article = document.createElement('article');
    article.className = 'tablon-card';
    article.setAttribute('tabindex','0');
    article.setAttribute('aria-labelledby', 'noticia-'+noticia.id+'-titulo');

    // Imagen
    const img = document.createElement('img');
    img.src = noticia.imagenUrl || '../images/placeholder-news.jpg';
    img.alt = noticia.titulo || 'Imagen de noticia';
    img.loading = 'lazy';
    article.appendChild(img);

    // Cuerpo
    const body = document.createElement('div');
    body.className = 'card-body';

    const meta = document.createElement('div');
    meta.className = 'card-meta';
    meta.textContent = noticia.fecha || '';
    body.appendChild(meta);

    const h3 = document.createElement('h3');
    h3.id = 'noticia-'+noticia.id+'-titulo';
    h3.textContent = noticia.titulo || 'Sin título';
    body.appendChild(h3);

    const excerpt = document.createElement('p');
    excerpt.textContent = noticia.resumen || '';
    body.appendChild(excerpt);

    article.appendChild(body);

    // Acciones
    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const link = document.createElement('a');
    link.className = 'read-more';
    link.href = noticia.enlaceUrl || '#';
    link.textContent = 'Continuar leyendo';
    link.setAttribute('aria-label', 'Continuar leyendo: ' + (noticia.titulo || 'noticia'));

    actions.appendChild(link);
    article.appendChild(actions);

    return article;
  }

  const noticias = await fetchNoticias();
  if(!Array.isArray(noticias) || noticias.length === 0){
    container.innerHTML = '<p>No hay noticias disponibles.</p>';
    return;
  }

  // Crear fragmento para minimizar reflows
  const frag = document.createDocumentFragment();
  noticias.forEach(n => {
    const tarjeta = crearTarjeta(n);
    frag.appendChild(tarjeta);
  });

  container.appendChild(frag);
})();