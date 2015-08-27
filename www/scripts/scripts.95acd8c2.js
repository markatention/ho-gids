function onDeviceReady(){7===parseFloat(window.device.version)&&(document.body.style.marginTop="20px")}L.RotatedMarker=L.Marker.extend({options:{angle:0},_setPos:function(a){if(L.Marker.prototype._setPos.call(this,a),L.DomUtil.TRANSFORM)this._icon.style[L.DomUtil.TRANSFORM]+=" rotate("+this.options.angle+"deg)";else if(L.Browser.ie){var b=this.options.angle*(Math.PI/180),c=Math.cos(b),d=Math.sin(b);this._icon.style.filter+=" progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11="+c+", M12="+-d+", M21="+d+", M22="+c+")"}}}),L.rotatedMarker=function(a,b){return new L.RotatedMarker(a,b)},document.addEventListener("deviceready",onDeviceReady,!1),angular.module("hoGidsApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","wu.masonry","leaflet-directive","snap","LocalStorageModule"]).config(["$routeProvider","snapRemoteProvider","localStorageServiceProvider",function(a,b,c){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/informatie",{templateUrl:"views/informatie.html",controller:"InformatieCtrl"}).when("/programma",{templateUrl:"views/programma.html",controller:"ProgrammaCtrl"}).when("/instellingen",{templateUrl:"views/instellingen.html",controller:"InstellingenCtrl"}).when("/over",{templateUrl:"views/over.html",controller:"OverCtrl"}).when("/kaart",{templateUrl:"views/kaart.html",controller:"KaartCtrl"}).when("/kaart/:highlightPlaats",{templateUrl:"views/kaart.html",controller:"KaartCtrl"}).when("/nieuwsstroom",{templateUrl:"views/nieuwsstroom.html",controller:"NieuwsstroomCtrl"}).otherwise({redirectTo:"/"}),b.globalOptions={hyperextensible:!1,touchToDrag:!1,tapToClose:!0},c.setPrefix("hogids").setStorageCookie(0,"/")}]).run(function(){navigator.splashscreen&&navigator.splashscreen.hide()}),angular.module("hoGidsApp").controller("MainCtrl",["$scope",function(a){}]),angular.module("hoGidsApp").controller("ProgrammaCtrl",["$scope","$location","Programma","localStorageService",function(a,b,c,d){a.programma=c.programma,a.gouw=d.get("gouw"),a.toonOpKaart=function(c){c.plaats&&(c.selected=!0,c.plaats.toLowerCase().indexOf("gouw")>=0?b.path("/kaart/"+a.gouw.grond):b.path("/kaart/"+c.plaats))}}]);var labelClassName="map-label",iconClassName="map-icon",iconRectClassName="map-icon-rect",hogeRielenCenter=L.latLng(51.24230669704754,4.936895370483398),hogeRielenBounds=L.latLngBounds(L.latLng(51.23,4.909),L.latLng(51.253,4.957)),DEFAULT_ZOOM=14,POLL_LOCATION_INTERVAL=10,POLL_LOCATION_TIMEOUT=4,POLL_LOCATION_INTERVAL_OUTSIDE_AREA=600,POSITION_DESIRED_ACCURACY=60,POSITION_MAX_ALLOWED_ACCURACY=350,styles={podium:{fillColor:"#f07d00",fillOpacity:1,stroke:!1},podiumgrond:{fillColor:"#006f93",fillOpacity:1,stroke:!1},pavilioen:{fillColor:"#e2afc4",fillOpacity:1,stroke:!1},loods:{fillColor:"#dae283",fillOpacity:1,stroke:!1},kampeergrond:{fillColor:"#51af31",fillOpacity:1,stroke:!1,lineJoin:"round"},aanbod:{fillColor:"#da0c25",fillOpacity:1,stroke:!1,lineJoin:"round"},vijver:{fillColor:"#009fe3",fillOpacity:.6,stroke:!1,lineJoin:"round"},bos:{fillColor:"#7e216e",fillOpacity:1,weight:1,color:"37af6b"},"weg-hard":{weight:4,opacity:1,color:"white",lineCap:"square"},"weg-hard-2":{weight:3,opacity:1,color:"white",lineCap:"square"},"weg-halfhard":{weight:3,opacity:1,color:"white",lineCap:"square"},"weg-zand":{weight:1,opacity:1,color:"#c7d301",dashArray:"5"},faciliteit:{stroke:!1,radius:4,fillColor:"#0e7594",fillOpacity:1},border:{fillColor:"#f4f6da",weight:5,color:"#c7d301",fillOpacity:1,opacity:1},"default":{fillColor:"black",weight:1,opacity:1,color:"white",fillOpacity:.7}},accuracyCircleStyle={fillOpacity:.3,fillColor:"#1d9c5a",stroke:!1},accuracyCircleStyleInvalid={fillOpacity:.3,fillColor:"#9C2A1D",stroke:!1},icons={ehboIcon:L.icon({iconUrl:"images/kaart/ehbo.png",iconSize:[24,24],className:iconClassName}),infoIcon:L.icon({iconUrl:"images/kaart/infopunt.png",iconSize:[24,24],className:iconClassName}),sisIcon:L.icon({iconUrl:"images/kaart/sis.png",iconSize:[24,24],className:iconClassName}),onthaalIcon:L.icon({iconUrl:"images/kaart/onthaal.png",iconSize:[24,24],className:iconClassName}),sanitair:L.icon({iconUrl:"images/kaart/sanitair.png",iconSize:[24,24],className:iconClassName}),afwasbatterij:L.icon({iconUrl:"images/kaart/afwasbatterij.png",iconSize:[24,24],className:iconClassName}),evacuatiepunt:L.icon({iconUrl:"images/kaart/evacuatiepunt.png",iconSize:[24,24],className:iconClassName}),bar:L.icon({iconUrl:"images/kaart/bar.png",iconSize:[24,24],className:iconClassName}),tent:L.icon({iconUrl:"images/kaart/tent.png",iconSize:[128,64],className:iconRectClassName}),locationIcon:L.icon({iconUrl:"images/kaart/marker-location.png",iconRetinaUrl:"images/kaart/marker-location-2x.png",shadowUrl:"images/kaart/marker-shadow.png",shadowRetinaUrl:"images/kaart/marker-shadow.png",iconSize:[25,41],iconAnchor:[12,41],popupAnchor:[1,-34],shadowSize:[41,41]})};angular.module("hoGidsApp").controller("KaartCtrl",["$scope","$http","leafletData","$routeParams","$log","localStorageService",function(a,b,c,d,e,f){function g(a){return styles[a.properties.style]||styles["default"]}function h(a,b){if(a.properties.name)switch(a.properties.name.toLowerCase()){case"ehbo":return L.marker(b,{icon:icons.ehboIcon});case"infopunt":return L.marker(b,{icon:icons.infoIcon});case"sis":return L.marker(b,{icon:icons.sisIcon});case"onthaal":return L.marker(b,{icon:icons.onthaalIcon});case"sanitair":return L.marker(b,{icon:icons.sanitair});case"afwasbatterij":return L.marker(b,{icon:icons.afwasbatterij});case"evacuatiepunt":return L.marker(b,{icon:icons.evacuatiepunt});case"centrale bar":return L.marker(b,{icon:icons.bar})}return L.circle(b,7)}function i(a,b){return a.properties.show_on_map!==!1}function j(a,b){k(a,b),l(a,b)}function k(a,b){if("Polygon"===a.geometry.type){var c=L.polygon(b._latlngs);if("kampeergrond"===a.properties.style&&L.marker(c.getBounds().getCenter(),{icon:icons.tent}).addTo(B),a.properties.name){var d=L.divIcon({className:labelClassName,html:a.properties.name});L.marker(c.getBounds().getCenter(),{icon:d}).addTo(B)}}}function l(a,b){if(m(a)){var c=b._latlngs?L.polygon(b._latlngs).getBounds().getCenter():b._latlng;c&&(y=L.marker(c).addTo(B))}}function m(a){if(d.highlightPlaats){var b=a.properties.name,c=a.properties.alias,e=d.highlightPlaats.toLowerCase();return b&&b.toLowerCase()===e||c&&c.toLowerCase().indexOf(e)>=0}return!1}function n(){var a=B.getZoom(),b={14:6,15:7,16:12,17:14,18:20};angular.element("."+labelClassName).css("fontSize",b[a]+"px");var c={14:10,15:16,16:24,17:44,18:56},d=c[a],e=-1*d/2;angular.element("."+iconClassName).css("width",d+"px").css("height",d+"px").css("margin-left",e+"px").css("margin-top",e+"px");var f={14:10,15:16,16:32,17:56,18:64},g=f[a],h=-1*g,i=-1*g/2;angular.element("."+iconRectClassName).css("width",2*g+"px").css("height",g+"px").css("margin-left",h+"px").css("margin-top",i+"px")}function o(){w&&y?B.fitBounds(L.latLngBounds(y.getLatLng(),w.getLatLng()),{animate:!0,duration:1,maxZoom:DEFAULT_ZOOM}):(w||y)&&(B.setZoom(DEFAULT_ZOOM+2,{animate:!1}),n(),w?B.panTo(w.getLatLng(),{animate:!0,duration:1}):y&&B.panTo(y.getLatLng(),{animate:!0,duration:1}))}function p(a){q(a)}function q(a){if(console.log(a),hogeRielenBounds.contains(a.latlng)){if(a.accuracy<POSITION_MAX_ALLOWED_ACCURACY){var b=a.accuracy/2;w&&x?(w.setLatLng(a.latlng),w.update(),x.setLatLng(a.latlng),x.setRadius(b),x.setStyle(accuracyCircleStyle),x.redraw()):(w=L.marker(a.latlng,{icon:icons.locationIcon}),B.addLayer(w),x=L.circle(a.latlng,b,accuracyCircleStyle),B.addLayer(x),o())}v(POLL_LOCATION_INTERVAL)}else s(),v(POLL_LOCATION_INTERVAL_OUTSIDE_AREA)}function r(a){e.warn("Position not found",a),x&&x.setStyle(accuracyCircleStyleInvalid),v(POLL_LOCATION_INTERVAL)}function s(){w&&B.removeLayer(w),x&&B.removeLayer(x),w=void 0,x=void 0}function t(){A&&(B.on("accuratepositionprogress",p),B.on("accuratepositionfound",q),B.on("accuratepositionerror",r),u())}function u(){e.info("Request position."),B.findAccuratePosition({maxWait:1e3*POLL_LOCATION_TIMEOUT,desiredAccuracy:POSITION_DESIRED_ACCURACY})}function v(a){z&&clearInterval(z),z=setInterval(u,1e3*a)}var w,x,y,z,A=f.get("locationEnabled")!==!1,B=L.map("map",{center:hogeRielenCenter,zoom:DEFAULT_ZOOM,minZoom:14,maxBounds:hogeRielenBounds});B.whenReady(function(){B.on("layeradd",n),B.on("zoomend",n)});var C="http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";L.tileLayer(C,{attribution:""}).addTo(B),L.Icon.Default.imagePath="images/kaart",b.get("data/map.geojson").success(function(a){L.geoJson(a,{style:g,pointToLayer:h,filter:i,onEachFeature:j}).addTo(B),t(),o()})}]),angular.module("hoGidsApp").controller("MenuCtrl",["$scope","$location","localStorageService",function(a,b,c){a.gouw=c.get("gouw"),a.isActive=function(a){return 0===b.path().indexOf(a)},a.go=function(a){b.path(a)}}]),angular.module("hoGidsApp").service("Programma",function(){var a=[{titel:"Kapoenen, Zeehondjes",plaats:"K10",beschrijving:"Kom op ontdekking en leer waar jij en je kapoenen goed in zijn! \nNieuwe spelen, moeilijke kapoenen, voorlezen, spelen in elkaar boksen, gescheiden ouders,... dit en méér kan je vinden in het kapoenenaanbod!"},{titel:"Kabouters, (Zee)welpen",plaats:"KP14",beschrijving:"Of je nu nieuw bent in de horde, al wat lessen van Baloe onder de knie hebt, of een ervaren Akela bent, doet er niet zo toe. Bij ons vind je workshops om ervaringen uit te wisselen, om nieuwe spellen te leren, om je danskunsten bij te schaven,... Kortom, in onze jungle is er voor elk wat wils."},{titel:"Jonggidsen, Jongverkenner, Scheepsmakker",plaats:"K9",beschrijving:"Alle leiding zijn helden maar alleen als team zijn ze ontoombaar. Als leiding ben je een held voor je leden omdat je ze vanalles kan leren, maar een held blijf je pas als je zelf steeds bijleert."},{titel:"(Zee)gidsen, (Zee)verkenner, SOLL",plaats:"Vijver 1",beschrijving:"Klaar om een fantastisch jaar als giverleiding tegemoet te gaan? Na het volgen van een van onze werkwinkels zeker wel! Aan de vijver bieden wij jullie inspiratie om in het kader van het jaarthema met je givers van het buitenleven te genieten, tips en tricks om originele en uitdagende projecten op te bouwen, een kans om even stil te staan bij totemisatie en nog veel meer."},{titel:"Jins, Loodsen",plaats:"K12",beschrijving:"Zin om je jinjaar zonder kleerscheuren te overleven? Op zoek naar een originele jinvergadering? Ideeën nodig voor het eerste jinweekend? Zin in een leuk project, maar weet je niet goed hoe eraan te beginnen? Inspiratie nodig? Meer weten over kampen, leefweek en kleurentotems? \nPrima, wees dan welkom op onze Jingrond. We bewijzen dat vorming allesbehalve saai hoeft te zijn door zowel inhoudelijke als praktische werkwinkels aan te bieden. Dit alles is natuurlijk, zoals het de jins betaamt, overgoten met een zotte en speelse saus."},{titel:"Groepsleiding, VGA, materiaalmeesters",plaats:"KKG",beschrijving:"Net groepsleiding geworden? Al veel ervaring, maar de groepsadministratie vlot niet? Waar en hoe vind ik nieuwe leiding? Hoe start ik een oudercomité op? Talloze vragen waar je hier een antwoord op vindt!"},{titel:"Akabeleiding",plaats:"KKK",beschrijving:"Scouting... zonder beperking! \nEen handicap hoeft geen beperking te zijn. Ontdek hoe je het maximum kan halen uit je groep en echt iedereen meekrijgt bij scouting, of je nu een lid hebt met ADHD, autisme of downsyndroom. Rolstoelspelen, klauteren in de bossen, zwaardgevechten... we doen het gewoon bij Akabe!"}],b=[{titel:"Scouting DNA",plaats:"KKK",beschrijving:""},{titel:"Scouting DNA",plaats:"K10",beschrijving:""},{titel:"Lokalen, Financiën en Administratie",plaats:"KP14",beschrijving:""},{titel:"Actie en Spel",plaats:"K9",beschrijving:""},{titel:"Zeescouting",plaats:"Vijver 1",beschrijving:""},{titel:"Safety First",plaats:"K12",beschrijving:""},{titel:"Technieken",plaats:"KKG",beschrijving:""}],c=[{titel:"Scouteske zangavond",plaats:"Hoofdpodium",beschrijving:""},{titel:"Volksdansen",plaats:"K10",beschrijving:""},{titel:"Jindiana Jones",plaats:"L341",beschrijving:""},{titel:"Lasershooting",plaats:"L341",beschrijving:""},{titel:"Kampvuur",plaats:"KKG",beschrijving:""}],d=[{titel:"Winnaar 'Scouting got talent' (23u)",plaats:"Hoofdpodium",beschrijving:""},{titel:"Tuxedo swamp blues band (23u)",plaats:"K10",beschrijving:""},{titel:"DJ Turntable Tities (0u)",plaats:"Hoofdpodium",beschrijving:""},{titel:"Pussy Willow (0u45)",plaats:"K10",beschrijving:""},{titel:"Kampvuur",plaats:"KKG",beschrijving:""}],e={programma:[{dag:"Vrijdag",items:[{start:"19:00",titel:"Aankomst",beschrijving:"Aankomst en inschrijving deelnemers"},{start:"20:00",stop:"22:30",titel:"Onthaal",beschrijving:"Onthaal en instapactiviteit bij je gouw",plaats:"Gouwgrond"},{start:"23:00",stop:"01:00",titel:"Onthaalshow",beschrijving:"Onthaalshow en 'Scouting Got Talent' op het grote podium",plaats:"KKG"},{start:"01:00",stop:"02:30",titel:"Scouteske avond",beschrijving:"Scouteske avond met animo, kampvuur en café",plaats:"",subitems:c},{start:"03:00",titel:"Slaapwel",beschrijving:"Tijd om je slaapzak te kruipen",plaats:"Gouwgrond"}]},{dag:"Zaterdag",items:[{start:"08:00",stop:"09:00",titel:"Opstaan",beschrijving:"Opstaan en ontbijt op je gouwgrond",plaats:"Gouwgrond"},{start:"09:15",stop:"09:50",titel:"Openingsshow",beschrijving:"Openingsshow op het grote podium",plaats:"KKG"},{start:"10:00",stop:"12:30",titel:"Tijd voor Thema's",beschrijving:"Vorming op de themagronden",plaats:"Themagronden",subitems:b},{start:"12:40",stop:"13:40",titel:"Picknick",beschrijving:"Massa-picknick op de grote grond met animo",plaats:"KKG"},{start:"13:50",stop:"16:20",titel:"Tijd voor Takken",beschrijving:"Vorming op de takgronden",plaats:"Takgronden",subitems:a},{start:"16:30",stop:"22:00",titel:"Gouw- en districtsmoment",beschrijving:"Gouw- en districtsmoment met warm avondmaal op je gouwgrond",plaats:"Gouwgrond"},{start:"22:15",stop:"22:45",titel:"Zin in HO",beschrijving:"ZIN in HO op het grote podium",plaats:"KKG"},{start:"22:45",stop:"02:30",titel:"Avondaanbod",beschrijving:"Avondgebeuren met optredens, animo, kampvuur en café",plaats:"",subitems:d},{start:"03:00",titel:"Slaapwel",beschrijving:"Tijd om in je slaapzak te kruipen",plaats:"Gouwgrond"}]},{dag:"Zondag",items:[{start:"08:00",stop:"09:00",titel:"Opstaan",beschrijving:"Opstaan op je gouwgrond",plaats:"Gouwgrond"},{start:"09:30",stop:"11:30",titel:"Markt",beschrijving:"Een actief marktgebeuren met walking brunch op de grote grond",plaats:"KKG"},{start:"12:00",stop:"13:00",titel:"Slotshow",beschrijving:"Slotshow op het grote podium",plaats:"KKG"},{start:"13:00",stop:"14:00",titel:"Opruim",beschrijving:"Opruim en afbraak"},{start:"15:30",titel:"Vertrek naar huis"}]}],gouwen:[{naam:"Antwerpen",grond:"K2"},{naam:"Gent",grond:"K15"},{naam:"Heide",grond:"K8"},{naam:"Kempen",grond:"K1"},{naam:"Land van Egmont",grond:"K1"},{naam:"Limburg",grond:"K7"},{naam:"Noordzee",grond:"K5"},{naam:"Opsinjoor",grond:"K4"},{naam:"Waas",grond:"K1"},{naam:"Webra",grond:"K6"},{naam:"Zuid-West-Vlaanderen",grond:"K5"},{naam:"Oost-Brabant",grond:"K6"}]};return e}),L.Map.include({_defaultAccuratePositionOptions:{maxWait:1e4,desiredAccuracy:20},findAccuratePosition:function(a){if(!navigator.geolocation)return this._handleAccuratePositionError({code:0,message:"Geolocation not supported."}),this;this._accuratePositionEventCount=0,this._accuratePositionOptions=L.extend(this._defaultAccuratePositionOptions,a),this._accuratePositionOptions.enableHighAccuracy=!0,this._accuratePositionOptions.maximumAge=0,this._accuratePositionOptions.timeout||(this._accuratePositionOptions.timeout=this._accuratePositionOptions.maxWait);var b=L.bind(this._checkAccuratePosition,this),c=L.bind(this._handleAccuratePositionError,this),d=L.bind(this._handleAccuratePositionTimeout,this);this._accuratePositionWatchId=navigator.geolocation.watchPosition(b,c,this._accuratePositionOptions),this._accuratePositionTimerId=setTimeout(d,this._accuratePositionOptions.maxWait)},_handleAccuratePositionTimeout:function(){return navigator.geolocation.clearWatch(this._accuratePositionWatchId),"undefined"!=typeof this._lastCheckedAccuratePosition?this._handleAccuratePositionResponse(this._lastCheckedAccuratePosition):this._handleAccuratePositionError({code:3,message:"Timeout expired"}),this},_cleanUpAccuratePositioning:function(){clearTimeout(this._accuratePositionTimerId),navigator.geolocation.clearWatch(this._accuratePositionWatchId)},_checkAccuratePosition:function(a){var b=a.coords.accuracy<=this._accuratePositionOptions.desiredAccuracy;this._lastCheckedAccuratePosition=a,this._accuratePositionEventCount=this._accuratePositionEventCount+1,b&&this._accuratePositionEventCount>1?(this._cleanUpAccuratePositioning(),this._handleAccuratePositionResponse(a)):this._handleAccuratePositionProgress(a)},_prepareAccuratePositionData:function(a){var b=a.coords.latitude,c=a.coords.longitude,d=new L.LatLng(b,c),e=180*a.coords.accuracy/40075017,f=e/Math.cos(L.LatLng.DEG_TO_RAD*b),g=L.latLngBounds([b-e,c-f],[b+e,c+f]),h={latlng:d,bounds:g,timestamp:a.timestamp};for(var i in a.coords)"number"==typeof a.coords[i]&&(h[i]=a.coords[i]);return h},_handleAccuratePositionProgress:function(a){var b=this._prepareAccuratePositionData(a);this.fire("accuratepositionprogress",b)},_handleAccuratePositionResponse:function(a){var b=this._prepareAccuratePositionData(a);this.fire("accuratepositionfound",b)},_handleAccuratePositionError:function(a){var b=a.code,c=a.message||(1===b?"permission denied":2===b?"position unavailable":"timeout");this._cleanUpAccuratePositioning(),this.fire("accuratepositionerror",{code:b,message:"Geolocation error: "+c+"."})}}),angular.module("hoGidsApp").controller("InformatieCtrl",["$scope","$location",function(a,b){a.showOnMap=function(a){b.path("/kaart/"+a)}}]),angular.module("hoGidsApp").controller("NieuwsstroomCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("hoGidsApp").controller("InstellingenCtrl",["$scope","$rootScope","$location","localStorageService","Programma",function(a,b,c,d,e){a.gouw=d.get("gouw"),a.gouwen=e.gouwen,a.setGouw=function(a){console.debug("Zet gouw op: "+a),d.set("gouw",a)},a.showOnMap=function(a){c.path("/kaart/"+a)},a.enableLocation=function(b){return a.locationEnabled=b,d.set("locationEnabled",b),b},a.locationEnabled=d.get("locationEnabled")===!1?!1:a.enableLocation(!0)}]),angular.module("hoGidsApp").controller("OverCtrl",["$scope",function(a){}]);