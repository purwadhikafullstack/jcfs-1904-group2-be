const connection = require("../../config/database");
const { verify } = require("../../services/token");

const auth = (req, res, next) => {
  try {
    // bagaimana cara kita dapat tokennya ?
    console.log({ header: req.headers });
    const token = req.headers.authorization.replace("Bearer ", "");
    console.log(token);
    // verifiedToken = {id: 22, "iat": 1677783949}

    const verifiedToken = verify(token);

    const sqlGetToken =
      "SELECT * FROM tokens WHERE user_id = ? AND tokens = ?;";
    // userId = 22
    // token = eYJhL
    const dataGetToken = [verifiedToken.id, token];

    connection.query(sqlGetToken, dataGetToken, (err, tokens) => {
      if (err) return res.status(500).send({ err });

      if (!tokens[0])
        return res.status(404).send({ message: "Please re-login" });

      // Lanjut ke handler
      const sqlGetUser = "SELECT * FROM users WHERE id = ?";
      const dataGetUser = verifiedToken.id;

      connection.query(sqlGetUser, dataGetUser, (err, users) => {
        if (err) return res.status(500).send({ err });

        // Jika user tidak ditemukan
        if (!users[0])
          return res.status(404).send({ message: "User not found" });

        // users[0] : {id: 28, username: user8, email: roger@mail.com, ...}
        req.user = users[0];

        next();
      });
    });
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
