const swaggerSmartCCLOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "SMART CCL API Documentation",
    },
    servers: [
      { url: "http://localhost:3000" }, 
      { url: "http://43.72.228.42" }
    ],
  },
  apis: [
    "server.js", 
    "./routes/smart/test_manage.js", 
    "./routes/smart/Daily_Log.js",
  ],
};

module.exports = { swaggerSmartCCLOptions };
