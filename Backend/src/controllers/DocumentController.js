const documentController = {};
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Documents = require("../models/DocumentModel");

documentController.getDocuments = async (req, res) => {
    const documents = await Documents.find();
    res.status(200).json(documents);
};

documentController.createDocument = async (req, res) => {
    try {
        const { owner, frontPage, documentContent } =
            req.body;

        console.log("Creating document: " + owner);
        console.log("Creating document: " + frontPage);
        console.log("Creating document: " + documentContent);
        const newDocument = new Documents({
            owner,
            frontPage,
            documentContent
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

documentController.getDocumentsByOwner = async (req, res) => {
    Documents.find({ owner: req.params.owner }, { owner: 1, frontPage: 1 }).then((documents) => {
        if (!documents) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json(documents);
    }).catch((error) => {
        res.status(500).json({ message: error });
    });
};

async function convertIdList(ids) {
    const _idList = ids.map(id => new ObjectId(id));
    return _idList;
}

documentController.getSharedDocuments = async (req, res) => {
    console.log(req.body);
    const _idList = await convertIdList(req.body);

    Documents.find({_id: { $in: _idList }}, { owner: 1, frontPage: 1 }).then((documents) => {
        if (!documents) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json(documents);
    }).catch((error) => {
        res.status(500).json({ message: error });
    });
};

documentController.getDocumentInfo = async (req, res) => {
    Documents.findById(req.params.id, { owner: 1, frontPage: 1 }).then((document) => {
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

documentController.updateOwnerInDocuments = async (req, res) => {
    Documents.updateMany({ owner: req.params.owner }, { owner: req.body.owner }).then((document) => {
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json(document);
    }).catch((error) => {
        res.status(500).json({ message: error });
    });
};

documentController.updateOnlySubSectionByTitles = async (req, res) => {

    const { id, sectionTitle, subSectionTitle } = req.params;
    console.log("Updating document: " + id);
    console.log("Updating section: " + sectionTitle);
    console.log("Updating subSection: " + subSectionTitle);

    Documents.updateOne({ _id: new ObjectId(id) },
        { $set: { "documentContent.$[section].subSections.$[subSection].subSectionContent": req.body }},
        { arrayFilters: [ { "section.sectionTitle": sectionTitle }, { "subSection.subSectionTitle": subSectionTitle } ] }).then((document) => {
            if (!document) {
                return res.status(404).json({ message: "Document not found" });
            }
            res.status(200).json(document);
        }).catch((error) => {
            res.status(500).json({ message: error });
        });
};

documentController.updateOnlySubSectionByIds = async (req, res) => {

    const { id, sectionId, subSectionId } = req.params;
    console.log("Updating document: " + id);
    console.log("Updating section: " + sectionId);
    console.log("Updating subSection: " + subSectionId);

    Documents.updateOne({ _id: new ObjectId(id) },
        { $set: { "documentContent.$[section].subSections.$[subSection].subSectionContent": req.body }},
        { arrayFilters: [ { "section._id": sectionId }, { "subSection._id": subSectionId } ] }).then((document) => {
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
