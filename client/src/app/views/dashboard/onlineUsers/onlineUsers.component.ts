import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

@Component({
    selector:'onlineusers',
    templateUrl:'onlineUsers.template.html'
})

export class OnlineUsersComponent implements OnChanges{
    @Input() onlineUsers : any;
    @Input() userActivity : any;
    onlineUserModel = {
        onlineUsers:[]
    }
    constructor(){}
    ngOnChanges( changes: SimpleChanges ) {
        let users = []
        for (let prop of Object.keys(this.onlineUsers)) { 
            let userObj = {id:this.onlineUsers[prop],name:prop,status:'Idle'};
            if(this.userActivity.user === prop){
                userObj.status = this.userActivity.action;
            }else{
                userObj.status = 'Idle';
            }
            users.push(userObj);
        }
        this.onlineUserModel.onlineUsers = users; 
    }

}