import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

//create schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }, 
   isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

//secure password by bcryptjs
userSchema.pre("save", async function (next) {
  console.log("pre method", this); //this mean user provided data (name,email,password)

  const userData = this;

  if (!userData.isModified("password")) {
    next();
  } else {
    try {
      // const saltRounds = 10;
      const saltRound = await bcrypt.genSalt(12);
      const hassedpassword = await bcrypt.hash(userData.password, saltRound);
      userData.password = hassedpassword;
      next();
    } catch (error) {
      next(error);
    }
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

//generate token
userSchema.methods.createJWT = async function () {
     try {
    return jsonwebtoken.sign({
        userId: this._id.toString(),
        name: this.name,
        email: this.email,
        isAdmin: this.isAdmin,
    },
    process.env.JWT_KEY,
    {expiresIn: "10d"}
    
)
        
    
     } catch (error) {
        console.log(error)
     }
}

//create model
const UserProfile = mongoose.model("UserProfile", userSchema);

export default UserProfile;
