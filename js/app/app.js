var startApp = function() {
	// $.mobile.listview.prototype.options.theme = "c";
	console.log('App Started *');
	
	var placeholderPhotoNote = [{
		title:"No Entry Found",
		imgurl:"img/logo.png",
		comment :"Add Photos please?"
	}];
	
	var Notes = {
		init: function(config){
			console.log("init:");
			this.template = config.template;
			this.container = config.container;
			this.fetch();
		},

		attachTemplate: function(){
			console.log("attachTemplate:");
			var template = Handlebars.compile( this.template );
			var html = template( this.fotolistdata );
			this.container.empty();
			this.container.append(html);
			this.container.listview("refresh");
		},

		fetch: function(){
			console.log("fetch:");
			this.fotolistdata = getPhotoNotelistdata();
			this.attachTemplate();			
		}
	}	

	$( '#home' ).live( 'pageinit',function(event){
		console.log("home: pageinit");
		refreshPhotoListData();
	});
	
	$( '#editor' ).live( 'pagebeforeshow',function(event){
		console.log("editor: pagebeforeshow");
		$('#cameraPic').attr('src', "img/logo.png");
		$('#title').val("");
		$('#comments').val("");
	});
		
	$("#takePhotoButton").live("tap", function() {
       navigator.camera.getPicture(uploadPhoto,null,{sourceType:1,quality:60});
    });
	
	$("#addphotonote").live("tap", function() {
		console.log("addphotonote");
		var id = new Date().getUTCMilliseconds();
		myObj = {
			id : id,
			imgurl : $('#cameraPic').attr('src'),
			title : $('#title').val(),
			comment : $('#comments').val()
		};
		addToStorage(id,myObj);
		refreshPhotoListData();
		$.mobile.changePage("index.html", {transition:"turn", reverse:true});
	});
	
	function refreshPhotoListData() {
		console.log("refreshPhotoListData");
		Notes.init({
		   template: $('#photonoteTempl').html(),
		   container: $('ul.photonotes')	
		});
	}
	
	function uploadPhoto(data){
	    // this is where you would send the image file to server
	    //output image to screen
	    console.log('upload photo: ' + data);
	    cameraPic.src =  data;
	};

	//loading from storage
	function getStorage(){
		var current = localStorage["fotolist"];
		var data = {};
		if(typeof current != "undefined") data=window.JSON.parse(current);
		return data
	}

	//save storage
	function saveStorage(data){
		console.log("To store...");
		console.log(data);
		localStorage["fotolist"] = window.JSON.stringify(data);
	}

	//Adding to storage
	function addToStorage(id,myObj){
		if (!hasInStorage(id)) {
			var data = getStorage();
			data[id] = myObj;
			saveStorage(data);
		}
	}	

	//removing from storage
	function removeFromStorage(id){
		if (hasInStorage(id)) {
			var data = getStorage();
			delete data[id];
			console.log('removed '+id);
			saveStorage(data);
		}
	}	

	//Checking storage
	function hasInStorage(id){
		return (id in getStorage());
	}
	
	function getPhotoNotelistdata() {
		console.log("getPhotoNotelistdata");
		var fotos = getStorage();
		if (!$.isEmptyObject(fotos)) {
			if (Object.keys(fotos).length == 0) {
				console.log("fotos length 0");
				return placeholderPhotoNote;
			} else {
				var notelist = [];
				for (var key in fotos) {
					notelist.push(fotos[key]);
				}
				console.log("list data:", notelist);
				return notelist;
			}
		} else {
			console.log("isEmptyObject null");
			return placeholderPhotoNote;
		}
	}
	
	function getPamarByName(url, paramName){ 
		var strGET = url.substr(url.indexOf('?')+1,url.length - url.indexOf('?')); 
		var arrGET = strGET.split("&"); 
		var paramValue = '';
		for(i=0;i<arrGET.length;i++){ 
		      var aux = arrGET[i].split("="); 
		      if (aux[0] == paramName){
		            paramValue = aux[1];
		      }
		} 
		return paramValue;
	}
	
};