import { BookCategory, tResult } from "../initialization";

export class Books{
    public readonly bId:number;
    private title:string;
    private author:string;
    private bCategory:BookCategory;
    private pubYear:number;
    private copies:number;

    constructor (bId:number,bN:string,aut:string,gen:BookCategory,pYear:number,cop:number){
        this.bId=bId;
        this.title=bN;
        this.author=aut;
        this.bCategory=gen
        this.pubYear=pYear;
        this.copies=cop;
    }

    public getId():number{
        return this.bId;
    }

    public getTitle():string{
        return this.title;
    }

    public getAuthor():string{
        return this.author;
    }

    public getCategory():BookCategory{
        return this.bCategory;
    }

    public increaseCopy(){
        this.copies++;
    }

    public decreaseCopy():boolean{
        if(this.copies<=0) return false;
        return true;
    }

    public updateCopies(copies:number):void{
        this.copies=copies;
    }
}