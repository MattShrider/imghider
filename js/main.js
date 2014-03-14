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
   window.open(dataURL);
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
         div.innerHTML = "<input type='range' name='red' min='0' max='16581375' id='redshift' value='10'>";
         $('#redshift').change(drawEncryption);
      break;
      case("affine"):
         div.innerHTML = "<input type='range' name='red' min='0' max='16581375' id='redshift' value='10'>";
         div.innerHTML = "<input type='range' name='red' min='0' max='16581375' id='redshift' value='10'>";
         $('#redshift').change(drawEncryption);
      break;
      case("vigenere"):
      break;
      case("aes"):
      break;
      case("xorShuffle"):
         div.innerHTML = "<input type='range' name='red' min='0' max='16777216' id='redshift' value='10'>";
         $('#redshift').change(drawEncryption);
      break;
      default:
         console.log("Yur dumb u haker");
   }

}
//add listener to combo box
$('#selector').change(changeCipher);
$('#redshift').change(drawEncryption);

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
            ctx.putImageData(affineCipher(data, key), 0, 0);
         break;
         case("vigenere"):
         break;
         case("aes"):
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
   if (encrypting){
      for (var i=0; i<data.data.length; i+=4){
         
      }
   } else {

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