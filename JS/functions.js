const recipesContainer = document.querySelector(".recipes-container");
function showRecipes(recipesData) {
  recipesData.forEach((recipe) => {
    const title = document.createElement("h2");
    title.textContent = recipe.title;
    const description = document.createElement("p");
    description.textContent = recipe.description;
    const image = document.createElement("img");
    image.src = recipe.image;
    image.alt = recipe.title;
    const cookTime = document.createElement("strong");
    cookTime.innerText = "Cooking time : " + recipe.cookTime;
    const ingredientsTitle = document.createElement("h3");
    ingredientsTitle.innerText = "Ingredients";
    const ingredients = document.createElement("ul");

    recipe.ingredients.forEach((ingredient) => {
      const ingredientE = document.createElement("li");
      ingredientE.innerText = ingredient;
      ingredients.appendChild(ingredientE);
    });

    const card = document.createElement("div");
    card.classList.add("card");
    card.append(
      title,
      description,
      image,
      cookTime,
      ingredientsTitle,
      ingredients,
    );

    recipesContainer.append(card);
  });
}
if (recipesContainer) {
  fetch("http://localhost:3000/api/recipes")
    .then((response) => response.json())
    .then((data) => {
      showRecipes(data);
    });
}

// Add ingredients
function addIngredient() {
  const ingredientsContainer = document.getElementById("ingredientsContainer");
  const rowContainer = document.createElement("div");

  rowContainer.className = "input-row";
  rowContainer.innerHTML = `
            <input type="text" name="ingredients" placeholder="Next ingredient..." required>
            <button type="button" class="remove-btn" onclick="removeRow(this)">X</button>
        `;
  ingredientsContainer.appendChild(rowContainer);
}

// Add steps
function addStep() {
  const stepsContainer = document.getElementById("stepsContainer");
  const rowContainer = document.createElement("div");

  rowContainer.className = "input-row";
  rowContainer.innerHTML = `
            <textarea name="steps" rows="2" placeholder="Next step..." required></textarea>
            <button type="button" class="remove-btn" onclick="removeRow(this)">X</button>
        `;
  stepsContainer.appendChild(rowContainer);
}

// Remove row
function removeRow(button) {
  button.parentElement.remove();
}

// For submitting the recipe
const recipeForm = document.querySelector("form");
if (recipeForm) {
  recipeForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const ingredientInputs = document.querySelectorAll(
      'input[name="ingredients"]',
    );
    const ingredientsArray = Array.from(ingredientInputs).map(
      (input) => input.value,
    );

    const stepInputs = document.querySelectorAll('textarea[name="steps"]');
    const stepsArray = Array.from(stepInputs).map((textarea) => textarea.value);

    const recipeData = {
      image: document.getElementById("image").value,
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      ingredients: ingredientsArray,
      cookTime: document.getElementById("cookTime").value,
      steps: stepsArray,
    };

    fetch("http://localhost:3000/api/add-recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Recipe saved permanently to the server!");
        recipeForm.reset();
      })
      .catch((error) => {
        console.error("Error saving recipe:", error);
        alert("There was an error saving the recipe.");
      });
  });
}

// for visibility
window.addIngredient = addIngredient;
window.addStep = addStep;
window.removeRow = removeRow;
