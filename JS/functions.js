import { recipes } from "./Recipes.js";

const recipesContainer = document.querySelector(".recipes-container");

recipes.forEach((recipe) => {
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
