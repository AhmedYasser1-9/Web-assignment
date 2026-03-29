const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors()); // Allows the HTML file to make requests to this server
app.use(express.json()); // Allows the server to understand JSON data


// This line tells Express to serve all files from the project root directory.
app.use(express.static(path.join(__dirname, "..")));

// Default route for the home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "home.html"));
});

// Path to data
const dataFilePath = path.join(__dirname, "recipes.json");

// Route to send all recipes to the frontend
app.get("/api/recipes", (req, res) => {
  try {
    const rawData = fs.readFileSync(dataFilePath);
    const recipes = JSON.parse(rawData);
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error reading recipes:", error);
    res.status(500).json({ message: "Failed to load recipes." });
  }
});

// Route to handle saving a new recipe
app.post("/api/add-recipe", (req, res) => {
  const newRecipe = req.body;

  // Read the existing recipes from the file
  const rawData = fs.readFileSync(dataFilePath);
  const recipes = JSON.parse(rawData);
  // generate and add ID
  const newId =
    recipes.length > 0 ? Math.max(...recipes.map((r) => r.id)) + 1 : 1;
  newRecipe.id = newId;
  // add new recipe
  recipes.push(newRecipe);
  //recompine file
  fs.writeFileSync(dataFilePath, JSON.stringify(recipes, null, 2));

  console.log(`New recipe saved successfully with ID: ${newId}`);
  res.status(200).json({ message: "Recipe saved to server!" });
});

// The route for editing
app.put("/api/update-recipe/:id", (req, res) => {
  const recipeId = parseInt(req.params.id); // Get the ID from the URL
  const updatedData = req.body;

  const rawData = fs.readFileSync(dataFilePath);
  let recipes = JSON.parse(rawData);

  // Find the exact index of the recipe we want to edit
  const index = recipes.findIndex((r) => r.id === recipeId);

  if (index !== -1) {
    updatedData.id = recipeId; // Ensure the ID stays exactly the same
    recipes[index] = updatedData; // Replace the old data with the new data

    fs.writeFileSync(dataFilePath, JSON.stringify(recipes, null, 2));
    console.log(`Recipe ${recipeId} updated successfully!`);
    res.status(200).json({ message: "Recipe updated!" });
  } else {
    res.status(404).json({ message: "Recipe not found." });
  }
});

// Route to handle deleting a recipe
app.delete("/api/delete-recipe/:id", (req, res) => {
  const recipeId = req.params.id;
  const rawData = fs.readFileSync(dataFilePath);
  let recipes = JSON.parse(rawData);

  const updatedRecipes = recipes.filter(
    (r) => String(r.id) !== String(recipeId),
  );

  if (recipes.length !== updatedRecipes.length) {
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedRecipes, null, 2));
    console.log(`Recipe ${recipeId} deleted successfully!`);
    res.status(200).json({ message: "Recipe deleted!" });
  } else {
    console.log(`Failed to delete: Recipe ${recipeId} not found in database.`);
    res.status(404).json({ message: "Recipe not found." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
