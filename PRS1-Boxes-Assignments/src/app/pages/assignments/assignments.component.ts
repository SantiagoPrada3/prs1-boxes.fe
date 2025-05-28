import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoxService } from '../../services/box.service';
import { Assignment, UserData, BoxData } from '../../interfaces/assignment.interface';
import { Box } from '../../interfaces/box.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assignments.component.html',
  styles: [`
    .card {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(44,62,80,0.07);
      overflow: hidden;
    }
    .card-header {
      border-bottom: 1px solid #e3e8ee;
    }
    .card-body {
      padding: 0;
    }
    table {
      border-collapse: separate;
      border-spacing: 0;
      width: 100%;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(44,62,80,0.04);
    }
    thead th {
      position: sticky;
      top: 0;
      z-index: 2;
      background: #f4f7fb;
      color: #1976d2;
      font-weight: 700;
      font-size: 0.95rem;
      letter-spacing: 0.04em;
      border-bottom: 2px solid #e3e8ee;
      padding-top: 14px;
      padding-bottom: 14px;
    }
    tbody tr {
      transition: background 0.2s;
    }
    tbody tr:hover {
      background: #e3f0fc;
    }
    td, th {
      border: none;
      padding-left: 18px;
      padding-right: 18px;
    }
    td {
      font-size: 1rem;
      color: #2c3e50;
      vertical-align: middle;
      padding-top: 12px;
      padding-bottom: 12px;
    }
    .btn {
      border-radius: 6px;
      padding: 6px 10px;
      font-size: 1rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, box-shadow 0.2s;
      box-shadow: 0 1px 2px rgba(44,62,80,0.07);
    }
    .btn i {
      font-size: 1.1rem;
    }
    .btn-info {
      background: #e3f0fc;
      color: #1976d2;
      border: none;
    }
    .btn-info:hover {
      background: #1976d2;
      color: #fff;
    }
    .btn-warning {
      background: #fffbe6;
      color: #f6b800;
      border: none;
    }
    .btn-warning:hover {
      background: #f6b800;
      color: #fff;
    }
    .btn-danger {
      background: #ffeaea;
      color: #e53935;
      border: none;
    }
    .btn-danger:hover {
      background: #e53935;
      color: #fff;
    }
    .btn-success {
      background: #e6fbe9;
      color: #43a047;
      border: none;
    }
    .btn-success:hover {
      background: #43a047;
      color: #fff;
    }
    .btn-sm {
      padding: 5px 8px;
      font-size: 0.95rem;
      margin-right: 2px;
    }
    .btn[title] {
      position: relative;
    }
    .btn[title]:hover::after {
      content: attr(title);
      position: absolute;
      left: 50%;
      top: -30px;
      transform: translateX(-50%);
      background: #222;
      color: #fff;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.85rem;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0.95;
      z-index: 10;
    }
    @media (max-width: 900px) {
      table, thead, tbody, th, td, tr {
        display: block;
      }
      thead {
        display: none;
      }
      tr {
        margin-bottom: 18px;
        border-radius: 10px;
        box-shadow: 0 1px 4px rgba(44,62,80,0.04);
        background: #fff;
      }
      td {
        padding: 12px 16px;
        text-align: right;
        position: relative;
      }
      td:before {
        content: attr(data-label);
        position: absolute;
        left: 16px;
        top: 12px;
        font-weight: 700;
        color: #1976d2;
        text-align: left;
      }
    }
  `]
})
export class AssignmentsComponent implements OnInit {
  assignments: Assignment[] = [];
  filteredAssignments: Assignment[] = [];
  boxes: Box[] = [];
  assignment: Assignment = {
    id: '',
    boxId: '',
    userId: '',
    assignmentDate: new Date(),
    observations: '',
    registrationDate: new Date(),
    status: 'active',
    userData: {
      fullName: '',
      document: '',
      address: ''
    },
    boxData: {
      code: '',
      type: ''
    }
  };
  editingAssignment: Assignment | null = null;
  showModal = false;
  currentFilter: string = 'active';
  showDetailsModal = false;
  selectedAssignment: Assignment | null = null;

  constructor(private boxService: BoxService) {}

  ngOnInit(): void {
    this.loadAssignments();
    this.loadBoxes();
  }

  loadAssignments(): void {
    console.log('Starting to load assignments...');
    this.boxService.getAssignments().subscribe({
      next: (assignments: Assignment[]) => {
        console.log('Assignments loaded successfully:', assignments);
        this.assignments = assignments;
        this.filterAssignments('active');
      },
      error: (error: any) => {
        console.error('Error loading assignments:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las asignaciones. Por favor, verifique que el servidor esté funcionando.',
          customClass: {
            popup: 'rounded-xl',
            title: 'text-xl font-bold text-gray-800',
            htmlContainer: 'text-gray-600',
            confirmButton: 'btn btn-primary px-6 py-2 rounded-lg'
          },
          buttonsStyling: false
        });
      }
    });
  }

  loadBoxes(): void {
    this.boxService.getBoxes().subscribe(
      (boxes: Box[]) => this.boxes = boxes,
      (error: any) => console.error('Error loading boxes:', error)
    );
  }

  openModal(): void {
    this.showModal = true;
    this.resetForm();
  }

  closeModal(): void {
    this.showModal = false;
    this.editingAssignment = null;
    this.resetForm();
  }

  onSubmit(): void {
    if (this.editingAssignment) {
      this.boxService.updateAssignment(this.editingAssignment.id, this.assignment).subscribe(
        () => {
          this.loadAssignments();
          this.closeModal();
          Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'La asignación ha sido actualizada correctamente',
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: 'rounded-xl',
              title: 'text-xl font-bold text-gray-800',
              htmlContainer: 'text-gray-600'
            }
          });
        },
        (error: any) => {
          console.error('Error updating assignment:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al actualizar la asignación',
            customClass: {
              popup: 'rounded-xl',
              title: 'text-xl font-bold text-gray-800',
              htmlContainer: 'text-gray-600',
              confirmButton: 'btn btn-primary px-6 py-2 rounded-lg'
            },
            buttonsStyling: false
          });
        }
      );
    } else {
      this.boxService.createAssignment(this.assignment).subscribe(
        () => {
          this.loadAssignments();
          this.closeModal();
          Swal.fire({
            icon: 'success',
            title: '¡Creado!',
            text: 'La asignación ha sido creada correctamente',
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: 'rounded-xl',
              title: 'text-xl font-bold text-gray-800',
              htmlContainer: 'text-gray-600'
            }
          });
        },
        (error: any) => {
          console.error('Error creating assignment:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al crear la asignación',
            customClass: {
              popup: 'rounded-xl',
              title: 'text-xl font-bold text-gray-800',
              htmlContainer: 'text-gray-600',
              confirmButton: 'btn btn-primary px-6 py-2 rounded-lg'
            },
            buttonsStyling: false
          });
        }
      );
    }
  }

  editAssignment(assignment: Assignment): void {
    this.editingAssignment = assignment;
    this.assignment = { ...assignment };
    this.showModal = true;
  }

  deleteAssignment(id: string): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-xl',
        title: 'text-xl font-bold text-gray-800',
        htmlContainer: 'text-gray-600',
        confirmButton: 'btn btn-danger px-6 py-2 rounded-lg',
        cancelButton: 'btn btn-secondary px-6 py-2 rounded-lg'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.boxService.deleteAssignment(id).subscribe(
          () => {
            this.loadAssignments();
            this.filterAssignments(this.currentFilter);
            Swal.fire({
              icon: 'success',
              title: '¡Eliminado!',
              text: 'La asignación ha sido eliminada correctamente',
              showConfirmButton: false,
              timer: 1500,
              customClass: {
                popup: 'rounded-xl',
                title: 'text-xl font-bold text-gray-800',
                htmlContainer: 'text-gray-600'
              }
            });
          },
          (error: any) => {
            console.error('Error deleting assignment:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al eliminar la asignación',
              customClass: {
                popup: 'rounded-xl',
                title: 'text-xl font-bold text-gray-800',
                htmlContainer: 'text-gray-600',
                confirmButton: 'btn btn-primary px-6 py-2 rounded-lg'
              },
              buttonsStyling: false
            });
          }
        );
      }
    });
  }

  private resetForm(): void {
    this.assignment = {
      id: '',
      boxId: '',
      userId: '',
      assignmentDate: new Date(),
      observations: '',
      registrationDate: new Date(),
      status: 'active',
      userData: {
        fullName: '',
        document: '',
        address: ''
      },
      boxData: {
        code: '',
        type: ''
      }
    };
  }

  filterAssignments(status: string): void {
    console.log('Filtering by status:', status);
    console.log('Current assignments:', this.assignments);
    this.currentFilter = status;
    
    if (status === 'ALL') {
      this.filteredAssignments = this.assignments;
    } else {
      this.filteredAssignments = this.assignments.filter(assignment => {
        console.log('Assignment status:', assignment.status);
        return assignment.status === status;
      });
    }
    console.log('Filtered assignments:', this.filteredAssignments);
  }

  restoreAssignment(assignment: Assignment): void {
    Swal.fire({
      title: '¿Restaurar asignación?',
      text: "La asignación volverá a estar activa",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, restaurar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-xl',
        title: 'text-xl font-bold text-gray-800',
        htmlContainer: 'text-gray-600',
        confirmButton: 'btn btn-success px-6 py-2 rounded-lg',
        cancelButton: 'btn btn-secondary px-6 py-2 rounded-lg'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedAssignment = { ...assignment, status: 'active' };
        this.boxService.updateAssignment(assignment.id, updatedAssignment).subscribe(
          () => {
            this.loadAssignments();
            this.filterAssignments(this.currentFilter);
            Swal.fire({
              icon: 'success',
              title: '¡Restaurado!',
              text: 'La asignación ha sido restaurada correctamente',
              showConfirmButton: false,
              timer: 1500,
              customClass: {
                popup: 'rounded-xl',
                title: 'text-xl font-bold text-gray-800',
                htmlContainer: 'text-gray-600'
              }
            });
          },
          (error: any) => {
            console.error('Error restoring assignment:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al restaurar la asignación',
              customClass: {
                popup: 'rounded-xl',
                title: 'text-xl font-bold text-gray-800',
                htmlContainer: 'text-gray-600',
                confirmButton: 'btn btn-primary px-6 py-2 rounded-lg'
              },
              buttonsStyling: false
            });
          }
        );
      }
    });
  }

  viewDetails(assignment: Assignment): void {
    this.selectedAssignment = assignment;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedAssignment = null;
  }
} 