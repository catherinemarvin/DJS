###DJS makes media-sharing sites easy to make!

<a href="https://github.com/khwang/DJS">Check out the github</a>


##What is DJS?

DJS is a Node.JS module built on top of Now and MongoDB. It is a media distribution framework. Simply spin up a Node server and plug DJS in and serve up all sorts of media in real-time with no server-side Javascript necessary. Media can mean anything from YouTube videos, pictures, and even webpages. We also support a public subscription model and groups, for discriminating customers.

Install from npm
----------------

`npm install djs` or `npm install djs -g` for a global installation. You may have to also `npm install mongodb`.



##Public API

```javascript
	
	var server = express.createServer(...)
	var nowjs = require('now');
	var everyone = nowjs.initialize(server, {socketio:{"log level": process.argv[2]}});
	...
	var dj = require('djs')
	dj.initialize(server, nowjs, everyone)

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

Adds the user who calls this function to the room. If the room didn't exist before you made this call, you will create it. 

	now.SleaveRoom(*roomId)

By default, has the user who calls this function leave all the rooms, including the `everyone` namespace (i.e. a logout). When called with a roomId as an argument, has the user leave just that room.

	now.Sapply(functionName, *args, *roomId)
	
By default, applies the callback function on all members of the `everyone` group, i.e. everybody who is on the server. Providing the optional `roomId` argument causes the callback to only be applied for members in the room. Note that the callback function must be in the now pocketspace.

#Groups Server Side Functionality
-----
	now.SaddUser(uId)

If you wish to use our groups functionality then you must let us know about the users in your system. Call this when you add a user to your own DB. 

	now.SremoveUser(uId)

Call this when you remove a user from your database. 

	now.SloginUser(uId, *callback, *args)

Call this when a user logs in to your application. This will put him back into all the groups that he was subscribed to. Optionally, you can have a callback be called after a user is logged out. Note that if you wish to provide arguments they must be an array of arguments to your callback. Also note that your callback function must be in the `everyone.now` pocketspace. 

The reason the callback is necessary is that login performs a database operation and so if you were to call Sapply on any group the user is logged in, the user won't receive the function since the user won't be added to the group for a while as database operations are expensive.

	now.SlogoutUser(uId)

Call this when a user logs out of your application. This will remove him from the groups that he was subscribed to but we will remember to put him back in those groups when he logs back in.

	now.subscribeToGroup(uId, groupId)

Subscribes a user to a group, and adds him to the group.

	now.unsubscribeToGroup(uId, groupId)

Unsubscribes a user from a group, and removes him from the group.

Keep in mind that these are different from NowJS groups because these groups will persist beyond client log-in and log-out. 

#Client Side Initialization

1. Include dclient.js on the client side.
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

##Quickest Start Guide (tl;dr)
1. Include djs server side.
2. Initialize the client playback function.
3. Be super productive.

FAQ
------
**Q**: Did someone actually accidentally delete the entire codebase?

A: No, he actually only deleted half of it.

**Q**: What's up with the strange naming scheme? I don't like the C's and S's in front of your function names.

A: It's because we've had trouble in the past writing code that utilized NowJS. Since it blurred the client server borders, we often got confused about whether functions were server-side or client-side, so to save us (and hopefully you!) from headaches we decided to do this.

**Q**: What's the difference between rooms and groups?

A: Rooms don't persist. If the server goes down, or the client disconnects, the client won't return to rooms they were connected to. Groups will persist. 

**Q**: What's up with your strange numbering scheme? Why does it start
at 0.0.2?

A: 0.0.0 was us claiming "djs" as a unique package name and 0.0.1 was us
publishing something broken accidentally. Yes we realize we could have unpublished on npm but starting at 0.0.2 also lets us give the impression that we've already iterated once through a design cycle.

Further Information
------------
We have two examples at the moment. They're both incredibly hacky, but they were also built in about 30 minutes from scratch each, which includes all the wayward Facebook browsing. Information on how to run them is included in READMEs present in each example folder.
