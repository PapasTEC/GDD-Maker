const documentController = {};
// const { ObjectId } = require("bson");
const Documents = require("../models/DocumentModel");

documentController.getDocuments = async (req, res) => {
    const documents = await Documents.find();
    res.status(200).json(documents);
};

documentController.createDocument = async (req, res) => {
    try {
        const { owner, lastUpdated, titleInfo, docText } =
            req.body;
        const newDocument = new Documents({
            owner,
            lastUpdated,
            titleInfo,
            docText
        });
        console.log("Inserting document: " + newDocument);
        await newDocument.save();
        res.status(200).json({ message: "Document created" });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

documentController.getDocument = async (req, res) => {
    Documents.findById(req.params.id).then((document) => {
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json(document);
    }).catch((error) => {
        res.status(500).json({ message: error });
    });
};

documentController.getDocumentInfo = async (req, res) => {
    Documents.findById(req.params.id, { titleInfo: 1, lastUpdated: 1, owner: 1 }).then((document) => {
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json(document);
    }).catch((error) => {
        res.status(500).json({ message: error });
    });
};

documentController.updateDocument = async (req, res) => {
    Documents.findByIdAndUpdate(req.params.id, { ...req.body }).then((document) => {
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json(document);
    }).catch((error) => {
        res.status(500).json({ message: error });
    });
};

documentController.deleteDocument = async (req, res) => {
    Documents.findByIdAndDelete(req.params.id).then((document) => {
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json(document);
    }).catch((error) => {
        res.status(500).json({ message: error });
    });
};

module.exports = documentController;
