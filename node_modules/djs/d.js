var nowjs = require('now');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

var server
exports.initialize = function (theServer) {
	server = theServer
	var everyone = nowjs.initialize(server, {socketio:{"log level": process.argv[2]}});
	
	module.exports = everyone.now;
	
	var usercoll;
	var mediacoll;
	var db = new Db('djs', new Server("localhost", 27017, {}), {native_parser:false});
	db.open(function(err, conn) {
		db = conn;
		db.collection('userinfo', function(err, coll) {
			usercoll = coll;
		});
		db.collection('mediainfo', function(err, coll) {
			mediacoll = coll;
		});
	});
	
	everyone.now.SbroadcastMedia = function (mId, roomId) {
		var self = this
		//usercoll.findOne({isKing: true}, function (err, doc) {
		//	if (doc.uId == self.user.clientId) {
			if (roomId != undefined) {
				mediacoll.findOne({_id: new db.bson_serializer.ObjectID(mId)}, function (err, doc) {
					var room = nowjs.getGroup(roomId);
					room.now.playback(doc);
					//callback(doc)
					console.log(doc.metadata.t)
				});
			} else {
				mediacoll.findOne({_id: new db.bson_serializer.ObjectID(mId)}, function (err, doc) {
					console.log(doc)
					everyone.now.playback(doc);
					console.log(doc.metadata.t)
					//callback(doc);
				});
			}
		//	}
		//});
	}
	
	everyone.now.SgetCurrentMedia = function () {
		
	}
	
	everyone.now.SfindMedia = function (searchQuery, callback) {
		searchQuery = ("" + searchQuery).toLowerCase();
		var self = this;
		if (searchQuery === "") {
			var cursor = mediacoll.find({});
		 	cursor.toArray(function(err, array) {
				callback(array);
			});
		} else {
			var cursor = mediacoll.find({tags: searchQuery});
			cursor.toArray(function(err, array) {
				callback(array);
			});
		}
	}
	
	everyone.now.SaddMedia = function (path, tags, metadata) {
		
		mediacoll.insert(
			{
				path: path,
				tags: tags,
				metadata: metadata
			});
	}
	
	
	everyone.now.SaddToRoom = function (roomId) {
		var self = this;
		var group = nowjs.getGroup(roomId);
		group.addUser(self.user.clientId);
		
	}
	
	everyone.now.SleaveRoom = function (roomId) {
		var self = this;
		this.getGroups(function (groups) {
			if (roomId) {
				for (var i = groups.length; i--;) {
					if (groups[i] == roomId) {
						nowjs.getGroup(groups[i]).removeUser(self.user.clientId);
					}
				}
			} else {
				for (var i = groups.length; i--;) {
					nowjs.getGroup(groups[i]).removeUser(self.user.clientId);
				}
			}
		});
	}
	
	everyone.now.Sapply = function (functionName, args, roomId) {
		console.log("huehuehue")
		var room
		var fn

		if (args === undefined && roomId === undefined) { //did not provide args or roomId
			console.log('nope')
			roomId = "everyone"
			args = []
		}  else if (args instanceof Array && roomId === undefined) { //provided args
			console.log('guaranteed')
			roomId = "everyone"
		} else if (args instanceof String) { //provided roomId
			console.log('nonono')
			roomId = args
			args = []
		} //provided errything
		console.log(functionName + ' ' + args + ' ' + roomId)
		var room = nowjs.getGroup(roomId);
		var fn = room.now[functionName]
		fn.apply(fn, args)
	}

	//groups prototypes
	everyone.now.SaddUser = function (uId) {
		console.log("ADDING USER")
		var self = this;
		
		usercoll.insert(
			{
				uId: uId,
				groups: [ ] 
			});
	}
	
	everyone.now.SremoveUser = function (uId) {
		var self = this;
		
		usercoll.remove(
			{
				uId: uId
			});
	}
	
	everyone.now.SloginUser = function (uId, callback, args) {
		var self = this;
		usercoll.findOne({uId: uId}, function (err,doc) {
			for( var i in doc.groups){
				nowjs.getGroup(doc.groups[i]).addUser(self.user.clientId)
			}
			if (args) {
				var room = nowjs.getGroup('everyone')
				
				var fn = room.now[callback]
				fn.apply(fn, args)
			} else if (callback) {
			
				
				var room = nowjs.getGroup('everyone')
				var fn = room.now[callback]
				fn.apply(fn, [])
			}
		});


	}
	
	everyone.now.SlogoutUser = function (uId, callback, args) {
		var self = this;
		usercoll.findOne({uId: uId}, function (err,doc) {
			for( var i in doc.groups){
				nowjs.getGroup(doc.groups[i]).removeUser(self.user.clientId)
			}
			if (args) {
				var room = nowjs.getGroup('everyone')
				var fn = room.now[callback]
				fn.apply(fn, args)
			} else if (callback) {
				var room = nowjs.getGroup('everyone')
				var fn = room.now[callback]
				fn.apply(fn, [])
			}

		});
	}
	
	everyone.now.subscribeToGroup = function (uId, groupId) {
		nowjs.getGroup(groupId).addUser(this.user.clientId);
		var self = this;
		usercoll.findOne({uId: uId}, function (err,doc) {
			var newdoc = doc.groups.push(groupId);
			usercoll.update({uId: uId}, doc, function (err, doc){
				
			});


		});
	}
	
	everyone.now.unsubscribeFromGroup = function (uId, groupId){
		nowjs.getGroup(groupId).removeUser(this.user.clientId);
		var self = this;
		usercoll.findOne({uId: uId}, function (err,doc) {
			var i = 0;
			while( doc.groups[i] != groupId && i < doc.groups.length ){
				if (i == doc.groups.length-1){
					return;
				}
				i = i + 1;
			}
			
			
			
			newdoc = doc.groups.splice(i,1);
			
			usercoll.update({groups: newdoc}, doc, function (err, doc){
				
			});
		})
	}
}
