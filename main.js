
var loadJSONP = (function () {
    var unique = 0;
    return function (url, callback, context) {
        // INIT
        var name = "_jsonp_" + unique++;
        if (url.match(/\?/)) url += "&callback=" + name;
        else url += "?callback=" + name;

        // Create script
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Setup handler
        window[name] = function (data) {
            callback.call((context || window), data);
            document.getElementsByTagName('head')[0].removeChild(script);
            script = null;
            delete window[name];
        };

        // Load JSON
        document.getElementsByTagName('head')[0].appendChild(script);
    };
})();

loadJSONP('https://wakatime.com/share/@044ed4c3-38b9-4be7-ac4b-3a2f41fba255/e279d43f-7e62-45a5-8d00-2b256c86c3c6.json',
    function (response) {
        console.log(response.data);

        const summer = (accumulator, currentValue) => accumulator + currentValue;

        const response2 = response.data.filter(r => r.percent > 10)

        const data = {
            labels: response2.map(r => r.name + ' ' + r.percent + ' %'),
            series: response2.map(r => r.percent)
        };

        const sum = data.series.reduce(summer)
        if (sum < 100) {
            data.labels.push('Other')
            data.series.push(100 - sum)
        }

        console.log(data)

        Raphael("holder").setViewBox(0, 0, 700, 700, true).pieChart(350, 350, 200, data.series, data.labels, "#fff");

    }
);

Raphael.fn.pieChart = function (cx, cy, r, values, labels, stroke) {
    var paper = this,
        rad = Math.PI / 180,
        chart = this.set();
    function sector(cx, cy, r, startAngle, endAngle, params) {
        console.log(params.fill);
        var x1 = cx + r * Math.cos(-startAngle * rad),
            x2 = cx + r * Math.cos(-endAngle * rad),
            y1 = cy + r * Math.sin(-startAngle * rad),
            y2 = cy + r * Math.sin(-endAngle * rad);
        return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
    }
    var angle = 0,
        total = 0,
        start = 0,
        process = function (j) {
            var value = values[j],
                angleplus = 360 * value / total,
                popangle = angle + (angleplus / 2),
                color = Raphael.hsb(start, .75, 1),
                ms = 500,
                delta = 30,
                bcolor = Raphael.hsb(start, 1, 1),
                p = sector(cx, cy, r, angle, angle + angleplus, { fill: "90-" + bcolor + "-" + color, stroke: stroke, "stroke-width": 3 }),
                txt = paper.text(cx + (r + delta + 55) * Math.cos(-popangle * rad), cy + (r + delta + 25) * Math.sin(-popangle * rad), labels[j]).attr({ fill: bcolor, stroke: "none", opacity: 0, "font-size": 20 });
            p.mouseover(function () {
                p.stop().animate({ transform: "s1.1 1.1 " + cx + " " + cy }, ms, "elastic");
                txt.stop().animate({ opacity: 1 }, ms, "elastic");
            }).mouseout(function () {
                p.stop().animate({ transform: "" }, ms, "elastic");
                txt.stop().animate({ opacity: 0 }, ms);
            });
            angle += angleplus;
            chart.push(p);
            chart.push(txt);
            start += .05;
        };
    for (var i = 0, ii = values.length; i < ii; i++) {
        total += values[i];
    }
    for (i = 0; i < ii; i++) {
        process(i);
    }
    return chart;
};
