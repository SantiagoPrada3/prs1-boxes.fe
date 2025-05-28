export interface UserData {
    fullName: string;
    document: string;
    address: string;
}

export interface BoxData {
    code: string;
    type: string;
}

export interface Assignment {
    id: string;
    boxId: string;
    userId: string;
    assignmentDate: Date;
    observations: string;
    registrationDate: Date;
    status?: string;
    userData: UserData;
    boxData: BoxData;
} 