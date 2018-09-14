import { Component,HostListener,ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../../app.service';

@Component({
    selector:'canvas-draw',
    templateUrl:'canvas.template.html'
})

export class CanvasComponent{
    canvasModel = {
        isDrawing:false,
        selectedColor:'black',
        selectedShape:'Free Draw',
        canvasCursor:'default',
        selectedAction:'Drawing',
        currentX:0,
        currentY:0,
        drawnPath:[],
        drawStartPoint:{x:0,y:0}
    };
    dashboardViewModel = {
        currentUser:'',
        onlineUsers:{},
        loginState : true,
        isInteractionHappening:false,
        onGoingInteractionDetail:{user:'',action:'Drawing'}
    };

    @ViewChild('drawCanvas') drawCanvas: ElementRef;
    @ViewChild('canvasholder') public canvasholder:any;
    public context: CanvasRenderingContext2D;

    constructor(public _appService:AppService,private elRef:ElementRef){}

    /* Initialising the Canvas and the Mouse Event Listeners */
    ngAfterViewInit(): void {
        this.context = (<HTMLCanvasElement>this.drawCanvas.nativeElement).getContext('2d');
        this.drawCanvas.nativeElement.width = this.canvasholder._element.nativeElement.clientWidth * 1.5;
        this.drawCanvas.nativeElement.height = this.canvasholder._element.nativeElement.clientHeight * 1.3;
      
        this.drawCanvas.nativeElement.addEventListener('mousemove', (e) => {
            if(this.canvasModel.isDrawing){
                this.canvasModel.drawnPath.push({x:e.offsetX,y:e.offsetY});
                this.drawPattern(e,
                    this.canvasModel.selectedColor,
                    this.canvasModel.selectedShape,
                    this.canvasModel.selectedAction
                );
            }
        });
       
        this.drawCanvas.nativeElement.addEventListener('mousedown', (e) => {
            this.canvasModel.isDrawing = true;
            [this.canvasModel.drawStartPoint.x,this.canvasModel.drawStartPoint.y] = [e.offsetX, e.offsetY];
            [this.canvasModel.currentX , this.canvasModel.currentY ] = [e.offsetX, e.offsetY];
            this._appService.sendStartInteractionDetail(this.dashboardViewModel.currentUser,this.canvasModel.selectedAction);
        });

        this.drawCanvas.nativeElement.addEventListener('mouseup', (e) => {
            this._appService.sendInteractionDetails({
                name:this.dashboardViewModel.currentUser,
                color:this.canvasModel.selectedColor,
                action:this.canvasModel.selectedAction,
                shape:this.canvasModel.selectedShape,
                drawnPath:{path:this.canvasModel.drawnPath},
                drawStartPoint:this.canvasModel.drawStartPoint
            });
            this.canvasModel.drawnPath = [];
            this.canvasModel.isDrawing = false;
        });
      
        this.drawCanvas.nativeElement.addEventListener('mouseout', (e) => {
            this.canvasModel.drawnPath = [];
            this.canvasModel.isDrawing = false
        });
    }

    /* Name : drawPattern 
       Parameters : Event,Color,Start point
       Functionality : Draw the User Selected Patterns on the Canvas 
    */
    drawPattern(e,color,shape,action){
        this.context.beginPath();
        if(action === 'Erasing'){
            shape = 'Eraser';
        }
        switch(shape){
            case 'Free Draw':
                this.context.moveTo(this.canvasModel.currentX , this.canvasModel.currentY);
                this.context.lineTo(e.offsetX, e.offsetY);
                this.context.strokeStyle = color;
                [this.canvasModel.currentX , this.canvasModel.currentY] = [e.offsetX, e.offsetY];
            break;
            case 'Square':
                var width = Math.abs(this.canvasModel.currentX - e.offsetX);
                var height = Math.abs(this.canvasModel.currentY - e.offsetY);
                this.context.rect(this.canvasModel.currentX, this.canvasModel.currentY, width, height);
                this.context.fillStyle = color;
            break;
            case 'Triangle':
                this.context.moveTo(this.canvasModel.currentX , this.canvasModel.currentY);
                this.context.lineTo(this.canvasModel.currentX+50, this.canvasModel.currentY+100);
                this.context.lineTo(this.canvasModel.currentX+100, this.canvasModel.currentY+100);
                this.context.fillStyle = color;
            break;
            case 'Circle':
                var distance = Math.sqrt(Math.pow(this.canvasModel.currentX - e.offsetX, 2) + Math.pow(this.canvasModel.currentY - e.offsetY,2));
                this.context.arc(this.canvasModel.currentX , this.canvasModel.currentY,distance, 0, Math.PI * 2, false);
                this.context.fillStyle = color;
            break;
            case 'Eraser':
                this.context.moveTo(this.canvasModel.currentX , this.canvasModel.currentY);
                this.context.lineTo(e.offsetX, e.offsetY);
                this.context.lineWidth = 5;
                this.context.strokeStyle = 'white';
                [this.canvasModel.currentX , this.canvasModel.currentY] = [e.offsetX, e.offsetY];
            default:
        }
        this.context.fill();
        this.context.stroke();
    }
    onConnect(users){
        delete users[this.dashboardViewModel.currentUser];
        this.dashboardViewModel.onlineUsers = users;
        this._appService.getPreviousUpdates(this.dashboardViewModel.currentUser);
    }
    onDisconnect(users){
        delete users[this.dashboardViewModel.currentUser];
        this.dashboardViewModel.onlineUsers = users;
    }
    /* 
      Name : onInteractionEvent
      Parameters : Interaction Parameters(UserName,Path Drawn,Color,Action)
      Functionality : Catch Interaction Parameters and Draw Patterns Accordingly
      Other Details : Socket Connection CallBack Function
    */
    onInteractionEvent(interaction){
        if(interaction.name !== this.dashboardViewModel.currentUser){
            this.dashboardViewModel.onGoingInteractionDetail = { user:'',action:'' };
            this.dashboardViewModel.isInteractionHappening = false;
             [this.canvasModel.currentX,this.canvasModel.currentY] = [interaction.drawStartPoint.x,interaction.drawStartPoint.y];
              for(let path of interaction.drawnPath.path){
                  this.drawPattern(
                      {offsetX:path.x,offsetY:path.y},
                      interaction.color,
                      interaction.shape,
                      interaction.action
                 );
            }
        }
    }
    onUserInteractionStart(interactionDetails){
        if(interactionDetails.user !== this.dashboardViewModel.currentUser){
            this.dashboardViewModel.onGoingInteractionDetail = { user:interactionDetails.user,action:interactionDetails.userAction };
            this.dashboardViewModel.isInteractionHappening = true;
        }
    }
    onPreviousUpdates(previousUpdates){
        if(previousUpdates.previousPaths.length){
           for(let update of previousUpdates.previousPaths){
            [this.canvasModel.currentX,this.canvasModel.currentY] = [update.drawStartPoint.x,update.drawStartPoint.y];
               for(let path of update.drawnPath.path){
                    this.drawPattern(
                        {offsetX:path.x,offsetY:path.y},
                        update.color,
                        update.shape,
                        update.action
                    );
               }
           }
        }
    }
    /* 
      Name : nameEventHander
      Parameters : Logged In Username
      Functionality : Save Username & Start Socket service
      Other Details : Linked To Child Component(LoginComponent)
    */
    nameEventHander($event: any) {
        this._appService.registerUser($event,
            this.onConnect.bind(this),
            this.onDisconnect.bind(this),
            this.onInteractionEvent.bind(this),
            this.onUserInteractionStart.bind(this),
            this.onPreviousUpdates.bind(this)
        );
        this.dashboardViewModel.currentUser = $event;
        this.dashboardViewModel.loginState = false;
    }
    /* 
      Name : onToolBarInteraction
      Parameters : ToolBar Selected Parameters
      Functionality : Save User Selections From ToolBar
      Other Details : Linked To Child Component(ToolBarComponent)
    */
    onToolBarInteraction($event:any){
        this.canvasModel.canvasCursor = $event.canvasCursor;
        this.canvasModel.selectedShape = $event.selectedShape;
        this.canvasModel.selectedColor = $event.selectedColor;
        this.canvasModel.selectedAction = $event.selectedAction;
    }
}