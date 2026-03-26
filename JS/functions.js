// General variables
var Total = 0,
  main = 0,
  snacks = 0,
  dessert = 0;

// For the recipes page
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
// For the Add Recipe page
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
const recipeForm = document.getElementById("addRecipeForm");
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
      type: document.getElementById("recipeType").value,
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

// For the Admin page

const tableBody = document.getElementById("tableBody");
function showEditableRecipes(recipesData) {
  recipesData.forEach((recipe) => {
    const row = document.createElement("tr");

    const name = document.createElement("td");
    name.innerText = recipe.title;
    row.appendChild(name);

    const type = document.createElement("td");
    type.innerText = recipe.type;
    if (recipe.type == "Appetizers") {
      snacks += 1;
    } else if (recipe.type == "Main course") {
      main += 1;
    } else {
      dessert += 1;
    }
    row.appendChild(type);

    const ingredients = document.createElement("td");
    ingredients.innerText = `${recipe.ingredients.length} ingredients`;
    row.appendChild(ingredients);

    const actionButtons = document.createElement("td");
    actionButtons.className = "action-buttons";
    actionButtons.innerHTML = `
      <a href="edit-recipe.html?id=${recipe.id}" class="edit-btn">Edit</a>
      <button onclick="deleteRecipe(${recipe.id})" class="delete-btn" style="cursor: pointer;">Delete</button>
    `;
    row.appendChild(actionButtons);
    tableBody.appendChild(row);
  });
  document.getElementById("Total-recipes").innerText = recipesData.length;
  document.getElementById("mian-course").innerText = main;
  document.getElementById("Appetizers").innerText = snacks;
  document.getElementById("dessert").innerText = dessert;
}
if (tableBody) {
  fetch("http://localhost:3000/api/recipes")
    .then((response) => response.json())
    .then((data) => {
      showEditableRecipes(data);
    });
}
// for Editing the recipes

const editRecipeForm = document.getElementById("editRecipeForm");

if (editRecipeForm) {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");

  if (recipeId) {
    fetch("http://localhost:3000/api/recipes")
      .then((response) => response.json())
      .then((recipes) => {
        const recipe = recipes.find((r) => r.id == recipeId);

        if (recipe) {
          document.getElementById("recipeType").value = recipe.type;
          document.getElementById("title").value = recipe.title;
          document.getElementById("image").value = recipe.image;
          document.getElementById("description").value = recipe.description;
          document.getElementById("cookTime").value = recipe.cookTime;

          // fill the ingredients
          // Remove the initial empty label
          const ingContainer = document.getElementById("ingredientsContainer");
          ingContainer.innerHTML = "";
          // add the ingredients from the database
          recipe.ingredients.forEach((ing) => {
            const row = document.createElement("div");
            row.className = "input-row";
            row.innerHTML = `
              <input type="text" name="ingredients" value="${ing}" required>
              <button type="button" class="remove-btn" onclick="removeRow(this)">X</button>
            `;
            ingContainer.appendChild(row);
          });

          // fill the steps
          // Remove the initial empty label
          const stepsContainer = document.getElementById("stepsContainer");
          stepsContainer.innerHTML = "";

          // add the steps from the database
          recipe.steps.forEach((step) => {
            const row = document.createElement("div");
            row.className = "input-row";
            row.innerHTML = `
              <textarea name="steps" rows="2" required>${step}</textarea>
              <button type="button" class="remove-btn" onclick="removeRow(this)">X</button>
            `;
            stepsContainer.appendChild(row);
          });
        }
      })
      .catch((error) => console.error("Error loading recipe data:", error));
  }

  // handle form submission
  editRecipeForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const ingredientInputs = document.querySelectorAll(
      'input[name="ingredients"]',
    );
    const ingredientsArray = Array.from(ingredientInputs).map(
      (input) => input.value,
    );

    const stepInputs = document.querySelectorAll('textarea[name="steps"]');
    const stepsArray = Array.from(stepInputs).map((textarea) => textarea.value);

    const updatedRecipeData = {
      type: document.getElementById("recipeType").value,
      image: document.getElementById("image").value,
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      ingredients: ingredientsArray,
      cookTime: document.getElementById("cookTime").value,
      steps: stepsArray,
    };

    // Send the edit request to the server
    fetch(`http://localhost:3000/api/update-recipe/${recipeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRecipeData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Recipe updated successfully!");
        window.location.href = "admin.html";
      })
      .catch((error) => {
        console.error("Error updating recipe:", error);
        alert("There was an error updating the recipe.");
      });
  });
}

// for deleting a recipe

function deleteRecipe(id) {
  // Catch undefined IDs (which happens if old recipes don't have an ID in your JSON)
  if (!id || id === "undefined") {
    alert("Error: This recipe doesn't have a valid ID in the database!");
    return;
  }
  if (
    confirm(
      "Are you sure you want to delete this recipe? This cannot be undone.",
    )
  ) {
    fetch(`http://localhost:3000/api/delete-recipe/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        // Force the code to jump to the catch block if the server fails
        if (!response.ok) throw new Error("Server failed to delete recipe.");
        return response.json();
      })
      .then((data) => {
        alert("Recipe deleted!");
        window.location.reload(); // Reload the table
      })
      .catch((error) => {
        console.error("Error deleting recipe:", error);
        alert(
          "Failed to delete recipe. Check your terminal console for clues!",
        );
      });
  }
}

// for visibility
window.addIngredient = addIngredient;
window.addStep = addStep;
window.removeRow = removeRow;
window.deleteRecipe = deleteRecipe;
