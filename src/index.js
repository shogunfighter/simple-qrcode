import {QRCode} from "/node_modules/qrcodejs/qrcode.js";

let generateSerial = (serialLength = 20) => {
    let chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        randomSerial = "",
        randomNumber;

    for (let i = 0; i < serialLength; i = i + 1) {
        randomNumber = Math.floor(Math.random() * chars.length);
        randomSerial += chars.substring(randomNumber, randomNumber + 1);
    }
    return randomSerial;
};

let inp, el1, el2, el3;

let initInterface = () => {
	inp = document.getElementById("inputData");
	
	inp.addEventListener("change", updateQrImage);
	
	el1 = document.getElementById("qrcode1");
	el2 = document.getElementById("qrcode2");
	el3 = document.getElementById("qrcode3");
};

let updateQrImage = () => {
	el1.innerHTML = '';
	el2.innerHTML = '';
	el3.innerHTML = '';
	
    new QRCode(el1, {
        text: inp.value,
        width: 100,
        height: 100,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    new QRCode(el2, {
        text: inp.value,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    new QRCode(el3, {
        text: inp.value,
        width: 300,
        height: 300,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
};

window.onload = () => {
    initInterface();
	
	inp.value = generateSerial(20);
	updateQrImage();  
};