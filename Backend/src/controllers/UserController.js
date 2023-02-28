const userController = {};
const Users = require("../models/UserModel");

userController.getUsers = async (req, res) => {
    const users = await Users.find();
    res.status(200).json(users);
};

userController.createUser = async (req, res) => {
    try {
        const { name, email, password, owned_documents, shared_with_me_documents } =
            req.body;
        const newUser = new Users({
            name,
            email,
            password,
            owned_documents,
            shared_with_me_documents,
        });
        console.log("Inserting user: " + newUser);
        await newUser.save();
        res.status(200).json({ message: "User created" });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validatePassword(password) {
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    return re.test(password);
}

userController.getUser = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.params.email });

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

userController.updateUser = async (req, res) => {
    try {
        let user = await Users.findOne({ email: req.params.email });

        if (!user) return res.status(404).json({ message: "User not found" });

        newUser = { ...req.body };

        await user.updateOne(newUser);

        res.status(200).json({ message: "User updated" });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

userController.deleteUser = async (req, res) => {
    try {
        let user = await Users.findOne({ email: req.params.email });

        if (!user) return res.status(404).json({ message: "User not found" });

        await user.deleteOne();

        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

module.exports = userController;
