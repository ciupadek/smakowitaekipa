// recipe.js — obsługa wyświetlania przepisu po slug

const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
const recipe = recipes.find(r => r.slug === slug);

const recipeContent = document.getElementById('recipeContent');

if (recipe) {
  document.title = recipe.title;
  let html = '';
  if (recipe.image) {
    html += `<img src="${recipe.image}" style="max-width:100%; border-radius:12px; margin-bottom:16px;">`;
  }
  html += recipe.content;
  recipeContent.innerHTML = html;
} else {
  recipeContent.innerHTML = '<p style="color:red;">Nie znaleziono przepisu</p>';
}
