const multer = require("multer");
const path = require("path");

const avatarDirectory = path.join(__dirname, "../../../public/avatar");
const storageAvatar = multer.diskStorage({
  // config destination
  destination: (req, file, cb) => {
    cb(null, avatarDirectory);
  },

  filename: (req, file, cb) => {
    // req.user.username // user8
    // Untuk mendapatkan extension dari file yang di upload
    // const extname = path.extname(file.originalname);
    // bagaimana cara mendapakan nama username --> auth
    cb(null, `${req.user.username}-avatar.png`);
  },
});

const uploadAvatar = multer({
  storage: storageAvatar,
  limits: {
    fileSize: 10000000, // Byte, 10MB
  },
  fileFilter(req, file, cb) {
    const allowedExtension = [".png", ".jpg", ".jpeg"];
    // ktp.jpg
    // extname : .jpg
    const extname = path.extname(file.originalname);
    // Jika extension yang diupload tidak sesuai dengan isi dari allowedExtension
    if (!allowedExtension.includes(extname))
      return cb(new Error("Please upload image file (jpg, jpeg, png)"));

    cb(null, true);
  },
});

// PRODUCT //
const photoDirectory = path.join(__dirname, "../../../public/productPicture");
const storageProductPhoto = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, photoDirectory);
  },

  filename: (req, file, cb) => {
    cb(
      null,
      path.parse(file.originalname).name +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const uploadProductPhoto = multer({
  storage: storageProductPhoto,
  limits: {
    fileSize: 10000000, // Byte, 10MB
  },
  fileFilter(req, file, cb) {
    const allowedExtension = [".png", ".jpg", ".jpeg"];
    // ktp.jpg
    // extname : .jpg
    const extname = path.extname(file.originalname);
    // Jika extension yang diupload tidak sesuai dengan isi dari allowedExtension
    if (!allowedExtension.includes(extname))
      return cb(new Error("Please upload image file (jpg, jpeg, png)"));

    cb(null, true);
  },
});



//Prescription
const prescriptionDirectory = path.join(__dirname, "../../../public/prescription");
const storagePrescription = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, prescriptionDirectory);
  },

  filename: (req, file, cb) => {
    cb(
      null,
      path.parse(file.originalname).name +
        "prescription" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const uploadPrescription = multer({
  storage: storagePrescription,
  limits: {
    fileSize: 10000000, 
  },
  fileFilter(req, file, cb) {
    const allowedExtension = [".png", ".jpg", ".jpeg"];
   
    const extname = path.extname(file.originalname);
    
    if (!allowedExtension.includes(extname))
      return cb(new Error("Please upload image file (jpg, jpeg, png)"));

    cb(null, true);
  },
});


//PaymentProof
const paymentProofDirectory = path.join(__dirname, "../../../public/paymentProof");
const storagePaymentProof = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, paymentProofDirectory);
  },

  filename: (req, file, cb) => {
    cb(
      null,
      path.parse(file.originalname).name +
        "paymentProof" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const uploadPaymentProof = multer({
  storage: storagePaymentProof,
  limits: {
    fileSize: 10000000, 
  },
  fileFilter(req, file, cb) {
    const allowedExtension = [".png", ".jpg", ".jpeg"];
   
    const extname = path.extname(file.originalname);
    
    if (!allowedExtension.includes(extname))
      return cb(new Error("Please upload image file (jpg, jpeg, png)"));

    cb(null, true);
  },
});


module.exports = { uploadAvatar, uploadProductPhoto, uploadPrescription, uploadPaymentProof };
