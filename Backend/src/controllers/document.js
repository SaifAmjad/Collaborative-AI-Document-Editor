const Document = require("../models/Document");
const User = require("../models/User");

const findAndCreateDocument = async (id) => {
  if (id == null) return;
  try {
    const document = await Document.findById(id);
    if (document) return document;

    return await Document.create({ _id: id, data: "" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error });
  }
};

const saveDoc = async (req, res) => {
  const { id } = req.params;
  const { documentId } = req.body;
  try {
    const result = await User.updateOne(
      { _id: id, documents: { $ne: documentId } },
      { $addToSet: { documents: documentId } }
    );

    if (result.modifiedCount > 0) {
      res.status(201).json({ success: true, msg: "New document is saved" });
    } else {
      res
        .status(201)
        .json({ success: true, msg: "Existing document is saved" });
    }
  } catch (error) {
    console.error("Error adding document:", err);
    return res.status(500).json({ msg: error });
  }
};

const getAllDocuments = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id }).populate("documents");
    if (!user) return res.status(402).json({ msg: "Some error occured" });

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error });
  }
};

const getDocument = async (req, res) => {
  const { id } = req.params;
  try {
    const document = await Document.findById(id);
    if (!document) return res.status(404).json({ msg: "No document find" });

    return res.status(200).json({ success: true, data: document });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error });
  }
};

module.exports = {
  findAndCreateDocument,
  saveDoc,
  getAllDocuments,
  getDocument,
};
