# Drone-Gesture-Control
Human Gesture Control of Multiple Quadcopter Drones

###About
In this work, an intuitive way for controlling quadcopters has been proposed. This human computer interface uses hand gestures to control multiple quadcopters simultaneously, and is compatible across multiple operating systems such as Linux, Mac and Windows. A web-interface has also been developed for live video streaming. This gesture based interface has been demonstrated using commercially available Parrot AR Drone and Leap Motion Controller. 

###Setup

####Drones Configuration
The drones used are Parrot AR.Drone 2.0

These instructions are for using two drones

1. Telnet to each drone to remotely access its directory
2. Type ```vi /data/config.ini``` to change its settings
3. Change network mode to ad-hoc (value=1)
4. Alter the SSID so that both drones have the same one
5. Type ```vi /bin/wifi_setup.sh``` and change the ip so that both drones have diffent ip's (192.168.1.1 and 192.168.1.201 have been used in the code)

###LEAP Motion Configuration (Optional)

1. Download the Leap motion SDK
2. Connect the controller (A red light should show on the controller)

###Usage

1. Connect to the drones wifi
2. Navigate to the repository
3. Type the command ```node server.js```

Open a browser a navigate to ```localhost:3000```, you should see this screen

![Screenshot](Web Interface.jpg?raw=true "Screenshot")

In this you can choose to use the on screen controls, or use the LEAP motion controller. Its also optional to use two drones you can disable one of the drones through the interface.

###LEAP Motion Gestures

1. Take-Off (Make a fist)
2. Land (Remove hand from range)
3. Up-Down (Take hand up or down)
4. Navigate (Tilt hand in the desired direction)


###Acknowledgements
This project used this [ardrone-nodejs-browser-control](https://github.com/rohitghatol/ardrone-nodejs-browser-control) as a starting point.


