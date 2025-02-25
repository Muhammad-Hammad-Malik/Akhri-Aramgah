const graveyardModel = require("../models/graveyardModel");

exports.createGraveyard = async (req, res) => {
  try {
    const {
      name,
      description,
      totalGraves,
      totalRows,
      totalCols,
      sourcePin,
      gorkanName,
      password,
      customID,
    } = req.body;

    // Validation
    if (
      !name ||
      !totalGraves ||
      !totalRows ||
      !totalCols ||
      !sourcePin ||
      !gorkanName ||
      !password ||
      !customID
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Call the model to create the graveyard
    const result = await graveyardModel.createGraveyard({
      name,
      description,
      totalGraves,
      totalRows,
      totalCols,
      sourcePin,
      gorkanName,
      password,
      customID,
    });

    return res
      .status(201)
      .json({ message: "Graveyard created successfully", result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
