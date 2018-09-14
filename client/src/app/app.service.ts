import { Injectable } from '@angular/core';
import openSocket from 'socket.io-client';

let AppConstants = {
    toolBarColors:[
        {name:'Red',colorCode:'red'},
        {name:'Blue',colorCode:'blue'},
        {name:'Black',colorCode:'black'},
        {name:'Green',colorCode:'green'}
    ],
    toolBarShapes:[
        {name:'Square',imagePath:'assets/images/square.svg',cursorStyle:'crosshair'},
        {name:'Circle',imagePath:'assets/images/circle.svg',cursorStyle:'crosshair'},
        {name:'Triangle',imagePath:'assets/images/triangle.svg',cursorStyle:'crosshair'},
        {name:'Free Draw',imagePath:'assets/images/freeDraw.svg',cursorStyle:'default'}
    ],
    toolBarDrawTools:[
        {name:'Pen',imagePath:'assets/images/draw.svg'},
        {name:'Eraser',imagePath:'assets/images/eraser.svg'}
    ]
};
let socketClient;
@Injectable()

export class AppService{
   client:any; 
   getToolBardisplayProperties = () => {
       return { 
           colorBlocks:AppConstants.toolBarColors,
           shapeBlocks:AppConstants.toolBarShapes,
           toolBlocks:AppConstants.toolBarDrawTools
        }
   }
   registerUser = (userName,onJoinEvent,onDisconnectEvent,onUserInteractionEvent,onUserInteractionStart,getPreviousUpdates) => {
    socketClient = openSocket("http://localhost:3000", {transports: ['websocket']});
    socketClient.emit("join",userName);
    socketClient.on("join",onJoinEvent);
    socketClient.on("userInteraction",onUserInteractionEvent)
    socketClient.on("userDisconnected",onDisconnectEvent);
    socketClient.on("onUserInteractionStart",onUserInteractionStart);
    socketClient.on("getPreviousUpdates",getPreviousUpdates)
   }
   sendInteractionDetails = (interaction) => {
    socketClient.emit("userInteraction",interaction);
   }
   sendStartInteractionDetail = (user,activity)=>{
    socketClient.emit("onUserInteractionStart",{user:user,userAction:activity});

   }
   getPreviousUpdates = (userName) => {
    socketClient.emit("getPreviousUpdates",{user:userName});
    
   }
}