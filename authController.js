import UserProfile from "./../models/User.js";

export const register = async (req, res) => {
    try {
        // Extracting data from request body
        const { name, email, password } = req.body;

        // Condition 1: Check if all fields are provided
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ success: false, error: "All fields are required" });
        }

        // Condition 2: Check if the user already exists
        const userExist = await UserProfile.findOne({ email });
        if (userExist) {
            return res
                .status(400)
                .json({ success: false, error: "User already exists" });
        }

        // Condition 3: Create a new user if all validations pass
        const user = await UserProfile.create({ name, email, password });
        res.status(201).json({
            token: await user.createJWT(),
            userId: user._id.toString(), //generate token
            success: true,
            data: user,
            message: `Profile for ${name} created successfully`,
        });
    } catch (error) {
        console.error("Registration error:", error); // Logs error details to console
        res
            .status(500)
            .json({ success: false, error: error.message || "Registration failed" });
    }
};

export const login = async (req, res) => {
    try {
        // Process 1: Ensure all fields are provided
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, error: "All fields are required" });
        }

        // Process 2: Check if user exists
        const user = await UserProfile.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // // Process 3: Check if the password is correct
        // if (user.password !== password) {
        //   return res
        //     .status(400)
        //     .json({ success: false, error: "Incorrect password" });
        // }

        // Process:3: Compare the entered password with the hashed password stored in the database
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res
                .status(400)
                .json({ success: false, error: "Incorrect password" });
        }

        // Process 5: Return successful response
        res.status(200).json({
            success: true,
            data: user.name || user.email,
            message: `Hello ${user.name}. You have successfully logged in!`,
        });
    } catch (error) {
        res
            .status(500)
            .json({ success: false, error: error.message || "Login failed" });
    }
};
