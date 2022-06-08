require("dotenv").config();

const router = require("express").Router();
const pool = require("../../config/database");
const bcrypt = require("bcryptjs");

const { sign, verify } = require("../../services/token");
const auth = require("../../middleware/auth");
const { uploadAvatar } = require("../../services/upload");

// RESET PASSWORD //
const putResetPassword = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();

    const sqlReset = "UPDATE users SET password = ? WHERE id = ?;";

    const verifiedToken = verify(req.params.token);

    const sqlNewPassword = bcrypt.hashSync(req.body.password);

    const newPassword = [sqlNewPassword, verifiedToken.id];

    const result = await connection.query(sqlReset, newPassword);
    connection.release();

    res.status(200).send("Password has been reset");
  } catch (error) {
    next(error);
  }
};

// EDIT PHOTO PROFILE - AVATAR //
const multerUploadSingle = uploadAvatar.single("photo");
const putUserPhotoById = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();

    let finalImageURL =
      req.protocol + "://" + req.get("host") + "/avatar/" + req.file.filename;

    const sqlUpdatePhoto = `UPDATE users SET ? WHERE id = ?`;
    const dataUserPhoto = [{ photo: finalImageURL }, req.user.id];
    const result = connection.query(sqlUpdatePhoto, dataUserPhoto);
    res
      .status(201)
      .send({ message: "Profile picture uploaded!", Image: finalImageURL });
  } catch (error) {
    next(error);
  }
};

// EDIT PROFILE KESELURUHAN //
const putEditProfile = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();
    let { oldPassword, newPassword, name, age, gender, address, email } =
      req.body;


    console.log("change ", req.body);

    const sqlGetAllData = "SELECT * from users WHERE id = ?";
    const data = req.user.id;
    const [response] = await connection.query(sqlGetAllData, data);

    const password = response[0].password;
    if (newPassword) {
      const compareResult = bcrypt.compareSync(oldPassword, password);
      if (!compareResult)
        // Jika password lama tidak cocok

        return res.status(401).send("Wrong password entered!");

      newPassword = bcrypt.hashSync(newPassword);

      const sqlUpdateEditProfile = "UPDATE users SET ? WHERE id = ?";
      const newEditProfile = [
        { name, age, gender, address, email, password: newPassword },
        Number(req.params.id),
      ];

      const [resultProfile] = await connection.query(
        sqlUpdateEditProfile,
        newEditProfile
      );
      res.status(201).send(resultProfile);
    } else {
      const sqlUpdateEditProfile = "UPDATE users SET ? WHERE id = ?";
      const newEditProfile = [
        { name, age, gender, address, email },
        Number(req.params.id),
      ];

      const [resultProfile] = await connection.query(
        sqlUpdateEditProfile,
        newEditProfile
      );
      res.status(201).send(resultProfile);
    }
  } catch (error) {
    next(error);
  }
};


router.put("/edit-profile/:id", auth, putEditProfile);
router.put(
  "/edit-profile-picture/:id",
  auth,
  multerUploadSingle,
  putUserPhotoById
);
router.put("/reset-password/:token", putResetPassword);

module.exports = router;