/* **********************************************
 * This project will allow a user to select a file,
 * and a type of encryption, and then see what effects
 * the encryption has on the file.
 *
 * Author: Matthew Shrider
 * **********************************************/

/* Get our "before" canvas */
var before=document.getElementById("img1");
before.width = 300;
before.height = 300;
var beforectx = before.getContext("2d");
var encrypted, decrypted;

var encrypting = true;

/* Get our visible canvas */
var can=document.getElementById("img2");
can.width = 300;
can.height = 300;
var ctx=can.getContext("2d");

/* Create an invisible canvas for saving files in the full size */
var offscreen = document.createElement('canvas');
var ctxoff=offscreen.getContext("2d");

var imgData;

/* Variables used to check if an affine key is ok */
var goodRed, goodBlue, goodGreen = true;

function fileChanged(e) {
   console.log(e);
   var files = e.target.files;

   readFile(files[0]);
}

//add listener to the upload button
var uploadButton = document.getElementById('filechooser');
uploadButton.addEventListener('change', fileChanged, false);
save.addEventListener('click', function(){
   var dataURL = can.toDataURL("image/png");
   Canvas2Image.saveAsPNG(can);
}, false);

function changeCipher(){
   console.log("changing cipher");
   var div = $('#sliders')[0];
   console.log(div);
   var data = beforectx.getImageData(0, 0, before.width, before.height);
   var pixels = data.data.length / 4;
   console.log(pixels);

   switch ($('#selector').val()){
      case("caesar"):
         div.innerHTML = "<input type='range' name='red' min='0' max='16581375' id='redshift' value='10'>" + 
	 "<br/><input type='number' name='keynum' value='10' min='0' max='16581375' id='num1'>";
         $('#redshift').change(function(){ $('#num1').val($(this).val()); drawEncryption()});
	 $('#num1').change(function(){ $('#redshift').val($(this).val()); drawEncryption()});
      break;
      case("affine"):
         div.innerHTML = "<input type='range' name='red' min='0' max='16581375' id='shift1' value='1'>" +
         "<input type='range' name='red' min='0' max='16581375' id='shift2' value='10'>" +
	 "<br/><input type='number' name='keynum' value='65793' min='0' max='16581375' id='num1'> " +
	 "<input type='number' name='keynum' value='0' min='0' max='16581375' id='num2'>";
         $('#shift1').change(function(){$('#num1').val($(this).val()); drawEncryption()});
         $('#shift2').change(function(){$('#num2').val($(this).val()); drawEncryption()});
	      $('#num1').change(function(){$('#shift1').val($(this).val()); drawEncryption()});
	      $('#num2').change(function(){$('#shift2').val($(this).val()); drawEncryption()});
      break;
      case("vigenere"):
         div.innerHTML = "<input type='range' name='red' min='0' max='16581375' id='redshift' value='10'>" + 
            "<br/><input type='number' name='keynum' value='10' min='0' max='16581375' id='num1'>";
         $('#redshift').change(function(){ $('#num1').val($(this).val()); drawEncryption()});
         $('#num1').change(function(){ $('#redshift').val($(this).val()); drawEncryption()});
      break;
      case("aes"):
         div.innerHTML = "<input type='text' name='keynum' id='num1'>";
         $('#num1').change(function(){ $('#num1').val($(this).val()); drawEncryption()});

         var encrypted = '' + CryptoJS.AES.encrypt("message", "pass");
            console.log(encrypted);
 
         var decrypted = CryptoJS.AES.decrypt(encrypted, "pass");
            console.log(decrypted.toString(CryptoJS.enc.Utf8));


      break;
      case("xorShuffle"):

         div.innerHTML ="<input type='range' name='red' min='0' max='16581375' id='redshift' value='10'>" + 
            "<br/><input type='number' name='keynum' value='10' min='0' max='16581375' id='num1'>";
         $('#redshift').change(function(){ $('#num1').val($(this).val()); drawEncryption()});
         $('#num1').change(function(){ $('#redshift').val($(this).val()); drawEncryption()});

     "<input type='range' name='red' min='0' max='16777216' id='redshift' value='10'>";
         $('#redshift').change(drawEncryption);
      break;
      default:
         console.log("Yur dumb u haker");
   }

}
//add listener to combo box
$('#redshift').change(function(){ $('#num1').val($(this).val()); drawEncryption()});
$('#num1').change(function(){ $('#redshift').val($(this).val()); drawEncryption()});
$('#selector').change(changeCipher);

/* Gets the file URL of a dropped file onto the page */
function droppedFile(e) {
   console.log(e);
   e.stopPropagation();
   e.preventDefault();

   var files = e.dataTransfer.files;
   readFile(files[0]);
}

/* Stylizes the drop effect of dropping a file onto the page */
function draggedFile(e) {
   e.stopPropagation();
   e.preventDefault();
   e.dataTransfer.dropEffect = 'copy';
}

//add drop listener to container for listeners to be called
var dropElement = document.getElementById('container');
dropElement.addEventListener('dragover', draggedFile, false);
dropElement.addEventListener('drop', droppedFile, false);

// Toggle encrypting variable
$("#encrypt, #decrypt").change(function (){
   encrypting = $("#encrypt")[0].checked;
   console.log(encrypting);
});


/* load the opened file into the website (img1) */
function readFile(file){

   var reader = new FileReader();

   reader.onload = (function(theFile) {
      return function(e) {

   
         /* After loading, create and draw the images */
         createContext(e.target.result);
      };
      })(file);

   reader.readAsDataURL(file);
}

/* This function creates our drawing elements, and will draw both the
 * before image, and the after image to the screen */
function createContext(imgurl){
   console.log(imgurl);

   /* Create an image object from our data url (from reader) */
   var image = new Image();
   image.src=imgurl;

   beforectx.drawImage(image, 0, 0, 300, 300);
   ctxoff.drawImage(image, 0, 0);

   /* Before drawing, apply a cipher to the second image */
   imgData = beforectx.getImageData(0,0, before.width, before.height);

   drawEncryption();
}

/* Helper function chooses which encryption type to use */
function drawEncryption(){

   var data = beforectx.getImageData(0, 0, before.width, before.height);

   console.log(data);
   if (data.data.length != 0){

      var key = parseInt($('#redshift').val());

      switch($("#selector").val()){
         case("caesar"):
            ctx.putImageData(shiftCipher(data, key), 0, 0);
         break;
         case("affine"):
            var multiplyKey = parseInt($('#shift1').val());
            var additionKey = parseInt($('#shift2').val());
            ctx.putImageData(affineCipher(data, multiplyKey, additionKey), 0, 0);
         break;
         case("vigenere"):
            ctx.putImageData(shiftCipher(data, key), 0, 0);
         break;
         case("aes"):

            var key = $('#num1').val();
            /* TODO - handle aes text files */
            /*
            if (encrypting){
               var data = '' + CryptoJS.AES.encrypt(datastring, key);
            } else {
               var data = CryptoJS.AES.decrypt(str, key);
            }
            */
            ctx.putImageData(aesCipher(data, key), 0, 0);
  
         break;
         case("xorShuffle"):
            ctx.putImageData(xorShuffleCipher(data, key), 0, 0);
         break;
         default:
         console.log("Yur dumb u haker");
      }
   }
}

/* **********************************************************
 * begin functions
 * *********************************************************/

function shiftCipher(data, key) {

   // Encrypt
   if (encrypting){
      for (var i=0; i<data.data.length; i+=4){

         data.data[i] = (data.data[i] + (key & 255)) % 256;
         data.data[i+1] = (data.data[i+1] + ((key >> 8) & 255)) % 256;
         data.data[i+2] = (data.data[i+2] + ((key >> 16) & 255)) % 256;

      }

   }else{

      for (var i=0; i<data.data.length; i+=4){
         data.data[i] = (data.data[i] + (256 - (key & 255))) % 256;
         data.data[i+1] = (data.data[i+1] + (256 - ((key >> 8) & 255))) % 256;
         data.data[i+2] = (data.data[i+2] + (256 - ((key >> 16) & 255))) % 256;
      }
   }

   return data;
}

function affineCipher(data, key) {

   // Encrypt
   if (encrypting){
      var offset = 0;
      for (var i=0; i<data.data.length; i+=4){
         offset += 273;

         data.data[i] = (data.data[i] + (key & 255) + (offset & 255)) % 256;
         data.data[i+1] = (data.data[i+1] + ((key >> 8) & 255) + (offset >> 8 & 255)) % 256;
         data.data[i+2] = (data.data[i+2] + ((key >> 16) & 255) + (offset >> 16 & 255)) % 256;
      }

   }else{
      for (var i=0; i<data.data.length; i+=4){
         offset += 273;

         data.data[i] = (data.data[i] + (256 - (key & 255 + (offset & 255)))) % 256;
         data.data[i+1] = (data.data[i+1] + (256 - ((key >> 8) & 255 + (offset >> 8 & 255)))) % 256;
         data.data[i+2] = (data.data[i+2] + (256 - ((key >> 16) & 255 + (offset >> 16 & 255)))) % 256;
      }
   }

   return data;
}

function affineCipher(data, multiplyKey, additionKey) {
   goodRed = true;
   goodBlue = true;
   goodGreen = true;
   if (encrypting){ for (var i=0; i<data.data.length; i+=4){

         goodRed = modinv(256, multiplyKey & 255)[1];
         goodBlue = modinv(256, multiplyKey >> 8 & 255)[1];
         goodGreen = modinv(256, multiplyKey >> 16 & 255)[1];
      
         data.data[i] = (data.data[i] * (multiplyKey & 255)) % 256;
         data.data[i+1] = (data.data[i+1] * ((multiplyKey >> 8) & 255)) % 256;
         data.data[i+2] = (data.data[i+2] * ((multiplyKey >> 16) & 255)) % 256;

         data.data[i] = (data.data[i] + (additionKey & 255)) % 256;
         data.data[i+1] = (data.data[i+1] + ((additionKey >> 8) & 255)) % 256;
         data.data[i+2] = (data.data[i+2] + ((additionKey >> 16) & 255)) % 256;
      }
   } else {
      for (var i=0; i<data.data.length; i+=4){

         data.data[i] = (data.data[i] + (256 - (additionKey & 255))) % 256;
         data.data[i+1] = (data.data[i+1] + (256 - ((additionKey >> 8) & 255))) % 256;
         data.data[i+2] = (data.data[i+2] + (256 - ((additionKey >> 16) & 255))) % 256;

         var r = modinv(multiplyKey & 255, 256)[0];
         var g = modinv((multiplyKey >> 8) & 255, 256)[0];
         var b = modinv((multiplyKey >> 16) & 255, 256)[0];

         data.data[i] = (data.data[i] * r) % 256;
         data.data[i+1] = (data.data[i+1] * g) % 256;
         data.data[i+2] = (data.data[i+2] * b) % 256;

      }
   }

   if (!goodRed){
      console.log("Bad red key of ", (multiplyKey & 255));
   }
   if (!goodBlue){
      console.log("Bad blue key of ", (multiplyKey >> 8 & 255));
   }
   if (!goodGreen){
      console.log("Bad green key of ", (multiplyKey >> 16 & 255));
   }

   return data;
}

function xorShuffleCipher(data, key) {

   var tempArray = beforectx.getImageData(0, 0, before.width, before.height);
   var length = data.data.length / 2

   if (encrypting){
      for (var i=0; i<data.data.length / 2; i+=4){

         // Bottom half becomes top half
         tempArray.data[i + length] = data.data[i];
         tempArray.data[i + 1 + length] = data.data[i + 1];
         tempArray.data[i + 2 + length] = data.data[i + 2];

         // Top half XORed with key
         tempArray.data[i] = (data.data[i] ^ (key & 255)) % 256;
         tempArray.data[i+1] = (data.data[i+1] ^ ((key >> 8) & 255)) % 256;
         tempArray.data[i+2] = (data.data[i+2] ^ ((key >> 16) & 255)) % 256;

         // Top half XORed with key XORed with bottom half
         tempArray.data[i] = (tempArray.data[i] ^ data.data[i + length]) % 256;
         tempArray.data[i+1] = (tempArray.data[i+1] ^ data.data[i + length + 1]) % 256;
         tempArray.data[i+2] = (tempArray.data[i+2] ^ data.data[i + length + 2]) % 256;

      }
   } else {

         for (var i=0; i<data.data.length / 2; i+=4){
            // Top half of temp becomes bottom half of data
            tempArray.data[i] = data.data[i + length];
            tempArray.data[i + 1] = data.data[i + 1 + length];
            tempArray.data[i + 2] = data.data[i + 2 + length];

            // Bottom half of temp becomes top half of temp XORed with key
            tempArray.data[i + length] = (tempArray.data[i] ^ (key & 255)) % 256;
            tempArray.data[i + 1 + length] = (tempArray.data[i+1] ^ ((key >> 8) & 255)) % 256;
            tempArray.data[i + 2 + length] = (tempArray.data[i+2] ^ ((key >> 16) & 255)) % 256;

            // Bottom half of temp becomes bottom half of temp XORed with top half of data
            tempArray.data[i + length] = (tempArray.data[i + length] ^ data.data[i]) % 256;
            tempArray.data[i + 1 + length] = (tempArray.data[i + 1 + length] ^ data.data[i + 1]) % 256;
            tempArray.data[i + 2 + length] = (tempArray.data[i + 2 + length] ^ data.data[i + 2]) % 256;
         }
   }

   return tempArray;
}

function aesCipher(data, key){

   var tempArray = beforectx.getImageData(0, 0, before.width, before.height);

   if (encrypting){
      var datastring = "";
      for (var i=0; i<tempArray.data.length; i+=4){

         datastring += padString(tempArray.data[i].toString(), 3);
         datastring += padString(tempArray.data[i + 1].toString(), 3);
         datastring += padString(tempArray.data[i + 2].toString(), 3);
         datastring += padString(tempArray.data[i + 3].toString(), 3);

      }

      var encrypted = '' + CryptoJS.AES.encrypt(datastring, key);
      var str = encrypted.toString();

      var decrypted = CryptoJS.AES.decrypt(str, key);
      var decstr = decrypted.toString(CryptoJS.enc.Utf8);


      for (var i=0; i<tempArray.data.length; i+= 4){
      tempArray.data[i] = ((str.charCodeAt(i) + str.charCodeAt(i+1) + str.charCodeAt(i+2)) & 255) % 256;
      tempArray.data[i+1] = (((str.charCodeAt(i+3) + str.charCodeAt(i+4) + str.charCodeAt(i+5))) & 255) % 256;
      tempArray.data[i+2] = (((str.charCodeAt(i+6) + str.charCodeAt(i+7) + str.charCodeAt(i+8))) & 255) % 256;
      }
      
      console.log(tempArray);
   } else {
      //TODO - implement decrypting
      var decrypted = CryptoJS.AES.decrypt(data, "pass");
      var decstr = (decrypted.toString(CryptoJS.enc.Utf8));

      for (var i=0; i<decstr.length / 3; i++){
         tempArray.data[i] = parseInt(decstr.slice(i*3, i*3+3));
      }
   }

   return tempArray;
}

function egcd(a,b){
   if (a == 0){
      var temp = {g: b, x: 0, y: 1};
      return temp;
   } else {
      var temp = egcd(b % a, a);
      var g = temp.g;
      var y = temp.x;
      var x = temp.y;
      temp = {g: g, x: x-Math.floor(b / a) * y, y: y};
      return temp;
   }
}

function modinv(a, m){
   var badAffine = true;
   var temp = egcd(a, m);
   var g = temp.g, x = temp.x, y=temp.y;
   if (g != 1){
      var badAffine = false;
      return [65793, badAffine];
   } else {
      return [((x % m) + m) % m, badAffine];
   }
}

function padString(str, num, c){
   var s = str;
   c = c || '0';
   while(s.length < num){
      s = c + s;
   }
   return s;
}