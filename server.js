const express = require("express");
const app = express();
const ip = require("ip");
const bodyParser = require("body-parser");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const errorHandler = require("./_helpesrs/error-handler");
const cors = require("cors");

const smartCCLlist_manageRoute = require("./routes/smart/test_manage");
const dailyLogRoute = require("./routes/smart/daily_log.js");

const { swaggerSmartCCLOptions } = require("./swagger.config");

require("dotenv").config(); 

const corsOptions = {
    origin: "*",
    credentials: true,
  };

app.use(cors(corsOptions)); 
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

app.use(errorHandler);

const router = express.Router();
const PORT = process.env.PORT || 3400;

app.use("/api-qa", router);
app.set('trust proxy', true)

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerSmartCCLOptions)));

router.use("/test_manage", smartCCLlist_manageRoute);
router.use("/daily_log", dailyLogRoute);
router.use("/smart/daily_log", dailyLogRoute);

app.listen(PORT, () => {
  console.log(`Server ${ip.address()} is listening on port ${PORT}`);
});
