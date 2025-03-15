const DB_CONFIG = require("../db-config");
const mssql = require("mssql");
const { formatDate } = require("../utils/dateUtils");
const { PrismaClient } = require("@prisma/client");
const mssqlConfig = DB_CONFIG.DB_CONFIG_MSSQL;
const prisma = new PrismaClient();
const getDailyLogs = async () => {
    const dailyLogs = await prisma.tBL_DSJ_ISSUE_INFO.findMany();
    return dailyLogs;
};

const createDailyLog = async (req) => {
    const ISSUE_ID = req.body.ISSUE_ID;
    delete req.body.ISSUE_ID;
    const dailyLogs = await prisma.tBL_DSJ_ISSUE_INFO.upsert({
        where: {
            ISSUE_ID: ISSUE_ID
        },
        update: req.body,
        create: req.body,
    });
    return dailyLogs;
};

const searchDailyLogs = async (searchText) => {
    const daily_logs = await prisma.tBL_DSJ_ISSUE_INFO.findMany({
        where: {
            OR: [
                { ISSUE_ID: { contains: searchText } },
                { PDSITE: { contains: searchText } },
                { BIZ: { contains: searchText } },
                { PRODUCT_TYPE: { contains: searchText } },
                { PRODUCT_CATEGORY: { contains: searchText } },
                { MODEL_SERIES: { contains: searchText } },
                { LINE: { contains: searchText } },
                { SHIFT: { contains: searchText } },
                { PALLET_NO: { contains: searchText } },
                { QC_LOT_NO: { contains: searchText } },
                { PLAN_LOT_NO: { contains: searchText } },
                { ISSUE_AREA: { contains: searchText } },
                { ACTUAL_DETECTION: { contains: searchText } },
                { FOUND_DATE: { contains: searchText } },
                { QTY_DEFECT: { contains: searchText } },
                { CRITERIA: { contains: searchText } },
                { SYMPTOM: { contains: searchText } },
                { DETECT_ABILITY: { contains: searchText } },
                { DEFECT_PIC: { contains: searchText } },
                { HOLE_INFO: { contains: searchText } },
                { SHIPMENT: { contains: searchText } },
                { RESULT_PRE_JUDGEMENT: { contains: searchText } },
                { CASE_DESCRIPTION: { contains: searchText } },
                { ROOT_CASE: { contains: searchText } },
                { ACTION_TAKEN: { contains: searchText } },
                { DUE_DATE: { contains: searchText } },
                { PIC: { contains: searchText } },
                { DIARY_JUDGEMENT: { contains: searchText } },
                { JUDGEMENT_REASON: { contains: searchText } },
            ],
        },
    });
    return daily_logs;
};

const getDailyLogById = async (id) => {
    const id_int = parseInt(id);
    const dailyLog = await prisma.tBL_DSJ_ISSUE_INFO.findUnique({
        include: { TBL_DSJ_ISSUE_LOG: true },
        where: {
            ISSUE_ID: id_int,
        },
    });
    return dailyLog;
};

module.exports = { getDailyLogs, createDailyLog, searchDailyLogs, getDailyLogById };