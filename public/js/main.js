$(function () {

            function startArDRoneStream() {
                new NodecopterStream(document.getElementById("placeholder"), {port: 3001});
            }

            function startArDroneController(){
                var socket = io.connect('http://localhost:3002');
                socket.on('connect', function () {
                    console.log("Connection Successful");

                });

                var altitude1;
                var altitude2;
                var lastCommand;

                socket.on('event', function (data) {

                    if(data.name=="battery1"){
			             $("#battery-value-1").css("width", data.value+"%");
                        document.getElementById('battery-value-1').innerHTML=data.value+'%';
                    }

                    if(data.name=="altitude1"){
                        altitude1=data.value;
                        document.getElementById('altitude-value-1').innerHTML=data.value+' m';
                    }

                    if(data.name=="battery2"){
			             $("#battery-value-2").css("width", data.value+"%");
                        document.getElementById('battery-value-2').innerHTML=data.value+'%';
                    }

                    if(data.name=="altitude2"){
                        altitude2=data.value;
                        document.getElementById('altitude-value-2').innerHTML=data.value+' m';
                    }
                });

                $("#takeoff").click(function(){
                    console.log("Asking Server to send takeoff command to Ar Drone");
                    socket.emit('event',{name:"takeoff"});
                });
                $("#hover").click(function(){
                    console.log("Asking Server to send hover command to Ar Drone");
                    socket.emit('event',{name:"hover"});
                });
                $("#land").click(function(){
                    console.log("Asking Server to send land command to Ar Drone");
                    socket.emit('event',{name:"land"});
                });
                $("#up").click(function(){
                    console.log("Asking Server to send go up command to Ar Drone");
                    socket.emit('event',{name:"up"});
                });
                $("#down").click(function(){
                    console.log("Asking Server to send go down command to Ar Drone");
                    socket.emit('event',{name:"down"});
                });
                $("#front").click(function(){
                    console.log("Asking Server to send go ahead command to Ar Drone");
                    socket.emit('event',{name:"front", value:0.35});
                });
                $("#back").click(function(){
                    console.log("Asking Server to send go back command to Ar Drone");
                    socket.emit('event',{name:"back", value:0.35});
                });
                $("#right").click(function(){
                    console.log("Asking Server to send go right command to Ar Drone");
                    socket.emit('event',{name:"right", value:0.3});
                });
                $("#left").click(function(){
                    console.log("Asking Server to send go left command to Ar Drone");
                    socket.emit('event',{name:"left", value:0.3});
                });
                $("#emergency").click(function(){
                    console.log("Asking Server to send disable emergency command to Ar Drone");
                    socket.emit('event',{name:"emergency"});
                });
                $("#flipLeft").click(function(){
                    console.log("Asking Server to send flip left command to Ar Drone");
                    socket.emit('event',{name:"flipLeft"});
                });
                $("#flipAhead").click(function(){
                    console.log("Asking Server to send flip ahead command to Ar Drone");
                    socket.emit('event',{name:"flipAhead"});
                });
                $("#flipBehind").click(function(){
                    console.log("Asking Server to send flip behind command to Ar Drone");
                    socket.emit('event',{name:"flipBehind"});
                });
                $("#flipRight").click(function(){
                    console.log("Asking Server to send flip right command to Ar Drone");
                    socket.emit('event',{name:"flipRight"});
                });
                $("#clockwise").click(function(){
                    console.log("Asking Server to send rotate clockwise command to Ar Drone");
                    socket.emit('event',{name:"clockwise"});
                });
                $("#counterClockwise").click(function(){
                    console.log("Asking Server to send rotate counter clockwise command to Ar Drone");
                    socket.emit('event',{name:"counterClockwise"});
                });
                $("#calibrate").click(function(){
                    console.log("Asking Server to send calibrate command to Ar Drone");
                    socket.emit('event',{name:"calibrate"});
                });

                var leap_motion=true;
								var drone_1=true;
								var drone_2=true;

                $("#leap").click(function(){
                    if(leap_motion==true){
                        leap_motion=false;
                        console.log("Leap Disabled");
                        $("#leap").removeClass('btn btn-success');
                        $("#leap").addClass('btn btn-danger');
                    }
                    else{
                        leap_motion=true;
                        console.log("Leap Enabled");
                        $("#leap").removeClass('btn btn-danger');
                        $("#leap").addClass('btn btn-success active');
                    }

                });

								$("#drone2").click(function(){
                    if(drone_2==true){
                        drone_2=false;
                        console.log("Drone 2 Offline");
                        socket.emit('event',{name:"drone2"});
                        $("#drone2").removeClass('btn btn-success');
                        $("#drone2").addClass('btn btn-danger');
                    }
                    else{
                        drone_2=true;
                        console.log("Drone 2 Online");
                        socket.emit('event',{name:"drone2"});
                        $("#drone2").removeClass('btn btn-danger');
                        $("#drone2").addClass('btn btn-success active');
                    }

                });

                var handString="";
                var pitchRadians=0;
                var rollRadians =0;
                var hand;
                var takeoff=false;
                var hover=false;
                var height=0;
                var options={enableGestures: true};
                Leap.loop(options, function(frame){
                    if(leap_motion){
                        for(var i=0,len=frame.hands.length;i<len;i++){
                            hand=frame.hands[i];
                            handString=hand.grabStrength;
                            pitchRadians = Math.floor(hand.pitch()*10)/10;
                            rollRadians = Math.floor(hand.roll()*10)/10;
                            height = Math.floor(hand.palmPosition[1]);
                            if(handString=="1" && !takeoff){
                                console.log("Asking Server to send takeoff command to Ar Drone");
                                socket.emit('event',{name:"takeoff"});
                                lastCommand="takeoff";
                                takeoff=true;
                            }
                            if(takeoff)
                            {
                                if(height<100)
                                {
                                    document.getElementById("modalHeader").style.backgroundColor="#c9302c";
                                    document.getElementById("modalHeader").style.borderTopLeftRadius="15px";
                                    document.getElementById("modalHeader").style.borderTopRightRadius="15px";
                                    document.getElementById("modalHeader").style.color="white";
                                    document.getElementById("myModalLabel").innerHTML="Alert!";
                                    document.getElementById("myModalBody").innerHTML="Hand too low drone going into Hover mode";
                                    $("#myModal").modal('show');
                                    if(!hover){
                                        console.log("Asking Server to send hover command to Ar Drone");
                                        socket.emit('event',{name:"hover"});
                                        lastCommand="hover";
                                        hover=true;
                                        }
                                 }
                                 else if(height>300)
                                 {
                                    document.getElementById("modalHeader").style.backgroundColor="#c9302c";
                                    document.getElementById("modalHeader").style.borderTopLeftRadius="15px";
                                    document.getElementById("modalHeader").style.borderTopRightRadius="15px";
                                    document.getElementById("modalHeader").style.color="white";
                                    document.getElementById("myModalLabel").innerHTML="Alert!";
                                    document.getElementById("myModalBody").innerHTML="Hand too high drone going into Hover mode";
                                    $("#myModal").modal('show');
                                    if(!hover){
                                        console.log("Asking Server to send hover command to Ar Drone");
                                        socket.emit('event',{name:"hover"});
                                        lastCommand="hover";
                                        hover=true;
                                        }
                                 }
                                 else
                                 {

                                    $("#myModal").modal('hide');
                                    height=height/40-2.5;
                                    if(height<altitude1)
                                    {
                                        while(height<altitude1 && lastCommand!="down")
                                        {
                                         console.log("Asking Server to send go down command to Ar Drone");
                                         socket.emit('event',{name:"down"});
                                         lastCommand="down";
                                         hover=false;
                                        }
                                        console.log("Asking Server to send hover command to Ar Drone");
                                        socket.emit('event',{name:"hover"});
                                        lastCommand="hover";
                                        hover=true;
                                    }
                                    else if(height>altitude1)
                                    {
                                        while(height>altitude1 && lastCommand!="up")
                                        {
                                         console.log("Asking Server to send go up command to Ar Drone");
                                         socket.emit('event',{name:"up"});
                                         lastCommand="up";
                                         hover=false;
                                        }
                                        console.log("Asking Server to send hover command to Ar Drone");
                                        socket.emit('event',{name:"hover"});
                                        lastCommand="hover";
                                        hover=true;
                                    }

                                 }
                            }
                            if(takeoff)
                            {
                                if(Math.abs(pitchRadians)<=0.2 && Math.abs(rollRadians)<=0.4 && !hover)
                                {
                                    console.log("Asking Server to send hover command to Ar Drone");
                                    socket.emit('event',{name:"hover"});
                                    lastCommand="hover";
                                    hover=true;
                                }
                                else if(Math.abs(pitchRadians)>=Math.abs(rollRadians)/2 && Math.abs(pitchRadians)>0.2)
                                {
                                    if(Math.abs(pitchRadians)==0.6)
                                    {
                                        hover=false;
                                        document.getElementById("modalHeader").style.backgroundColor="#f0ad4e";
                                        document.getElementById("modalHeader").style.borderTopLeftRadius="15px";
                                        document.getElementById("modalHeader").style.borderTopRightRadius="15px";
                                        document.getElementById("modalHeader").style.color="white";
                                        document.getElementById("myModalLabel").innerHTML="Warning";
                                        if(pitchRadians<0 && lastCommand!=("front"+Math.abs(pitchRadians)))
                                        {
                                            console.log("Asking Server to send go ahead command to Ar Drone");
                                            socket.emit('event',{name:"front", value:pitchRadians});
                                            lastCommand="front"+Math.abs(pitchRadians);
                                            document.getElementById("myModalBody").innerHTML="Forward Angle Limit about to Exceed decrease Angle";
                                        }
                                        else if(pitchRadians>0 && lastCommand!=("back"+Math.abs(pitchRadians)))
                                        {
                                            console.log("Asking Server to send go ahead command to Ar Drone");
                                            socket.emit('event',{name:"back", value:pitchRadians});
                                            lastCommand="back"+Math.abs(pitchRadians);
                                            document.getElementById("myModalBody").innerHTML="Backward Angle Limit about to Exceed decrease Angle";
                                        }
                                        $("#myModal").modal('show');
                                    }
                                    else if(Math.abs(pitchRadians)>0.6)
                                    {
                                        document.getElementById("modalHeader").style.backgroundColor="#c9302c";
                                        document.getElementById("modalHeader").style.borderTopLeftRadius="15px";
                                        document.getElementById("modalHeader").style.borderTopRightRadius="15px";
                                        document.getElementById("modalHeader").style.color="white";
                                        document.getElementById("myModalLabel").innerHTML="Alert!";
                                        if(pitchRadians<0){
                                            document.getElementById("myModalBody").innerHTML="Forward Angle Limit Exceeded drone going into Hover mode";
                                        }
                                        else{
                                            document.getElementById("myModalBody").innerHTML="Backward Angle Limit Exceeded drone going into Hover mode";
                                        }
                                        $("#myModal").modal('show');
                                        if(lastCommand!="hover"){
                                            console.log("Asking Server to send hover command to Ar Drone");
                                            socket.emit('event',{name:"hover"});
                                            lastCommand="hover";
                                            hover=true;
                                            }
                                    }
                                    else if(pitchRadians<0 && lastCommand!=("front"+Math.abs(pitchRadians)))
                                    {
                                        hover=false;
                                        $("#myModal").modal('hide');
                                        $('.modal-backdrop').remove();
                                        console.log("Asking Server to send go ahead command to Ar Drone");
                                        socket.emit('event',{name:"front", value:pitchRadians});
                                        lastCommand="front"+Math.abs(pitchRadians);
                                    }
                                    else if(pitchRadians>0 && lastCommand!=("back"+Math.abs(pitchRadians)))
                                    {
                                        hover=false;
                                        $("#myModal").modal('hide');
                                        $('.modal-backdrop').remove();
                                        console.log("Asking Server to send go back command to Ar Drone");
                                        socket.emit('event',{name:"back", value:pitchRadians});
                                        lastCommand="back"+Math.abs(pitchRadians);

                                    }
                                }
                                else if(Math.abs(rollRadians)/2>Math.abs(pitchRadians) && Math.abs(rollRadians)>0.4)
                                {
                                    if(Math.abs(rollRadians)==1)
                                    {
                                        hover=false;
                                        document.getElementById("modalHeader").style.backgroundColor="#f0ad4e";
                                        document.getElementById("modalHeader").style.borderTopLeftRadius="15px";
                                        document.getElementById("modalHeader").style.borderTopRightRadius="15px";
                                        document.getElementById("modalHeader").style.color="white";
                                        document.getElementById("myModalLabel").innerHTML="Warning";
                                        if(rollRadians<0 && lastCommand!=("right"+Math.abs(rollRadians)))
                                        {
                                            console.log("Asking Server to send go right command to Ar Drone");
                                            socket.emit('event',{name:"right", value:rollRadians/2});
                                            lastCommand="right"+Math.abs(rollRadians);
                                            document.getElementById("myModalBody").innerHTML="Right Angle Limit about to Exceed decrease Angle";
                                        }
                                        else if(rollRadians>0 && lastCommand!=("left"+Math.abs(rollRadians))){
                                            console.log("Asking Server to send go left command to Ar Drone");
                                            socket.emit('event',{name:"left", value:rollRadians/2});
                                            lastCommand="left"+Math.abs(rollRadians);
                                            document.getElementById("myModalBody").innerHTML="Left Angle Limit about to Exceed decrease Angle";
                                        }
                                        $("#myModal").modal('show');
                                    }
                                    else if(Math.abs(rollRadians)>1)
                                    {
                                        document.getElementById("modalHeader").style.backgroundColor="#c9302c";
                                        document.getElementById("modalHeader").style.borderTopLeftRadius="15px";
                                        document.getElementById("modalHeader").style.borderTopRightRadius="15px";
                                        document.getElementById("modalHeader").style.color="white";
                                        document.getElementById("myModalLabel").innerHTML="Alert!";
                                        if(rollRadians<0){
                                            document.getElementById("myModalBody").innerHTML="Right Angle Limit Exceeded drone going into Hover mode";
                                        }
                                        else{
                                            document.getElementById("myModalBody").innerHTML="Left Angle Limit Exceeded drone going into Hover mode";
                                        }
                                        if(lastCommand!="hover"){
                                            console.log("Asking Server to send hover command to Ar Drone");
                                            socket.emit('event',{name:"hover"});
                                            lastCommand="hover";
                                            hover=true;
                                            }
                                        $("#myModal").modal('show');
                                    }
                                    else if(rollRadians<0 && lastCommand!=("right"+Math.abs(rollRadians)))
                                    {
                                        hover=false;
                                        $("#myModal").modal('hide');
                                        $('.modal-backdrop').remove();
                                        console.log("Asking Server to send go right command to Ar Drone");
                                        socket.emit('event',{name:"right", value:rollRadians/2});
                                        lastCommand="right"+Math.abs(rollRadians);
                                    }
                                    else if(rollRadians>0 && lastCommand!=("left"+Math.abs(rollRadians)))
                                    {
                                        hover=false;
                                        $("#myModal").modal('hide');
                                        $('.modal-backdrop').remove();
                                        console.log("Asking Server to send go left command to Ar Drone");
                                        socket.emit('event',{name:"left", value:rollRadians/2});
                                        lastCommand="left"+Math.abs(rollRadians);
                                    }
                                }
                            }
                        }
                        if(frame.hands.length==0 && takeoff && leap_motion){
                        console.log("Asking Server to send land command to Ar Drone");
                                socket.emit('event',{name:"land"});
                                lastCommand="land";
                                takeoff=false;
                            }
                    }
                });

            }
            startArDRoneStream();
            startArDroneController();

        })
