
                     .++o..ooo++X+.oo++++
                   .....++   ...+.+. ..+o+ ..
               .+.   .    ....   .. ..    +o+.
               .+. . .. .....    .+ . ..     +.
              .+      o+.+++++++++++X.o.    o+ .
               o+.   .+XX@@@@@@@@@@@XX@+. .X+.o+ ..
           .    .o.+XX@@@@@@@@@@@@@@@@@@XXX+.o+
                .X@@@@@@@@@@@@@@@@@@@@@@@@@XX.    ..
          .o+  +@@Xo++..++oX@@@@@@X++++++oX@@X+ ...
           .++o@X+.        X@@@@@+        ..o@@X.
         .   X@o          +@@@X@@+           +X@+
        ..  +X+ .        .XXXXXX@o.          .+XX    .
       +o+  .+oXXo       oX@@@@@@XX+       .oXXoo..+.+oo.
        .oXo o@@@@.. ..+o+oXX@@XXXX@+.    .X@@@X...  .oo.
        ..+oo@@@@@@XXX@@o   .++.  .@@@Xooo@@@@@X.   ..
           .@@@@XXXo++.....+o++o+. .++oXX@@@@@@@o XXo+.
        .++.ooo+.     .oXo+++++++oo++.   .+oXX@@X....  ....
        .   .....   .oX+.         .+X@o.    .++++.       .
              ...  oX+   +ooooo+.    +@X+
              ..++X@+...+..    .+++.  o@X+...
      ... .+ ..+oXXoXX.  .+++++.   .+XooX@o++.    .....
     .+..ooX  .oXo..+..oXX@@@@@@Xo+ .+o+oXXo+    .+.++++
    .++  .oXo .oXo+oXX@@@@XXXXXX@@@@XXXXXXXX.    +....++++.
       .++++X. .ooX@@@Xo+...   ..+oX@@@@@@@+    ++..+....oo.
     .+ooXo .   .+o+..              .+ooo+.     +..oo++X+.++
   +.... .o..                                  ...+. ..+++..
  +o.    .++.                                   ....     +o+
  +oX+.++...                                      .+++. .XXo
   .oXXo+.                                         .+o+.oXoo
     ..                                                 .+.
                 __  __        _    _ _   _
                 \ \/ /___  __| |_ (_) |_| |  Intel Edison
                  >  </ _ \/ _| ' \| |  _| |
                 /_/\_\___/\__|_||_|_|\__|_|
                 
# ble greenhouse
https://communities.intel.com/docs/DOC-23391
https://communities.intel.com/docs/DOC-23431?sr=stream&ru=180131
http://iotkit-comm-js.s3-website-us-west-2.amazonaws.com/api/index.html

## TI Sensortag(s)
http://processors.wiki.ti.com/index.php/SensorTag_User_Guide

## Intel Edison

### Getting started

https://github.com/pinion/Getting-Started-with-Edison-and-IoT

We want to program Edison with nodejs via WIFI deploying
to it with ssh and git.

First you need to configure your Edison to use WIFI as main
communication method.

If you have only one mini-usb cable and 12v power adapter like I did. 

Connect to the corner mini-usb port (which is usbserial)

Switch the dip between usb ports and power input towards power. Now Edison is powered from 12v adapter, Edison can't be powered from serial usb only!

In terminal run:

screen /dev/cu.usbserial-<tab> 115200 -L

login as root

configure_edison

https://communities.intel.com/docs/DOC-23148 <-should follow this

Now you can access via WIFI/ssh and USB connection is nolonger needed.


