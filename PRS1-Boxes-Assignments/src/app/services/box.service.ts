import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, switchMap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Box } from '../interfaces/box.interface';
import { Assignment } from '../interfaces/assignment.interface';

@Injectable({
  providedIn: 'root'
})
export class BoxService {
  private apiUrl = '/api/v1';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Box endpoints
  getBoxes(): Observable<Box[]> {
    console.log('Fetching boxes from:', `${this.apiUrl}/boxes`);
    return this.http.get<any>(`${this.apiUrl}/boxes`, this.httpOptions)
      .pipe(
        map(response => {
          console.log('Raw response:', response);
          if (Array.isArray(response)) {
            return response;
          } else if (response && typeof response === 'object') {
            return Object.values(response);
          }
          return [];
        }),
        catchError(this.handleError)
      );
  }

  getBoxById(id: string): Observable<Box> {
    return this.http.get<Box>(`${this.apiUrl}/boxes/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private serializeDates(box: Box): Partial<Box> {
    const serializedBox: Partial<Box> = { ...box };
    
    // Handle installationDate
    if (Array.isArray(box.installationDate)) {
      // If it's an array, convert it to a proper date string
      const [year, month, day] = box.installationDate;
      serializedBox.installationDate = new Date(year, month - 1, day).toISOString();
    } else if (box.installationDate instanceof Date) {
      serializedBox.installationDate = box.installationDate.toISOString();
    }

    // Handle registrationDate
    if (Array.isArray(box.registrationDate)) {
      const [year, month, day] = box.registrationDate;
      serializedBox.registrationDate = new Date(year, month - 1, day).toISOString();
    } else if (box.registrationDate instanceof Date) {
      serializedBox.registrationDate = box.registrationDate.toISOString();
    }

    // Remove empty or undefined fields
    Object.keys(serializedBox).forEach(key => {
      const typedKey = key as keyof Box;
      if (serializedBox[typedKey] === '' || serializedBox[typedKey] === undefined) {
        delete serializedBox[typedKey];
      }
    });

    return serializedBox;
  }

  createBox(box: Box): Observable<Box> {
    const serializedBox = this.serializeDates(box);
    return this.http.post<Box>(`${this.apiUrl}/boxes`, serializedBox, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateBox(id: string, box: Box): Observable<Box> {
    if (!id) {
      return throwError(() => new Error('Box ID is required for update operation'));
    }

    const serializedBox = this.serializeDates(box);
    console.log('Updating box with ID:', id);
    console.log('Box data being sent:', serializedBox);
    
    return this.http.put<Box>(`${this.apiUrl}/boxes/${id}`, serializedBox, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error updating box:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error,
            boxData: serializedBox
          });
          return this.handleError(error);
        })
      );
  }

  deleteBox(id: string): Observable<Box> {
    if (!id) {
      return throwError(() => new Error('Box ID is required for delete operation'));
    }
    console.log('Marking box as inactive with ID:', id);
    
    const deactivateData = { status: 'inactive' };
    return this.http.patch<Box>(`${this.apiUrl}/boxes/${id}/status`, deactivateData, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error marking box as inactive:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error,
            boxId: id,
            boxData: deactivateData
          });
          return this.handleError(error);
        })
      );
  }

  restoreBox(id: string): Observable<Box> {
    if (!id) {
      return throwError(() => new Error('Box ID is required for restore operation'));
    }
    console.log('Restoring box with ID:', id);
    const restoreData = { status: 'active' };
    return this.http.patch<Box>(`${this.apiUrl}/boxes/${id}/restore`, restoreData, this.httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error restoring box:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error,
            boxId: id
          });
          return this.handleError(error);
        })
      );
  }

  // Assignment endpoints
  getAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/assignments`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAssignmentById(id: string): Observable<Assignment> {
    return this.http.get<Assignment>(`${this.apiUrl}/assignments/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  createAssignment(assignment: Assignment): Observable<Assignment> {
    return this.http.post<Assignment>(`${this.apiUrl}/assignments`, assignment, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateAssignment(id: string, assignment: Assignment): Observable<Assignment> {
    return this.http.put<Assignment>(`${this.apiUrl}/assignments/${id}`, assignment, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteAssignment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/assignments/${id}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage += `\nServer Message: ${error.error.message}`;
      }
    }
    
    console.error('Detailed error:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      error: error.error
    });
    
    return throwError(() => new Error(errorMessage));
  }
} 