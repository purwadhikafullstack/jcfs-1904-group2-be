require("dotenv").config();
const router = require("express").Router();
const pool = require("../../config/database");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { sign } = require("../../services/token");
const auth = require("../../middleware/auth");
const { sendEmail } = require("../../services/emails");

//CREATE USER = REGISTER
const postRegisterUserRouter = async (req, res, next) => {

  const connection = await pool.promise().getConnection();
  
  try {
    

    const sqlPostUser = "Insert into users set ?";
    const dataAddUser = req.body;
    const isEmail = validator.isEmail(dataAddUser.email);
    if (!isEmail)
      return res.status(401).send({ message: "Format email salah" });

    dataAddUser.password = bcrypt.hashSync(dataAddUser.password);

    const [result] = await connection.query(sqlPostUser, dataAddUser);

    const token = sign({ id: result.insertId });

    sendEmail({
      recipient: dataAddUser.email,
      subject: "Email Verification",
      url: `${process.env.API_URL}/users/verify?token=${token}`,
      dataAddUser: {
        username: dataAddUser.username,
        url: `${process.env.API_URL}/users/verify?token=${token}`,
      },
    });

    console.log(process.env.API_URL)
    connection.release();
    res.status(201).send({
      message: `Data dengan username: ${req.body.username} berhasil ditambahkan`,
    });
  } catch (error) {
    connection.release();
    next(error);
  }
};

//LOGIN USER
const postLoginUserRouter = async (req, res, next) => {

  const connection = await pool.promise().getConnection();

  try {
    
    const { username, password } = req.body;

    const sqlLoginUser =
      "SELECT id, username, password, isVerified, role, photo FROM users WHERE username = ?;";
    const data = req.body.username;

    const [result] = await connection.query(sqlLoginUser, data);

    const user = result[0];
    if (!user) return res.status(404).send({ message: "User not found" });

    const compareResult = bcrypt.compareSync(password, user.password);

    // Jika hasil compare tidak valid
    if (!compareResult)
      return res.status(401).send({ message: "Wrong password" });

    // Jika status user belum terverifikasi
    if (!user.isVerified)
      return res.status(401).send({ message: "Please verify your account" });

    const token = sign({ id: user.id });
    const sqlInsertToken = `INSERT INTO tokens set ?;`;
    const dataToken = { user_Id: user.id, tokens: token };

    await connection.query(sqlInsertToken, dataToken);
    connection.release();
    res.status(201).send({ ...result[0], token });
  } catch (error) {
    connection.release();
    next(error);
  }
};
router.post("/", postRegisterUserRouter);
router.post("/login", postLoginUserRouter);

module.exports = router;