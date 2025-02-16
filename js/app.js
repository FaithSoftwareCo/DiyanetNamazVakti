/*
 * Copyright (c) 2016 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*global tizen, tau, window, document, history, console*/

/**
 * Main application module.
 * Handles application life cycle.
 *
 * @module app
 * @namespace app
 */

//strict wrapper
(function mainWrapper() {
	'use strict';

	var version = "5.2";

	var isStarting = false,

	currentLanguage = "en",
	defaultLanguage = "en",
	supportedLanguages = ["en", "tr"],

	ulkelerLoadedBefore = false,
	fromAlarm = false,
	fromOp = null,
	/**
	 * Logs list element.
	 *
	 * @memberof app
	 * @private
	 * @type {HTMLElement}
	 */
	
	mainPage = null,
	
	gunAdd = 0,

	locationSettingsListEl = document.getElementById('settings-location-ui'),

	locationSettingsUlkelerListEl = document.getElementById('settings-location-ulke-ui'),

	locationSettingsIllerListEl = document.getElementById('settings-location-il-ui'),

	locationSettingsIlcelerListEl = document.getElementById('settings-location-ilce-ui'),

	locationSettingsNotificationsListEl = document.getElementById('settings-notifications-ui'),

	//prayerTimesDivEl = document.getElementById('content-prayertimes'),

	bayramListEl = document.getElementById('bayram-vakitleri-ui'),

	vakitTableOk = document.getElementById('vakitTable'),
	vakitTableError = document.getElementById('selectLocTable'),
	miladiDate = document.getElementById('miladiDate'),
	miladiDay = document.getElementById('miladiDay'),
	imsakTime = document.getElementById('imsakTime'),
	gunesTime = document.getElementById('gunesTime'),
	ogleTime = document.getElementById('ogleTime'),
	ikindiTime = document.getElementById('ikindiTime'),
	aksamTime = document.getElementById('aksamTime'),
	yatsiTime = document.getElementById('yatsiTime'),
	hicriDate = document.getElementById('hicriDate'),

	vakitTabloArray = null,
	kibleSaati = null,

	MY_ALARM_URI='my_alarm_uri',
	vibrationDuration = 1500,
	alarmHeader=false,
	alarmImsak=false,
	alarmGunes=false,
	alarmOgle=false,
	alarmIkindi=false,
	alarmAksam=false,
	alarmYatsi=false,

	alarmImsakValue=0,
	alarmGunesValue=0,
	alarmOgleValue=0,
	alarmIkindiValue=0,
	alarmAksamValue=0,
	alarmYatsiValue=0,
	MAX_ALARM_VALUE = 60,
	MIN_ALARM_VALUE = -60,

	SCROLL_STEP = 60,       // distance of moving scroll for each rotary event

	/**
	 * Alert popup.
	 *
	 * @memberof app
	 * @private
	 * @type {HTMLElement}
	 */
	alertPopup = document.getElementById('alert-popup');

	/**
	 * Exits the application.
	 *
	 * @memberof main
	 */
	function exit() {
		try {
			tizen.application.getCurrentApplication().exit();
		} catch (err) {
			console.error('Error: ', err);
		}
	}

	function setSpan(spanId, textArg)
	{
		var span = document.getElementById(spanId);

		while( span.firstChild ) {
			span.removeChild( span.firstChild );
		}
		span.appendChild( document.createTextNode(textArg) );
	}

	function initVars()
	{
		if (tizen.preference.exists('alarmHeader')) {
			alarmHeader = tizen.preference.getValue('alarmHeader');
		}
		if (tizen.preference.exists('alarmImsak')) {
			alarmImsak = tizen.preference.getValue('alarmImsak');
		}
		if (tizen.preference.exists('alarmGunes')) {
			alarmGunes = tizen.preference.getValue('alarmGunes');
		}
		if (tizen.preference.exists('alarmOgle')) {
			alarmOgle = tizen.preference.getValue('alarmOgle');
		}
		if (tizen.preference.exists('alarmIkindi')) {
			alarmIkindi = tizen.preference.getValue('alarmIkindi');
		}
		if (tizen.preference.exists('alarmAksam')) {
			alarmAksam = tizen.preference.getValue('alarmAksam');
		}
		if (tizen.preference.exists('alarmYatsi')) {
			alarmYatsi = tizen.preference.getValue('alarmYatsi');
		}
		if (tizen.preference.exists('alarmImsakValue')) {
			alarmImsakValue = tizen.preference.getValue('alarmImsakValue');
		}
		if (tizen.preference.exists('alarmGunesValue')) {
			alarmGunesValue = tizen.preference.getValue('alarmGunesValue');
		}
		if (tizen.preference.exists('alarmOgleValue')) {
			alarmOgleValue = tizen.preference.getValue('alarmOgleValue');
		}
		if (tizen.preference.exists('alarmIkindiValue')) {
			alarmIkindiValue = tizen.preference.getValue('alarmIkindiValue');
		}
		if (tizen.preference.exists('alarmAksamValue')) {
			alarmAksamValue = tizen.preference.getValue('alarmAksamValue');
		}
		if (tizen.preference.exists('alarmYatsiValue')) {
			alarmYatsiValue = tizen.preference.getValue('alarmYatsiValue');
		}
		if (tizen.preference.exists('vibrationDuration')) {
			vibrationDuration = tizen.preference.getValue('vibrationDuration');
		}
		if (tizen.preference.exists('currentLanguage')) {
			currentLanguage = tizen.preference.getValue('currentLanguage');
		}

		setSpan('versionSpanId', version);
	}

	function showNum(n) {
		return (n>0?'+':'') + n + ' ' + MY_LOCALE('mins');
	}

	function showChecked(c) {
		if(c==true)
			return ' checked';
		else
			return '';
	}

	function GetUlkelerFromWebSite() {
		if (currentLanguage === 'tr')
			initLocationUlkelerMenu(ulkeler);
		else
			initLocationUlkelerMenu(ulkeler_en);
		/*var xmlhttp = null;
        xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function() {
            //console.log('State:' + xmlhttp.readyState);

            if (xmlhttp.readyState == 4) {
                console.log('GetUlkelerFromWebSite State:' + xmlhttp.readyState);
                //alert(xmlhttp.responseText.length);
                //console.log(xmlhttp.responseText);
                try {
                	var ulkeler = JSON.parse(xmlhttp.responseText);

                	initLocationUlkelerMenu(ulkeler);
                }
                catch (e) {
					alert(xmlhttp.responseText);
				}
            } else {
                //alert(xmlhttp.responseText.count);
                //console.log(xmlhttp.responseText);
            }
        };
        xmlhttp.onerror = function(e) {
            console.log("onerror: " + xmlhttp.statusText);
        };

        xmlhttp.open("GET", "https://ezanvakti.emushaf.net/ulkeler");

        xmlhttp.send();*/
	}

	function GetBayramlarFromWebSite(ilId) {
		try
		{
			var isOnline = navigator.onLine;
			if(false==isOnline)
			{
				alert(MY_LOCALE('check_internet'));
				tau.changePage('settings');
				return;
			}
		}
		catch(e)
		{}
		
		var xmlhttp = null;
		xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {
			//console.log('State:' + xmlhttp.readyState);

			if (xmlhttp.readyState == 4) {
				console.log('GetBayramlarFromWebSite State:' + xmlhttp.readyState);
				//alert(xmlhttp.responseText.length);
				//console.log(xmlhttp.responseText);
				try{
					var bayramlar = JSON.parse(xmlhttp.responseText);

					initBayramMenu(true, bayramlar)
				}
				catch (e) {
					//alert(xmlhttp.responseText);
					console.log(xmlhttp.responseText + ' State:' + xmlhttp.readyState);
				}

			} else {
				//alert(xmlhttp.responseText.count);
				console.log(xmlhttp.responseText + ' State2:' + xmlhttp.readyState);
			}
		};
		xmlhttp.onerror = function(e) {
			alert(MY_LOCALE('try_again'));
			console.log("onerror: " + xmlhttp.statusText);
			tau.changePage('settings');
			return;
		};

		//xmlhttp.open("GET", "https://ezanvakti.emushaf.net/bayram?ilce=" + ilceId);
		xmlhttp.open("GET", "https://ezanvakti.emushaf.net/bayram-namazi/" + ilId);

		xmlhttp.send();
	}

	function GetIllerFromWebSite(ulkeId) {
		try
		{
			var isOnline = navigator.onLine;
			if(false==isOnline)
			{
				alert(MY_LOCALE('check_internet'));
				tau.changePage('settings');
				return;
			}
		}
		catch(e)
		{}
		
		var xmlhttp = null;
		xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {

			if (xmlhttp.readyState == 4) {
				//alert(xmlhttp.responseText.length);
				console.log('GetIllerFromWebSite State:' + xmlhttp.readyState);
				try{
					var iller = JSON.parse(xmlhttp.responseText);
					if(iller == null || xmlhttp.status != 200)
					{
						alert(MY_LOCALE('try_again'));
						tau.changePage('settings');
						return;
					}
					else
					{
						initLocationIllerMenu(iller);
					}
				}
				catch (e) {
					//console.log(xmlhttp.responseText + ' State:' + xmlhttp.readyState);
					alert(MY_LOCALE('try_again'));
					tau.changePage('settings');
					return;
				}
			} else {
				//alert(xmlhttp.responseText.count);
				console.log(' State in iller:' + xmlhttp.readyState);
			}
		};
		xmlhttp.onerror = function(e) {
			alert(MY_LOCALE('try_again'));
			console.log("onerror: " + xmlhttp.statusText);
			tau.changePage('settings');
			return;
		};

		xmlhttp.open("GET", "https://ezanvakti.emushaf.net/sehirler?ulke=" + ulkeId);

		xmlhttp.send();
	}

	function GetIlcelerFromWebSite(sehirId) {
		try
		{
			var isOnline = navigator.onLine;
			if(false==isOnline)
			{
				alert(MY_LOCALE('check_internet'));
				tau.changePage('settings');
				return;
			}
		}
		catch(e)
		{}
		
		var xmlhttp = null;
		xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {
			//console.log('State:' + xmlhttp.readyState);

			if (xmlhttp.readyState == 4) {
				console.log('GetIlcelerFromWebSite State:' + xmlhttp.readyState);
				//alert(xmlhttp.responseText.length);
				console.log(xmlhttp.responseText);
				try {
					var ilceler = JSON.parse(xmlhttp.responseText);
					if(ilceler == null || xmlhttp.status != 200)
					{
						alert(MY_LOCALE('try_again'));
						tau.changePage('settings');
						return;
					}
					else
					{
						initLocationIlcelerMenu(ilceler);
					}
				}
				catch (e) {
					console.log(xmlhttp.responseText + ' State:' + xmlhttp.readyState);
				}

			} else {
				//alert(xmlhttp.responseText.count);
				console.log(xmlhttp.responseText + ' State2:' + xmlhttp.readyState);
			}
		};
		xmlhttp.onerror = function(e) {
			alert(MY_LOCALE('try_again'));
			console.log("onerror: " + xmlhttp.statusText);
			tau.changePage('settings');
			return;
		};

		xmlhttp.open("GET", "https://ezanvakti.emushaf.net/ilceler?sehir=" + sehirId);

		xmlhttp.send();
	}

	function GetVakitlerFromWebSite(ilceId) {
		try
		{
			var isOnline = navigator.onLine;
			if(false==isOnline)
			{
				alert(MY_LOCALE('check_internet'));
				return;
			}
		}
		catch(e)
		{}
		
		var xmlhttp = null;
		xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function() {

			if (xmlhttp.readyState == 4) {
				console.log('GetVakitlerFromWebSite State:' + xmlhttp.readyState);
				//alert(xmlhttp.responseText.length);
				//console.log(xmlhttp.responseText);
				var vakitler = JSON.parse(xmlhttp.responseText);
				if(vakitler == null || xmlhttp.status != 200)
				{
					alert(MY_LOCALE('try_again'));
					tau.changePage('settings');
					return;
				}
				else
				{	
					console.log('write to file');
					storeVakitler(vakitler);
	
					clearAlarms();
	
					tau.changePage("main");
				}
			} else {
				console.log(xmlhttp.responseText + ' State3:' + xmlhttp.readyState);
			}
		};
		xmlhttp.onerror = function(e) {
			alert(MY_LOCALE('try_again'));
			console.log("onerror: " + xmlhttp.statusText);
			tau.changePage('settings');
			return;
		};

		xmlhttp.open("GET", "https://ezanvakti.emushaf.net/vakitler?ilce=" + ilceId);

		xmlhttp.send();
	}

	function parseBayramlar(ilbayramlar)
	{
		var ilceId = tizen.preference.getValue('pref_ilceid');
		for(var i = 0; i < ilbayramlar.length; i++)	
		{
			if(ilbayramlar[i].ilceBilgisi.IlceID == ilceId)
			{
				return ilbayramlar[i].bayramNamazVakti;
			}
		}

		return null;
	}

	function initBayramMenu(contentLoaded, bayramlar) {
		bayramListEl.innerHTML = '';
		if (contentLoaded == false) {
			bayramListEl.innerHTML = '<p>' + MY_LOCALE('wait') + '</p>';

			if (tizen.preference.exists('pref_ilid') && tizen.preference.exists('pref_ilceid')) {
				var ilId = tizen.preference.getValue('pref_ilid');
				GetBayramlarFromWebSite(ilId);
			} else {
				bayramListEl.innerHTML = '<p>' + MY_LOCALE('select_loc_alert') + '</p>';
				return;
			}
		} else {
			///////////
			if (bayramlar != null) {

				var myBayram = parseBayramlar(bayramlar);
				if(myBayram == null)
					return;

				var newElement = document.createElement('LI');

				newElement.classList.add('ul-li-static');

				newElement.innerHTML = MY_LOCALE('ramazan') + '<div class="li-text-sub">' +
				myBayram.RamazanBayramNamaziTarihi + '-' + myBayram.RamazanBayramNamaziSaati + '</div>';

				bayramListEl.appendChild(newElement);

				///////////////
				newElement = document.createElement('LI');

				newElement.classList.add('ul-li-static');

				newElement.innerHTML = MY_LOCALE('kurban') + '<div class="li-text-sub">' +
				myBayram.KurbanBayramNamaziTarihi + '-' + myBayram.KurbanBayramNamaziSaati + '</div>';

				bayramListEl.appendChild(newElement);
			}
		}

	}

	function initLocationSettinsMenu() {
		locationSettingsListEl.innerHTML = ''; // empty
		///////////
		var newElement = document.createElement('LI');

		newElement.classList.add('ul-li-static');
		var ulkeStr = '---';

		if (tizen.preference.exists('pref_ulkename')) {
			ulkeStr = tizen.preference.getValue('pref_ulkename');
		}

		newElement.innerHTML =  '' + MY_LOCALE('ulke') + '' + '<div class="li-text-sub">' +
		'' + ulkeStr + '' + '</div>';

		newElement.addEventListener('click', function onClick() {
			var element = document.getElementById("settings-location-ulke");
			tau.changePage(element);
		});

		locationSettingsListEl.appendChild(newElement);
		///////////////
		var newElement2 = document.createElement('LI');

		newElement2.classList.add('ul-li-static');
		var ilStr = '---';

		if (tizen.preference.exists('pref_ilname')) {
			ilStr = tizen.preference.getValue('pref_ilname');
		}

		newElement2.innerHTML = MY_LOCALE('il') + '<div class="li-text-sub">' +
		ilStr + '</div>';

		// newElement2.addEventListener("click", alertSelectCountry, false); //where func is your function name

		newElement2.addEventListener('click', function onClick() {
			alert(MY_LOCALE('select_country'));
			tau.changePage('settings-location-ulke');
		});

		locationSettingsListEl.appendChild(newElement2);
		////////////
		var newElement3 = document.createElement('LI');

		newElement3.classList.add('ul-li-static');
		var ilceStr = '---';

		if (tizen.preference.exists('pref_ilcename')) {
			ilceStr = tizen.preference.getValue('pref_ilcename');
		}
		newElement3.innerHTML = MY_LOCALE('ilce') + '<div class="li-text-sub">' +
		ilceStr + '</div>';

		newElement3.addEventListener('click', function onClick() {
			alert(MY_LOCALE('select_country'));
			tau.changePage('settings-location-ulke');
		});

		locationSettingsListEl.appendChild(newElement3);
	}

	function initLocationUlkelerMenu(ulkeler) {
		locationSettingsUlkelerListEl.innerHTML = ''; // empty

		if (ulkeler == null) {
			var newElement = document.createElement('LI');

			newElement.classList.add('li-has-radio');
			newElement.innerHTML = '<label> --- <input type="radio" name="ulkeid" value="0"/>' + '</label>';

			locationSettingsUlkelerListEl.appendChild(newElement);
		} else {
			var myUlkeId = 2; //Default turkey
			if (tizen.preference.exists('pref_ulkeid')) {
				myUlkeId = tizen.preference.getValue('pref_ulkeid');
			}

			for (var i = 0; i < ulkeler.length; i++) {
				var newElement = document.createElement('LI');

				var checkedStr = '';

				if (ulkeler[i].UlkeID == myUlkeId) {
					checkedStr = 'checked="checked"';
					//newElement.scrollIntoView(true);
				}

				var yerStr = '';
				if (currentLanguage === 'tr')
					yerStr = ulkeler[i].UlkeAdi;
				else
					yerStr = ulkeler[i].UlkeAdiEn;

				newElement.classList.add('li-has-radio');
				newElement.innerHTML = '<label>' + yerStr + ' <input type="radio" name="ulkeid" value="' + ulkeler[i].UlkeID + '" ' + checkedStr + '/>' + '</label>';

				locationSettingsUlkelerListEl.appendChild(newElement);
			}

			//ulkelerLoadedBefore = true;
		}

		//var listv = tau.widget.Listview(locationSettingsUlkelerListEl);
		//listv.refresh();

		//locationSettingsUlkelerListEl.scrollTop = 29;
	}


	function initLocationIllerMenu(iller) {
		locationSettingsIllerListEl.innerHTML = ''; // empty

		if (iller == null) {
			var newElement = document.createElement('LI');

			newElement.classList.add('li-has-radio');
			newElement.innerHTML = '<label> --- <input type="radio" name="sehirid" value="0"/>' + '</label>';

			locationSettingsIllerListEl.appendChild(newElement);
		} else {
			for (var i = 0; i < iller.length; i++) {
				var newElement = document.createElement('LI');

				var yerStr = '';
				if (currentLanguage === 'tr')
					yerStr = iller[i].SehirAdi;
				else
					yerStr = iller[i].SehirAdiEn;

				newElement.classList.add('li-has-radio');
				newElement.innerHTML = '<label>' + yerStr + ' <input type="radio" name="sehirid" value="' + iller[i].SehirID + '"/>' + '</label>';

				locationSettingsIllerListEl.appendChild(newElement);
			}
		}
	}

	function initLocationIlcelerMenu(ilceler) {
		locationSettingsIlcelerListEl.innerHTML = ''; // empty

		if (ilceler == null) {
			var newElement = document.createElement('LI');

			newElement.classList.add('li-has-radio');
			newElement.innerHTML = '<label> --- <input type="radio" name="ilceid" value="0"/>' + '</label>';

			locationSettingsIlcelerListEl.appendChild(newElement);
		} else {
			for (var i = 0; i < ilceler.length; i++) {
				var newElement = document.createElement('LI');

				var yerStr = '';
				if (currentLanguage === 'tr')
					yerStr = ilceler[i].IlceAdi;
				else
					yerStr = ilceler[i].IlceAdiEn;

				newElement.classList.add('li-has-radio');
				newElement.innerHTML = '<label>' + yerStr + ' <input type="radio" name="ilceid" value="' + ilceler[i].IlceID + '"/>' + '</label>';

				locationSettingsIlcelerListEl.appendChild(newElement);
			}
		}
	}

	/**
	 * Displays popup with alert message.
	 *
	 * @memberof app
	 * @private
	 * @param {string} message
	 */
	function showAlert(message) {
		alertPopup.querySelector('#message').innerHTML = message;
		tau.openPopup(alertPopup);
		alertPopup.addEventListener('click', function onClick() {
			tau.closePopup(alertPopup);
		});
	}

	function storeVakitler(jsonData) {
		var i = 0;
		if (jsonData == null) {
			console.log("ERROR: jsonData is null! ");
			return;
		}
		console.log("jsonData written with item length: " + jsonData.length);
		for (var i = 0; i < jsonData.length && i < 31; i++) {
			tizen.preference.setValue('vakitData' + i, JSON.stringify(jsonData[i]));
		}
		//var deneme = '{"ali":"1", "veli":"2"}';
		exportData(JSON.stringify(jsonData));
		//var deneme = {"Aksam":"19:40","AyinSekliURL":"https://namazvakti.diyanet.gov.tr/images/sd5.gif","Gunes":"05:55","GunesBatis":"19:33","GunesDogus":"06:02","HicriTarihKisa":"28.8.1441","HicriTarihUzun":"28 Şaban 1441","Ikindi":"16:37","Imsak":"04:23","KibleSaati":"12:08","MiladiTarihKisa":"21.04.2020","MiladiTarihKisaIso8601":"21.04.2020","MiladiTarihUzun":"21 Nisan 2020 Salı","MiladiTarihUzunIso8601":"2020-04-21T00:00:00.0000000+03:00","Ogle":"12:52","Yatsi":"21:05"};
		//var myJSON = JSON.stringify(deneme);
	}


	var fileContent = null;

	function errorCallback(error)
	{
		console.log("An error occurred, during file deletion: " + error.message);
		saveData();
	}

	function successCallback(path)
	{
		console.log("The file has been deleted, path to the parent of deleted file: " + path);
		saveData();
	}

	function saveData()
	{
		try {
			tizen.filesystem.resolve("documents", function(dir) {
				var saveFileName = 'pt_vakitler.json';

				var newFile = dir.createFile(saveFileName);
				if(newFile != null)
				{
					newFile.openStream(
							"w",
							function(fs) {
								fs.write(fileContent);
								fs.close();
							},
							function(e) {
								console.log("Error " + e.message);
							}, "UTF-8");
				}
			});
		} catch (e) {
			console.log('Exception for write: ' + e.message);
		}
	}
	// export data (export_data) to filesystem (export_data should be JSON)
	function exportData(export_data) {

		/*var platformVersion=tizen.systeminfo.getCapabilities().platformVersion;
		 console.log("platformVersion:" + platformVersion);
		 var v = parseInt(platformVersion, 10);
		 console.log("v:" + v);

		 if(v<5)
		 {*/
		fileContent = export_data;

		try
		{
			tizen.filesystem.deleteFile("documents/pt_vakitler.json", successCallback, errorCallback);
		}
		catch (error)
		{
			console.log("File cannot be deleted: " + error.message);
		}

		/* 
		 }
		 else
		 {
			 // Opening file for write - file is created if not exists, 
			 // otherwise existing file is truncated. 
			 var fileHandleWrite = tizen.filesystem.openFile("documents/pt_vakitler.json", "w");
			 console.log("File opened for writing");
			 fileHandleWrite.writeString(export_data);
			 console.log("String has been written to the file");
			 fileHandleWrite.close();
		 }*/

	}

	function getVakitlerFromLocal() {
		console.log("getVakitlerFromLocal ");
		var i = 0;
		var currentVakitStr;
		var key = '';
		var vakitler = [];

		for (var i = 0; i < 31; i++) {
			key = 'vakitData' + i;

			if (tizen.preference.exists(key)) {
				var currentVakitStr = tizen.preference.getValue(key);
				vakitler.push(JSON.parse(currentVakitStr));
				//console.log('Preference key' + i + ' is: ' + currentVakitStr);
			}
		}

		console.log('vakitler array length:' + vakitler.length);
		if(vakitler.length > 0)
		{
			setSpan('lastDataSpanId', vakitler[vakitler.length-1].MiladiTarihKisaIso8601);
		}
		return vakitler;
	}

	function IntToStr(hourValue) {
		if (hourValue == 0)
			return '00';
		else if (hourValue < 10)
			return '0' + hourValue;
		else
			return '' + hourValue;
	}

	function GetNextVakitRow(vakitTabloArray) // Imsak=0,...Yatsi=5
	{
		//var today = new Date();
		var today = tizen.time.getCurrentDateTime();
		//var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
		var timeString = IntToStr(today.getHours()) + ':' + IntToStr(today.getMinutes()) + ':00';
		var todayTime = new Date('1970-01-02T' + timeString + 'Z');

		if (vakitTabloArray != null && vakitTabloArray.length > 6) {
			timeString = vakitTabloArray[1][1] + ':00';
			var imsakTime = new Date('1970-01-02T' + timeString + 'Z');
			timeString = vakitTabloArray[2][1] + ':00';
			var gunesTime = new Date('1970-01-02T' + timeString + 'Z');
			timeString = vakitTabloArray[3][1] + ':00';
			var ogleTime = new Date('1970-01-02T' + timeString + 'Z');
			timeString = vakitTabloArray[4][1] + ':00';
			var ikindiTime = new Date('1970-01-02T' + timeString + 'Z');
			timeString = vakitTabloArray[5][1] + ':00';
			var aksamTime = new Date('1970-01-02T' + timeString + 'Z');
			timeString = vakitTabloArray[6][1] + ':00';
			var yatsiTime = new Date('1970-01-02T' + timeString + 'Z');

			if (todayTime.getTime() > yatsiTime.getTime()) {
				return 5;
			} else if (todayTime.getTime() > aksamTime.getTime()) {
				return 4;
			} else if (todayTime.getTime() > ikindiTime.getTime()) {
				return 3;
			} else if (todayTime.getTime() > ogleTime.getTime()) {
				return 2;
			} else if (todayTime.getTime() > gunesTime.getTime()) {
				return 1;
			} else if (todayTime.getTime() > imsakTime.getTime()) {
				return 0;
			} else {
				return 5;
			}
		}

		return 4;
	}

	function prepareMainUI() {
		var vakitler = null;
		console.log('prepareMainUI');

		if (tizen.preference.exists('pref_ilceid') == false) 
		{
			ShowVakitler(false, null, 0);
		} 
		else if ((vakitler = getVakitlerFromLocal()) == null) 
		{
			var ilceId = tizen.preference.getValue('pref_ilceid');

			ShowMainScreenError(MY_LOCALE('loading'));

			if(ilceId != null)
				GetVakitlerFromWebSite(ilceId);

			// lokalden al tekrardan goster!!!!
			ShowVakitler(false, null, 0+gunAdd);
		} 
		else 
		{
			ShowVakitler(true, vakitler, 0+gunAdd);

			if(fromAlarm == true)
			{
				// do alarm setting again.
				SetupAlarms(false);

				if( vibrationDuration > 0 )
				{
					setTimeout(function() {
						navigator.vibrate(vibrationDuration);
						showAlert('' + fromOp);
					}, 100);
				}

				setTimeout(function() {
					exit();
				}, 3200);
			}
		}
	}

	function ShowMainScreenError(errorMsg)
	{
		vakitTableError.style.display = "table";
		vakitTableOk.style.display = "none";

		// set title
		var title = MY_LOCALE('title');

		var titleEl = mainPage.querySelector('.ui-header').querySelector('.ui-title');
		if (titleEl != null)
			titleEl.innerText = title;


		var errorDiv = vakitTableError.querySelector('#errorScreen');
		if (errorDiv != null)
			errorDiv.innerText = errorMsg;
	}

	function ShowMainScreenOk( imsak, gunes, ogle, ikindi, aksam, yatsi, activeTime, miladiDateArg, miladiDayArg, hicriDateArg )
	{
		vakitTableError.style.display = "none";
		vakitTableOk.style.display = "table";

		var title = MY_LOCALE('title');
		if (tizen.preference.exists('pref_ilceid') == true) {
			title = tizen.preference.getValue('pref_ilcename');
		}
		var titleEl = mainPage.querySelector('.ui-header').querySelector('.ui-title');
		if (titleEl != null)
			titleEl.innerText = title;

		imsakTime.innerText = imsak;
		gunesTime.innerText = gunes;
		ogleTime.innerText = ogle;
		ikindiTime.innerText = ikindi;
		aksamTime.innerText = aksam;
		yatsiTime.innerText = yatsi;

		miladiDate.innerText = miladiDateArg;
		miladiDay.innerText = miladiDayArg;
		hicriDate.innerText = hicriDateArg;

		var rows = vakitTableOk.querySelector("#month-table").getElementsByTagName("tr");

		console.log('activeTime :' + activeTime);

		for(var i = 0; i < rows.length; i++) {
			if( i == activeTime )
			{
				rows[i].getElementsByTagName("td")[0].className = "inactive";
				rows[i].getElementsByTagName("td")[1].className = "selected";
			}
			else
			{
				rows[i].getElementsByTagName("td")[0].className = "inactive";
				rows[i].getElementsByTagName("td")[1].className = "today";
			}
		}
	} 

	function ShowVakitler(dbOK, vakitler, gun) {
		console.log('ShowVakitler gun:' + gun);

		// sil
//		var today2 = new Date();
//		console.log('today date:' + today2.getDate() + 'month' + today2.getMonth());
//		var vakitDay2 = new Date('2020-08-09T00:00:00.0000000+03:00');
//		console.log('today date:' + vakitDay2.getDate() + 'month' + vakitDay2.getMonth());
//		var kisaTarihISOString = "09.08.2020"; 

//		var dateParts = kisaTarihISOString.split(".");

//		var vakitDay3 = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
//		console.log('today date:' + vakitDay3.getDate() + 'month' + vakitDay3.getMonth());
		//

		if (dbOK == true) {
			//var today = new Date();
			//console.log('today date:' + today.getDate() + 'month' + today.getMonth());
			var today = tizen.time.getCurrentDateTime();
			if(gun != 0)
			{
				today = today.addDuration(new tizen.TimeDuration(gun, 'DAYS'));
			}

			console.log('Current time / date is ' + today.toLocaleString());

			for (var vakit in vakitler) {
				//var vakitDay = new Date(vakitler[vakit].MiladiTarihUzunIso8601);
				var kisaTarihISOString = vakitler[vakit].MiladiTarihKisaIso8601; 
				var dateParts = kisaTarihISOString.split(".");
				//var vakitDay = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
				var vakitDay = new tizen.TZDate(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

				if (vakitDay.getDate() == today.getDate() &&
						vakitDay.getMonth() == today.getMonth() &&
						vakitDay.getFullYear() == today.getFullYear()) {

					vakitTabloArray = new Array();

					vakitTabloArray.push(['Miladi', vakitler[vakit].MiladiTarihUzun]);
					vakitTabloArray.push(['Imsak', vakitler[vakit].Imsak]);
					vakitTabloArray.push(['Gunes', vakitler[vakit].Gunes]);
					vakitTabloArray.push(['Ogle', vakitler[vakit].Ogle]);
					vakitTabloArray.push(['Ikindi', vakitler[vakit].Ikindi]);
					vakitTabloArray.push(['Aksam', vakitler[vakit].Aksam]);
					vakitTabloArray.push(['Yatsi', vakitler[vakit].Yatsi]);
					vakitTabloArray.push(['Hicri', vakitler[vakit].HicriTarihUzun]);
					kibleSaati = vakitler[vakit].KibleSaati;
					break;
				}
			}
		}

		if (dbOK == false) 
		{
			ShowMainScreenError(MY_LOCALE('select_loc_alert'));
		} 
		else if (vakitTabloArray == null || vakitTabloArray.length == 0) 
		{
			ShowMainScreenError(MY_LOCALE('vakitler_alinamadi'));
			// ya bir aylık veri bitti ya da baska problem var. tekrar iste

			var ilceId = tizen.preference.getValue('pref_ilceid');

			if(ilceId != null)
				GetVakitlerFromWebSite(ilceId);
		} 
		else 
		{ 
			var n = vakitTabloArray[0][1].split(" "); // 23 Nisan 2020 Perşembe
			var dayString = GET_TR_DAY(n[3]);
			var dateString = n[0] + ' ' + GET_TR_MONTH(n[1]) + ' ' + n[2];

			// getNextVakit
			var nextVakitRow = GetNextVakitRow(vakitTabloArray); // Imsak=0,...Yatsi=5

			ShowMainScreenOk(vakitTabloArray[1][1], vakitTabloArray[2][1],vakitTabloArray[3][1],vakitTabloArray[4][1],vakitTabloArray[5][1], vakitTabloArray[6][1],
					nextVakitRow, dateString, dayString, vakitTabloArray[7][1]);

		}

	}

	function clearAlarms()
	{
		// Gets the current application ID.
		var appId = tizen.application.getCurrentApplication().appInfo.id;

		tizen.alarm.removeAll();

		alarmHeader = false;
		alarmImsak = false;
		alarmGunes = false;
		alarmOgle = false;
		alarmIkindi = false;
		alarmAksam = false;
		alarmYatsi = false;

		tizen.preference.setValue('alarmHeader', alarmHeader);
		tizen.preference.setValue('alarmImsak', alarmImsak);
		tizen.preference.setValue('alarmGunes', alarmGunes);
		tizen.preference.setValue('alarmOgle', alarmOgle);
		tizen.preference.setValue('alarmIkindi', alarmIkindi);
		tizen.preference.setValue('alarmAksam', alarmAksam);
		tizen.preference.setValue('alarmYatsi', alarmYatsi);
	}

	var elScroller;

	// rotary event handler
	function rotaryEventHandler(e) {
		if (elScroller) {
			if (e.detail.direction === "CW") { // Right direction
				elScroller.scrollTop += SCROLL_STEP;
			} else if (e.detail.direction === "CCW") { // Left direction
				elScroller.scrollTop -= SCROLL_STEP;
			}
		}
	};

	function isVibrateChecked(vibrateArg)
	{
		if(vibrateArg == vibrationDuration)
		{
			return " checked";
		}
		else
		{
			return "";
		}
	}

	function onLangSelected(lang) {
		currentLanguage = lang;
		tizen.preference.setValue('currentLanguage', currentLanguage);
		translateTexts();
	}

	/**
	 * Creates TAU Selector and bind it's events.
	 *
	 * @memberof app
	 * @private
	 */
	function bindSelectorEvents() {
		mainPage = document.querySelector('#main');
		//elSelector = mainPage.querySelector('#selector'),
		var handler = document.querySelector('#settings-btn');
		//popup = mainPage.querySelector('#selector-popup'),
		//selector = null;

		var locationMenuPage = document.querySelector('#settings-location'); //tau.widget.Page(document.getElementById("settings-location"));
		var locationUlkeMenuPage = document.querySelector('#settings-location-ulke');
		var ulkeSelector = locationUlkeMenuPage.querySelector('#settings-location-content-ulke');
		var locationIlMenuPage = document.querySelector('#settings-location-il');
		var ilSelector = locationIlMenuPage.querySelector('#settings-location-content-il');
		var locationIlceMenuPage = document.querySelector('#settings-location-ilce');
		var ilceSelector = locationIlceMenuPage.querySelector('#settings-location-content-ilce');
		var bayramMenuPage = document.querySelector('#bayramvakitleri');
		var notificationsMenuPage = document.querySelector('#settings-notification');
		var kibleMenuPage = document.querySelector('#settings-kible');
		var dilCheckBoxTurkish = document.querySelector('#lang-radio-turkish');
		var dilCheckBoxEnglish = document.querySelector('#lang-radio-english');
		dilCheckBoxTurkish.addEventListener('click', function onLangClick() {
			onLangSelected('tr');
		});
		dilCheckBoxEnglish.addEventListener('click', function onLangClick2() {
			onLangSelected('en');
		});       

		vakitTableError.addEventListener('click', function onTableErrorClick() {
			clickHandler();
		});       

		if (currentLanguage === 'tr')
		{
			dilCheckBoxTurkish.checked = true;
			dilCheckBoxEnglish.checked = false;
		}
		else {
			dilCheckBoxTurkish.checked = false;
			dilCheckBoxEnglish.checked = true;
		}

		document.addEventListener("pagebeforeshow", function pageScrollHandler(e) {
			var page = e.target;
			elScroller = page.querySelector(".ui-scroller");          

			// register rotary event.
			document.addEventListener("rotarydetent", rotaryEventHandler, false);

			// unregister rotary event
			page.addEventListener("pagebeforehide", function pageHideHanlder() {
				page.removeEventListener("pagebeforehide", pageHideHanlder, false);
				document.removeEventListener("rotarydetent", rotaryEventHandler, false);
			}, false);
		}, false);

		function clickHandler() {
			//tau.openPopup(popup);
			var element = document.getElementById("settings");
			tau.changePage(element);
		}

		mainPage.addEventListener('pagebeforeshow', function onPageBeforeShow() {
			// selector items radius
			console.log('pagebeforeshow');
			var radius = window.innerHeight / 2 * 0.8;
			//console.log('pagebeforeshow1');
			// checks if TAU supports circle shape
			if (tau.support.shape.circle) {
				//console.log('pagebeforeshow2');
				handler.addEventListener('click', clickHandler);
			}
			prepareMainUI();
		});


		mainPage.addEventListener('pagebeforehide', function onPageBeforeHide() {
			console.log('pagebeforehide');
			// checks if TAU supports circle shape
			if (tau.support.shape.circle) {
				handler.removeEventListener('click', clickHandler);

			}

			//console.log('pagebeforehide-end');
		});


		ulkeSelector.addEventListener('click', function onUlkeClick() {
			// only available option in Selector is clear
			console.log('Ulke secildi.');
			var seciliulke = ulkeSelector.querySelector('input[name = "ulkeid"]:checked');
			var ulkeId = seciliulke.value;
			var ulkeName = seciliulke.parentNode.innerText;

			console.log(ulkeId + '>' + ulkeName);
			tizen.preference.setValue('pref_ulkeid', ulkeId);
			tizen.preference.setValue('pref_ulkename', ulkeName);

			GetIllerFromWebSite(ulkeId);
			locationSettingsIllerListEl.innerHTML = '<p>' + MY_LOCALE('wait') + '</p>';

			var element = document.getElementById("settings-location-il");
			tau.changePage(element);

		});

		ilSelector.addEventListener('click', function onIlClick() {
			// only available option in Selector is clear
			console.log('Il secildi.');
			var seciliil = ilSelector.querySelector('input[name = "sehirid"]:checked');
			var ilId = seciliil.value;
			var ilName = seciliil.parentNode.innerText;

			console.log(ilId + '>' + ilName);
			tizen.preference.setValue('pref_ilid', ilId);
			tizen.preference.setValue('pref_ilname', ilName);

			GetIlcelerFromWebSite(ilId);
			locationSettingsIlcelerListEl.innerHTML = '<p>' + MY_LOCALE('wait') + '</p>';

			var element = document.getElementById("settings-location-ilce");
			tau.changePage(element);
		});

		ilceSelector.addEventListener('click', function onIlceClick() {
			// only available option in Selector is clear
			console.log('Ilce secildi.');
			var seciliilce = ilceSelector.querySelector('input[name = "ilceid"]:checked');
			var ilceId = seciliilce.value;
			var ilceName = seciliilce.parentNode.innerText;

			console.log(ilceId + '>' + ilceName);
			tizen.preference.setValue('pref_ilceid', ilceId);
			tizen.preference.setValue('pref_ilcename', ilceName);
			
			gunAdd = 0;
			GetVakitlerFromWebSite(ilceId);

			//clearAlarms();

			//tau.changePage("main");
		});

		locationMenuPage.addEventListener('pagebeforeshow', function onPageLocBeforeShow() {
			// checks if TAU supports circle shape
			console.log('onPageLocationMenuBeforeShow');
			initLocationSettinsMenu();
		});

		locationUlkeMenuPage.addEventListener('pagebeforeshow', function onPageLocBeforeShow() {
			// checks if TAU supports circle shape
			if (ulkelerLoadedBefore == false) {
				locationSettingsUlkelerListEl.innerHTML = '<p>' + MY_LOCALE('wait') + '</p>';
				// waitt
				GetUlkelerFromWebSite();
			}

		});

		bayramMenuPage.addEventListener('pagebeforeshow', function onPageBayramBeforeShow() {
			// checks if TAU supports circle shape
			console.log('onPageBayramBeforeShow');
			initBayramMenu(false, null);
		});

		notificationsMenuPage.addEventListener('pagebeforeshow', function onPageNotiBeforeShow() {
			//locationSettingsNotificationsListEl.innerHTML = '<p>' + MY_LOCALE('wait') + '</p>';
			console.log('onPageNotiBeforeShow');

			locationSettingsNotificationsListEl.innerHTML = ""; // empty it

			if (!tizen.preference.exists('pref_ilceid')) 
			{
				locationSettingsNotificationsListEl.innerHTML = MY_LOCALE('select_loc_alert');
				return;
			}
			else
			{
				var newElement = document.createElement('LI');
				newElement.innerHTML = ''  + 
				'<div class="outeralarm">' +
				'<div class="outeralarm"><label class="checkbox-label"><input type="checkbox" id="alarmCheckHeader"'+showChecked(alarmHeader)+'>'+MY_LOCALE('all')+'</input></label></div>' +
				'</div>';
				locationSettingsNotificationsListEl.appendChild(newElement);

				newElement = document.createElement('LI');
				//newElement.classList.add('ul-li-static');
				newElement.innerHTML = ''  + 
				'<div class="outeralarm">' +
				'<div class="outeralarm"><label class="checkbox-label"><input type="checkbox" id="alarmCheckImsak"'+showChecked(alarmImsak)+'>'+MY_LOCALE('Imsak')+'</input></label></div>' +
				'<div class="inneralarm"><button class="alarmSetBtn" id="alarmButtonNImsak">-</button></div>' +
				'<div class="inneralarm"><button class="alarmSetBtn" id="alarmButtonPImsak">+</button></div>' +
				'<div class="inneralarm"><span id="alarmSpanImsak">'+showNum(alarmImsakValue)+'</span></div>' +
				'</div>';
				locationSettingsNotificationsListEl.appendChild(newElement);

				newElement = document.createElement('LI');
				newElement.innerHTML = ''  + 
				'<div class="outeralarm">' +
				'<div class="outeralarm"><label class="checkbox-label"><input type="checkbox" id="alarmCheckGunes"'+showChecked(alarmGunes)+'>'+MY_LOCALE('Gunes')+'</input></label></div>' +
				'<div class="inneralarm"><button class="alarmSetBtn" id="alarmButtonNGunes">-</button></div>' +
				'<div class="inneralarm"><button class="alarmSetBtn" id="alarmButtonPGunes">+</button></div>' +
				'<div class="inneralarm"><span id="alarmSpanGunes">'+showNum(alarmGunesValue)+'</span></div>' +
				'</div>';
				locationSettingsNotificationsListEl.appendChild(newElement);

				newElement = document.createElement('LI');
				newElement.innerHTML = ''  + 
				'<div class="outeralarm">' +
				'<div class="outeralarm"><label class="checkbox-label"><input type="checkbox" id="alarmCheckOgle"'+showChecked(alarmOgle)+'>'+MY_LOCALE('Ogle')+'</input></label></div>' +
				'<div class="inneralarm"><button class="alarmSetBtn" id="alarmButtonNOgle">-</button></div>' +
				'<div class="inneralarm"><button class="alarmSetBtn" id="alarmButtonPOgle">+</button></div>' +
				'<div class="inneralarm"><span id="alarmSpanOgle">'+showNum(alarmOgleValue)+'</span></div>' +
				'</div>';
				locationSettingsNotificationsListEl.appendChild(newElement);

				newElement = document.createElement('LI');
				newElement.innerHTML = ''  + 
				'<div class="outeralarm">' +
				'<div class="outeralarm"><label class="checkbox-label"><input type="checkbox" id="alarmCheckIkindi"'+showChecked(alarmIkindi)+'>'+MY_LOCALE('Ikindi')+'</input></label></div>' +
				'<div class="inneralarm"><button class="alarmSetBtn" id="alarmButtonNIkindi">-</button></div>' +
				'<div class="inneralarm"><button class="alarmSetBtn" id="alarmButtonPIkindi">+</button></div>' +
				'<div class="inneralarm"><span id="alarmSpanIkindi">'+showNum(alarmIkindiValue)+'</span></div>' +
				'</div>';
				locationSettingsNotificationsListEl.appendChild(newElement);

				newElement = document.createElement('LI');
				newElement.innerHTML = ''  + 
				'<div class="outeralarm">' +
				'<div class="outeralarm"><label class="checkbox-label"><input type="checkbox" id="alarmCheckAksam"'+showChecked(alarmAksam)+'>'+MY_LOCALE('Aksam')+'</input></label></div>' +
				'<div class="inneralarm"><button class="alarmSetBtn" id="alarmButtonNAksam">-</button></div>' +
				'<div class="inneralarm"><button class="alarmSetBtn" id="alarmButtonPAksam">+</button></div>' +
				'<div class="inneralarm"><span id="alarmSpanAksam">'+showNum(alarmAksamValue)+'</span></div>' +
				'</div>';
				locationSettingsNotificationsListEl.appendChild(newElement);

				newElement = document.createElement('LI');
				newElement.innerHTML = ''  + 
				'<div class="outeralarm">' +
				'<div class="outeralarm"><label class="checkbox-label"><input type="checkbox" id="alarmCheckYatsi"'+showChecked(alarmYatsi)+'>'+MY_LOCALE('Yatsi')+'</input></label></div>' +
				'<div class="inneralarm"><button class="alarmSetBtn" id="alarmButtonNYatsi">-</button></div>' +
				'<div class="inneralarm"><button class="alarmSetBtn" id="alarmButtonPYatsi">+</button></div>' +
				'<div class="inneralarm"><span id="alarmSpanYatsi">'+showNum(alarmYatsiValue)+'</span></div>' +
				'</div>';
				locationSettingsNotificationsListEl.appendChild(newElement);

				newElement = document.createElement('UL');
				//newElement.classList.add('li-has-radio-alarm');
				newElement.innerHTML = ''  +
				'<p>'+MY_LOCALE('vibration')+':</p>' +
				'<input type="radio" id="vibrateNone" name="vibration" value="0"' + isVibrateChecked(0) + '>'+
				'<label for="vibrateNone">'+MY_LOCALE('off')+'</label><br>'+
				'<input type="radio" id="vibrateNormal" name="vibration" value="1500"' + isVibrateChecked(1500) + '>'+
				'<label for="vibrateNormal">'+MY_LOCALE('normal')+'</label><br>'+
				'<input type="radio" id="vibrateLong" name="vibration" value="2500"' + isVibrateChecked(2500) + '>'+
				'<label for="vibrateLong">'+MY_LOCALE('long')+'</label><br>';
				locationSettingsNotificationsListEl.appendChild(newElement);
			}

		});

		notificationsMenuPage.addEventListener('click', function onNotifyClick(e) {
			// only available option in Selector is clear
			console.log('alarm secildi.');
			console.log('target:' + e.target.id); 

			var alarmCheckHeader = locationSettingsNotificationsListEl.querySelector('input[id = "alarmCheckHeader"]');
			var alarmCheckImsak = locationSettingsNotificationsListEl.querySelector('input[id = "alarmCheckImsak"]');
			var alarmCheckGunes = locationSettingsNotificationsListEl.querySelector('input[id = "alarmCheckGunes"]');
			var alarmCheckOgle = locationSettingsNotificationsListEl.querySelector('input[id = "alarmCheckOgle"]');
			var alarmCheckIkindi = locationSettingsNotificationsListEl.querySelector('input[id = "alarmCheckIkindi"]');
			var alarmCheckAksam = locationSettingsNotificationsListEl.querySelector('input[id = "alarmCheckAksam"]');
			var alarmCheckYatsi = locationSettingsNotificationsListEl.querySelector('input[id = "alarmCheckYatsi"]');

			if (!tizen.preference.exists('pref_ilceid')) 
			{
				return;
			}
			else if(e.target.id == 'alarmCheckHeader')
			{
				alarmCheckImsak.checked = alarmCheckHeader.checked;
				alarmCheckGunes.checked = alarmCheckHeader.checked;
				alarmCheckOgle.checked = alarmCheckHeader.checked;
				alarmCheckIkindi.checked = alarmCheckHeader.checked;
				alarmCheckAksam.checked = alarmCheckHeader.checked;
				alarmCheckYatsi.checked = alarmCheckHeader.checked;
			}
			else if(e.target.id == 'alarmButtonNImsak')
			{
				if(alarmImsakValue > MIN_ALARM_VALUE)
					alarmImsakValue -= 1;
			}
			else if(e.target.id == 'alarmButtonPImsak')
			{
				if(alarmImsakValue < MAX_ALARM_VALUE)
					alarmImsakValue += 1;
			}
			else if(e.target.id == 'alarmButtonNGunes')
			{
				if(alarmGunesValue > MIN_ALARM_VALUE)
					alarmGunesValue -= 1;
			}
			else if(e.target.id == 'alarmButtonPGunes')
			{
				if(alarmGunesValue < MAX_ALARM_VALUE)
					alarmGunesValue += 1;
			}
			else if(e.target.id == 'alarmButtonNOgle')
			{
				if(alarmOgleValue > MIN_ALARM_VALUE)
					alarmOgleValue -= 1;
			}
			else if(e.target.id == 'alarmButtonPOgle')
			{
				if(alarmOgleValue < MAX_ALARM_VALUE)
					alarmOgleValue += 1;
			}
			else if(e.target.id == 'alarmButtonNIkindi')
			{
				if(alarmIkindiValue > MIN_ALARM_VALUE)
					alarmIkindiValue -= 1;
			}
			else if(e.target.id == 'alarmButtonPIkindi')
			{
				if(alarmIkindiValue < MAX_ALARM_VALUE)
					alarmIkindiValue += 1;
			}
			else if(e.target.id == 'alarmButtonNAksam')
			{
				if(alarmAksamValue > MIN_ALARM_VALUE)
					alarmAksamValue -= 1;
			}
			else if(e.target.id == 'alarmButtonPAksam')
			{
				if(alarmAksamValue < MAX_ALARM_VALUE)
					alarmAksamValue += 1;
			}
			else if(e.target.id == 'alarmButtonNYatsi')
			{
				if(alarmYatsiValue > MIN_ALARM_VALUE)
					alarmYatsiValue -= 1;
			}
			else if(e.target.id == 'alarmButtonPYatsi')
			{
				if(alarmYatsiValue < MAX_ALARM_VALUE)
					alarmYatsiValue += 1;
			}
			else if(e.target.id == 'vibrateNone' )	
			{
				vibrationDuration = 0;
				tizen.preference.setValue('vibrationDuration', vibrationDuration);
				return;
			}   
			else if(e.target.id == 'vibrateNormal' )	
			{
				vibrationDuration = 1500;
				tizen.preference.setValue('vibrationDuration', vibrationDuration);
				return;
			}   
			else if(e.target.id == 'vibrateLong' )	
			{
				vibrationDuration = 2500;
				tizen.preference.setValue('vibrationDuration', vibrationDuration);
				return;
			}          

			alarmHeader = alarmCheckHeader.checked;
			alarmImsak = alarmCheckImsak.checked;
			alarmGunes = alarmCheckGunes.checked;
			alarmOgle = alarmCheckOgle.checked;
			alarmIkindi = alarmCheckIkindi.checked;
			alarmAksam = alarmCheckAksam.checked;
			alarmYatsi = alarmCheckYatsi.checked;

			document.getElementById('alarmSpanImsak').innerHTML = showNum(alarmImsakValue);
			document.getElementById('alarmSpanGunes').innerHTML = showNum(alarmGunesValue);
			document.getElementById('alarmSpanOgle').innerHTML = showNum(alarmOgleValue);
			document.getElementById('alarmSpanIkindi').innerHTML = showNum(alarmIkindiValue);
			document.getElementById('alarmSpanAksam').innerHTML = showNum(alarmAksamValue);
			document.getElementById('alarmSpanYatsi').innerHTML = showNum(alarmYatsiValue);

			tizen.preference.setValue('alarmImsakValue', alarmImsakValue);
			tizen.preference.setValue('alarmGunesValue', alarmGunesValue);
			tizen.preference.setValue('alarmOgleValue', alarmOgleValue);
			tizen.preference.setValue('alarmIkindiValue', alarmIkindiValue);
			tizen.preference.setValue('alarmAksamValue', alarmAksamValue);
			tizen.preference.setValue('alarmYatsiValue', alarmYatsiValue);

			tizen.preference.setValue('alarmHeader', alarmHeader);
			tizen.preference.setValue('alarmImsak', alarmImsak);
			tizen.preference.setValue('alarmGunes', alarmGunes);
			tizen.preference.setValue('alarmOgle', alarmOgle);
			tizen.preference.setValue('alarmIkindi', alarmIkindi);
			tizen.preference.setValue('alarmAksam', alarmAksam);
			tizen.preference.setValue('alarmYatsi', alarmYatsi);
		});

		notificationsMenuPage.addEventListener('pagebeforehide', function onPageNotiBeforeHide() {
			console.log('onPageNotiBeforeHide');

			SetupAlarms(true);

		});

		kibleMenuPage.addEventListener('pagebeforeshow', function onPageBeforeShow() {
			// selector items radius
			console.log('pagebeforeshowKibleMenu');
			var kibleExplan = kibleMenuPage.querySelector('#kible-time');
			if (!tizen.preference.exists('pref_ilceid')) 
			{
				kibleExplan.innerHTML = MY_LOCALE('select_loc_alert');
				return;
			}

			kibleExplan.innerHTML = MY_LOCALE('kible_time_expl') + '<br/>' + kibleSaati;
		});

	}

	function SetupAlarms(fromSettings) {
		var alarm1 = null, alarm2 = null, alarm3 = null, alarm4 = null, alarm5 = null, alarm6 = null;

		if (tizen.preference.exists('pref_ilceid') && vakitTabloArray != null) 
		{
			var today = new Date();
			var newDateObj;

			if(alarmImsak)
			{
				var indexOfTime=1;
				today.setHours(vakitTabloArray[indexOfTime][1].substr(0,vakitTabloArray[indexOfTime][1].indexOf(":")));
				today.setMinutes(vakitTabloArray[indexOfTime][1].substr(vakitTabloArray[indexOfTime][1].indexOf(":")+1));
				today.setSeconds(0,0);

				newDateObj = new Date(today.getTime() + alarmImsakValue*60000);
				console.log(' imsak alarm:' + newDateObj);

				alarm1 = new tizen.AlarmAbsolute(newDateObj, tizen.alarm.PERIOD_DAY);
			}

			if(alarmGunes)
			{
				var indexOfTime=2;
				today.setHours(vakitTabloArray[indexOfTime][1].substr(0,vakitTabloArray[indexOfTime][1].indexOf(":")));
				today.setMinutes(vakitTabloArray[indexOfTime][1].substr(vakitTabloArray[indexOfTime][1].indexOf(":")+1));
				today.setSeconds(0,0);

				newDateObj = new Date(today.getTime() + alarmGunesValue*60000);
				console.log(' gunes alarm:' + newDateObj);

				alarm2 = new tizen.AlarmAbsolute(newDateObj, tizen.alarm.PERIOD_DAY);
			}

			if(alarmOgle)
			{
				var indexOfTime=3;
				today.setHours(vakitTabloArray[indexOfTime][1].substr(0,vakitTabloArray[indexOfTime][1].indexOf(":")));
				today.setMinutes(vakitTabloArray[indexOfTime][1].substr(vakitTabloArray[indexOfTime][1].indexOf(":")+1));
				today.setSeconds(0,0);

				newDateObj = new Date(today.getTime() + alarmOgleValue*60000);
				console.log(' ogle alarm:' + newDateObj);

				alarm3 = new tizen.AlarmAbsolute(newDateObj, tizen.alarm.PERIOD_DAY);
			}

			if(alarmIkindi)
			{
				var indexOfTime=4;
				today.setHours(vakitTabloArray[indexOfTime][1].substr(0,vakitTabloArray[indexOfTime][1].indexOf(":")));
				today.setMinutes(vakitTabloArray[indexOfTime][1].substr(vakitTabloArray[indexOfTime][1].indexOf(":")+1));
				today.setSeconds(0,0);

				newDateObj = new Date(today.getTime() + alarmIkindiValue*60000);
				console.log(' ikindi alarm:' + newDateObj);

				alarm4 = new tizen.AlarmAbsolute(newDateObj, tizen.alarm.PERIOD_DAY);
			}

			if(alarmAksam)
			{
				var indexOfTime=5;
				today.setHours(vakitTabloArray[indexOfTime][1].substr(0,vakitTabloArray[indexOfTime][1].indexOf(":")));
				today.setMinutes(vakitTabloArray[indexOfTime][1].substr(vakitTabloArray[indexOfTime][1].indexOf(":")+1));
				today.setSeconds(0,0);

				newDateObj = new Date(today.getTime() + alarmAksamValue*60000);
				console.log(' aksam alarm:' + newDateObj);

				alarm5 = new tizen.AlarmAbsolute(newDateObj, tizen.alarm.PERIOD_DAY);
			}

			if(alarmYatsi)
			{
				var indexOfTime=6;
				today.setHours(vakitTabloArray[indexOfTime][1].substr(0,vakitTabloArray[indexOfTime][1].indexOf(":")));
				today.setMinutes(vakitTabloArray[indexOfTime][1].substr(vakitTabloArray[indexOfTime][1].indexOf(":")+1));
				today.setSeconds(0,0);

				newDateObj = new Date(today.getTime() + alarmYatsiValue*60000);
				console.log(' yatsi alarm:' + newDateObj);

				alarm6 = new tizen.AlarmAbsolute(newDateObj, tizen.alarm.PERIOD_DAY);
			}
		} 
		else {
			return;
		}

		// Gets the current application ID.
		var appId = tizen.application.getCurrentApplication().appInfo.id;

		tizen.alarm.removeAll();

		if( alarm1 != null )
		{
			console.log('alarm1 added.');
			/* Create ApplicationControl object */
			var appControl = new tizen.ApplicationControl(MY_LOCALE('Imsak'), MY_ALARM_URI);

			tizen.alarm.add(alarm1, appId, appControl);
		}
		if( alarm2 != null )
		{
			console.log('alarm2 added.');
			/* Create ApplicationControl object */
			var appControl = new tizen.ApplicationControl(MY_LOCALE('Gunes'), MY_ALARM_URI);

			tizen.alarm.add(alarm2, appId, appControl);
		}
		if( alarm3 != null )
		{
			console.log('alarm3 added.');
			/* Create ApplicationControl object */
			var appControl = new tizen.ApplicationControl(MY_LOCALE('Ogle'), MY_ALARM_URI);

			tizen.alarm.add(alarm3, appId, appControl);
		}
		if( alarm4 != null )
		{
			console.log('alarm4 added.');
			/* Create ApplicationControl object */
			var appControl = new tizen.ApplicationControl(MY_LOCALE('Ikindi'), MY_ALARM_URI);

			tizen.alarm.add(alarm4, appId, appControl);
		}
		if( alarm5 != null )
		{
			console.log('alarm5 added.');
			/* Create ApplicationControl object */
			var appControl = new tizen.ApplicationControl(MY_LOCALE('Aksam'), MY_ALARM_URI);

			tizen.alarm.add(alarm5, appId, appControl);
		}
		if( alarm6 != null )
		{
			console.log('alarm6 added.');
			/* Create ApplicationControl object */
			var appControl = new tizen.ApplicationControl(MY_LOCALE('Yatsi'), MY_ALARM_URI);

			tizen.alarm.add(alarm6, appId, appControl);
		}

		var alarms = tizen.alarm.getAll();
		console.log(alarms.length + ' alarms present in the storage.');
	}
	/**
	 * Binds events.
	 *
	 * @memberof app
	 * @private
	 */
	function bindEvents() {

		window.addEventListener('tizenhwkey', function onTizenHWKey(e) {
			if (e.keyName === 'back') {
				var pageActive = document.getElementsByClassName('ui-page-active')[0],
				pageid = pageActive ? pageActive.id : '';

				console.log('Back - active:' + pageid);

				if (pageid === 'main') {
					exit();
				} 
				else if (pageid === 'settings-location') {
					tau.changePage('settings');
				} 
				else if (pageid === 'settings-notification') 
				{
					tau.changePage('settings');
				} 
				else if (pageid === 'settings-kible') 
				{
					tau.changePage('settings');
				}
				else if (pageid === 'settings-location-ulke')
				{
					tau.changePage('settings-location');
				} 
				else if (pageid === 'settings-location-il')
				{
					tau.changePage('settings-location-ulke');
				} 
				else if (pageid === 'settings-location-ilce') 
				{
					tau.changePage('settings-location-il');
				}
				else if (pageid === 'bayramvakitleri') 
				{
					tau.changePage('settings');
				} 
				else if (pageid === 'settings') 
				{
					gunAdd = 0;
					tau.changePage('main');
				} else
				{
					window.history.back();
				}
			}
		});
		
		document.addEventListener('rotarydetent', function(ev) {
	        /* Get the direction value from the event */
	        var direction = ev.detail.direction;
	        var pageActive = document.getElementsByClassName('ui-page-active')[0],
			pageid = pageActive ? pageActive.id : '';
	        if (pageid === 'main') {
		        if (direction == 'CW') {
		            /* Add behavior for clockwise rotation */
		            if(gunAdd<31)
		            {
		            	gunAdd++;
		            	prepareMainUI();
		            }
		            console.log('clockwise gun:' + gunAdd);
		        } else if (direction == 'CCW') {
		            /* Add behavior for counter-clockwise rotation */
		        	if(gunAdd>0)
		            {
		            	gunAdd--;
		            	prepareMainUI();
		            }
		        	console.log('counter- clockwise gun:' + gunAdd);
		        }
		        
	        }
	  });

		/*window.onload = function() {
            translateTexts();
        }*/

		translateTexts();
		bindSelectorEvents();
	}

	function MY_LOCALE(str)
	{
		if(currentLanguage === 'tr')
		{
			return TIZEN_L10N_TR[str];
		}
		else
		{
			return TIZEN_L10N[str];
		}
	}

	/**
	 * Function for translating strings in html file
	 */
	function translateElement(jqElement) {
		for (var i = 0; i < jqElement.querySelectorAll('[data-l10n]').length; i++) {
			var elem = jqElement.querySelectorAll('[data-l10n]')[i];
			elem.innerHTML = MY_LOCALE(elem.getAttribute('data-l10n'));
		}
	}

	function translateTexts() {
		//tizen.systeminfo.getPropertyValue("LOCALE", function(locale) {
		/*var tmp = locale.language.substring(0, 2);

            if (supportedLanguages.indexOf(tmp) > -1) {
                currentLanguage = tmp;
            } else {
                currentLanguage = defaultLanguage;
            }*/

		console.log('curr lang:' + currentLanguage);

		translateElement(document);
		//});
	}

	function GET_TR_DAY(tr)
	{
		if (currentLanguage === 'tr')
		{
			return tr;
		}
		else if( tr == 'Pazar' )
			return 'Sunday';
		else if( tr == 'Pazartesi' )
			return 'Monday';
		else if( tr == 'Salı' )
			return 'Tuesday';
		else if( tr == 'Çarşamba' )
			return 'Wednesday';
		else if( tr == 'Perşembe' )
			return 'Thursday';
		else if( tr == 'Cuma' )
			return 'Friday';
		else if( tr == 'Cumartesi' )
			return 'Saturday';
		else 
			return tr;
	}

	function GET_TR_MONTH(tr)
	{
		if (currentLanguage === 'tr')
		{
			return tr;
		}
		else if( tr == 'Ocak' )
			return 'January';
		else if( tr == 'Şubat' )
			return 'February';
		else if( tr == 'Mart' )
			return 'March';
		else if( tr == 'Nisan' )
			return 'April';
		else if( tr == 'Mayıs' )
			return 'May';
		else if( tr == 'Haziran' )
			return 'June';
		else if( tr == 'Temmuz' )
			return 'July';
		else if( tr == 'Ağustos' )
			return 'August';
		else if( tr == 'Eylül' )
			return 'September';
		else if( tr == 'Ekim' )
			return 'October';
		else if( tr == 'Kasım' )
			return 'November';
		else if( tr == 'Aralık' )
			return 'December';
		else 
			return tr;
	}

	function checkFromAlarm()
	{
		var reqAppControl = tizen.application.getCurrentApplication().getRequestedAppControl();

		console.log("checkFromAlarm... ");
		fromAlarm = false;
		fromOp = null;

		if (reqAppControl) {
			/* console.log("Requester AppID : " + reqAppControl.callerAppId);
		     console.log("Requester uri : " + reqAppControl.appControl.uri);
		     console.log("Requester data : " + reqAppControl.appControl.data);
		     console.log("Requester mime : " + reqAppControl.appControl.mime + " op:" +
		    		 reqAppControl.appControl.operation);
			 */
			if( reqAppControl.appControl.uri == MY_ALARM_URI )
			{
				fromAlarm = true;
				fromOp = reqAppControl.appControl.operation;
				console.log(" fromOp:" +	 fromOp);
			}
		}
	}

	/**
	 * Initializes main module.
	 *
	 * @memberof app
	 * @private
	 */
	function initMain() {

		var isSupport = tizen.systeminfo.getCapability('http://tizen.org/feature/input.rotating_bezel');
		console.log(' Bezel = ' + isSupport);
		
		initVars();

		checkFromAlarm();

		bindEvents();

		var alarms = tizen.alarm.getAll();
		console.log(alarms.length + ' alarms present in the storage.');
	}

	initMain();
})();