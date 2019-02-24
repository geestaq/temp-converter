'use strict';

let coldWidget = document.getElementsByClassName('cold')[0];
let hotWidget = document.getElementsByClassName('hot')[0];
let thermoLevel = document.querySelector(".thermometer .level");
let ouputTemp = document.querySelector(".converter .output");
//do przesuwania bg
let converter = document.querySelector(".converter");
let thermoDiv = document.querySelector(".thermometer");

//funkcja do ustawiania widocznosci widgetow hot/cold
let toggleWidget = function(el, mode) {
	if(mode == 'show') {
		el.style.height = '200px';
	} else {
		el.style.height = '0px';
	}
};

/*
termometr
*/
let thermometer = {
	//aktualne temp
	currentC: 0,
	currentF: 0,
	minTempC: -273.15,
	maxTempC: 200,
	//ustawienie temperatury na termometrze
	setTemp: function(unit, value) {
		if(unit == 'C') {
			this.currentC = parseFloat(value);
			this.calcTemp('F');
		} else {
			this.currentF = parseFloat(value);
			this.calcTemp('C');
		}
		//pokazanie wyniku
		this.showOutput();
	},
	//funkcja wylicza temperature
	//outputUnit - jednostka wyjciowa
	calcTemp: function(outputUnit) {
		//dane wejsciowe
		let input = this.currentC;
		if(outputUnit == 'C') input = this.currentF;

		//jednostka wynikowa
		if(outputUnit == 'F') {
			//wyliczenie stopni F
			this.currentF = Math.round(input * 1.8 + 32, 2);
		} else {
			//wyliczenie stopni C
			this.currentC = Math.round((input - 32) / 1.8, 2);
		}
	},
	//wylicza przesuniecie w px pomiedzy temp min a aktualna uwzgledniajac rozne skale termometru
	calcDeltaPx: function() {
		let scales = [
			{
				minTempC: -273.15, //temp. min. zakresu
				maxTempC: 200, //temp maks. zakresu
				rangeDeg: 50, //skala - przedzial temperatur
				rangePx: 134.7 //skala - przedzial pikseli dla przedzialu temperatur
			},
			{
				minTempC: 200.01, //temp. min. zakresu
				maxTempC: 400, //temp maks. zakresu
				rangeDeg: 200, //skala - przedzial temperatur
				rangePx: 73 //skala - przedzial pikseli dla przedzialu temperatur
			},
			{
				minTempC: 400.01, //temp. min. zakresu
				maxTempC: 1000, //temp maks. zakresu
				rangeDeg: 200, //skala - przedzial temperatur
				rangePx: 66.5 //skala - przedzial pikseli dla przedzialu temperatur
			},
			{
				minTempC: 1000.01, //temp. min. zakresu
				maxTempC: 5000, //temp maks. zakresu
				rangeDeg: 1000, //skala - przedzial temperatur
				rangePx: 134.5 //skala - przedzial pikseli dla przedzialu temperatur
			},
			{
				minTempC: 5000.01, //temp. min. zakresu
				maxTempC: 10000, //temp maks. zakresu
				rangeDeg: 3000, //skala - przedzial temperatur
				rangePx: 160 //skala - przedzial pikseli dla przedzialu temperatur
			},
			{
				minTempC: 10000.01, //temp. min. zakresu
				maxTempC: 100000, //temp maks. zakresu
				rangeDeg: 90000, //skala - przedzial temperatur
				rangePx: 100 //skala - przedzial pikseli dla przedzialu temperatur
			},
			{
				minTempC: 100000.01, //temp. min. zakresu
				maxTempC: 1000000, //temp maks. zakresu
				rangeDeg: 900000, //skala - przedzial temperatur
				rangePx: 99.5 //skala - przedzial pikseli dla przedzialu temperatur
			},
			{
				minTempC: 1000000.01, //temp. min. zakresu
				maxTempC: 10000000, //temp maks. zakresu
				rangeDeg: 9000000, //skala - przedzial temperatur
				rangePx: 100 //skala - przedzial pikseli dla przedzialu temperatur
			},
			{
				minTempC: 10000000.01, //temp. min. zakresu
				maxTempC: 100000000, //temp maks. zakresu
				rangeDeg: 90000000, //skala - przedzial temperatur
				rangePx: 99.5 //skala - przedzial pikseli dla przedzialu temperatur
			},
			{
				minTempC: 100000000.01, //temp. min. zakresu
				maxTempC: 1000000000, //temp maks. zakresu
				rangeDeg: 900000000, //skala - przedzial temperatur
				rangePx: 99.5 //skala - przedzial pikseli dla przedzialu temperatur
			},
			{
				minTempC: 1000000000.01, //temp. min. zakresu
				maxTempC: 500000000000, //temp maks. zakresu
				rangeDeg: 499000000000, //skala - przedzial temperatur
				rangePx: 45 //skala - przedzial pikseli dla przedzialu temperatur
			},
			{
				minTempC: 500000000000.01, //temp. min. zakresu
				maxTempC: 1000000000000, //temp maks. zakresu
				rangeDeg: 500000000000, //skala - przedzial temperatur
				rangePx: 55 //skala - przedzial pikseli dla przedzialu temperatur
			},
		];
		//roznica pomiedzy min temp a aktualna
		let deltaC = this.currentC - this.minTempC;// +273.15;
		//ograniczenie min wartosci - przesuwac tylko do zera absolutnego
		if(deltaC <= 0) deltaC = 0;
		//ograniczenie max wartosci - przesuwac tylko do triliona
		if(deltaC <= 1000000000000) deltaC = 1000000000000;

		//wyliczenie przesuniecia px
		let deltaPx = 0;
		scales.forEach((item) => {
			//czy temp. w zakresie
			if(this.currentC >= item.minTempC && this.currentC <= item.maxTempC) {
				//zmiana temp. w tym zakresie
				let deltaCTmp = this.currentC - item.minTempC;
				//przesuniecie w zakresie
				deltaPx += Math.round((deltaCTmp / item.rangeDeg) * item.rangePx);
				//break; //koniec obliczen
			} else if(this.currentC < item.minTempC) {
				//temp. ponizej zakresu
				//deltaPx += item
			} else {
				//temp. powyzej zakresu
				//zmiana temp. w tym zakresie
				//let deltaCTmp = this.currentC - item.maxTempC;
				let deltaCTmp = item.maxTempC - item.minTempC;
				//przesuniecie w zakresie
				deltaPx += Math.round((deltaCTmp / item.rangeDeg) * item.rangePx);
			}
		});

		return deltaPx;
	},
	//pokazanie aktualnej temperatury
	//50deg = 123px
	//250deg = 614px
	//-273.15 = 80px / 190px
	//0 = 817px / 927px
	showOutput: function() {
		//wyliczenie przesuniecia px od min temp do aktualnej
		let deltaPx = this.calcDeltaPx();
		//thermoLevel.style.top = (80 + deltaPx) + "px";
		//ouputTemp.style.top = (190 + deltaPx) + "px";
		converter.style.backgroundPosition = "center " + (-130 - deltaPx) + "px";
		thermoDiv.style.top = (150 - deltaPx) + "px";
		thermoLevel.style.top = (80 + deltaPx) + "px";

		document.querySelector('.converter .outputC .value').innerHTML = this.currentC;
		document.querySelector('.converter .outputF .value').innerHTML = this.currentF;

		//widgety
		if(this.currentC <= -273) {
			toggleWidget(coldWidget, 'show');
		} else {
			toggleWidget(coldWidget, 'hide');
		}
		if(this.currentC >= 1000000000000) {
			toggleWidget(hotWidget, 'show');
		} else {
			toggleWidget(hotWidget, 'hide');
		}
	}
};

thermometer.setTemp('C', 0);

let buttonCalculateC = document.getElementsByClassName('btn-calc-c')[0];
buttonCalculateC.addEventListener('click', function(event) {
	let temp = document.querySelector('input[name="temperature"]').value;
	thermometer.setTemp('F', temp);
});

let buttonCalculateF = document.getElementsByClassName('btn-calc-f')[0];
buttonCalculateF.addEventListener('click', function(event) {
	let temp = document.querySelector('input[name="temperature"]').value;
	thermometer.setTemp('C', temp);
});
