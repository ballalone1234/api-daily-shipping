const express = require("express");
const router = express.Router();
const { gettest} = require("../../controllers/test_controller");

/**
 * @swagger
 * /api-qa/smart/test_manage:
 *   get:
 *     summary: Get test_manage data 
 *     description: Retrieve test_managem the database.
 *     tags: [test_manage manage]
 *     parameters:
 *     responses:
 *       '200':
 *         description: Successful response. Returns ALL test_manage  data.
 *       '400':
 *         description: Error response. Returns an error message.
 */
router.get("/", async (req, res) => {
    try {
      const result = await gettest(req);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  module.exports = router;
