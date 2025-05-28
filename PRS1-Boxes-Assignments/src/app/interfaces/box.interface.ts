export interface Box {
    id: string;
    code: string;
    type: string;
    installationDate: Date | string;
    observations: string;
    registrationDate: Date | string;
    status?: string; 
    userId?: string;  
} 