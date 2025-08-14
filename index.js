const express = require("express");
const cors = require("cors");
// const fileURLToPath = require("url")
const path = require("path")
const app = express();
app.use(express.json({ limit: "500mb" }));

const env = require("dotenv");
const connectDB = require("./db/db");
env.config();

const PORT = process.env.PORT || 5001;
connectDB();

app.use(cors());

// const __filename = fileURLToPath(import.meta.url);
// const __filename = __filename || __filename;
// const __dirname = __dirname || __dirname



app.use("/api", require("./router/auth"));
app.use("/api", require("./router/company"));
app.use("/api", require("./router/location"));
app.use("/api", require("./router/category"));
app.use("/api", require("./router/question"));
app.use("/api", require("./router/form"));
app.use("/api", require("./router/user"));
app.use("/api" , require("./router/role"))
app.use(express.static(path.join(__dirname, "../goAudit_new_fe/dist")));


// app.use("/api/user", require("./router/user"));
// app.use("/api/customer", require("./router/customer"));
// app.use("/api/patient", require("./router/patient"));
// app.use("/api/pdf", require("./router/pdf"));
// app.use("/api/role", require("./router/role"));
// app.use("/api/note", require("./router/note"));
// app.use("/api/dicom", require("./router/dicom"));
// app.use("/api/logs", require("./router/logs"));

app.listen(PORT, () => {
  console.log(`Server run on PORT : ${PORT}`);
});
