###DJS makes media-sharing sites easy to make!

<a href="https://github.com/khwang/DJS">Check out the github</a>

Install from npm (doesn't actually work yet)
----------------

`npm install djs` or `npm install djs -g` for a global installation.

DJS is a Node.JS module built on top of Now and MongoDB

##Public API

```javascript
	
	var server = express.createServer(...)
	...
	var dj = require('djs')
	dj.initialize(server)

```

Note: Any arguments with * are optional

#Bare Bones Server Side Functionality
------

	now.SbroadcastMedia(mId, *roomId, callback)

By default it tells all the clients to display whatever media is indicated by mId. Supplying the roomId will only display the media to users in that particular room. You must search for the mId you want using `SfindMedia`. The callback expects an argument `mediainfo`, which is a JSON object of this form. The callback has to be in the now space.

````javascript
{
	path: path_to_media
	tags: [array, of, tags]
	metadata: JSON of your choice
}
````

	now.SfindMedia(searchQuery, callback)

Crawls the database for media with the searchQuery as part of the tag and passes the result to the callback function as an array of JSON objects of this form:

````javascript
{ 
	path: path_to_media
	tags: [array, of, tags]
	metadata: JSON of your choice
}
````

	now.SaddMedia(path, tags, metadata)

Adds the media to the database. path is just the path to the media in question; tags is an array of strings. Metadata is a JSON object of your choice!!!

	now.SaddToRoom(roomId)

Adds the user who calls this function to the room.

	now.SleaveRoom(*roomId)

By default, has the user who calls this function leave all the rooms, including the `everyone` namespace (i.e. a logout). When called with a roomId as an argument, has the user leave just that room.

#Groups Server Side Functionality
-----
	now.SaddUser(uId)

Adds a user into our personal database.

	now.SremoveUser(uId)

Removes a user from our personal database.

	now.SloginUser(uId)

Logs a user out of our personal database.

	now.subscribeToGroup(uId, groupId)

Subscribes a user to a group.

	now.unsubscribeToGroup(uId, groupId)

Unsubscribes a user from a group.

Inserts a user into our personal userdatabase.

#Client Side Initialization

1. Include d.js on the client side.
2. Call initialize with a JSON object of this type:
````javascript
 initialize({
	playback: playback(mediaInfo)
})

````
playback is your own provided function that takes mediaInfo as an argument. mediaInfo is of this form:

````javascript
{ 
	path: path_to_media
	tags: [array, of, tags]
	metadata: JSON of your choice
}
````

##Quickest Start Guide
1. Include djs server side.
2. Initialize the client stuff.

FAQ
------
**Q**: Did someone actually accidentally delete the entire codebase?

A: No, he actually only deleted half of it.

**Q**: What's up with the strange naming scheme? I don't like the C's and S's in front of your function names.

A: It's because we've had trouble in the past writing code that utilized NowJS. Since it blurred the client server borders, we often got confused about whether functions were server-side or client-side, so to save us (and hopefully you!) from headaches we decided to do this.

Further Information
------------
Rainbow Dash is the best pony <3
