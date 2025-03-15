const moment = require('moment');

class MomentService {
    constructor() {
        this.moment = moment;
    }

    getCurrentDate() {
        return this.moment().tz('Asia/Bangkok').format("YYYY-MM-DD");
    }

    getCurrentDateTime() {
        return this.moment().tz('Asia/Bangkok').format("YYYY-MM-DD HH:mm:ss.SSS");
    }

    convertToDate(date) {
        return this.moment(date).tz('Asia/Bangkok').format("YYYY-MM-DD");
    }

    convertToDateTime(date) {
        return this.moment(date).tz('Asia/Bangkok').format("YYYY-MM-DD HH:mm:ss.SSS");
    }

    getCurrentWeek() {
        const year = this.moment().tz('Asia/Bangkok').year();
        const week = this.moment().tz('Asia/Bangkok').week();

        return `${year}${week}`;
    }

    getCurrentYear() {
        return this.moment().tz('Asia/Bangkok').year();
    }

    formatDateTime(dateTime) {
        return this.moment(dateTime).tz('Asia/Bangkok').subtract(7, 'hours').format("YYYY-MM-DD hh:mm:ss A");
    }

    convertToDateTimeForISO(dateTime) {
        return this.moment(dateTime).tz('Asia/Bangkok').subtract(7, 'hours').format("YYYY-MM-DD HH:mm:ss.SSS");
    }

}

module.exports = MomentService;