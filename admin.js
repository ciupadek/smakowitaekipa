// ==========================
// AUTO SLUG
// ==========================
document.getElementById('title').addEventListener('input', function () {
  const slugField = document.getElementById('slug');

  let slug = this.value
    .toLowerCase()
    .replace(/[^a-z0-9ąćęłńóśźż\s-]/g, '') // polskie znaki + cyfry
    .replace(/\s+/g, '-') // spacje na myślniki
    .replace(/-+/g, '-')   // podwójne myślniki
    .replace(/^-+|-+$/g, ''); // usuwanie myślników z początku/końca

  slugField.value = slug;
});

// ==========================
// PREVIEW OBRAZKA
// ==========================
document.getElementById('image').addEventListener('input', function () {
  const preview = document.getElementById('imagePreview');
  const url = this.value.trim();

  if (url) {
    preview.innerHTML = `<img src="${url}" alt="Podgląd">`;
  } else {
    preview.innerHTML = '';
  }
});

// ==========================
// ZAPIS DO LOCAL STORAGE
// ==========================
document.getElementById('recipeForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('title');
  const slug = document.getElementById('slug');
  const category = document.getElementById('category');
  const image = document.getElementById('image');
  const description = document.getElementById('description');
  const seo = document.getElementById('seo');

  const titleError = document.getElementById('titleError');

  let valid = true;

  // WALIDACJA
  if (!title.value.trim()) {
    title.classList.add('error');
    titleError.textContent = 'Tytuł jest wymagany!';
    valid = false;
  } else {
    title.classList.remove('error');
    titleError.textContent = '';
  }

  if (!valid) return;

  // NOWY PRZEPIS
  const newRecipe = {
    title: title.value.trim(),
    slug: slug.value.trim(),
    category: category.value,
    image: image.value.trim(),
    description: description.value.trim(),
    seo: seo.value.trim(),
    createdAt: new Date().toISOString()
  };

  // POBIERZ ISTNIEJĄCE
  let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

  // DODAJ NOWY
  recipes.push(newRecipe);

  // ZAPISZ
  localStorage.setItem('recipes', JSON.stringify(recipes));

  // DEBUG
  console.log('📦 Wszystkie przepisy:', recipes);

  // INFO
  alert('✅ Zapisano przepis');

  // RESET
  this.reset();
  document.getElementById('imagePreview').innerHTML = '';
  slug.value = '';
});

// ==========================
// IMPORT HTML → FORMULARZ
// ==========================
document.getElementById('parseHTMLBtn').addEventListener('click', () => {
  const html = document.getElementById('importHTML').value;

  if (!html.trim()) {
    alert('Wklej HTML');
    return;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Tytuł
  const title = doc.querySelector('h3')?.innerText || '';
  document.getElementById('title').value = title;

  // Opis (pierwszy paragraf)
  const description = doc.querySelector('p')?.innerText || '';
  document.getElementById('description').value = description;

  // SEO – fraza kluczowa
  const seoItems = doc.querySelectorAll('h4 + ul li');
  seoItems.forEach(li => {
    if (li.innerText.includes('Fraza kluczowa')) {
      document.getElementById('seo').value = li.innerText.replace('Fraza kluczowa:', '').trim();
    }
  });

  // Kategorie
  const categoriesMatch = html.match(/<h4>Kategorie<\/h4>\s*<p>(.*?)<\/p>/);

  if (categoriesMatch) {
    const firstCat = categoriesMatch[1].split(',')[0].trim();
    document.getElementById('category').value = firstCat;
  }

  // Trigger slug
  document.getElementById('title').dispatchEvent(new Event('input'));

  alert('✅ Wczytano dane z HTML');
});

// ==========================
// KATEGORIE
// ==========================

// domyślne kategorie
function getCategories() {
  let categories = JSON.parse(localStorage.getItem('categories'));

  if (!categories) {
    categories = ['Obiad', 'Ciasta', 'Sałatki', 'Śniadania'];
    localStorage.setItem('categories', JSON.stringify(categories));
  }

  return categories;
}

// zapis
function saveCategories(categories) {
  localStorage.setItem('categories', JSON.stringify(categories));
}

// render listy
function renderCategories() {
  const list = document.getElementById('categoriesList');
  const select = document.getElementById('category');

  const categories = getCategories();

  // lista w panelu
  list.innerHTML = '';

  categories.forEach((cat, index) => {
    const div = document.createElement('div');
    div.className = 'category-item';

    div.innerHTML = `
      ${cat}
      <button onclick="deleteCategory(${index})">x</button>
    `;

    list.appendChild(div);
  });

  // select
  select.innerHTML = '<option value="">Wybierz kategorię</option>';
  categories.forEach(cat => {
    select.innerHTML += `<option>${cat}</option>`;
  });
}

// dodawanie
document.getElementById('addCategoryBtn').addEventListener('click', () => {
  const input = document.getElementById('newCategory');
  const value = input.value.trim();

  if (!value) return;

  let categories = getCategories();

  if (!categories.includes(value)) {
    categories.push(value);
    saveCategories(categories);
    renderCategories();
  }

  input.value = '';
});

// usuwanie
function deleteCategory(index) {
  let categories = getCategories();

  categories.splice(index, 1);

  saveCategories(categories);
  renderCategories();
}

// start
renderCategories();
