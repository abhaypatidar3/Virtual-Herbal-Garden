import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await fetch("https://permapeople.org/api/plants?page=2", {
      headers: {
        "x-permapeople-key-id": process.env.PP_KEY_ID,
        "x-permapeople-key-secret": process.env.PP_KEY_SECRET,
      },
    });

    const apiJson = await response.json();

    // Try common shapes: API might return an array directly or an object with data/results/plants
    let plantsArray = [];
    if (Array.isArray(apiJson)) plantsArray = apiJson;
    else if (Array.isArray(apiJson.data)) plantsArray = apiJson.data;
    else if (Array.isArray(apiJson.results)) plantsArray = apiJson.results;
    else if (Array.isArray(apiJson.plants)) plantsArray = apiJson.plants;
    else if (apiJson.data && Array.isArray(apiJson.data.plants)) plantsArray = apiJson.data.plants;
    else {
      // fallback: if apiJson has keys mapping to items, try to extract array
      plantsArray = Object.values(apiJson).find(Array.isArray) || [];
    }

    // Return normalized payload
    res.json({ success: true, plants: plantsArray });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
