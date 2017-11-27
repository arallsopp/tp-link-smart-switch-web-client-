##TP-Link HS100 Web Client

###Why?

TP-Link give you access to your HS-100 range devices through the KASA app on IOS / Android. That's fine, but what if you're
in front of your desktop / tablet / etc, and don't have your phone to hand? How annoying to have to fish it out of your pocket
just to flick a switch. 

This angular material web-page provides the service TP-Link omitted. You can log into the TP-Link API to generate a service token,
have it look up the devices stored against your account, monitor and set their power state. 

If you've just added TP-Link devices to a smart home network and want to be able to control them all from one place, you can 
examine the source of this project and utilise the calls within your own pages. Or just use this one :)


##Heads up: Work in progress

###Able to:

 - generate a UUID
 - capture credentials.
 - authenticate against the tp api service to get a token
 - list the devices stored against your account
 - send on/off commands to them.
 - reflect whether the devices are currently on or not.
 
 
###Notes:

Credentials are stored in a local cookie and not submitted to any server, except for the tpa api.

###To do:

Much.

