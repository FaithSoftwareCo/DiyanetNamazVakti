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

(function () {

    var mywidget = {

        DEFAULT_BACKGROUND_COLOR: 'white',
       
        // preference keys
        PREFERENCE_KEY_IS_RUNNING: 'isRunning',
        PREFERENCE_KEY_SPEED: 'speed',

        // mode
        STAND_ALONE_MODE: 'stand-alone-mode',
        COMPANION_MODE: 'companion-mode',

        // main page

        currentLanguage : 'en',
        defaultLanguage : 'en',
        supportedLanguages : ['en', 'tr'],
        
        currentWidgetAppearance : 0, // 
        errorScreenActive: 0,
        
        application: {
            launch: {},
            isRunning: {},
            setStateChangeListener: {}
        },

        ui: {
            setMode: {},
            init: {},
            
            
            vakitTableError: {},
            vakitTableOk: {},
            vakitTableOk2: {},
            vakitTableOk3: {},
            //page
            imsakTime: {},
            gunesTime: {},
            ogleTime: {},
            ikindiTime: {},
            aksamTime: {},
            yatsiTime: {},
            miladiDate: {},
            miladiDay: {},
            hicriDate: {},
            //page2
            myDate: {},
            nextPrayerLabel: {},
            nextPrayerTime: {},
            toPray: {},
            nextPrayerDuration: {},
            //page3
            currentDate: {},
            currentTime: {},
            nextPrayerTime2: {},
            
            ShowMainScreenError: {},
            ShowMainScreenOk: {},
            ShowVakitler: {},
            
            IntToStr: {},
            GET_TR_DAY: {},
            GET_TR_MONTH: {},
            GetNextVakitRow: {},
            GetPrayTimeName: {},
            GetNextPrayTime: {},
        	GetDurationToNextPrayTime: {},
            
            getVakitlerFromLocal: {},
            
            body: {}
        },

        //isSpeedChangedListenerSet: false,
        //setSpeedChangeListener: {},
        //unsetSpeedChangeListener: {},

        onstatechange: {},
        onspeedchange: {}

    };

     var init = function () {

        var self = this;
        
        console.log('widget init');
        
        /**
         *  A listener for retrieving the application state change
         */
        self.onstatechange = function (data) {

            console.log('[mywidget] statechangelistener enter');

            if (data.value === true) {

                // the application is running
                //self.setSpeedChangeListener(self.speedchangeiistener);
                self.ui.setMode(self.COMPANION_MODE);

            } else if (data.value === false) {

                // the application is not running
               //self.unsetSpeedChangeListener();
                self.ui.setMode(self.STAND_ALONE_MODE);

            }

        };

        

        /**
         *  Sets Mode to change UI
         */
        self.ui.setMode = function (mode) {

            self.ui.body.style.backgroundColor = self.DEFAULT_BACKGROUND_COLOR;

            /*if (mode === self.STAND_ALONE_MODE) {

                self.ui.launchbutton.style.display = 'block';

            } else if (mode === self.COMPANION_MODE) {

                self.ui.launchbutton.style.display = 'none';

            }*/

        };
        
        self.ui.vakitTableError = (function (id) {

            return document.getElementById(id);

        })('contentErrorPage');
        
        self.ui.vakitTableOk = (function (id) {

            return document.getElementById(id);

        })('contentOkPage');
        
        self.ui.vakitTableOk2 = (function (id) {

            return document.getElementById(id);

        })('contentOk2Page');
        
        self.ui.vakitTableOk3 = (function (id) {

            return document.getElementById(id);

        })('contentOk3Page');
        
        self.ui.imsakTime = (function (id) {

            return document.getElementById(id);

        })('imsakTime');
         
        self.ui.gunesTime = (function (id) {

            return document.getElementById(id);

        })('gunesTime');
          
        self.ui.ogleTime = (function (id) {

            return document.getElementById(id);

        })('ogleTime');
           
        self.ui.ikindiTime = (function (id) {

            return document.getElementById(id);

        })('ikindiTime');
            
        self.ui.aksamTime = (function (id) {

            return document.getElementById(id);

        })('aksamTime');
             
        self.ui.yatsiTime = (function (id) {

            return document.getElementById(id);

        })('yatsiTime');
              
        self.ui.miladiDate = (function (id) {

            return document.getElementById(id);

        })('miladiDate');
               
        self.ui.miladiDay = (function (id) {

            return document.getElementById(id);

        })('miladiDay');
                
        self.ui.hicriDate = (function (id) {
            return document.getElementById(id);
        })('hicriDate');
        
        self.ui.myDate = (function (id) {
            return document.getElementById(id);
        })('myDate');
        
        self.ui.nextPrayerLabel = (function (id) {
            return document.getElementById(id);
        })('nextPrayerLabel');
        
        self.ui.nextPrayerTime = (function (id) {
            return document.getElementById(id);
        })('nextPrayerTime');
        
        self.ui.toPray = (function (id) {
            return document.getElementById(id);
        })('toPray');
        
        self.ui.nextPrayerDuration = (function (id) {
            return document.getElementById(id);
        })('nextPrayerDuration');

        self.ui.currentDate = (function (id) {
            return document.getElementById(id);
        })('currentDate');
        self.ui.currentTime = (function (id) {
            return document.getElementById(id);
        })('currentTime');
        self.ui.nextPrayerTime2 = (function (id) {
            return document.getElementById(id);
        })('nextPrayerTime2');
        
        /**
         *  Returns a DOM element for mywidget.ui.backgroundcolor .
         */
        self.ui.body = (function (tag) {

            return document.getElementsByTagName(tag)[0];

        })('BODY');

        /**
         *  Launchs the application
         */
        self.application.launch = function () {

            console.log('[mywidget] application launch enter');

            var appId = tizen.application.getCurrentApplication().appInfo.id;
            tizen.application.launch(appId.replace('.Widget', ''), function () {

                console.log('[mywidget] application launched');

            });

        };

        /**
         *  Checks whether the application is running
         */
        self.application.isRunning = function () {

            // Checks the key mywidget.PREFERENCE_KEY_IS_RUNNING is set.
            // If not, set the key
            if (tizen.preference.exists(self.PREFERENCE_KEY_IS_RUNNING) === false) {

                tizen.preference.setValue(self.PREFERENCE_KEY_IS_RUNNING, false);
                return false;
            }

            // If the key was set by the application It can be used to check whether the application is running or not.
            return tizen.preference.getValue(self.PREFERENCE_KEY_IS_RUNNING);

        };

        /**
         *  Sets a listener for listening to changes in speed.
         */
        self.application.setStateChangeListener = function (listener) {

            console.log('[mywidget] application setStateChangeListener enter');
            // Checks the key mywidget.PREFERENCE_KEY_IS_RUNNING is set.
            // If not, set the key
            if (tizen.preference.exists(self.PREFERENCE_KEY_IS_RUNNING) === false) {

                console.log('[mywidget] the key, speed, does not exists');

                tizen.preference.setValue(self.PREFERENCE_KEY_IS_RUNNING, false);
            }

            // To get the information about whether the UI application is running or not.
            tizen.preference.setChangeListener(self.PREFERENCE_KEY_IS_RUNNING, listener);

        };

        
        self.ui.prepareMainUI = function () {
            var vakitler = null;
            console.log('prepareMainUI');
            //self.ui.miladiDay.textContent = '1dd';    
            if (tizen.preference.exists('currentWidgetAppearance') == false) 
        	{
            	self.currentWidgetAppearance = 0;
        	}
            else
        	{
            	self.currentWidgetAppearance = tizen.preference.getValue('currentWidgetAppearance');
        	}
            
            if (tizen.preference.exists('pref_ilceid') == false) 
            {
            	//self.ui.miladiDay.textContent = '2dd';
                self.ui.ShowVakitler(false, null);
            } 
            else if ((vakitler = self.ui.getVakitlerFromLocal()) == null) 
            {
                var ilceId = tizen.preference.getValue('pref_ilceid');
                //self.ui.miladiDay.textContent = '3dd';
                //ShowMainScreenError(TIZEN_L10N['loading']);
                
                //GetVakitlerFromWebSite(ilceId);

                // lokalden al tekrardan goster!!!!
                self.ui.ShowVakitler(false, null);
            } 
            else 
            {
            	//self.ui.miladiDay.textContent = '4dd';
            	self.ui.ShowVakitler(true, vakitler);
            }
        };

        self.ui.getVakitlerFromLocal = function() {
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
                    console.log('Preference key' + i + ' is: ' + currentVakitStr);
                }
            }

            console.log('vakitler array length:' + vakitler.length);
            return vakitler;
        };
        
        self.ui.ShowMainScreenError = function (errorMsg) {
        	self.ui.vakitTableError.style.display = "block";
        	self.ui.vakitTableOk.style.display = "none";
        	self.ui.vakitTableOk2.style.display = "none";
        	self.ui.vakitTableOk3.style.display = "none";
        	self.errorScreenActive = 1;
        	
        	// set title
            var title = MY_LOCALE('title');

            var titleEl = document.getElementById('myTitle');
            if (titleEl != null)
                titleEl.textContent = title;
            
            var errorDiv = document.getElementById('errorScreen');
            if (errorDiv != null)
            	errorDiv.textContent = errorMsg;
        };
        
        self.ui.ShowMainScreenOk = function( imsak, gunes, ogle, ikindi, aksam, yatsi, activeTime, miladiDateArg, miladiDayArg, hicriDateArg, nextImsak )
        {
        	self.ui.vakitTableError.style.display = "none";
        	self.ui.vakitTableOk.style.display = "none";
        	self.ui.vakitTableOk2.style.display = "none";
        	self.ui.vakitTableOk3.style.display = "none";
        	self.errorScreenActive = 0;
        	
        	if(self.currentWidgetAppearance == 1)
    		{
        		var nextPrayTime = self.ui.GetNextPrayTime(imsak, gunes, ogle, ikindi, aksam, yatsi, activeTime, nextImsak);
        		
        		self.ui.vakitTableOk2.style.display = "block";
        		self.ui.myDate.textContent = miladiDateArg;
        		self.ui.nextPrayerLabel.textContent = self.ui.GetPrayTimeName(activeTime+1); // get next pray time label
        		
        		self.ui.nextPrayerTime.textContent = nextPrayTime + '';

        		//self.ui.toPray.textContent = 'Ezana todo';
        		self.ui.nextPrayerDuration.textContent = self.ui.GetDurationToNextPrayTime(nextPrayTime);
    		}
        	else if(self.currentWidgetAppearance == 2)
        	{
        		var nextPrayTime = self.ui.GetNextPrayTime(imsak, gunes, ogle, ikindi, aksam, yatsi, activeTime, nextImsak);
        		var today = new Date();
        		var SpecialCH = '\u231A';
        		self.ui.vakitTableOk3.style.display = "block";
        		self.ui.currentDate.textContent = miladiDateArg;
        		self.ui.currentTime.textContent = self.ui.IntToStr(today.getHours()) + ':' + self.ui.IntToStr(today.getMinutes());
        		self.ui.nextPrayerTime2.textContent = self.ui.GetPrayTimeName(activeTime+1).toUpperCase() + ' ' + SpecialCH + ' ' + nextPrayTime + '';
       		}
        	else
    		{
        		self.ui.vakitTableOk.style.display = "block";
        		
        		var title = MY_LOCALE('title');
                if (tizen.preference.exists('pref_ilceid') == true) {
                     title = tizen.preference.getValue('pref_ilcename');
                }
                var titleEl = document.getElementById('myTitle');
                if (titleEl != null)
                    titleEl.textContent = title;
                
                self.ui.imsakTime.textContent = imsak;
                self.ui.gunesTime.textContent = gunes;
                self.ui.ogleTime.textContent = ogle;
                self.ui.ikindiTime.textContent = ikindi;
                self.ui.aksamTime.textContent = aksam;
                self.ui.yatsiTime.textContent = yatsi;
                
                self.ui.miladiDate.textContent = miladiDateArg;
                self.ui.miladiDay.textContent = miladiDayArg;
                self.ui.hicriDate.textContent = hicriDateArg;
                
                if(activeTime == 0 )            
                	self.ui.imsakTime.className = "rightDiv-selected";
                else
                	self.ui.imsakTime.className = "rightDiv";
                
                if(activeTime == 1 )
                	self.ui.gunesTime.className = "rightDiv-selected";
                else
                	self.ui.gunesTime.className = "rightDiv";
                
                if(activeTime == 2 )
                	self.ui.ogleTime.className = "rightDiv-selected";
                else
                	self.ui.ogleTime.className = "rightDiv";
                
                if(activeTime == 3 )
                	self.ui.ikindiTime.className = "rightDiv-selected";
                else
                	self.ui.ikindiTime.className = "rightDiv";
                
                if(activeTime == 4 )
                	self.ui.aksamTime.className = "rightDiv-selected";
                else
                	self.ui.aksamTime.className = "rightDiv";
                
                if(activeTime == 5 )
                	self.ui.yatsiTime.className = "rightDiv-selected";
                else
                	self.ui.yatsiTime.className = "rightDiv";
    		}
        }; 
        
                
        self.ui.ShowVakitler = function(dbOK, vakitler) {
            //console.log('ShowVakitler');
            //self.ui.miladiDay.textContent = '4dd';
        	
        	var  vakitTabloArray = null;
        	
            if (dbOK == true) {
                var today = new Date();

                for (var i=0; i<vakitler.length; i++)
            	{
                	//for (var vakit in vakitler) {
                    //var vakitDay = new Date(vakitler[vakit].MiladiTarihUzunIso8601);
                	var kisaTarihISOString = vakitler[i].MiladiTarihKisaIso8601; 
                    var dateParts = kisaTarihISOString.split(".");
                    var vakitDay = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
                    
                    if (vakitDay.getDate() == today.getDate() &&
                        vakitDay.getMonth() == today.getMonth() &&
                        vakitDay.getFullYear() == today.getFullYear()) {
                    	
                    	vakitTabloArray = new Array();
                    	
                        vakitTabloArray.push(['Miladi', vakitler[i].MiladiTarihUzun]);
                        vakitTabloArray.push(['Imsak', vakitler[i].Imsak]);
                        vakitTabloArray.push(['Gunes', vakitler[i].Gunes]);
                        vakitTabloArray.push(['Ogle', vakitler[i].Ogle]);
                        vakitTabloArray.push(['Ikindi', vakitler[i].Ikindi]);
                        vakitTabloArray.push(['Aksam', vakitler[i].Aksam]);
                        vakitTabloArray.push(['Yatsi', vakitler[i].Yatsi]);
                        vakitTabloArray.push(['Hicri', vakitler[i].HicriTarihUzun]);
                        if((i+1)<vakitler.length)
                    	{
                        	vakitTabloArray.push(['NextImsak', vakitler[i+1].Imsak]);
                    	}
                        else {
                        	vakitTabloArray.push(['NextImsak', null]);
						}
                        break;
                    }
                }
            }
            
            //self.ui.miladiDay.textContent = '5dd';
            
            if (dbOK == false) 
            {
            	//self.ui.miladiDay.textContent = '6dd';
                self.ui.ShowMainScreenError(MY_LOCALE('select_loc_alert'));
            } 
            else if (vakitTabloArray == null || vakitTabloArray.length == 0) 
            {
            	//self.ui.miladiDay.textContent = '7dd';
            	self.ui.ShowMainScreenError(MY_LOCALE('vakitler_alinamadi'));
            } 
            else 
            { 
            	//self.ui.miladiDay.textContent = '8dd';
                var n = vakitTabloArray[0][1].split(" "); // 23 Nisan 2020 Perşembe
                var dayString = self.ui.GET_TR_DAY(n[3]);
                var dateString = n[0] + ' ' + self.ui.GET_TR_MONTH(n[1]) + ' ' + n[2];
                
               // self.ui.miladiDay.textContent = '9dd';
                // getNextVakit
                var nextVakitRow = self.ui.GetNextVakitRow(vakitTabloArray); // Imsak=0,...Yatsi=5
                
                //self.ui.miladiDay.textContent = '-dd';
                
                self.ui.ShowMainScreenOk(vakitTabloArray[1][1], vakitTabloArray[2][1],vakitTabloArray[3][1],vakitTabloArray[4][1],vakitTabloArray[5][1], vakitTabloArray[6][1],
                		nextVakitRow, dateString, dayString, vakitTabloArray[7][1], vakitTabloArray[8][1]);
                
            }
        };
        
        self.ui.IntToStr = function(hourValue) {
            if (hourValue == 0)
                return '00';
            else if (hourValue < 10)
                return '0' + hourValue;
            else
                return '' + hourValue;
        };
        
        self.ui.GET_TR_DAY = function(tr)
        {
        	var fixedstring;

    		try{
    		    // If the string is UTF-8, this will work and not throw an error.
    		    fixedstring=decodeURIComponent(escape(tr));
    		}catch(e){
    		    // If it isn't, an error will be thrown, and we can assume that we have an ISO string.
    		    fixedstring=tr;
    		}
    		
        	if (self.currentLanguage === 'tr')
    		{
        		return fixedstring;
    		}
        	else if( fixedstring == 'Pazar' )
        		return 'Sunday';
        	else if( fixedstring == 'Pazartesi' )
        		return 'Monday';
        	else if( fixedstring == 'Salı' )
        		return 'Tuesday';
        	else if( fixedstring == 'Çarşamba' )
        		return 'Wednesday';
        	else if( fixedstring == 'Perşembe' )
        		return 'Thursday';
        	else if( fixedstring == 'Cuma' )
        		return 'Friday';
        	else if( fixedstring == 'Cumartesi' )
        		return 'Saturday';
        	else 
        		return tr;
        };
        
        self.ui.GET_TR_MONTH = function(tr)
        {
        	var fixedstring;

    		try{
    		    // If the string is UTF-8, this will work and not throw an error.
    		    fixedstring=decodeURIComponent(escape(tr));
    		}catch(e){
    		    // If it isn't, an error will be thrown, and we can assume that we have an ISO string.
    		    fixedstring=tr;
    		}
        	
        	if (self.currentLanguage === 'tr')
    		{
        		return fixedstring;
    		}
        	else if( fixedstring == 'Ocak' )
        		return 'January';
        	else if( fixedstring == 'Şubat' )
        		return 'February';
        	else if( fixedstring == 'Mart' )
        		return 'March';
        	else if( fixedstring == 'Nisan' )
        		return 'April';
        	else if( fixedstring == 'Mayıs' )
        		return 'May';
        	else if( fixedstring == 'Haziran' )
        		return 'June';
        	else if( fixedstring == 'Temmuz' )
        		return 'July';
        	else if( fixedstring == 'Ağustos' )
        		return 'August';
        	else if( fixedstring == 'Eylül' )
        		return 'September';
        	else if( fixedstring == 'Ekim' )
        		return 'October';
        	else if( fixedstring == 'Kasım' )
        		return 'November';
        	else if( fixedstring == 'Aralık' )
        		return 'December';
        	else 
        		return tr;
        };
        
        self.ui.GetNextVakitRow = function(vakitTabloArray) // Imsak=0,...Yatsi=5
        {
            var today = new Date();
            //var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
            var timeString = self.ui.IntToStr(today.getHours()) + ':' + self.ui.IntToStr(today.getMinutes()) + ':00';
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
        };
        
        self.ui.GetPrayTimeName= function(activeTime) // Imsak=0,...Yatsi=5
        {
        	if(activeTime == 1 )
            	return MY_LOCALE('Gunes');
        	else if(activeTime == 2 )
            	return MY_LOCALE('Ogle');
        	else if(activeTime == 3 )
            	return MY_LOCALE('Ikindi');
        	else if(activeTime == 4 )
            	return MY_LOCALE('Aksam');
        	else if(activeTime == 5 )
            	return MY_LOCALE('Yatsi');
        	else 
        		return MY_LOCALE('Imsak');
        };
        
        self.ui.GetNextPrayTime = function(imsak, gunes, ogle, ikindi, aksam, yatsi, activeTime, nextImsak)
        {
        	if(activeTime == 0 )
            	return gunes;
        	else if(activeTime == 1 )
            	return ogle;
        	else if(activeTime == 2 )
            	return ikindi;
        	else if(activeTime == 3 )
            	return aksam;
        	else if(activeTime == 4 )
            	return yatsi;
        	else if(activeTime == 5 )
            	return nextImsak;
        	else 
        		return nextImsak;
    	};
    	
    	self.ui.GetDurationToNextPrayTime = function(prayTime)
        {
    		var today = new Date();
            //var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
            var timeString = self.ui.IntToStr(today.getHours()) + ':' + self.ui.IntToStr(today.getMinutes()) + ':00';
            var todayTime = new Date('1970-01-02T' + timeString + 'Z');
            
            timeString = prayTime + ':00';
            var prayTime = new Date('1970-01-02T' + timeString + 'Z');
            
            if (todayTime.getTime() > prayTime.getTime()) // demekki ertesi gunmus. ona gore hesap et
        	{
            	 prayTime = new Date('1970-01-03T' + timeString + 'Z');
        	}
            
            var diff = prayTime - todayTime;
            var mins = Math.round(diff / 60000);
        	
            var hours = (mins / 60);
            var rhours = Math.floor(hours);
            var minutes = (hours - rhours) * 60;
            var rminutes = Math.round(minutes);
            
            return rhours + " " + MY_LOCALE('hours_and') + " " + rminutes + " " + MY_LOCALE('minutes');
    	};
        
        self.ui.prepareMainUI();
    };
    
    /**
     *  window.onload
     */
    window.onload = function() {
    	//console.log('widget onload');
    	translateTexts();        
        init.call(mywidget);
        //console.log('widget onload2');
        document.addEventListener('visibilitychange',
            function () {

                console.log('[mywidget] visibilityState: ' + document.visibilityState);

                if (document.visibilityState === 'visible') {

                    //mywidget.setSpeedChangeListener(mywidget.onspeedchange);
                	translateTexts();
                	mywidget.ui.prepareMainUI();

                } else if(document.visibilityState === 'hidden') {

                    //mywidget.unsetSpeedChangeListener();
                }

            }
        );

        /**
         *  To launch the UI application when clicking the launch button on Stand Alone Mode.
         */
        mywidget.ui.body.onclick = function () {
        	//translateTexts();
        	if(mywidget.errorScreenActive == 1)
    		{
        		mywidget.application.launch();

                // Navigates to Companion Mode
                mywidget.ui.setMode(mywidget.COMPANION_MODE);
    		}
        	else
    		{
        		mywidget.currentWidgetAppearance = (mywidget.currentWidgetAppearance+1)%3;
        		tizen.preference.setValue('currentWidgetAppearance', mywidget.currentWidgetAppearance);
        		mywidget.ui.prepareMainUI();
    		}
        	
        };
        

        /**
         *  To check if the UI application is running.
         */
        if (mywidget.application.isRunning() === true) {

            //mywidget.setSpeedChangeListener(mywidget.onspeedchange);

            // Navigates to Companion Mode
            mywidget.ui.setMode(mywidget.COMPANION_MODE);

        } else {

            // Navigates to Stand Alone Mode
            mywidget.ui.setMode(mywidget.STAND_ALONE_MODE);

        }

        /**
         *  Sets a listener to get the state of the application
         */
        mywidget.application.setStateChangeListener(mywidget.onstatechange);
    };
    
    function MY_LOCALE(str)
    {
    	if(mywidget.currentLanguage === 'tr')
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
    	var withProperty = [],
        els = document.getElementsByTagName('span'), // or '*' for all types of element
        i = 0;

	    for (i = 0; i < els.length; i++) {
	        if (els[i].hasAttribute('data-l10n')) {
	        	els[i].textContent = MY_LOCALE(els[i].getAttribute('data-l10n'));
	        }
	    }
	    
	       	
    	/*
        for (var i = 0; i < jqElement.querySelectorAll('[data-l10n]').length; i++) {
            var elem = jqElement.querySelectorAll('[data-l10n]')[i];
            elem.textContent = TIZEN_L10N[elem.getAttribute('data-l10n')];
        }*/
    }

    function translateTexts() {
        //tizen.systeminfo.getPropertyValue("LOCALE", function(locale) {
            /*var tmp = locale.language.substring(0, 2);

            if (mywidget.supportedLanguages.indexOf(tmp) > -1) {
            	mywidget.currentLanguage = tmp;
            } else {
            	mywidget.currentLanguage = mywidget.defaultLanguage;
            }*/
    	if (tizen.preference.exists('currentLanguage') == false) 
    	{
    		mywidget.currentLanguage = 'en';
    	}
        else
    	{
        	mywidget.currentLanguage = tizen.preference.getValue('currentLanguage');
    	}
    	

            console.log('curr lang:' + mywidget.currentLanguage);

            translateElement(document);
       // });
    }

})();
