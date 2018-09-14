import { Component,Output,EventEmitter } from '@angular/core';
import { AppService } from '../../../app.service';

@Component({
    selector:'toolbar',
    templateUrl:'toolbar.template.html'
})

export class ToolbarComponent{
    @Output() toolBarInteractEvent = new EventEmitter<object>();
    toolBarModel = {
        colors:[],
        shapes:[],
        tools:[],
        canvasCursor:'default',
        eraserEnabled:false,
        selectedShape:'Free Draw',
        selectedShapeImagePath:'assets/images/freeDraw.svg',
        selectedColor:'black',
        selectedAction:'Drawing'
    };
    constructor(public _appService:AppService){
        this.toolBarModel.colors = _appService.getToolBardisplayProperties().colorBlocks;
        this.toolBarModel.shapes = _appService.getToolBardisplayProperties().shapeBlocks;
        this.toolBarModel.tools = _appService.getToolBardisplayProperties().toolBlocks;
    }
    onToolBarInteraction(){
       this.toolBarInteractEvent.emit({
           selectedColor:this.toolBarModel.selectedColor,
           selectedAction:this.toolBarModel.selectedAction,
           selectedShape:this.toolBarModel.selectedShape,
           canvasCursor:this.toolBarModel.canvasCursor
       });
    }
    onColorSelect(selectedColor){
        this.toolBarModel.selectedColor = selectedColor;   
        this.onToolBarInteraction();
    }
    onToolSelect(selectedTool){
        if(selectedTool === 'Eraser'){
            this.toolBarModel.selectedAction = 'Erasing';
        }else{
            this.toolBarModel.selectedAction = 'Drawing';
        }
        this.onToolBarInteraction();
    }
    onEraserSelect(){
        this.toolBarModel.selectedShape = 'Free Draw';
        this.toolBarModel.eraserEnabled = !this.toolBarModel.eraserEnabled;
        this.onToolBarInteraction();
    }
    onShapeSelect(selectedShape,cursor,imagePath){
        this.toolBarModel.canvasCursor = cursor;
        this.toolBarModel.selectedShape = selectedShape;
        this.toolBarModel.selectedShapeImagePath = imagePath
        this.onToolBarInteraction();
    }
}