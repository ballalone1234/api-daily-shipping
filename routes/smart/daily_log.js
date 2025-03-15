const express = require("express");
const router = express.Router();
const { getDailyLogs, createDailyLog, searchDailyLogs, getDailyLogById } = require("../../controllers/dailylog_controller");

/**
 * @swagger
 * /api-qa/smart/daily_log:
 *   get:
 *     summary: Get daily log data
 *     description: Retrieve all daily logs from the database.
 *     tags: [Daily Log]
 *     responses:
 *       '200':
 *         description: Successfully retrieved daily log data.
 *       '400':
 *         description: Error response. Returns an error message.
 */
router.get("/", async (req, res) => {
    try {
        const result = await getDailyLogs();
        res.status(200).json(result);
    } catch (error) {
        console.error("Failed to fetch daily logs:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /api-qa/smart/daily_log:
 *   post:
 *     summary: Create a new daily log entry
 *     description: Insert a new daily log issue into the database.
 *     tags: [Daily Log]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               PDSITE:
 *                 type: string
 *               BIZ:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Successfully created a daily log entry.
 *       '400':
 *         description: Error response. Returns an error message.
 */
router.post("/", async (req, res) => {
    try {
        const result = await createDailyLog(req);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api-qa/smart/daily_log/search:
 *   get:
 *     summary: Search daily logs
 *     description: Search daily logs by text in all fields.
 *     tags: [Daily Log]
 *     parameters:
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *         required: true
 *         description: Text to search in all fields of daily logs.
 *     responses:
 *       '200':
 *         description: Successfully retrieved search results.
 *       '400':
 *         description: Error response. Returns an error message.
 */
router.get("/search", async (req, res) => {
    const { searchText } = req.query;
    console.log("Received searchText:", searchText);
    try {
        const result = await searchDailyLogs(searchText);
        console.log("Search result:", result); 
        res.status(200).json(result);
    } catch (error) {
        console.error("Failed to search daily logs:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * @swagger
 * /api-qa/smart/daily_log/{id}:
 *   get:
 *     summary: Get daily log by ID
 *     description: Retrieve a daily log by its ID.
 *     tags: [Daily Log]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the daily log to retrieve.
 *     responses:
 *       '200':
 *         description: Successfully retrieved the daily log.
 *       '404':
 *         description: Daily log not found.
 *       '500':
 *         description: Internal Server Error.
 */
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    console.log("Received ID:", id);
    try {
        const result = await getDailyLogById(id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Failed to fetch daily log by ID:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;