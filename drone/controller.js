var io = require('socket.io').listen(3002);
io.set('log level', 1);

var drones = ["192.168.1.1", "192.168.1.201"];

io.sockets.on('connection', function (socket) {
    var arDrone = require('ar-drone');
    var client1 = arDrone.createClient({ip:drones[0]});
    var client2 = arDrone.createClient({ip:drones[1]});

    client1.config('control:altitude_max', '10000');
    client2.config('control:altitude_max', '10000');

    setInterval(function(){
        var batteryLevel1 = client1.battery();
        socket.emit('event', { name: 'battery1',value: batteryLevel1});
    },1000);

    setInterval(function(){
        var batteryLevel2 = client2.battery();
        socket.emit('event', { name: 'battery2',value: batteryLevel2});
    },1000);

    setInterval(function(){
        var altitudeLevel1 = client1._lastAltitude;
        socket.emit('event', { name: 'altitude1',value: altitudeLevel1});
    },1000);

    setInterval(function(){
        var altitudeLevel2 = client2._lastAltitude;
        socket.emit('event', { name: 'altitude2',value: altitudeLevel2});
    },1000);

    var currentState="";
    var drone2=true;

    socket.on('event', function (data) {
        if(data.name=="drone2"){
          if(drone2)
          {
            drone2=false;
            console.log("Browser asked Ar Drone 2 to be offline and land");
            client2.land();
          }
          else
          {
            drone2=true;
            console.log("Browser asked Ar Drone 2 to be online");
          }
        }
        if(data.name=="takeoff"){
            currentState="takeoff";
            console.log("Browser asked Ar Drone to Take Off");
            client1.takeoff();
            if(drone2)
              client2.takeoff();
        }
        if(data.name=="hover"){
            if(currentState!="hover"){
                console.log("Browser asked Ar Drone to Stay and Hover");
                client1.stop();
                if(drone2)
                  client2.stop();
                currentState="hover";
            }
        }
        if(data.name=="land"){
            currentState="land";
            console.log("Browser asked Ar Drone to Land");
            client1.land();
            if(drone2)
              client2.land();
        }
        if(data.name=="up"){
            if(currentState!="up"){
                console.log("Browser asked Ar Drone to gain Altitude");
                client1.up(0.5);
                if(drone2)
                  client2.up(0.5);
                currentState="up";
            }
        }
        if(data.name=="down"){
            currentState="down";
            console.log("Browser asked Ar Drone to lose Altitude");
            client1.down(0.5);
            if(drone2)
              client2.down(0.5);
        }
        if(data.name=="front"){
            currentState="front";
            var speed=Math.abs(data.value*1.42);
            console.log("Browser asked Ar Drone to go ahead @"+speed*100+"% speed");
            client1.front(speed);
            if(drone2)
              client2.front(speed);
            client1.after(1000,function(){
                if(currentState!="hover"){
                console.log("Browser asked Ar Drone to Stay and Hover");
                client1.stop();
                if(drone2)
                  client2.stop();
                currentState="hover";
                }
            })
        }
        if(data.name=="back"){
            currentState="back";
            var speed=Math.abs(data.value*1.42);
            console.log("Browser asked Ar Drone to go back @"+speed*100+"% speed");
            client1.back(speed);
            if(drone2)
              client2.back(speed);
            client1.after(1000,function(){
                if(currentState!="hover"){
                console.log("Browser asked Ar Drone to Stay and Hover");
                client1.stop();
                if(drone2)
                  client2.stop();
                currentState="hover";
                }
            })
        }
        if(data.name=="left"){
            currentState="left";
            var speed=Math.abs(data.value*1.66);
            console.log("Browser asked Ar Drone to go left @"+speed*100+"% speed");
            client1.left(speed);
            if(drone2)
              client2.left(speed);
            client1.after(1000,function(){
                if(currentState!="hover"){
                console.log("Browser asked Ar Drone to Stay and Hover");
                client1.stop();
                if(drone2)
                  client2.stop();
                currentState="hover";
                }
            })
        }
        if(data.name=="right"){
            currentState="right";
            var speed=Math.abs(data.value*1.66);
            console.log("Browser asked Ar Drone to go right @"+speed*100+"% speed");
            client1.right(speed);
            if(drone2)
              client2.right(speed);
            client1.after(1000,function(){
                if(currentState!="hover"){
                console.log("Browser asked Ar Drone to Stay and Hover");
                client1.stop();
                if(drone2)
                  client2.stop();
                currentState="hover";
                }
            })
        }
        if(data.name=="emergency"){
            currentState="emergency";
            console.log("Browser asked Ar Drone to disable emergency");
            client1.disableEmergency();
            if(drone2)
              client2.disableEmergency();
        }
        if(data.name=="flipLeft"){
            console.log("Browser asked Ar Drone to flip left");
            client1.animate('flipLeft', 1000);
            if(drone2)
              client2.animate('flipLeft', 1000);
        }
        if(data.name=="flipAhead"){
            console.log("Browser asked Ar Drone to flip ahead");
            client1.animate('flipAhead', 1000);
            if(drone2)
              client2.animate('flipAhead', 1000);
        }
        if(data.name=="flipBehind"){
            console.log("Browser asked Ar Drone to flip behind");
            client1.animate('flipBehind', 1000);
            if(drone2)
              client2.animate('flipBehind', 1000);
        }
        if(data.name=="flipRight"){
            console.log("Browser asked Ar Drone to flip right");
            client1.animate('flipRight', 1000);
            if(drone2)
              client2.animate('flipRight', 1000);
        }
        if(data.name=="clockwise"){
            console.log("Browser asked Ar Drone to rotate clockwise");
            client1.clockwise(0.5);
            if(drone2)
              client2.clockwise(0.5);
            client1.after(1000,function(){
                console.log("Browser asked Ar Drone to Stay and Hover");
                client1.stop();
                if(drone2)
                  client2.stop();
            })
        }
        if(data.name=="counterClockwise"){
            console.log("Browser asked Ar Drone to rotate counter clockwise");
            client1.counterClockwise(0.5);
            if(drone2)
              client2.counterClockwise(0.5);
            client1.after(1000,function(){
                console.log("Browser asked Ar Drone to Stay and Hover");
                client1.stop();
                if(drone2)
                  client2.stop();
            })
        }
        if(data.name=="calibrate"){
            console.log("Browser asked Ar Drone to calibrate");
            client1.calibrate(0);
            if(drone2)
              client2.calibrate(0);
        }
    });
});
