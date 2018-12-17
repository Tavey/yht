
export default {
    data() {
        return {
            
        }
    },
    methods: {
        //返回天数差
        DateDiff(sDate1, sDate2) {
            //sDate1和sDate2是2002-12-18格式
            let aDate, oDate1, oDate2, iDays;
            aDate = sDate1.split("-");
            oDate1 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]); //转换为12-18-2002格式
            aDate = sDate2.split("-");
            oDate2 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]);
            iDays = (oDate1 - oDate2) / 1000 / 60 / 60 / 24; //把相差的毫秒数转换为天数
            return iDays;
        },
        //日期+天
        addDate(date, days) {
            let vm = this;
            if (days == undefined || days == "") {
                days = 1;
            }
            var date = new Date(date);
            date.setDate(date.getDate() + days);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return (
                date.getFullYear() +
                "-" +
                vm.getFormatDate(month) +
                "-" +
                vm.getFormatDate(day)
            );
        },
        // 日期月份/天的显示，如果是1位数，则在前面加上'0'
        getFormatDate(arg) {
            if (arg == undefined || arg == "") {
                return "";
            }

            var re = arg + "";
            if (re.length < 2) {
                re = "0" + re;
            }

            return re;
        },
        //+0
        add0(m) {
            return m < 10 ? "0" + m : m;
        },
         //求自然月日期
        getMonthBeforeFormatAndDay(date) {
            let mo = date.split("-")[1];
            let day = date.split("-")[2];
            //小月
            if (mo == 4 || mo == 6 || mo == 9 || mo == 11) {
                if (day > 30) {
                    day = 30;
                }
            }
            //2月
            else if (mo == 2) {
                if (this.isLeapYear(date.split("-")[0])) {
                    if (day > 29) {
                        day = 29;
                    } else {
                        day = 28;
                    }
                } else {
                    day = 28;
                }
            }
            //大月
            else {
                if (day > 31) {
                    day = 31;
                }
            }
            return date.split("-")[0] + "-" + mo + "-" + day;
        },
        //判断闰年代码
        isLeapYear(Year) {
            if ((Year % 4 == 0 && Year % 100 != 0) || Year % 400 == 0) {
                return true;
            } else {
                return false;
            }
        },
         // addMonth(startDate, addMonth) {
        //     var startTime = new Date(startDate);
        //     var startYear = startTime.getFullYear(); //年
        //     var startMonth = startTime.getMonth() + 1; //月
        //     var startGetDate = startTime.getDate(); //日
        //     startGetDate < 10
        //         ? (startGetDate = "0" + startGetDate)
        //         : (startGetDate = startGetDate);
        //     var afterMonth = (Number(startMonth) + Number(addMonth)) % 12; //增加后的月份
        //     afterMonth == 0 ? (afterMonth = 12) : (afterMonth = afterMonth);
        //     afterMonth < 10
        //         ? (afterMonth = "0" + afterMonth)
        //         : (afterMonth = afterMonth);
        //     var year = Math.ceil((Number(startMonth) + Number(addMonth)) / 12); //年数向上取整
        //     var afterYear; //增加后的年份
        //     if (year > 1) {
        //         afterYear = Number(startYear) + year - 1;
        //     } else {
        //         afterYear = startYear;
        //     }
        //     var afterDate = afterYear + "-" + afterMonth + "-" + startGetDate; //月份相加的时间
        //     return this.getMonthBeforeFormatAndDay(afterDate);
        // },
       
    }
}
