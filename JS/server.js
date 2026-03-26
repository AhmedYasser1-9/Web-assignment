const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors()); // Allows the HTML file to make requests to this server
app.use(express.json()); // Allows the server to understand JSON data

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
  // add new recipe
  recipes.push(newRecipe);
  //recompine file
  fs.writeFileSync(dataFilePath, JSON.stringify(recipes, null, 2));

  console.log("New recipe saved successfully!");
  res.status(200).json({ message: "Recipe saved to server!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
