// Global Variables
// Stores the currently-visible layer, initially set to the very first screen
var visibleLayerId;

// Stores the file we're in!
var firstFileName;

// Stores all the file names
var allFileNames;

// An entry for each screen; its value is the filename
var allScreenNames;

function getFileName() {
  return ((document.location).toString().split('/')[(document.location).toString().split('/').length-1]);
}

// This one is used to initially hide all layers
function hideAllLayers(layers) {
  
  for (layer in layers) {
	hideLayer(layers[layer]);
  }
  return;
}

// This one is just used at the beginning to set the initial / very first screen to visible
function showLayerById(layer) {
  document.getElementById(layer).setAttribute('style', 'display: inline');
  return;
}

function showLayer(layer) {
  layer.setAttribute('style', 'display: inline');
  return;
}

// Just thought this would be handy
function hideLayerById(layer) {
  document.getElementById(layer).setAttribute('style', 'display: none');
  return;
}

function hideLayer(layer) {
  layer.setAttribute('style', 'display: none');
  return;
}

// This just runs through and processes all the layers and sets their IDs to be the same as the layer name in Inkscape's UI so it's much easier to consistenly refer to screens
function inkscapeLayersToIDs() {

  var layers = new Array();
  var groups = document.querySelectorAll("g");
  for (var group in groups) {
     if(/* the group can have its attributes retrieved => */ groups[group].getAttributeNS && /* the group has a label => */ groups[group].getAttributeNS("http://www.inkscape.org/namespaces/inkscape",'label') && /* the group has a groupmode set to layer => */ groups[group].getAttributeNS("http://www.inkscape.org/namespaces/inkscape",'groupmode')==='layer' && /* the group id starts with the substring 'layer' => */ groups[group].getAttributeNS(null,"id").substring(0,5)==='layer' && /* the matching substring isn't null => */ groups[group].getAttributeNS(null,"id").substring(0,5) != 'null') {
        layers[groups[group].getAttributeNS("http://www.inkscape.org/namespaces/inkscape",'label')] = groups[group];
        groups[group].setAttributeNS(null,"id",groups[group].getAttributeNS("http://www.inkscape.org/namespaces/inkscape",'label'));
     }
  }
  return layers;

}

// This one's for moving between screens within the same file.
function nextScreen(evt,layer) {
  // hide the currently-visible layer
  document.getElementById(visibleLayerId).setAttribute('style', 'display: none');

  // is the passed-in layer in this file?
  if (document.getElementById(layer)) {
	// make the passed-in layer visible
	document.getElementById(layer).setAttribute('style', 'display: inline');
	// set the visibleLayerId variable to the new visible layer
	visibleLayerId = layer;
	return;
  }
 
  // if the passed-in layer is not in this file, look it up.
  if (allScreenNames[layer]) {
  	document.location.href = allScreenNames[layer]+"#"+layer;
  return;
  }
}

function indexScreensInFile(filename) {
  var request = new XMLHttpRequest();

  // instead of hardcoding here, could get document.location and strip off everything after last '/'
  // is it href or not?
 // if ('file:///home/duffy/SparkleShare/fedora-ux/Projects/Anaconda/Prototypes/Screens/'+filename != document.location.href /* don't load the file into itself, or you'll cross the streams.*/) {
	request.open('GET', 'file:///home/duffy/SparkleShare/fedora-ux/Projects/Anaconda/Prototypes/Screens/'+filename, false);
  	request.send(null);
	if (request.status == 0) {
		var xmlThingy = request.responseXML;
  		var layers = new Array();
  		var groups = xmlThingy.documentElement.querySelectorAll("g");
  		for (var group in groups) {
     			if(/* the group can have its attributes retrieved => */ groups[group].getAttributeNS && /* the group has a label => */ groups[group].getAttributeNS("http://www.inkscape.org/namespaces/inkscape",'label') && /* the group has a groupmode set to layer => */ groups[group].getAttributeNS("http://www.inkscape.org/namespaces/inkscape",'groupmode')==='layer' && /* the group id starts with the substring 'layer' => */ groups[group].getAttributeNS(null,"id").substring(0,5)==='layer' && /* the matching substring isn't null => */ groups[group].getAttributeNS(null,"id").substring(0,5) != null) {
				var label = groups[group].getAttributeNS("http://www.inkscape.org/namespaces/inkscape",'label');
				//alert('screen in '+filename+' and screen name is '+label);
        			groups[group].setAttributeNS(null,"id",groups[group].getAttributeNS("http://www.inkscape.org/namespaces/inkscape",'label'));
				//alert('groups[group] is a '+groups[group]);
        			layers[label] = filename;
				//alert('layers[label] for '+label+' is '+layers[label]);
				//alert('layers[label] is '+layers[label]);
     			}
  		}
  		return layers;
 	 }
//}

return null;

}

function addFileName(filename) {
  allFileNames.push(filename);
  var screens = new Array();
  screens = indexScreensInFile(filename);
  allFileNames[filename] = screens;
  for (mockup in screens) {
	//alert('mockup is '+mockup+' and screens[mockup] is '+screens[mockup]);
 	allScreenNames[mockup]=screens[mockup];
  }
  return;
}

function listAllFileNames() {
  alert(allFileNames.toString());
}


function listAllScreenNames() {
  var screenstring = '';
  for (mockup in allScreenNames) {
	screenstring = screenstring.concat(mockup+": "+allScreenNames[mockup]+", ");
  }
  alert(screenstring);
}

function init() {
 
  allFileNames = new Array();
  allScreenNames = new Array();
  addFileName('01-welcome.svg');
  addFileName('02-preinstall_hub.svg');
  addFileName('03-progress_hub2.svg');
  addFileName('04-datetime.svg');
  addFileName('05-language.svg');
  addFileName('06-keyboard.svg');
  addFileName('07-software.svg');
  addFileName('08-installsource.svg');
  addFileName('09-storage.svg');
  addFileName('10-useraccount.svg');
  addFileName('11-register.svg');
  addFileName('12-license.svg');
  var layers = inkscapeLayersToIDs();
  hideAllLayers(layers);
  filename = getFileName();
  for (mockup in allScreenNames) {
    visibleLayerId = mockup;
  }
  // if there's a '#' character in the URL we're at ... use it as the target screen id
  if (filename.indexOf('#') >= 0) {
   visibleLayerId = filename.slice(filename.indexOf('#')+1,filename.length+1);
  } 
 showLayerById(visibleLayerId);
 //listAllScreenNames();
 //alert(getFileName());
}

