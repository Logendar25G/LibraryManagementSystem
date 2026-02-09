
import { UserType } from "../initialization";
export class Users{
    public readonly uId:number;
    private uName:string;
    private type:UserType;
    private uDept:string;
    private isActive:boolean;

  
    constructor(uId:number,uName:string,type:UserType,uDept:string){
        this.uId=uId;
        this.uName=uName;
        this.type=type;
        this.uDept=uDept;
        this.isActive=true;
    }

    public getName():string{
        return this.uName;
    }

    public getType():UserType{
        return this.type;
    }
    public getDept():string{
        return this.uDept;
    }

    public isUserActive():boolean{
        return this.isActive;
    }

    public updateUserInfo(uName:string,uDept:string):void{
        this.uName=uName;
        this.uDept=uDept;
    }

    public deactivate(){
        this.isActive=false;
    }
}