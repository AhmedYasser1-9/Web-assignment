// Import the shared functions
import './functions.js';

// Function to load recipe data based on URL parameter
async function loadRecipe() {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get('id');
  
  if (!recipeId) {
    window.location.href = 'Recipies.html';
    return;
  }

  try {
    const [recipesRes, favRes] = await Promise.all([
      fetch('http://localhost:3000/api/recipes'),
      fetch('http://localhost:3000/api/retrieveAllFavorites')
    ]);

    const recipes = await recipesRes.json();
    const favorites = await favRes.json();

    const recipe = recipes.find(r => r.id === parseInt(recipeId));
    if (!recipe) { window.location.href = 'Recipies.html'; return; }

    const isFavorite = favorites.some(f => f.id === parseInt(recipeId));
    displayRecipe(recipe, isFavorite);

  } catch (error) {
    console.error('Error loading recipe:', error);
    window.location.href = 'Recipies.html';
  }
}

   function displayRecipe(recipe, isFavorite = false) {
  // Set page title
  document.getElementById('pageTitle').textContent = `${recipe.title} — Tasty Recipe`;
  
  // Set hero section
  document.getElementById('recipeImage').src = recipe.image;
  document.getElementById('recipeImage').alt = recipe.title;
  document.getElementById('cookTime').textContent = recipe.cookTime;
  document.getElementById('recipeTitle').textContent = recipe.title;
  document.getElementById('recipeDescription').textContent = recipe.description;
  
  // Build ingredients list
  const ingredientsList = document.getElementById('ingredientsList');
  ingredientsList.innerHTML = '';
  recipe.ingredients.forEach(ingredient => {
    const ingredientItem = document.createElement('div');
    ingredientItem.className = 'ingredient-item';
    ingredientItem.innerHTML = `
      <span class="ingredient-dot"></span>
      ${ingredient}
    `;
    ingredientsList.appendChild(ingredientItem);
  });
  
  // Build steps list
  const stepsList = document.getElementById('stepsList');
  stepsList.innerHTML = '';
  recipe.steps.forEach((step, index) => {
    const stepItem = document.createElement('div');
    stepItem.className = 'step-item';
    stepItem.innerHTML = `
      <div class="step-number">${index + 1}</div>
      <div class="step-text">${step}</div>
    `;
    stepsList.appendChild(stepItem);
  });

  // Set heart icon
  const heart = document.getElementById('heartIcon');
  heart.textContent = isFavorite ? '❤️' : '🤍';
  heart.title = isFavorite ? 'In your favorites' : 'Not in favorites';
}

// Load recipe when page loads
document.addEventListener('DOMContentLoaded', loadRecipe);