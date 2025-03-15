const DB_CONFIG = require("../db-config");
const mssql = require("mssql");
const { formatDate } = require("../utils/dateUtils");
const mssqlConfig = DB_CONFIG.DB_CONFIG_MSSQL;

const getDailyLogs = async () => {
    const str_sql = `
    SELECT 
        ISSUE_ID, PDSITE, BIZ, PRODUCT_TYPE, PRODUCT_CATEGORY, MODEL_SERIES, LINE, SHIFT, 
        PRODUCTION_DATE, PALLET_NO, QC_LOT_NO, PLAN_LOT_NO, 
        ISSUE_AREA, ACTUAL_DETECTION, FOUND_DATE, 
        QTY_DEFECT, CRITERIA, SYMPTOM, DETECT_ABILITY, DEFECT_PIC, HOLE_INFO, SHIPMENT, 
        RESULT_PRE_JUDGEMENT, CASE_DESCRIPTION, ROOT_CASE, ACTION_TAKEN, 
        DUE_DATE, PIC, DIARY_JUDGEMENT, JUDGEMENT_REASON
    FROM TBL_DSJ_ISSUE_INFO
    ORDER BY FOUND_DATE DESC
    `;

    let pool;
    try {
        pool = await mssql.connect(mssqlConfig);
        const raw_result = await pool.request().query(str_sql);

        return raw_result.recordset.map((log) => ({
            ...log,
            PRODUCTION_DATE: formatDate(log.PRODUCTION_DATE),
            FOUND_DATE: formatDate(log.FOUND_DATE),
            DUE_DATE: formatDate(log.DUE_DATE),
        }));
    } catch (err) {
        console.error("Error fetching daily logs:", err.message);
        throw new Error("Error fetching daily logs: " + err.message);
    } finally {
        if (pool) {
            await pool.close();
        }
    }
};

const createDailyLog = async (req) => {
    const {
        pdSite, biz, productType, productCategory, modelSeries, line, shift,
        productionDate, palletNo, qcLotNo, planLotNo, issueArea, actualDetection,
        foundDate, qtyDefect, criteria, symptom, detectAbility, defectPic, holeInfo,
        shipment, resultPreJudgement, case: caseDescription, rootCase, action,
        dueDate, pic, diaryJudgement, judgementReason
    } = req.body;

    console.log("Request payload:", req.body);

    let defectPicBase64 = null;
    if (defectPic) {
        try {
            defectPicBase64 = defectPic.split(",")[1];
            console.log("Converted defectPic to base64:", defectPicBase64);
        } catch (error) {
            console.error("Error converting defectPic to base64:", error.message);
            throw new Error("Invalid defectPic format");
        }
    } else {
        console.log("No defectPic provided");
    }

    const str_sql = `
    INSERT INTO TBL_DSJ_ISSUE_INFO (
        PDSITE, BIZ, PRODUCT_TYPE, PRODUCT_CATEGORY, MODEL_SERIES, LINE, SHIFT, PRODUCTION_DATE, 
        PALLET_NO, QC_LOT_NO, PLAN_LOT_NO, ISSUE_AREA, ACTUAL_DETECTION, FOUND_DATE, 
        QTY_DEFECT, CRITERIA, SYMPTOM, DETECT_ABILITY, DEFECT_PIC, HOLE_INFO, SHIPMENT, 
        RESULT_PRE_JUDGEMENT, CASE_DESCRIPTION, ROOT_CASE, ACTION_TAKEN, DUE_DATE, PIC, 
        DIARY_JUDGEMENT, JUDGEMENT_REASON
    ) VALUES (
        @PDSITE, @BIZ, @PRODUCT_TYPE, @PRODUCT_CATEGORY, @MODEL_SERIES, @LINE, @SHIFT, @PRODUCTION_DATE, 
        @PALLET_NO, @QC_LOT_NO, @PLAN_LOT_NO, @ISSUE_AREA, @ACTUAL_DETECTION, @FOUND_DATE, 
        @QTY_DEFECT, @CRITERIA, @SYMPTOM, @DETECT_ABILITY, @DEFECT_PIC, @HOLE_INFO, @SHIPMENT, 
        @RESULT_PRE_JUDGEMENT, @CASE_DESCRIPTION, @ROOT_CASE, @ACTION_TAKEN, @DUE_DATE, @PIC, 
        @DIARY_JUDGEMENT, @JUDGEMENT_REASON
    );
    SELECT SCOPE_IDENTITY() AS ISSUE_ID;
    `;
    console.log("SQL:", str_sql);

    let pool;
    try {
        pool = await mssql.connect(mssqlConfig);
        const result = await pool.request()
            .input("PDSITE", mssql.VarChar, pdSite)
            .input("BIZ", mssql.VarChar, biz)
            .input("PRODUCT_TYPE", mssql.VarChar, productType)
            .input("PRODUCT_CATEGORY", mssql.VarChar, productCategory)
            .input("MODEL_SERIES", mssql.VarChar, modelSeries)
            .input("LINE", mssql.VarChar, line)
            .input("SHIFT", mssql.VarChar, shift)
            .input("PRODUCTION_DATE", mssql.Date, productionDate)
            .input("PALLET_NO", mssql.VarChar, palletNo)
            .input("QC_LOT_NO", mssql.VarChar, qcLotNo)
            .input("PLAN_LOT_NO", mssql.VarChar, planLotNo)
            .input("ISSUE_AREA", mssql.VarChar, issueArea)
            .input("ACTUAL_DETECTION", mssql.VarChar, actualDetection)
            .input("FOUND_DATE", mssql.Date, foundDate)
            .input("QTY_DEFECT", mssql.VarChar, qtyDefect)
            .input("CRITERIA", mssql.VarChar, criteria)
            .input("SYMPTOM", mssql.VarChar, symptom)
            .input("DETECT_ABILITY", mssql.VarChar, detectAbility)
            .input("DEFECT_PIC", mssql.NVarChar, defectPicBase64)  // Use base64 string
            .input("HOLE_INFO", mssql.NVarChar, holeInfo)
            .input("SHIPMENT", mssql.NVarChar, shipment)
            .input("RESULT_PRE_JUDGEMENT", mssql.VarChar, resultPreJudgement)
            .input("CASE_DESCRIPTION", mssql.NVarChar, caseDescription)
            .input("ROOT_CASE", mssql.NVarChar, rootCase)
            .input("ACTION_TAKEN", mssql.NVarChar, action)  // Changed actionTaken to action
            .input("DUE_DATE", mssql.Date, dueDate)
            .input("PIC", mssql.VarChar, pic)
            .input("DIARY_JUDGEMENT", mssql.VarChar, diaryJudgement)
            .input("JUDGEMENT_REASON", mssql.NVarChar, judgementReason)
            .query(str_sql);

        return { ISSUE_ID: result.recordset[0].ISSUE_ID, message: "Daily log entry created successfully" };
    } catch (err) {
        console.error('Error inserting daily log:', err.message);
        throw new Error('Error inserting daily log: ' + err.message);
    } finally {
        if (pool) {
            await pool.close();
        }
    }
};

const searchDailyLogs = async (searchText) => {
    const str_sql = `
    SELECT 
        ISSUE_ID, PDSITE, BIZ, PRODUCT_TYPE, PRODUCT_CATEGORY, MODEL_SERIES, LINE, SHIFT, 
        PRODUCTION_DATE, PALLET_NO, QC_LOT_NO, PLAN_LOT_NO, 
        ISSUE_AREA, ACTUAL_DETECTION, FOUND_DATE, 
        QTY_DEFECT, CRITERIA, SYMPTOM, DETECT_ABILITY, DEFECT_PIC, HOLE_INFO, SHIPMENT, 
        RESULT_PRE_JUDGEMENT, CASE_DESCRIPTION, ROOT_CASE, ACTION_TAKEN, 
        DUE_DATE, PIC, DIARY_JUDGEMENT, JUDGEMENT_REASON
    FROM TBL_DSJ_ISSUE_INFO
    WHERE 
        PDSITE LIKE @SEARCH_TEXT OR
        BIZ LIKE @SEARCH_TEXT OR
        PRODUCT_TYPE LIKE @SEARCH_TEXT OR
        PRODUCT_CATEGORY LIKE @SEARCH_TEXT OR
        MODEL_SERIES LIKE @SEARCH_TEXT OR
        LINE LIKE @SEARCH_TEXT OR
        SHIFT LIKE @SEARCH_TEXT OR
        PALLET_NO LIKE @SEARCH_TEXT OR
        QC_LOT_NO LIKE @SEARCH_TEXT OR
        PLAN_LOT_NO LIKE @SEARCH_TEXT OR
        ISSUE_AREA LIKE @SEARCH_TEXT OR
        ACTUAL_DETECTION LIKE @SEARCH_TEXT OR
        QTY_DEFECT LIKE @SEARCH_TEXT OR
        CRITERIA LIKE @SEARCH_TEXT OR
        SYMPTOM LIKE @SEARCH_TEXT OR
        DETECT_ABILITY LIKE @SEARCH_TEXT OR
        DEFECT_PIC LIKE @SEARCH_TEXT OR
        HOLE_INFO LIKE @SEARCH_TEXT OR
        SHIPMENT LIKE @SEARCH_TEXT OR
        RESULT_PRE_JUDGEMENT LIKE @SEARCH_TEXT OR
        CASE_DESCRIPTION LIKE @SEARCH_TEXT OR
        ROOT_CASE LIKE @SEARCH_TEXT OR
        ACTION_TAKEN LIKE @SEARCH_TEXT OR
        PIC LIKE @SEARCH_TEXT OR
        DIARY_JUDGEMENT LIKE @SEARCH_TEXT OR
        JUDGEMENT_REASON LIKE @SEARCH_TEXT
    ORDER BY FOUND_DATE DESC
    `;
    console.log("Search text:", searchText);

    let pool;
    try {
        pool = await mssql.connect(mssqlConfig);
        const raw_result = await pool.request()
            .input("SEARCH_TEXT", mssql.VarChar, `%${searchText}%`)
            .query(str_sql);

        return raw_result.recordset.map((log) => ({
            ...log,
            PRODUCTION_DATE: formatDate(log.PRODUCTION_DATE),
            FOUND_DATE: formatDate(log.FOUND_DATE),
            DUE_DATE: formatDate(log.DUE_DATE),
        }));

    } catch (err) {
        console.error("Error searching daily logs:", err.message);
        throw new Error("Error searching daily logs: " + err.message);
    } finally {
        if (pool) {
            await pool.close();
        }
    }
};

const getDailyLogById = async (id) => {
    const str_sql = `
    SELECT 
        ISSUE_ID, PDSITE, BIZ, PRODUCT_TYPE, PRODUCT_CATEGORY, MODEL_SERIES, LINE, SHIFT, 
        PRODUCTION_DATE, PALLET_NO, QC_LOT_NO, PLAN_LOT_NO, 
        ISSUE_AREA, ACTUAL_DETECTION, FOUND_DATE, 
        QTY_DEFECT, CRITERIA, SYMPTOM, DETECT_ABILITY, DEFECT_PIC, HOLE_INFO, SHIPMENT, 
        RESULT_PRE_JUDGEMENT, CASE_DESCRIPTION, ROOT_CASE, ACTION_TAKEN, 
        DUE_DATE, PIC, DIARY_JUDGEMENT, JUDGEMENT_REASON
    FROM TBL_DSJ_ISSUE_INFO
    WHERE ISSUE_ID = @ID
    `;
    console.log("Search ID:", id);

    let pool;
    try {
        pool = await mssql.connect(mssqlConfig);
        const raw_result = await pool.request()
            .input("ID", mssql.Int, id)
            .query(str_sql);

        if (raw_result.recordset.length === 0) {
            throw new Error("No daily log found with the given ID");
        }

        const log = raw_result.recordset[0];
        return {
            ...log,
            PRODUCTION_DATE: formatDate(log.PRODUCTION_DATE),
            FOUND_DATE: formatDate(log.FOUND_DATE),
            DUE_DATE: formatDate(log.DUE_DATE),
        };

    } catch (err) {
        console.error("Error fetching daily log by ID:", err.message);
        throw new Error("Error fetching daily log by ID: " + err.message);
    } finally {
        if (pool) {
            await pool.close();
        }
    }
};

module.exports = { getDailyLogs, createDailyLog, searchDailyLogs, getDailyLogById };