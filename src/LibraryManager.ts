import { tResult,BookCategory,UserType } from "./initialization";
import { UserManager } from "./users/UserManager";
import { BookManager } from "./books/BooksManager";
import { IssueRecord } from "./library/IssueRecords";
import { LibraryService } from "./library/LibraryService";
import { loadFromFile } from "./fileUtils";

import promptSync from "prompt-sync";
import { Books } from "./books/Books";

const prompt = promptSync();
const users=new UserManager();
const books=new BookManager();
const library=new LibraryService(books,users);

function getTypeOfUser():UserType{
    console.log("User Type: Student-1 Staff-2");
    const choice=parseInt(prompt("Enter Your Choice:"));
    switch(choice){
        case 1:
            return UserType.Student;
        case 2:
            return UserType.Staff;
        default:
            console.log("Invalid Choice.Defaulting Student");
            return UserType.Student;
    }
}

function getBookCategory():BookCategory{
    console.log("Book Category: Fiction-1 NonFiction-2");
    const choice=parseInt(prompt("Enter Your Choice:"));
    switch(choice){
        case 1:
            return BookCategory.Fiction;
        case 2:
            return BookCategory.NonFiction;
        default:
            console.log("Invalid Choice.Defaulting Fiction");
            return BookCategory.Fiction;
    }
}

function showMenu(){
    console.log("\n======== LIBRARY MANAGEMENT SYSTEM ========");
    console.log("1. Add User");
    console.log("2. View All Users");
    console.log("3. Add Book");
    console.log("4. View All Books");
    console.log("5. Issue Book");
    console.log("6. Return Book");
    console.log("7. View Issue Records");
    console.log("8. Deactivate User");
    console.log("9. View Users Book List")
    console.log("10. Exit");
    console.log("11. View Raw User Data File"); 
}


function main() {
    let flag: boolean = true;

    while (flag) {
        showMenu();
        const choice = parseInt(prompt("Enter choice: "));

        let uName: string;
        let utype: UserType;
        let uDept: string;

        let title: string;
        let author: string;
        let category: BookCategory;
        let publicationYear: number;
        let copies: number;

        let userId: number;
        let bookId: number;

        switch (choice) {
            // Add User to the System
            case 1: 
                console.log("Add Users to the Library System.");
                uName = prompt("Enter the User Name: ");
                utype = getTypeOfUser();
                uDept = prompt("Enter the Department of the User: ");
                const user = users.addUser(uName, utype, uDept);
                console.log("The User is added Successfully!!");
                users.displayUser([user]);
                break;

            // View All Users
            case 2: 
                console.log("View All the Users.");
                const allUsers = users.viewAllUsers();
                console.log("The Users are:");
                users.displayUser(allUsers);
                break;

            // Add Book to the Library
            case 3: 
                console.log("Add Books to the Library System.");
                title = prompt("Enter Title: ");
                category = getBookCategory();
                author = prompt("Enter Author: ");
                publicationYear = parseInt(prompt("Enter Publication Year: "));
                copies = parseInt(prompt("Enter Copies: "));
                const book = books.addBook(title, author, category, publicationYear, copies);
                console.log("Book is added Successfully!!");
                books.displayBooks([book]);
                break;

            // View All Books in the System
            case 4: 
                console.log("View All the books in the Library.");
                const allBooks = books.viewAllBooks();
                books.displayBooks(allBooks);
                break;

            // Issue Book to the User
            case 5: 
                console.log("Issue Book to the User.");
                userId = parseInt(prompt("Enter User ID: "));
                bookId = parseInt(prompt("Enter Book ID: "));

                const iResult: tResult = library.issueBook(userId, bookId);
                if (!iResult.success) {
                    console.log(`Error: ${iResult.msg}`);
                } else if (iResult.records) {
                    console.log(`The Book ID ${bookId} is issued successfully!!`);
                    console.log("Issue Record:");
                    console.log(iResult.msg);
                    library.displayRecords([iResult.records]);
                }
                break;

            // Return Book to the Library
            case 6: 
                console.log("Return Book to the Library.");
                userId = parseInt(prompt("Enter User ID: "));
                bookId = parseInt(prompt("Enter Book ID: "));

                const rResult: tResult = library.returnBook(userId, bookId);
                if (!rResult.success) {
                    console.log(`Error: ${rResult.msg}`);
                } else if (rResult.records) {
                    console.log(`The Book ID ${bookId} is Returned successfully!!`);
                    console.log("Return Record:");
                    console.log(rResult.msg);
                    library.displayRecords([rResult.records]);
                }
                break;

            // View All Issue Records
            case 7: 
                console.log("View All the issued Records.");
                const issuedRecords: IssueRecord[] = library.viewAllRecords();
                console.log("The Issued Records are:");
                library.displayRecords(issuedRecords);
                break;

            // Deactivate User
            case 8: 
                console.log("Deactivate the User.");
                userId = parseInt(prompt("Enter User ID: "));
                const dUser = users.deactivateUser(userId);
                if (!dUser.success) {
                    console.log(`Error: User ID ${userId} not found`);
                } else if (dUser.user) {
                    console.log(`The User ID ${userId} is deactivated successfully.`);
                    library.removeRecordsByUserId(userId);
                    users.displayUser([dUser.user]);
                }
                break;

            // View User's Book List
            case 9: 
                console.log("View User's Book List.");
                userId = parseInt(prompt("Enter User ID: "));
                const bookIDs: number[] = library.usersBookList(userId);
                const bookDetails: Books[] = [];
                bookIDs.forEach((id) => {
                    const book: Books = books.getBookById(id);
                    bookDetails.push(book);
                });
                console.log(`The User ID ${userId} has the following books:`);
                books.displayBooks(bookDetails);
                break;

            // Exit
            case 10: 
                console.log("Exiting the application.");
                flag = false;
                break;

            // View User Data File
            case 11: 
                const data = loadFromFile("/Users/logg/Documents/PetProjects/Library_Management_System/Data/userData.json", []);
                console.log("Raw data in userData.json:");
                console.table(data);  
                break;

            default:
                console.log("Invalid choice. Please try again.");
                break;
        }
    }
}
main();