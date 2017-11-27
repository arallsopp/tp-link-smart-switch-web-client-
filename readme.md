## TP-Link HS100 Web Client

### Why?

TP-Link give you access to your HS-100 range devices through the KASA app on IOS / Android. That's fine, but what if you're
in front of your desktop / tablet / etc, and don't have your phone to hand? How annoying to have to fish it out of your pocket
just to flick a switch. 

This angular material web-page provides the service TP-Link omitted. You can log into the TP-Link API to generate a service token,
have it look up the devices stored against your account, monitor and set their power state. 

If you've just added TP-Link devices to a smart home network and want to be able to control them all from one place, you can 
examine the source of this project and utilise the calls within your own pages. Or just use this one :)


### Features:

 - generates a UUID
 - capture credentials.
 - authenticates against the tp-link api service to get a secure authentication token
 - uses that token to:
  - list the devices stored against your account
  - send on/off commands to them.
  - reflect whether the devices are currently on or not.
 - optionally stores the token (and/or credentials) so that you can jump straight to it next time.
 
 
### Notes:

If you opt to store your token or credentials, these are held in a browser cookie on *your* machine. In use, they are sent directly from your
browser to the TP-Link API endpoint via https, and are not sent to any other web host.

### To do:

Look for further features.

### Implementation:

See codepen at: https://codepen.io/arallsopp/pen/pdZQWG