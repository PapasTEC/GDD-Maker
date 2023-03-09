const userController = {};
const Users = require("../models/UserModel");
const { generatePasswordCode, sendEmail } = require("../functions/utils");

userController.getUsers = async (req, res) => {
    const users = await Users.find();
    res.status(200).json(users);
};

userController.createUser = async (req, res) => {
    try {
        const { name, email  } = req.body;
        const newUser = new Users({
            name,
            email,
            password:"_",
            image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
            owned_documents: [],
            shared_with_me_documents: [],
        });
        console.log("Inserting user: " + newUser);
        await sendEmail(email, "", "welcome");
        await newUser.save();
        res.status(200).json({ message: "User created" });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

userController.checkUser = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.params.email });

        if (!user) return res.status(200).json(false);

        res.status(200).json(true);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

userController.getUser = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.params.email });

        if (!user) return res.status(200).json({ message: "User not found" });

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

userController.sendCodeUser = async (req, res) => {
    try {
        let user = await Users.findOne({ email: req.params.email });

        if (!user) return res.status(404).json({ message: "User not found" });

        const password = generatePasswordCode(10);
        await sendEmail(user.email, password, "reset");
        
        const newUser = { password };

        await user.updateOne(newUser);

        res.status(200).json({ password });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

userController.loginUser = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.params.email, password: req.params.password });

        if (!user) return res.status(200).json(false);
        res.status(200).json(user);

        try {
            let user = await Users.findOne({ email: req.params.email });
    
            if (!user) return res.status(404).json({ message: "User not found" });
    
            const password = "_";
            
            const newUser = { password };
    
            await user.updateOne(newUser);
    
            //res.status(200).json({ message: "Password updated" });
        } catch (error) {
            res.status(500).json({ message: error });
        }

    } catch (error) {
        res.status(500).json({ message: error });
    }
};



module.exports = userController;
