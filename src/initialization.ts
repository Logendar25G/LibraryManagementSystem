import { Users } from "./users/Users"
import { IssueRecord } from "./library/IssueRecords";
export enum BookCategory{
    Fiction=1,
    NonFiction

}

export enum UserType{
    Student=1,
    Staff
}
export type tResult={
    success:boolean,
    user?:Users,
    records?:IssueRecord;
    msg?:string;
}

