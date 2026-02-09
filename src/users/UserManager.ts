import { Users } from "./Users";
import { tResult, UserType } from "../initialization";
import { saveToFile,loadFromFile } from "../fileUtils";
const path="/Users/logg/Documents/PetProjects/Library_Management_System/Data/userData.json";

export class UserManager{
    private userMap:Map<number,Users>=new Map();
    private userId=1;

    constructor(){
        const userArr=loadFromFile(path,[]);
        userArr.forEach((ele:any) => {
            const user =new Users(ele.uId,ele.uName,ele.type,ele.uDept);
            if(!ele.isActive) user.deactivate();
            this.userMap.set(user.uId,user);
        });

        if(userArr.length>0){
            this.userId=Math.max(...userArr.map((u:any)=>{
                return u.uId;
            }))+1;
        }
    }

    public addUser(uName:string,type:UserType,uDept:string):Users{
        const user=new Users(this.userId++,uName,type,uDept);
        this.userMap.set(user.uId,user);
        this.save();
        return user;
    }

    public getUserById(uId:number):Users {

        const user=this.userMap.get(uId);
        if(user==undefined){
            throw new Error(`User Id ${uId} is not found`);
        }
        return user;
    }

    public viewAllUsers():Users[]{
        return [...this.userMap.values()];
    }

    public deactivateUser(uId:number):tResult{
        const user=this.userMap.get(uId);
        if(!user) return {success:false};

        user.deactivate();
        this.save();
        return {success:true,user};
    }

    public displayUser(users:Users[]):void{
        console.table(
            users.map((ele)=>(
                {
                    UserId:ele.uId,
                    UserName:ele.getName(),
                    UserType:ele.getType(),
                    UserDepartment:ele.getDept()
                }
            ))
        )
    }

    private save() {
    saveToFile(path, Array.from(this.userMap.values()));
  }

}