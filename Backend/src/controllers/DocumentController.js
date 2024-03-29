const documentController = {};
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Documents = require("../models/DocumentModel");
const Users = require("../models/UserModel");
const { sendEmail } = require("../functions/utils");

documentController.getDocuments = async (req, res) => {
  const documents = await Documents.find();
  res.status(200).json(documents);
};

documentController.createDocument = async (req, res) => {
  const { owner, frontPage, documentContent, codeReadOnly } = req.body;

  const newDocument = new Documents({
    owner,
    frontPage,
    documentContent,
    codeReadOnly,
  });

  await newDocument
    .save()
    .then((document) => {
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json({ message: "Document created", id: document._id });
    })
    .catch((error) => {
      res.status(200).json({ message: error, error: true });
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

documentController.updateOnlySubSectionByTitlesBasic = async (
  id,
  sectionTitle,
  subSectionTitle,
  content
) => {
  console.log("Updating content: " + JSON.stringify(content));

  try {
    let document = await Documents.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "documentContent.$[section].subSections.$[subSection]": content,
        },
      },
      {
        arrayFilters: [
          { "section.sectionTitle": sectionTitle },
          { "subSection.subSectionTitle": subSectionTitle },
        ],
      }
    );
    if (!document) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

documentController.updateOnlyCoverBasic = async (id, content) => {
  console.log("Updating content: " + JSON.stringify(content));

  try {
    let document = await Documents.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          frontPage: content,
        },
      }
    );
    if (!document) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

documentController.updateOnlySubSectionByIds = async (req, res) => {
  const { id, sectionId, subSectionId } = req.params;

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

  const user = await Users.findOne({ email: req.params.email });
  const documentWithId = await Documents.findById(id);

  if (!user)
    return res.status(200).json({ message: "User not found", success: false });

  if (user.shared_with_me_documents.includes(id)) {
    return res
      .status(200)
      .json({ message: "User already invited", success: false });
  }

  await Users.updateOne(
    { email: req.params.email },
    { $push: { shared_with_me_documents: req.params.id } }
  );

  if (documentWithId.owner === email) {
    return res
      .status(200)
      .json({ message: "Owner cannot be invited", success: false });
  }

  const document = await Documents.updateOne(
    { _id: id },
    { $push: { invited: email } }
  );

  if (!document) {
    return res
      .status(404)
      .json({ message: "Document not found", success: false });
  }

  let ownerObj = await Users.findOne({ email: documentWithId.owner });

  let msgContent = [
    "You have been invited to collaborate on a GDD Maker document!",

    `<strong>${ownerObj.name}</strong> (${ownerObj.email}) has invited you to start working on the document <strong>"${documentWithId.frontPage.documentTitle}"</strong>`,
  ];
  await sendEmail(user.email, "", "invite", msgContent);

  res.status(200).json({
    message: "User invited",
    users: await getUsersFromDocument(id),
    success: true,
  });
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
    return false;
  }

  const invitedUsers = await Users.find({ email: { $in: document.invited } });

  const users = {
    owner: await Users.findOne({ email: document.owner }),
    invited: invitedUsers,
  };

  return users;
};

documentController.getUsers = async (req, res) => {
  const { id } = req.params;

  try {
    const document = await Documents.findById(id);

    if (!document) {
      return res
        .status(200)
        .json({ error: true, message: "Document not found" });
    }
  } catch (error) {
    return res.status(200).json({ error: true, message: "Document not found" });
  }

  const users = await getUsersFromDocument(id);

  res.status(200).json(users);
};

documentController.revokeInvitation = async (req, res) => {
  const { id, email } = req.params;

  try {
    const document = await Documents.findById(id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
  } catch (error) {
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
