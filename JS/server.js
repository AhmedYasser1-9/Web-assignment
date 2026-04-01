const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors()); // Allows the HTML file to make requests to this server
app.use(express.json()); // Allows the server to understand JSON data
app.use((req, res, next) => {
    console.log(`📢 ${req.method} request to ${req.url}`);
    next();
});

// This line tells Express to serve all files from the project root directory.
app.use(express.static(path.join(__dirname, "..")));

// Default route for the home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "home.html"));
});

// Path to data
const dataFilePath = path.join(__dirname, "recipes.json");
const FavoritesIDSPath=path.join(__dirname,"favoriteRecipesIDs.json");
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

app.post("/api/addToFavorites", (req, res) => {
    const { recipeid } = req.body;
    
    
    if (!recipeid) {
        return res.status(400).json({ message: "Recipe id is required" });
    }
    
    try {
        let rawData = fs.readFileSync(dataFilePath);
        let data = JSON.parse(rawData);
      
        
        let rawIDS = fs.readFileSync(FavoritesIDSPath);
        let IDS = JSON.parse(rawIDS);
        
        if (IDS.includes(recipeid)) {
            return res.status(400).json({ message: "Recipe already in favorites!" });
        }
        
        IDS.push(recipeid);
        fs.writeFileSync(FavoritesIDSPath, JSON.stringify(IDS, null, 2));
        
        res.status(200).json({ message: "Recipe added successfully" });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Error adding to favorites", error: error.message });
    }
});


app.delete("/api/deleteFromFavorites/:id", (req,res)=>{
  const recipeid = parseInt(req.params.id);
    let rawData=fs.readFileSync(dataFilePath);
    let data=JSON.parse(rawData);

    if (!recipeid) {
        return res.status(400).json({ message: "Recipe id is required" });
    }

    let rawIDS=fs.readFileSync(FavoritesIDSPath);
    let IDS=JSON.parse(rawIDS);

    if(IDS.includes(recipeid)){
      let newfavorites=IDS.filter((id)=>id !== recipeid);
      fs.writeFileSync(FavoritesIDSPath,JSON.stringify(newfavorites,null,2));
      res.status(200).json({
      message:"recipe successfully got deleted"
      })
    }else{
      console.error(`the recipe with id ${recipeid} doesnot exist in your favorites list`);
      res.status(404).json({
        message:"Error deleting from favorites list"
      });
    }
    
  
});

app.get("/api/retrieveAllFavorites",(req,res)=>{
  try{
    const rawIDS=fs.readFileSync(FavoritesIDSPath);
    const IDS=JSON.parse(rawIDS);
    const availableRecipes=fs.readFileSync(dataFilePath);
    const data=JSON.parse(availableRecipes);
    const allFavoritesList=data.filter((recipe)=>IDS.includes(recipe.id));
    res.status(200).json(allFavoritesList);
  }catch(error){
    res.status(500).json({
      message:"Error fetching the favorites list",
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});