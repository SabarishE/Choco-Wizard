const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  req.token = token;
  jwt.verify(req.token, "mysecretkey", async (err, data) => {
    if (err) {
      console.log("error in authorization", err);
      res.status(403).send({ msg: "forbidden" });
    } else {
      console.log("error in authorization", data);
      next();
    }
  });
};

module.exports = auth;
