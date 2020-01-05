// Date 对象自动使用当前的日期和时间作为其初始值
let d = new Date();
// getTimezoneOffset()方法可返回格林威治时间和本地时间之间的时差，以分钟为单位
let minute = 0 - d.getTimezoneOffset();

viewer.animation.viewModel.timeFormatter = function(date, viewModel) {
    let dateZone8 = Cesium.JulianDate.addMinutes(date, minute, new Cesium.JulianDate());
    let gregorianDate = Cesium.JulianDate.toGregorianDate(dateZone8);
    let millisecond = Math.round(gregorianDate.millisecond);
    if (Math.abs(viewModel._clockViewModel.multiplier) < 1) {
        return Cesium.sprintf("%02d:%02d:%02d.%03d", gregorianDate.hour, gregorianDate.minute, gregorianDate.second, millisecond);
    }
    return Cesium.sprintf("%02d:%02d:%02d GMT+8", gregorianDate.hour, gregorianDate.minute, gregorianDate.second);
}
