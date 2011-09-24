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

	dj.SbroadcastMedia(mId, *roomId)

By default it tells all the clients to display whatever media is indicated by mId. Supplying the roomId will only display the media to users in that particular room. You must search for the mId you want using `SfindMedia`

	dj.SfindMedia(searchQuery)

Crawls the database for media with the searchQuery as part of the tag and passes the result to `now.CreceiveSearchResults`

	dj.SaddMedia(path, tags)

Adds the media to the database. path is just the path to the media in question; tags is an array of strings.

	dj.SaddToRoom(roomId)

Adds the user who calls this function to the room.

	dj.SleaveRoom(*roomId)

By default, has the user who calls this function leave all the rooms, including the `everyone` namespace (i.e. a logout). When called with a roomId as an argument, has the user leave just that room.

#Groups Server Side Functionality
-----
	dj.SaddUser(uId)

Adds a user into our personal database.

	dj.SremoveUser(uId)

Removes a user from our personal database.

	dj.SloginUser(uId)

Logs a user out of our personal database.

	dj.subscribeToGroup(uId, groupId)

Subscribes a user to a group.

	dj.unsubscribeToGroup(uId, groupId)

Unsubscribes a user from a group.

Inserts a user into our personal userdatabase.

#Client Side Guide

	now.CreceiveSearchResults(results)

You need to write this. results is an array of JSON of this form:

```javascript
{
	path:
	tags:
}
``` 

##Quickest Start Guide
1. Include the required stuff server side.
2. Implement now.CreceiveSearchResults(result) client side.

FAQ
------
**Q**: Did someone actually accidentally delete the entire codebase?

A: No, he actually only deleted half of it.

**Q**: What's up with the strange naming scheme? I don't like the C's and S's in front of your function names.

A: It's because we've had trouble in the past writing code that utilized NowJS. Since it blurred the client server borders, we often got confused about whether functions were server-side or client-side, so to save us (and hopefully you!) from headaches we decided to do this.

Further Information
------------
Rainbow Dash is the best pony <3
