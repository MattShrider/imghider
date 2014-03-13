/* **********************************************
 * This project will allow a user to select a file,
 * and a type of encryption, and then see what effects
 * the encryption has on the file.
 *
 * Author: Matthew Shrider
 * **********************************************/


Number.prototype.mod = function(n) {
   return ((this%n)+n)%n;
}

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

   var red = parseInt($("#redshift").val());
   var blue = parseInt($("#blueshift").val());
   var green = parseInt($("#greenshift").val());

   document.getElementById("output").innerHTML = red + ", " + green + ", " + blue;

   var data = beforectx.getImageData(0, 0, before.width, before.height);

   console.log(data);
   if (data.data.length != 0){
      switch($("#selector").val()){
         case("caesar"):
               ctx.putImageData(shiftCipher(data, red, green, blue), 0, 0);
         break;
         case("affine"):
         break;
         case("vigenere"):
         break;
         case("aes"):
         break;
         default:
         console.log("Yur dumb u haker");
      }
   }
}

/* Add the draw function to the range inputs */
document.getElementById("redshift").addEventListener('change', drawEncryption, false);
document.getElementById("greenshift").addEventListener('change', drawEncryption, false);
document.getElementById("blueshift").addEventListener('change', drawEncryption, false);

/* **********************************************************
 * begin functions
 * *********************************************************/

function shiftCipher(data, keyred, keygreen, keyblue) {
   console.log(keyred, keygreen, keyblue);

   // Encrypt
   if (encrypting){
      for (var i=0; i<data.data.length; i+=4){

         data.data[i] = (data.data[i] + keyred) % 256;
         data.data[i+1] = (data.data[i+1] + keygreen) % 256;
         data.data[i+2] = (data.data[i+2] + keyblue) % 256;
      }

   }else{

      for (var i=0; i<data.data.length; i+=4){

         data.data[i] = (data.data[i] - keyred).mod(256);
         data.data[i+1] = (data.data[i+1] - keygreen).mod(256);
         data.data[i+2] = (data.data[i+2] - keyblue).mod(256);

      }
   }

   return data;
}


