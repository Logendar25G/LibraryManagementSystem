// IssueRecord class represents a record of a book issued to a user
export class IssueRecord {
    public userId: number;
    public bookId: number;
    public issueDate: string;
    public returnDate?: string;

    constructor(userId: number, bookId: number) {
        this.userId = userId;
        this.bookId = bookId;
        this.issueDate = new Date().toISOString();   // Set issue date to now
        this.returnDate = undefined;  // Not returned yet
    }
}
