webpackJsonp([1],{

/***/ 110:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 110;

/***/ }),

/***/ 152:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/auth-check/auth-check.module": [
		274,
		0
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 152;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 195:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__about_about__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__contact_contact__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(200);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var TabsPage = (function () {
    function TabsPage() {
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_1__about_about__["a" /* AboutPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_2__contact_contact__["a" /* ContactPage */];
    }
    return TabsPage;
}());
TabsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"C:\~y\~ionic\poma-profile\src\pages\tabs\tabs.html"*/'<ion-tabs>\n  <ion-tab [root]="tab1Root" tabTitle="Home" tabIcon="home"></ion-tab>\n  <ion-tab [root]="tab2Root" tabTitle="About" tabIcon="information-circle"></ion-tab>\n  <ion-tab [root]="tab3Root" tabTitle="Contact" tabIcon="contacts"></ion-tab>\n</ion-tabs>\n'/*ion-inline-end:"C:\~y\~ionic\poma-profile\src\pages\tabs\tabs.html"*/
    }),
    __metadata("design:paramtypes", [])
], TabsPage);

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 196:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AboutPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_date_picker__ = __webpack_require__(197);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/* import { DatePickerModule } from 'datepicker-ionic2';
import { DatePickerDirective } from 'ion-datepicker'; */
var AboutPage = (function () {
    function AboutPage(navCtrl, datePicker) {
        this.navCtrl = navCtrl;
        this.datePicker = datePicker;
    }
    AboutPage.prototype.showDatePicker = function () {
        this.datePicker.show({
            date: new Date(),
            mode: 'date'
            /* ,
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK */
        }).then(function (date) { return console.log('Got date: ', date); }, function (err) { return console.log('Error occurred while getting date: ', err); });
    };
    return AboutPage;
}());
AboutPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-about',template:/*ion-inline-start:"C:\~y\~ionic\poma-profile\src\pages\about\about.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      About\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n\n  <ion-buttons text-center>\n    <!-- {{ this.date }} -->\n    <button clear style="background-color:#f6f7f8" icon-left (click)="showDatePicker()">\n      <ion-icon name="calendar">\n      </ion-icon>\n    </button>\n</ion-buttons>\n\n\n</ion-content>'/*ion-inline-end:"C:\~y\~ionic\poma-profile\src\pages\about\about.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_date_picker__["a" /* DatePicker */]])
], AboutPage);

//# sourceMappingURL=about.js.map

/***/ }),

/***/ 198:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContactPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise__ = __webpack_require__(269);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(102);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






//import { AngularFireAuth } from 'angularfire2/auth';
//@IonicPage()
var ContactPage = (function () {
    //, private afAuth: AngularFireAuth
    function ContactPage(navCtrl, http, storage) {
        this.navCtrl = navCtrl;
        this.http = http;
        this.storage = storage;
    }
    ContactPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.storage.get('groovyKey').then(function (val) {
            var token = val;
            //console.log('retrieved token: ' + token);
            //skenney - 1003682710
            //fun - 1003890650
            //configuring for local server vs. remote hosting on firebase
            //http://localhost:8100/api/v1/profile/me
            //https://profile-testing-7452b.firebaseapp.com/api/v1/profile/me
            //pomaHeaders.set('GET', '/api/v1/profile/me HTTP/1.1'); // TRY WITHOUT THIS
            var pomaHeaders = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Headers */];
            pomaHeaders.set('Accept', 'application/json');
            pomaHeaders.append('Content-Type', 'application/json');
            pomaHeaders.append('Authorization', 'Bearer ' + token);
            //pomaHeaders.append('Cache-Control', 'no-cache');
            // /api/v1/profile/me
            var options = new __WEBPACK_IMPORTED_MODULE_2__angular_http__["d" /* RequestOptions */]({
                headers: pomaHeaders
            });
            //this.http.get('http://localhost:8100/app/memberclicks', options)
            //this.http.get('http://localhost:5000/memberclicks', options)
            //https://us-central1-poma-functions-db0c6.cloudfunctions.net/memberclicks
            //this.http.get('https://us-central1-poma-functions-db0c6.cloudfunctions.net/app/memberclicks', options)
            _this.http.get('https://us-central1-poma-cme-57533.cloudfunctions.net/app/memberclicks', options)
                .map(function (res) { return res.json(); }) // Instead of getting the _body manually, you can use the map method from RxJS
                .subscribe(function (data) {
                _this.data = data;
                console.log('? ' + _this.data);
                var lastName = _this.data["[Name | Last]"];
                var firstName = _this.data["[Name | First]"];
                var suffix = _this.data["[Suffix]"];
                //this.login(emailAddress, password);
                if (suffix == 'D.O.') {
                    _this.greeting = "Greetings Dr. " + lastName + ',';
                }
                else {
                    _this.greeting = "Greetings " + firstName + ' ' + lastName;
                }
            }, function (error) {
                console.log('error: ' + error);
            });
        });
    };
    return ContactPage;
}());
ContactPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-contact',template:/*ion-inline-start:"C:\~y\~ionic\poma-profile\src\pages\contact\contact.html"*/'<html>\n  <head>\n    <meta charset="utf-8" />\n    <meta http-equiv="Access-Control-Allow-Origin" content="*">\n  </head>\n</html>  \n\n<ion-header>\n  <ion-navbar>\n    <ion-title>\n      Contact\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-list>\n    <ion-list-header>Test Greeting:</ion-list-header>\n    <ion-item>\n      <ion-icon name="ionic" item-start></ion-icon>\n      {{ this.greeting }}\n    </ion-item>\n  </ion-list>\n\n<!-- <ion-item>\n  <h2>{{ item.name.first | uppercase }}</h2>\n</ion-item> -->\n\n<!--   <ion-item *ngFor="let item of items">\n    <h2>{{ item.Name.First | uppercase }}</h2>\n  </ion-item> -->\n\n</ion-content>\n'/*ion-inline-end:"C:\~y\~ionic\poma-profile\src\pages\contact\contact.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["b" /* Storage */]])
], ContactPage);

//# sourceMappingURL=contact.js.map

/***/ }),

/***/ 200:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(102);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var HomePage = (function () {
    function HomePage(navCtrl, http, storage) {
        this.navCtrl = navCtrl;
        this.http = http;
        this.storage = storage;
    }
    HomePage.prototype.ionViewDidLoad = function () {
        // need to build this as an observable
        // angular might be this simple: Observable<Response> ob = this.http.get(this.url); 
        //    alert('home page load');
        var myParam = location;
        //.search.split('access_token=')[1];
        //    alert('url ' + myParam);
        var stringUrl = myParam.toString();
        //    alert('stringUrl ' + myParam);
        if (stringUrl.split('access_token=')[1]) {
            var finallyParse = stringUrl.split('access_token=')[1];
            //    alert('finallyParse Access Token= |' + finallyParse + '|');
            //    console.log('finallyParse Access Token= "' + finallyParse + '"');
            var newParse = finallyParse.split('&')[0];
            //    console.log('next Parse ' + newParse);
            this.storage.set('groovyKey', newParse);
        }
    };
    return HomePage;
}());
HomePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-home',template:/*ion-inline-start:"C:\~y\~ionic\poma-profile\src\pages\home\home.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>POMA CME Report</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <h2>Welcome to Ionic!</h2>\n  <p>\n    This starter project comes with simple tabs-based layout for apps\n    that are going to primarily use a Tabbed UI.\n  </p>\n  <p>\n    Take a look at the <code>src/pages/</code> directory to add or change tabs,\n    update any existing page or create new pages.\n\n\n<!--   <a href="https://poma.memberclicks.net/oauth/v1/authorize?response_type=code&client_id=2zmDM0ch997q0vAjSB3t&scope=read&&redirect_uri=<redirectURI>localhost:8137">test</a>" -->\n\n<!--   <a href="https://poma.memberclicks.net/oauth/v1/authorize?response_type=code&client_id=2zmDM0ch997q0vAjSB3t&scope=read&state=<state>&redirect_uri=<redirectURI>">test</a>" -->\n\n<!--   <a href="https://poma.memberclicks.net/oauth/v1/authorize?response_type=code&client_id=2zmDM0ch997q0vAjSB3t&scope=read&redirect_uri=https%3A%2F%2Fwww.google.com">test without uri</a> -->\n\n<br>\n<br>\n<br>\n\n\n<!-- THIS LINK BELOW RETURNS AN ACCESS TOKEN -->\n<!-- THE REDIRECT URI IN THE LINK CORRESPONDS TO ONE I SET UP IN THE MEMBERCLICKS API ADMIN -->\n<!-- CLICKING THESE LINKS CREATES A REDIRECT WITH AN ACCESS TOKEN THAT EXPIRES\nTHE TYPESCRIPT PAGE GRABS THE ACCESS TOKEN FROM THE URL AND PUTS IT INTO LOCAL STORAGE WHERE IT IS USED FOR FULL USER-SPECIFIC AUTHENTICATION IN THE CONTACTS PAGE -->\n    <a href="https://poma.memberclicks.net/oauth/v1/authorize?response_type=token&client_id=2zmDM0ch997q0vAjSB3t&scope=read&redirect_uri=http%3A%2F%2Flocalhost:8100">Log in from localhost</a>\n    <!-- state=8d152e78-3df5-11e6-ac61-9e71128cae77 -->\n\n<!-- IF MEMBER IS LOGGED IN, DO WE EVEN NEED THIS STEP? -->\n\n<!-- configuring to work from firebase hosting: https://profile-testing-7452b.firebaseapp.com -->\n\n<br>\n<br>\n\ntest\n<br>\n\n<!-- https%3A%2F%2F -->\n<a href="https://poma.memberclicks.net/oauth/v1/authorize?response_type=token&client_id=2zmDM0ch997q0vAjSB3t&scope=read&redirect_uri=https://poma-cme-57533.firebaseapp.com/">Log in from firebase hosting</a>\n\n\n<br><br>\n<!--     <a href="https://poma.memberclicks.net/oauth/v1/authorize?response_type=code&client_id=2zmDM0ch997q0vAjSB3t&scope=read">Authorization Code Grant Type Request</a> -->\n\n    \n    \n<!-- \n<br>    \n\n    <a href="https://poma.memberclicks.net/oauth/v1/authorize?response_type=token&client_id=2zmDM0ch997q0vAjSB3t&scope=read">Implicit Grant Type Request Minimum</a>\n -->\n  </p>\n</ion-content>\n'/*ion-inline-end:"C:\~y\~ionic\poma-profile\src\pages\home\home.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* Http */], __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */]])
], HomePage);

/*  this.http.get('https://poma.memberclicks.net/oauth/v1/authorize?response_type=code&client_id=2zmDM0ch997q0vAjSB3t&scope=read&redirect_uri=http%3A%2F%2Flocalhost:8139')
.map(res => res.json())
.subscribe(data => {
  console.log(data);
});

*/
/*  RESULTS OF THE IMPLICIT GRANT TYPE REQUEST - ACCESS TOKEN EXPIRES IN AN HOUR
    http://localhost:8139/#access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiIxMDAzNjgyNzEwIiwic2NvcGUiOlsicmVhZCJdLCJleHAiOjE1MDg5Nzc1NDEsInNlcnZpY2VJZCI6ODMwMywidXNlcklkIjoxMDAzNjgyNzEwLCJhdXRob3JpdGllcyI6WyJST0xFX1BST0ZJTEVfQURNSU4iLCJST0xFX0FTQSIsIlJPTEVfRk9STVNfQURNSU4iLCJST0xFX01FTUJFUlNISVBfQURNSU4iLCJST0xFX0NNU19BRE1JTiIsIlJPTEVfVVNFUiIsIlJPTEVfRklOQU5DSUFMX0FETUlOIiwiUk9MRV9SRVBPUlRJTkdfQURNSU4iLCJST0xFX0FETUlOIiwiUk9MRV9DT01NVU5JVFlfQURNSU4iLCJST0xFX1BST0ZJTEVfSU1QT1JUX0FETUlOIl0sImp0aSI6ImM5Nzk2ZGZiLWFlOGMtNGI3Mi05MjViLTY0ZDg5ZjUyNjQwNiIsImNsaWVudF9pZCI6IjJ6bURNMGNoOTk3cTB2QWpTQjN0In0.-scPy0qcjgyIlXWA9mgbzGRToh2IEZOBRuRoVAWtt6M
    &token_type=bearer
    &state=8d152e78-3df5-11e6-ac61-9e71128cae77
    &expires_in=3600
    &serviceId=8303
    &userId=1003682710
    &jti=c9796dfb-ae8c-4b72-925b-64d89f526406
 */
//    let decodedUrl = decodeURIComponent(myParam);
//    this.urlParam = location;
/*
if (location.search.length > 0) {
  let myParam = location.search.split('#')[1];
  alert('url ' + myParam);
  let access_token = myParam.split('access_token=');
} */
//let myParam = location.search.split('viewid=')[1];
//# sourceMappingURL=home.js.map

/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(202);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(220);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 220:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(260);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_about_about__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_contact_contact__ = __webpack_require__(198);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_home_home__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_tabs_tabs__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_status_bar__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_splash_screen__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_storage__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__angular_http__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_date_picker__ = __webpack_require__(197);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




//import { RequestOptions, Http } from '@angular/http';









// THIS APP WILL BE INTEGRATED INTO THE C:\~y\~ionic\pomo-devapp-monitor> APP 
// HOME - CREATES ACCESS TOKEN
// CONTACT - USES ACCESS TOKEN TO FULLY AUTHENTICATE CURRENT USER TO GET TO PROFILE DATA
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_4__pages_about_about__["a" /* AboutPage */],
            __WEBPACK_IMPORTED_MODULE_5__pages_contact_contact__["a" /* ContactPage */],
            __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */],
            __WEBPACK_IMPORTED_MODULE_7__pages_tabs_tabs__["a" /* TabsPage */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_11__angular_http__["c" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {}, {
                links: [
                    { loadChildren: '../pages/auth-check/auth-check.module#AuthCheckPageModule', name: 'AuthCheckPage', segment: 'auth-check', priority: 'low', defaultHistory: [] }
                ]
            }),
            __WEBPACK_IMPORTED_MODULE_10__ionic_storage__["a" /* IonicStorageModule */].forRoot()
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_4__pages_about_about__["a" /* AboutPage */],
            __WEBPACK_IMPORTED_MODULE_5__pages_contact_contact__["a" /* ContactPage */],
            __WEBPACK_IMPORTED_MODULE_6__pages_home_home__["a" /* HomePage */],
            __WEBPACK_IMPORTED_MODULE_7__pages_tabs_tabs__["a" /* TabsPage */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_8__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_9__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_12__ionic_native_date_picker__["a" /* DatePicker */],
            { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicErrorHandler */] }
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 260:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_tabs_tabs__ = __webpack_require__(195);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_tabs_tabs__["a" /* TabsPage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    return MyApp;
}());
MyApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"C:\~y\~ionic\poma-profile\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"C:\~y\~ionic\poma-profile\src\app\app.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
], MyApp);

//# sourceMappingURL=app.component.js.map

/***/ })

},[201]);
//# sourceMappingURL=main.js.map