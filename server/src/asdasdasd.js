/**************************
 ****** PLS DONT TIDY******
 * *****Antti 28.6*********
 * ************************/
let altArr = [];
let altArr2 = [];
let vector = {};
var color;
var details;
var gps_details;
var altitude_info;
var Default = ' muutoksia ei havaittu';
var climb_info = 'jjjjjjj';
var kulutus;
var speed;
var arvio = 'Ei nousua / Ei laskua';
let speedArr = [];
var abc;
var sumArr2 = [];
var ev;
let vectorTest = {};
let vectorTestLayers = {};
let vectoritesteri = {};
let counterOver80 = 0;
let tsOver80 = [];
let counterUnder80 = 0;
let tsUnder80 = [];
let vectorCoords = {};
/**
 * BOOLEANIT:
 * */
var altitudeIncrease = false;
var altitudeDecrease = false;
var altInc = false;
var altDec = false;
var isBig = false;
var isSmall = false;
self.onInit = function () {
  self.ctx.$scope.data = self.ctx.defaultSubscription.data;
  self.ctx.layers = {};
  self.ctx.routes = {};

  //     const deviceService = self.ctx.deviceService
  //   //console.log(deviceService)
  //   const url = 'https://www.infraweb-rws.fi/api/plugins/telemetry/DEVICE/aa722090-bee0-11eb-8915-e38fced7f3b2/values/timeseries?keys=lat,lon,	010C:%20Engine%20RPM,rpm&useStrictDataTypes=false'
  //   const testTextField = document.getElementById('pateTest')
  //   const jep = '010C: Engine RPM'

  //   setInterval(() => {
  //     locationData();
  //   }, 10);

  //   device.g
  // const URL = 'https://www.infraweb-rws.fi/api/plugins/telemetry/DEVICE/aa722090-bee0-11eb-8915-e38fced7f3b2/values/timeseries?keys=lat, lon&useStrictDataTypes=false'

  //     setInterval(() => {
  //         const request =  fetch(URL,  {
  //         headers: {
  //         "X-authorization": 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwYXZsb3Mua2FyYWJpYmVyaXNAZWR1LmxhcGluYW1rLmZpIiwic2NvcGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJ1c2VySWQiOiI4YWExMDMyMC0wZWE2LTExZWItYjg3OS02ZmUyOTE2MTEzM2YiLCJmaXJzdE5hbWUiOiJQYXZsb3MiLCJsYXN0TmFtZSI6IkthcmFiaWJlcmlzIiwiZW5hYmxlZCI6dHJ1ZSwiaXNQdWJsaWMiOmZhbHNlLCJ0ZW5hbnRJZCI6IjgyNzM3ZWIwLWU0MjktMTFlOS1hYzhmLWZkY2RlYzJjMjZhMiIsImN1c3RvbWVySWQiOiIxMzgxNDAwMC0xZGQyLTExYjItODA4MC04MDgwODA4MDgwODAiLCJpc3MiOiJ0aGluZ3Nib2FyZC5pbyIsImlhdCI6MTYyNTQ2Mzc3NywiZXhwIjoxNjI1NDcyNzc3fQ.KC0Ae4qgV97ydAvbBIG4inG4eyrjTxUvF2BG1GBpnZR-So-FpiwnTdNcO1YAzppTNjgjdYYalV8ZEUTpbv7qXA'
  //     }} )
  //     .then(response =>
  //         response.json()
  //     ).then(res => console.log(res))
  //     }, 1)

  //altitude_info = climb_info;

  if (altitude_info == undefined) {
    altitude_info = 'Ladataan/Ei Dataa';
  }

  //document.getElementById('DemoInfo').innerHTML = altitude_info;

  self.ctx.map = new ol.Map({
    target: 'mapR',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM({
          url: 'http://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          renderer: 'canvas',
        }),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([25.728478856, 66.502790259]),
      zoom: 12,
    }),
  });

  self.ctx.leadingPointSource = new ol.source.Vector();
  self.ctx.layer = new ol.layer.Vector({ source: self.ctx.leadingPointSource });
  self.ctx.map.addLayer(self.ctx.layer);
  self.ctx.layer.setZIndex(99);
  var container = document.getElementById('popup');
  var content = document.getElementById('popup-content');
  var closer = document.getElementById('popup-closer');
  var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
  });
  self.ctx.map.addOverlay(overlay);

  closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
  };

  self.ctx.map.on('pointermove', function (event) {
    var feature = self.ctx.map.forEachFeatureAtPixel(
      event.pixel,
      function (feature, layer) {
        return feature;
      }
    );

    var dataArrayLength = self.ctx.data.length;
    var a = 0;
    var eventTypeData = [];
    var eventTimeData = [];
    var coordinate = event.coordinate;

    for (a = 0; a < dataArrayLength; a++) {
      var dataSource;
      dataSource = a;
      if (self.ctx.data[a].data[0]) {
        if (self.ctx.map.hasFeatureAtPixel(event.pixel) === true) {
          if (feature) {
            eventTypeData = self.ctx.data[a].data[0];
          } else if (self.ctx.data[a].dataKey.label == 'eventTime') {
            eventTimeData = self.ctx.data[a].data[0];
          }

          if (feature) {
            var geometry = feature.getGeometry();
            var coord = geometry.getCoordinates();
            var props = feature.getProperties();
            var htmlContent =
              '<b>Tiedot: <b> <HR> Ajoneuvo: ' +
              kulutus +
              '<b> <HR> Arvio: ' +
              arvio;
            props.eventType; //.replace(/[\[\]\"]/g,'');
            content.innerHTML = htmlContent;
            overlay.setPosition(coord);
          }
          overlay.setPosition(coordinate);
        } else {
          overlay.setPosition(undefined);
          closer.blur();
        }
      }
    }
  });
};

self.onMobileModeChanged = function () {
  self.ctx.map.checkMouseEvents();
};

self.onEditModeChanged = function () {};

self.onMobileModeChanged = function () {};

self.getSettingsSchema = function () {};

self.getDataKeySettingsSchema = function () {};

self.onDataUpdated = function () {
  Object.keys(vectorTestLayers).forEach((k) => {
    const source = vectorTestLayers[k].getSource();
    const features = source.getFeatures();
    features.forEach((f) => vectorTestLayers[k].getSource().removeFeature(f));
  });
  locationData();
  //   self.ctx.detectChanges();
  //   gps_a();
  //   climb();
};

/**
 * climbin, Altituden sekä speedin vaihtelun tarkistelun alkeet
 * Tällä hetkellä 4 datapisteen otannalla
 * Sekä kahden datan vertailussa(uusin vs edeltävä)
 * Antti
 * */

function climb() {
  let dataArrayLength = self.ctx.data.length;
  var x = 0;
  var climbArr = [];
  var climbvar;

  for (x = 0; x < dataArrayLength; x++) {
    var datasrc;
    datasrc = x;
    if (self.ctx.data[x].data[0]) {
      if (self.ctx.data[x].dataKey.label == 'Climb') {
        climbvar = self.ctx.data[x].data[0][1];
        if (climbvar > 0) {
          climb_info = 'Climb nousu ' + climbvar.toFixed(2);
        }
        if (climbvar < 0) {
          climb_info = 'Climb lasku ' + climbvar.toFixed(2);
        }
        if (climbvar == 0) {
          climb_info = 'Climb nolla ' + climbvar.toFixed(2);
        }
        // document.getElementById('DemoI').innerHTML = climb_info;
      }
    }
  }
}
/**
      * abc = self.ctx.data[b].data[0][1]
                 console.log("", speedArr, abc)
                     if(speedArr.length == 3){
                         console.log("joo speedarrissa on ainaki kaks arvoa")
                         if(speedArr[0]<speedArr[1]){
                             var speedchange = speedArr[0] - speedArr[1]
                             console.log("nopeus kasvaa")https://www.infraweb-rws.fi/userGroups
                             //sArrDown.unshift(speedchange);
                             speedArr.pop();
                             if(speedchange > 2){
                                 console.log("vauhti kasvaa kahdella")
                                 //vauhti kasvaa kahdella
                             }  
                             }
                         if(speedArr[0]>speedArr[1]){
                             var speedchange2 = speedArr[1] - speedArr[0]
                             console.log("nopeus laskee")
                             //nopeus laskee
                             //sArrUp.unshift(speedchange2); 
                             speedArr.pop();
                             if(speedchange2 > 2){
                                 console.log("vauhti pienenee kahdella")
                                 //vauhti pienenee kahdella
                             }   
                         }
                         if(speedArr[0]==speedArr[1])
                             console.log("nopeus on sama kuin aiemmin")
                             //speedArr.pop();
                     }
                     else{
                         //speedArr.unshift(abc)
                         speedArr.unshift(Math.floor(Math.random() * 40))
                     }
                 }
     
     **/
function gps_a() {
  altitudeIncrease = false;
  altitudeDecrease = false;
  altInc = false;
  altDec = false;
  var summa = 0;
  var sumArr = [];

  var limit = 3;
  var limit2 = 2;

  var sArrUp = [];
  var sArrDown = [];
  let dataArrayLength = self.ctx.data.length;
  var b = 0;
  var i = 0;
  for (b = 0; b < dataArrayLength; b++) {
    var datasrc;
    datasrc = b;
    if (self.ctx.data[b].data[0]) {
      //if(self.ctx.data[b].dataKey.label == "Speed"){

      if (self.ctx.data[b].dataKey.label == 'Altitude') {
        var altvar = self.ctx.data[b].data[0][1];

        altArr.push(altvar);
        altArr2.push(altvar);
        // self.ctx.detectChanges();
      }
      if (altArr.length > limit) {
        for (i = 0; i < altArr.length - 1; i++) {
          if (altArr[i] < altArr[i + 1]) {
            //kasvu havaittu
            altitudeIncrease = true;
            altArr = [];
          }
          if (altArr[i] > altArr[i + 1]) {
            //laskua havaittu
            altitudeDecrease = true;
            altArr = [];
          }
        }
        altArr = [];
      }
      if (altArr2.length == limit2) {
        console.log('altArr2', altArr2);
        if (altArr2[0] < altArr2[1]) {
          var diff = altArr2[1] - altArr2[0];

          console.log('Array ja laskenta', altArr2, diff);
          altInc = true;
          altArr2.shift();
          sumArr2.push(diff);
          console.log('summa array', sumArr2);
          //puske kaikki diffit samaan arrayhyn vaan, alhaalla on filter positiivisille ja negatiivisille!!!!!!!!!!
          const onlyPositives2 = sumArr2.filter((el) => el > 0);
          console.log('uhj', onlyPositives2.length);
          //console.log("EEPPINEN TESTI kasvussa",sumArr2.reduce((a, b) => a + b, 0))
          if (altInc == true) {
            altitude_info =
              'Korkeus kasvaa, se kasvoi: ' + diff.toFixed(3) + 'Metriä';
            if (diff > 1) {
              arvio = 'Korkeus nousi yli metrin';
            }
            if (altitude_info == undefined) {
              altitude_info = 'Ladataan/Ei Dataa/Auto ei liiku';
            }
            // document.getElementById('DemoInfo').innerHTML = altitude_info;
          }
          if (altitudeIncrease == true && altInc == false) {
            'Korkeus kasvoi kerran mittausvälillä : ' +
              diff.toFixed(3) +
              'Metriä';
          }
          if (altitudeIncrease == false && altInc == true) {
            'Korkeus kasvoi kerran : ' + diff.toFixed(3) + 'Metriä';
          } else {
            altitude_info = 'jihaa';
          }
        }
        if (altArr2[0] > altArr2[1]) {
          var diff2 = altArr2[0] - altArr2[1];
          altDec = true;
          altArr2.shift();
          sumArr.push(diff2);
          //console.log("EEPPINEN TESTI laskussa",sumArr.reduce((a, b) => a + b, 0))
          if (altDec == true) {
            altitude_info =
              'Korkeus pienenee, se pienentyi : ' + diff2.toFixed(3) + 'Metriä';
            if (diff2 > 1) {
              arvio = 'Korkeus laski yli metrin';
            }

            if (altitude_info == undefined) {
              altitude_info = 'Ladataan/Ei Dataa';
            }

            // document.getElementById('DemoInfo').innerHTML = altitude_info;
          }
          if (altitudeDecrease == true && altDec == false) {
            altitude_info = 'Korkeus pieneni kerran mittausvälillä';
          }
          if (altDec == true && altitudeDecrease == false) {
            altitude_info =
              'Korkeus putosi kerran' + diff2.toFixed(3) + 'Metriä';
          } else {
            altitude_info = 'wuhuu';
          }
        } else {
          altArr2.shift();
        }
      }
    }
  }
}

const locationData = () => {
  vectoritesteri = {};
  vectorCoords = {};
  console.log('vectorTestLayers :', vectorTestLayers);
  //   console.log('LAYERS :', self.ctx.map.getLayers());
  //console.log('VECTORLINES :', vector);
  //console.log('VECTORLINES :', JSON.stringify(Vector));
  //self.ctx.map.getLayers().forEach((layer) => console.log('LAYER :', layer));
  // console.log('LAYERS: ', self.ctx.layers);
  // console.log('vectorlines', vectorlines);
  console.log('*************', self.ctx.data);
  var rpm = [];
  var arr = [];
  let dataArrayLength = self.ctx.defaultSubscription.data.length;
  // console.log("Pituus: ", self.ctx.data[4])
  var a = 0;
  var counter = -1;
  let lonLatData = [];
  let metadata = [];
  let lonData = [];
  let latData = [];
  let climb = [];
  var altitude = [];
  let deviceData = {};
  var maf;
  var runtime;
  var speedo;
  //console.log("TESTER :", self.ctx.defaultSubscription.data)
  //console.log(self.ctx.data);
  for (a = 0; a < dataArrayLength; a++) {
    var dataSource;
    dataSource = a;

    if (self.ctx.data[a].data[0]) {
      if (self.ctx.data[a].dataKey.label == 'lat') {
        latData = self.ctx.data[a].data;
      } else if (self.ctx.data[a].dataKey.label == 'lon') {
        lonData = self.ctx.data[a].data;
      } else if (self.ctx.defaultSubscription.data[a].dataKey.label == 'RPM') {
        rpm =
          self.ctx.defaultSubscription.data[a].data[
            self.ctx.defaultSubscription.data[a].data.length - 1
          ][1];
      } else if (self.ctx.data[a].dataKey.label == 'MAF') {
        maf = self.ctx.data[a].data[self.ctx.data[a].data.length - 1][1];
      } else if (self.ctx.data[a].dataKey.label == 'Speed') {
        speed = self.ctx.data[a].data[self.ctx.data[a].data.length - 1][1];
      } else if (self.ctx.data[a].dataKey.label == 'E_Time') {
        runtime = self.ctx.data[a].data[self.ctx.data[a].data.length - 1][1];
      } else if (self.ctx.data[a].dataKey.label == 'Altitude') {
        altitude = self.ctx.data[a].data;
      }
    }
  }
  if (rpm == undefined) {
    rpm = '0';
  }

  if (speed == undefined) {
    speed = '0';
  }

  //   document.getElementById('RPM_TEST').innerHTML = `${rpm} RPM`;
  //   //console.log("MOOTTTIERIKSAER KIRTOS", rpm)
  //   document.getElementById('SPEED_HTML').innerHTML = `${speed} KM/H`;
  //   self.ctx.detectChanges();

  var hours = Math.floor(runtime / 60 / 60);

  var minutes = Math.floor(runtime / 60) - hours * 60;

  var seconds = runtime % 60;

  var formatted =
    hours.toString().padStart(2, '0') +
    ':' +
    minutes.toString().padStart(2, '0') +
    ':' +
    seconds.toString().padStart(2, '0');

  if (formatted == 'NaN:NaN:NaN') {
    formatted = '00:00:00';
  }

  counterOver80 = 0;
  tsOver80 = [];
  counterUnder80 = 0;
  tsUnder80 = [];

  let latLonData = [];
  let latlonDataAltUnder80 = [];
  let latlonDataAltOver80 = [];

  latData.forEach((lat, i) => {
    if (altitude[i][1] > 95) {
      latlonDataAltOver80.push([lonData[i][1], latData[i][1], lat[0]]);
    } else if (altitude[i][1] < 95) {
      latlonDataAltUnder80.push([lonData[i][1], latData[i][1], lat[0]]);
    }
  });

  console.log('VECTORITESTERI: ', vectoritesteri);
  latlonDataAltOver80.forEach((el, i) => {
    if (!vectoritesteri[`over80|${counterOver80}`]) {
      vectoritesteri[`over80|${counterOver80}`] = {};
    }
    if (i > 0) {
      let diff = latlonDataAltOver80[i][2] - latlonDataAltOver80[i - 1][2];
      if (diff > 5000) {
        counterOver80++;
        vectoritesteri[`over80|${counterOver80}`] = {};
        tsOver80 = [];
      }
    }

    tsOver80.push(latlonDataAltOver80[i][2]);
    vectoritesteri[`over80|${counterOver80}`] = tsOver80;
  });

  latlonDataAltUnder80.forEach((el, i) => {
    if (!vectoritesteri[`under80|${counterUnder80}`]) {
      vectoritesteri[`under80|${counterUnder80}`] = {};
    }
    if (i > 0) {
      let diff = latlonDataAltUnder80[i][2] - latlonDataAltUnder80[i - 1][2];
      if (diff > 5000) {
        counterUnder80++;
        vectoritesteri[`under80|${counterUnder80}`] = {};
        tsUnder80 = [];
      }
    }

    tsUnder80.push(latlonDataAltUnder80[i][2]);
    vectoritesteri[`under80|${counterUnder80}`] = tsUnder80;
  });

  console.log('VECTORITESTERI: ', vectoritesteri);

  for (const [key, value] of Object.entries(vectoritesteri)) {
    let coordsArr = [];
    if (key.includes('over')) {
      latlonDataAltOver80.forEach((coord, idx) => {
        value.map((el, i) => {
          if (coord[2] == el) {
            coordsArr.push([coord[0], coord[1]]);
          }
        });
      });

      if (!vectorCoords[`${key}`]) {
        vectorCoords[`${key}`] = {};
        vectorCoords[`${key}`] = coordsArr;
      }
    }
    if (key.includes('under')) {
      latlonDataAltUnder80.forEach((coord, idx) => {
        value.map((el, i) => {
          if (coord[2] == el) {
            coordsArr.push([coord[0], coord[1]]);
          }
        });
      });

      if (!vectorCoords[`${key}`]) {
        vectorCoords[`${key}`] = {};
        vectorCoords[`${key}`] = coordsArr;
      }
    }
  }

  Object.keys(vectorCoords).forEach((k) => {
    let lineStyle = k.includes('under')
      ? [
          new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: '#000',
              width: 7,
              zIndex: 0,
            }),
          }),
          new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: '#000',
              width: 5,
              zIndex: 1,
            }),
          }),
        ]
      : [
          new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: '#000',
              width: 7,
              zIndex: 0,
            }),
          }),
          new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: '#F1B0C6',
              width: 5,
              zIndex: 1,
            }),
          }),
        ];

    let lineStringTest = new ol.geom.LineString([]);

    let featureTest = new ol.Feature({
      geometry: lineStringTest,
      name: k,
    });

    let sourceTest = new ol.source.Vector({
      features: [featureTest],
    });

    let lineCoords = [];
    vectorCoords[k].forEach((coord) => {
      lineCoords.push(ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857'));
    });

    if (!vectorTestLayers[k]) {
      vectorTestLayers[k] = new ol.layer.Vector({
        source: sourceTest,
        style: lineStyle,
      });

      lineStringTest.setCoordinates(lineCoords);
      self.ctx.map.addLayer(vectorTestLayers[k]);
      console.log('ADD LAYER ');
    } else {
      console.log('WE ARE IN ELSE ');
      vectorTestLayers[k].setSource(sourceTest);
      lineStringTest.setCoordinates(lineCoords);
    }
  });

  //   document.getElementById('RUNTIME').innerHTML = `${formatted}`;
  maths(maf, speed);
  drawandstuff(latData, lonData, altitude);
};

function maths(maf, speed) {
  var litraasekunnissa = maf / 14.7 / 710;
  var kilometriasekunnissa = speed / 3600;
  var litraakilometrilla = litraasekunnissa / kilometriasekunnissa;
  var litraasadalle = litraakilometrilla * 100;

  if (isNaN(litraasadalle)) litraasadalle = 0;

  //   document.getElementById('KULUTUS').innerHTML = `${litraasadalle.toFixed(
  //     2
  //   )} L/100KM`;

  if (litraasadalle == Infinity) {
    color = '#fc0303';
    kulutus = 'Auto ei liiku..';
  } else if (litraasadalle >= 15) {
    color = '#ff5500';
    kulutus = 'Kulutus on yli 15 litraa...';
  } else if (litraasadalle >= 8) {
    color = '#fc9803';
    kulutus = 'Kulutus yli 8 litraa...';
  } else if (litraasadalle < 8) {
    color = '#befc03';
    kulutus = 'Kulutus on alle 8 litraa...';
  } else {
    color = '#000';
  }
  //drawandstuff(litraasadalle);
  //console.log("Kulutus: ", litraasadalle)
  //console.log("Vari: ", color)
  //console.log("Vari2: ", kulutus)
}

function drawandstuff(latData, lonData, altData) {}

// if(jj > 2 ){

//     console.log("WAUTSI EKA STYLE")
//      style = new ol.style.Style({
//     fill: new ol.style.Fill({ color: '#f5b942', weight: 8 }),
//     stroke: new ol.style.Stroke({ color: '#f5b942', width: 4 }),
//   });

// }else{
//     console.log("TOINEN STYLE")
//     style = new ol.style.Style({
//     fill: new ol.style.Fill({ color: '#42a1f5', weight: 8 }),
//     stroke: new ol.style.Stroke({ color: '#42a1f5', width: 4 }),
//   });
// }

/**
      * 
      * 
      * 
      let style = new ol.style.Style({
         stroke: new ol.style.Stroke({
             color: color,
             width: 5,
             zIndex: 0,
             }),
     
         });
         let style = new ol.style.Style({
         stroke: new ol.style.Stroke({
             color: color,
             width: 5,
             zIndex: 0,
             }),
     
         });
         let style = new ol.style.Style({
         stroke: new ol.style.Stroke({
             color: color,
             width: 5,
             zIndex: 0,
             }),
     
         });**/

self.onResize = function () {
  self.ctx.map.updateSize();
  console.log('resize');
};

self.onDestroy = function () {};
