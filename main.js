
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

        const options = {
            labelInterpolationFnc: function (value) {
                return value
            }
        };

        const responsiveOptions = [
            ['screen and (min-width: 640px)', {
                chartPadding: 30,
                labelOffset: 100,
                labelDirection: 'explode',
                labelInterpolationFnc: function (value) {
                    return value;
                }
            }],
            ['screen and (min-width: 1024px)', {
                labelOffset: 80,
                chartPadding: 20
            }]
        ];

        new Chartist.Pie('.ct-chart', data, options, responsiveOptions);
    }
);

