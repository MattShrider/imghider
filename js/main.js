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
   switch ($('#selector').val()){
      case("caesar"):
      break;
      case("affine"):
         div.innerHTML = "<input type='range' name='red' min='0' max='16581375' id='redshift' value='10'>"
         $('#redshift').change(drawEncryption);
         console.log("it changed, dummy");
      break;
      case("vigenere"):
      break;
      case("aes"):
      break;
      default:
         console.log("Yur dumb u haker");
   }

}
//add listener to combo box
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
      switch($("#selector").val()){
         case("caesar"):
            var red = parseInt($("#redshift").val());
            var blue = parseInt($("#blueshift").val());
            var green = parseInt($("#greenshift").val());

            document.getElementById("output").innerHTML = red + ", " + green + ", " + blue;
            ctx.putImageData(shiftCipher(data, red, green, blue), 0, 0);
         break;
         case("affine"):
            var key = parseInt($('#redshift').val());
            ctx.putImageData(affineCipher(data, key), 0, 0);
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

         data.data[i] = (data.data[i] + 256 - keyred) % 256;
         data.data[i+1] = (data.data[i+1] + 256 - keygreen) % 256;
         data.data[i+2] = (data.data[i+2] + 256 - keyblue) % 256;

      }
   }

   return data;
}

function affineCipher(data, key) {
   if (encrypting){
      for (var i=0; i<data.data.length; i+=4){
         data.data[i] = (data.data[i] + (key & 255)) % 256;
         data.data[i+1] = (data.data[i+1] + ((key >> 8) & 255)) % 256;
         data.data[i+2] = (data.data[i+2] + ((key >> 16) & 255)) % 256;
      }
   } else {

   }

   return data;
}

