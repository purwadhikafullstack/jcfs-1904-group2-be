require("dotenv").config();

const router = require("express").Router();
const pool = require("../../config/database");
const bcrypt = require("bcryptjs");
const { sign } = require("../../services/token");
const auth = require("../../middleware/auth");
const { sendEmail } = require("../../services/emails");
const { uploadAvatar } = require("../../services/upload");
const multer = require("multer");

// FORGOT PASSWORD //
const putForgotPassword = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();

    const sqlGetUserEmail =
      "SELECT id, username, isVerified, email from users where email = ?";
    const dataEmail = req.body.email;

    const [result] = await connection.query(sqlGetUserEmail, dataEmail);

    const user = result[0];
    if (!user)
      return res
        .status(404)
        .send({ message: "User not found! Registrasi terlebih dahulu" });

    const compareResult = dataEmail == user.email;
    if (!compareResult)
      return res
        .status(401)
        .send({ message: "Email tidak cocok, Anda bukan user kami" });

    const token = sign({ id: result.selectEmail }, { expiresIn: "10m" });

    sendEmail({
      recipient: dataEmail,
      subject: "Forgot Password",
      url: `${process.env.API_URL}/users/reset-password?token=${token}`,
    });
    connection.release();
    res.status(201).send({ message: "Email has been sent!" });
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

const putChangePassword = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();

    const { oldPassword, newPassword } = req.body;

    // Ambil password yang ada di database
    const sqlGetPassword = "SELECT password from users WHERE id = ?";
    const dataGetPassword = req.user.id;
    const [response] = await connection.query(sqlGetPassword, dataGetPassword);
    const password = response[0].password;

    const compareResult = bcrypt.compareSync(oldPassword, password);

    if (!compareResult)
      // Jika password lama tidak cocok
      return res.status(401).send({ message: "Wrong Password Entered!" });

    // Jika password yang diketik oleh user cocok, apa selanjutnya ?

    const sqlNewPassword = "UPDATE users SET password = ? WHERE password = ?;";
    const newData = bcrypt.hashSync(req.body.newPassword);
    const getId = password;

    const [result] = await connection.query(sqlNewPassword, [newData, getId]);

    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

// EDIT PROFILE KESELURUHAN //
const putEditProfile = async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();
    let { oldPassword, newPassword, fullName, age, gender, address, email } =
      req.body;

    const sqlGetAllData = "SELECT * from users WHERE id = ?";
    const data = req.user.id;
    const [response] = await connection.query(sqlGetAllData, data);

    const password = response[0].password;
    if (newPassword) {
      const compareResult = bcrypt.compareSync(oldPassword, password);
      if (!compareResult)
        // Jika password lama tidak cocok
        return res.status(401).send(alert("Wrong Password Entered!"));

      newPassword = bcrypt.hashSync(newPassword);
    }

    const sqlUpdateEditProfile = "UPDATE users SET ? WHERE id = ?";
    const newEditProfile = [
      { fullName, age, gender, address, email, password: newPassword },
      Number(req.params.id),
    ];

    const [resultProfile] = await connection.query(
      sqlUpdateEditProfile,
      newEditProfile
    );
    res.status(201).send(resultProfile);
  } catch (error) {
    next(error);
  }
};

router.put("/reset-password", putForgotPassword);
router.put("/edit-profile/:id", auth, putEditProfile);
router.put(
  "/edit-profile-picture/:id",
  auth,
  multerUploadSingle,
  putUserPhotoById
);
module.exports = router;
