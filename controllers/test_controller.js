const DB_CONFIG = require("../db-config");
const mssql = require("mssql");
const mssqlConfig = DB_CONFIG.DB_CONFIG_MSSQL;
const axios = require("axios");
const nodemailer = require("nodemailer");

const gettest = async (req) => { 
    const str_sql = `
    SELECT
        [ID],
        [BIZ],
        [AREA],
        [SITE],
        [SHIFT],
        [SERIES_EPLAN],
        [LINE_EPLAN],
        FORMAT([PRODATE_EPLAN], 'dd/MM/yyyy') AS [PRODATE_EPLAN],
        [PLANLOT_EPLAN],
        [PROCODE_EPLAN],
        [PD_NAME_EPLAN],
        [SHIFT_QTY_EPLAN],
        [PDREADY_QTY_EPLAN],
        [PALLET_NO_QCLOT],
        [QC_LOT],
        [QTY_QCLOT],
        FORMAT([PD_COMPLETE_DATE], 'yyyy-MM-dd HH:mm:ss') AS [PD_COMPLETE_DATE],
        [WIP_MAN],
        [EF_CARD_OR_SERIAL_MAN],  
        [WIP_MACHINE],
        [EF_CARD_OR_SERIAL_MACHINE],
        [WIP_METHOD],
        [EF_CARD_OR_SERIAL_METHOD],
        [WIP_MATERIAL],
        [EF_CARD_OR_SERIAL_MARTERIAL],
        [QC_SAMPLING_PLAN],
        CONCAT([LINE_EPLAN], [QC_LOT]) AS [LINE_QC_LOT]
    FROM [SMART_QC].[dbo].[TBL_QC_SAMPLING_MONITOR]
    ORDER BY ABS(DATEDIFF(DAY, [PRODATE_EPLAN], GETDATE())) ASC
`;

    let pool;
    try {
        pool = await mssql.connect(mssqlConfig);
        const raw_result = await pool.request().query(str_sql);
        return raw_result.recordset;
    } catch (err) {
        console.error('Error fetching data:', err.message);
        throw new Error('Error fetching data: ' + err.message);
    } finally {
        if (pool) {
            await pool.close();
        }
    }
};


module.exports = {
    gettest
};
