import { Component, Output, EventEmitter } from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material';


@Component({
    selector:'login',
    templateUrl:'login.template.html'
})

export class LoginComponent{
    loginModel = {
        username:''
    };
    @Output() nameEvent = new EventEmitter<string>();

    constructor(public snackBar: MatSnackBar){}

    registerUser(){
        if(this.loginModel.username !== ''){
            this.nameEvent.emit(this.loginModel.username);
        }else{
            const config = new MatSnackBarConfig();
            config.duration = 3000;
            this.snackBar.open('Please Enter Username',null, config);
        }
    }
}