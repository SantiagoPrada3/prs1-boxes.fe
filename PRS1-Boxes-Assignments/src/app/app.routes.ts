import { Routes } from '@angular/router';
import { BoxesComponent } from './pages/boxes/boxes.component';
import { AssignmentsComponent } from './pages/assignments/assignments.component';

export const routes: Routes = [
  { path: '', redirectTo: '/boxes', pathMatch: 'full' },
  { path: 'boxes', component: BoxesComponent },
  { path: 'assignments', component: AssignmentsComponent }
];
