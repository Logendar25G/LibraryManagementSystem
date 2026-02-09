import { Books } from "./Books";
import { BookCategory } from "../initialization";
import { saveToFile,loadFromFile } from "../fileUtils";
// Path to the JSON file for persisting book data
const path="/Users/logg/Documents/PetProjects/Library_Management_System/Data/bookData.json";

//Book Manager class to manage Book features
export class BookManager{
    //Attributes
    private bookMap:Map<number,Books>=new Map();
    private  bookId=1;

    // Constructor: load books from file 
    constructor() {
    const booksArr = loadFromFile(path, []);
    booksArr.forEach((b: any) => {
        // Create Books object from saved data and add to map
        const book = new Books(b.bId, b.title, b.author, b.bCategory, b.pubYear, b.copies);
        this.bookMap.set(book.getId(), book);
    });
    if (booksArr.length > 0) {
        //Set the next id as more than one of the highest existing book Id
        this.bookId = Math.max(...booksArr.map((b: any) => b.bId)) + 1;
    }
  }
    //Decrease the copy count for book by bookId
    public decreaseCopy(bId: number): boolean {
        const book = this.bookMap.get(bId);
        if (!book) {
            return false;
        }
        return book.decreaseCopy();
    }

    //Increase the copy count for book by bookId
    public increaseCopy(bId: number): void {
        const book = this.bookMap.get(bId);
        if (book) {
            book.increaseCopy();
        }
    }

    // Add a new book and save to file
    public addBook(bN:string,aut:string,bCat:BookCategory,pY:number,copies:number){
        const book=new Books(this.bookId++,bN,aut,bCat,pY,copies);
        this.bookMap.set(book.getId(), book);
        this.save();
        return book; 
    }

    //get Book Object using book Id
    public getBookById(bId:number):Books{
        const book=this.bookMap.get(bId);
        if(book==undefined){
            throw new Error(`Book Id ${bId} is not found`);
        }
        return book;
    }

    // Get all books of a given category
    public getBooksByType(type:BookCategory):Books[]{
        return this.viewAllBooks().filter(book => book.getCategory() === type);
    }

    // Return an array of all book objects
    public viewAllBooks():Books[]{
        return [...this.bookMap.values()];
    }

    //Display the books in library
    public displayBooks(book:Books[]):void{
            console.table(
                book.map((ele)=>(
                    {
                        BookId:ele.getId(),
                        Title:ele.getTitle(),
                        Author:ele.getAuthor(),
                        BookCategory:ele.getCategory(),

                    }
                ))
            )
        }
    
    //Helper method to save books to the file
    private save() {
        saveToFile(path, Array.from(this.bookMap.values()));
    }

    

}