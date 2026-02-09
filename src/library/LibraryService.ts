import { BookManager } from "../books/BooksManager";
import { UserManager } from "../users/UserManager";
import { IssueRecord } from "./IssueRecords";
import { tResult } from "../initialization";
import { saveToFile,loadFromFile } from "../fileUtils";
const path="/Users/logg/Documents/PetProjects/Library_Management_System/Data/issueRecords.json";

export class LibraryService {
    private issuedBooks: Map<number, number[]> = new Map();
    private records: IssueRecord[] = [];
    private bookManager: BookManager;
    private userManager:UserManager;

    constructor(bookManager: BookManager,userManager:UserManager) {
        this.bookManager = bookManager;
        this.userManager = userManager;

        this.records=loadFromFile(path,[]);
        this.records.forEach((ele)=>{
            if(!this.issuedBooks.has(ele.userId)){
                this.issuedBooks.set(ele.userId,[]);
            }

            this.issuedBooks.get(ele.userId)?.push(ele.bookId)
        })
    }

    



    public issueBook(uId: number, bId: number): tResult {
        try{
            const user = this.userManager.getUserById(uId);
            if (!user.isUserActive()) {
                return { success: false, msg: "User is deactivated" };
            }

            const book = this.bookManager.getBookById(bId);

            if (!book.decreaseCopy()) {
                return { success: false};
            }

            const list = this.issuedBooks.get(uId);
            if (list) list.push(bId);
            else this.issuedBooks.set(uId, [bId]);

            const rec = new IssueRecord(uId, bId);
            this.records.push(rec);
            this.save();

            return { success: true, records: rec ,msg: "Book issued successfully"};
        }    
        catch(err:any){
            
            const msg = err?.message || String(err);
            return { success: false, msg };
    
        }
            
    }

    public returnBook(uId: number, bId: number): tResult {
        try{
            const list = this.issuedBooks.get(uId);
            if (!list || !list.includes(bId)) return {success :false,msg:`The user doesnt have the book Id ${bId}.`};

            const newList = list.filter(id => id !== bId);
            this.issuedBooks.set(uId, newList);

            const record = this.records.find(
                r => r.userId === uId && r.bookId === bId && r.returnDate === undefined
            );
            if (!record) throw new Error("No active issue record found");
            const fine = this.calculateFine(record);

            record.returnDate = new Date().toISOString();

            const book = this.bookManager.getBookById(bId);
            book.increaseCopy();
            this.save();

            if (fine > 0)
                return {success:true,records:record,msg:`Book returned successfully. Fine to be paid: ₹${fine}`};
            else
                return {success:true,records:record,msg:`Book returned successfully. No fine.`};
        }

        catch(err:any){
            const msg = err?.message || String(err);
            return { success: false, msg };
        }
            
    }

    public usersBookList(uId: number): number[] {
        return this.issuedBooks.get(uId) || [];
    }

    public viewAllRecords(): IssueRecord[] {
        return this.records;
    }

    public removeRecordsByUserId(uId: number): void {
        // Remove all issue records for the user
        this.records = this.records.filter(r => r.userId !== uId);
        // Remove issued books mapping
        this.issuedBooks.delete(uId);
        this.save(); 
    }

    public calculateFine(record:IssueRecord):number{
        const issuedDate=new Date(record.issueDate);
        const currentDate=new Date();
        const diffMS=currentDate.getTime()-issuedDate.getTime();

        const diffDays= diffMS/(1000*60*60*24);
        const extraDays=diffDays-60;
        const finePerDay=10;
        return Math.floor(extraDays*finePerDay);
    }

    public displayRecords(records:IssueRecord []):void{
        console.table(
            records.map((r)=>({
                UserID:r.userId,
                BookID:r.bookId,
                IssueDate:r.issueDate,
                ReturnDate:r.returnDate
            }))
        )
    }

    private save() {
        saveToFile(path, this.records);
  }
}
