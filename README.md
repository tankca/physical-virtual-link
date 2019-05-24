
# Physical Virtual Link

A Web App that uses the gyroscope sensors on the user's mobile device (client) to manipulate a 3D model on a PC screen (server) using socket.io.

## How to use

NOTE: Make sure that your machine and mobile device are connected to the same network (SSID)

On your machine (Server side), run terminal and enter this:
```
$ cd physical-virtual-link
$ npm install
```
To run the server:
```
$ npm start
```
On a separate terminal window enter:
```
$ ifconfig (for MacOS)
$ ipconfig (for Windows)
```
to get your machine's ip address. (normally found at the en0 section)

Point your browser to `http://localhost:3000/display` which prompts you to enter a session ID.
Get the session ID on the mobile device.

On your mobile device (Client side)
Point your device browser to `http://(your machine ip here)`:3000/client.
The window should display values (alpha, beta, gamma) of your gyroscope, the scale size of the 3D model and the session id.
Take note of the session id and enter it on your machine browser.
