const documentController = {};
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Documents = require("../models/DocumentModel");
const Users = require("../models/UserModel");

documentController.getDocuments = async (req, res) => {
  const documents = await Documents.find();
  res.status(200).json(documents);
};

documentController.createDocument = async (req, res) => {
  const { owner, frontPage, documentContent } = req.body;
  console.log("Creating document: " + owner);
  console.log("Creating document: " + frontPage);
  console.log("Creating document: " + documentContent);
  const newDocument = new Documents({
    owner,
    frontPage,
    documentContent,
  });
  // console.log("Inserting document: " + newDocument);
  await newDocument
    .save()
    .then((document) => {
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json({ message: "Document created", id: document._id });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: error });
    });
};

documentController.getDocument = async (req, res) => {
  Documents.findById(req.params.id)
    .then((document) => {
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json(document);
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
};

documentController.getDocumentsByOwner = async (req, res) => {
  Documents.find({ owner: req.params.owner }, { owner: 1, frontPage: 1 })
    .then((documents) => {
      if (!documents) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json(documents);
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
};

async function convertIdList(ids) {
  const _idList = ids.map((id) => new ObjectId(id));
  return _idList;
}

documentController.getSharedDocuments = async (req, res) => {
  console.log(req.body);
  const _idList = await convertIdList(req.body);

  Documents.find({ _id: { $in: _idList } }, { owner: 1, frontPage: 1 })
    .then((documents) => {
      if (!documents) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json(documents);
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
};

documentController.getDocumentInfo = async (req, res) => {
  Documents.findById(req.params.id, { owner: 1, frontPage: 1 })
    .then((document) => {
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json(document);
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
};

documentController.updateDocument = async (req, res) => {
  Documents.findByIdAndUpdate(req.params.id, { ...req.body })
    .then((document) => {
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json(document);
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
};

documentController.updateOwnerInDocuments = async (req, res) => {
  Documents.updateMany({ owner: req.params.owner }, { owner: req.body.owner })
    .then((document) => {
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json(document);
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
};

documentController.updateOnlySubSectionByTitles = async (req, res) => {
  const { id, sectionTitle, subSectionTitle } = req.params;
  console.log("Updating document: " + id);
  console.log("Updating section: " + sectionTitle);
  console.log("Updating subSection: " + subSectionTitle);

  Documents.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        "documentContent.$[section].subSections.$[subSection].subSectionContent":
          req.body,
      },
    },
    {
      arrayFilters: [
        { "section.sectionTitle": sectionTitle },
        { "subSection.subSectionTitle": subSectionTitle },
      ],
    }
  )
    .then((document) => {
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json(document);
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
};

documentController.updateOnlySubSectionByIds = async (req, res) => {
  const { id, sectionId, subSectionId } = req.params;
  console.log("Updating document: " + id);
  console.log("Updating section: " + sectionId);
  console.log("Updating subSection: " + subSectionId);

  Documents.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        "documentContent.$[section].subSections.$[subSection].subSectionContent":
          req.body,
      },
    },
    {
      arrayFilters: [
        { "section._id": sectionId },
        { "subSection._id": subSectionId },
      ],
    }
  )
    .then((document) => {
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json(document);
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
};

documentController.deleteDocument = async (req, res) => {
  Documents.findByIdAndDelete(req.params.id)
    .then((document) => {
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json(document);
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
};

documentController.inviteUser = async (req, res) => {
  const { id, email } = req.params;

  const document = await Documents.findByIdAndUpdate(id, {
    $push: { invited: email },
  });

  if (!document) {
    return res
      .status(404)
      .json({ message: "Document not found", success: false });
  }

  if (document.invited.includes(email)) {
    return res
      .status(200)
      .json({ message: "User already invited", success: false });
  }

  const user = await Users.findOne({ email: req.params.email });

  if (!user)
    return res.status(200).json({ message: "User not found", success: false });

  await Users.updateOne(
    { email: req.params.email },
    { $push: { shared_with_me_documents: req.params.id } }
  );

  res.status(200).json({ message: "User invited", success: true });
};

/*
{
	owner: {
		_id: "645407500e8cc42976792729",
		email: "jasimak154@raotus.com",
		image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
	}
	invited: [
		{
			_id: "64483808f9f8147c171f1e1d",
			email: "pebike6422@pixiil.com",
			image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
		}
	]
}
*/

let getUsersFromDocument = async (id) => {
  const document = await Documents.findById(id);

  if (!document) {
    return res.status(404).json({ message: "Document not found" });
  }

  console.log(document.invited);

  const invitedUsers = await Users.find({ email: { $in: document.invited } });

  console.log(invitedUsers);

  const users = {
    owner: await Users.findOne({ email: document.owner }),
    invited: invitedUsers,
  };

  return users;
};

documentController.getUsers = async (req, res) => {
  const { id } = req.params;

  const users = await getUsersFromDocument(id);

  console.log(users);

  res.status(200).json(users);
};

documentController.revokeInvitation = async (req, res) => {
  const { id, email } = req.params;

  // revoke the invitation from the document and user account
  const document = await Documents.findById(id);

  if (!document) {
    return res.status(404).json({ message: "Document not found" });
  }

  await Documents.updateOne({ _id: id }, { $pull: { invited: email } });

  await Users.updateOne(
    { email: email },
    { $pull: { shared_with_me_documents: id } }
  );

  res.status(200).json({
    message: "Invitation revoked",
    users: await getUsersFromDocument(id),
  });
};

module.exports = documentController;
