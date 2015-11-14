// Morris.js Charts sample data for SB Admin template

$(function() {

    // Area Chart
    Morris.Area({
        element: 'morris-area-chart',
        data: [{
            period: '2010 Q1',
            iphone: 2666,
            ipad: null,
            itouch: 2647
        }, {
            period: '2010 Q2',
            iphone: 2778,
            ipad: 2294,
            itouch: 2441
        }, {
            period: '2010 Q3',
            iphone: 4912,
            ipad: 1969,
            itouch: 2501
        }, {
            period: '2010 Q4',
            iphone: 3767,
            ipad: 3597,
            itouch: 5689
        }, {
            period: '2011 Q1',
            iphone: 6810,
            ipad: 1914,
            itouch: 2293
        }, {
            period: '2011 Q2',
            iphone: 5670,
            ipad: 4293,
            itouch: 1881
        }, {
            period: '2011 Q3',
            iphone: 4820,
            ipad: 3795,
            itouch: 1588
        }, {
            period: '2011 Q4',
            iphone: 15073,
            ipad: 5967,
            itouch: 5175
        }, {
            period: '2012 Q1',
            iphone: 10687,
            ipad: 4460,
            itouch: 2028
        }, {
            period: '2012 Q2',
            iphone: 8432,
            ipad: 5713,
            itouch: 1791
        }],
        xkey: 'period',
        ykeys: ['iphone', 'ipad', 'itouch'],
        labels: ['iPhone', 'iPad', 'iPod Touch'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });

    // Donut Chart
    Morris.Donut({
        element: 'morris-donut-chart',
        data: [{
            label: "SD",
            value: 120
        }, {
            label: "MM",
            value: 250
        }, {
            label: "FI",
            value: 20
        }],
        resize: true
    });

    // Line Chart
    Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'morris-line-chart',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: [{
            d: '2012-10-01',
            volume: 10
        }, {
            d: '2012-10-02',
            volume: 20
        }, {
            d: '2012-10-03',
            volume: 30
        }, {
            d: '2012-10-04',
            volume: 40
        }, {
            d: '2012-10-05',
            volume: 55
        }, {
            d: '2012-10-06',
            volume: 60
        }, {
            d: '2012-10-07',
            volume: 71
        }, {
            d: '2012-10-08',
            volume: 88
        }, {
            d: '2012-10-09',
            volume: 120
        }, {
            d: '2012-10-10',
            volume: 140
        }, {
            d: '2012-10-11',
            volume: 150
        }, {
            d: '2012-10-12',
            volume: 160
        }, {
            d: '2012-10-13',
            volume: 170
        }, {
            d: '2012-10-14',
            volume: 170
        }, {
            d: '2012-10-15',
            volume: 180
        }, {
            d: '2012-10-16',
            volume: 190
        }, {
            d: '2012-10-17',
            volume: 200
        }, {
            d: '2012-10-18',
            volume: 230
        }, {
            d: '2012-10-19',
            volume: 240
        }, {
            d: '2012-10-20',
            volume: 250
        }, {
            d: '2012-10-21',
            volume: 300
        }, {
            d: '2012-10-22',
            volume: 320
        }, {
            d: '2012-10-23',
            volume: 325
        }, {
            d: '2012-10-24',
            volume: 325
        }, {
            d: '2012-10-25',
            volume: 340
        }, {
            d: '2012-10-26',
            volume: 350
        }, {
            d: '2012-10-27',
            volume: 360
        }, {
            d: '2012-10-28',
            volume: 370
        }, {
            d: '2012-10-29',
            volume: 390
        }, {
            d: '2012-10-30',
            volume: 400
        }, {
            d: '2012-10-31',
            volume: 430
        }, ],
        // The name of the data record attribute that contains x-volumes.
        xkey: 'd',
        // A list of names of data record attributes that contain y-volumes.
        ykeys: ['volume'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['Volume'],
        // Disables line smoothing
        smooth: false,
        resize: true
    });

    // Bar Chart
    Morris.Bar({
        element: 'morris-bar-chart',
        data: [{
            dia: '01',
            volume: 10
        }, {
            dia: '02',
            volume: 20
        }, {
            dia: '03',
            volume: 25
        }, {
            dia: '04',
            volume: 12
        }, {
            dia: '05',
            volume: 32
        }, {
            dia: '06',
            volume: 17
        }],
        xkey: 'dia',
        ykeys: ['volume'],
        labels: ['Volume'],
        barRatio: 0.2,
        xLabelAngle: 35,
        hideHover: 'auto',
        resize: true
    });


});
