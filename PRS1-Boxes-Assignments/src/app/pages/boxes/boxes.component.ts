import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Box } from '../../interfaces/box.interface';
import { BoxService } from '../../services/box.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-boxes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boxes.component.html',
  styles: [`
    .card {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(44,62,80,0.08);
      overflow: hidden;
    }
    .card-header {
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
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
      background: #e9ecef;
      color: #343a40;
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 0.05em;
      border-bottom: 2px solid #dee2e6;
      padding: 12px 20px;
      text-align: left;
    }
     thead th:last-child {
       text-align: right;
     }
    tbody tr {
      transition: background-color 0.2s ease;
    }
    tbody tr:nth-child(even) {
      background-color: #f8f9fa;
    }
    tbody tr:hover {
      background-color: #e9ecef;
    }
    td {
      border: none;
      padding: 12px 20px;
      font-size: 0.95rem;
      color: #495057;
      vertical-align: middle;
    }
    td:last-child {
      text-align: right;
    }
    .btn {
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 0.9rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .btn i {
      font-size: 1rem;
    }
    .btn-outline-light {
      border: 1px solid rgba(255, 255, 255, 0.5);
      color: #fff;
      background-color: transparent;
    }
    .btn-outline-light:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: #fff;
      border-color: #fff;
    }
    .btn-light {
      background-color: #f8f9fa;
      color: #212529;
      border: 1px solid #f8f9fa;
    }
    .btn-light:hover {
       background-color: #e2e6ea;
       border-color: #dae0e5;
       color: #212529;
    }
    .btn-primary {
      background-color: #007bff;
      color: #fff;
      border: 1px solid #007bff;
    }
    .btn-primary:hover {
      background-color: #0056b3;
      border-color: #004085;
    }
    .btn-secondary {
      background-color: #6c757d;
      color: #fff;
      border: 1px solid #6c757d;
    }
    .btn-secondary:hover {
      background-color: #545b62;
      border-color: #454d55;
    }
    .btn-info {
      background-color: #17a2b8;
      color: #fff;
      border: 1px solid #17a2b8;
    }
    .btn-info:hover {
      background-color: #138496;
      border-color: #117a8b;
    }
    .btn-danger {
      background-color: #dc3545;
      color: #fff;
      border: 1px solid #dc3545;
    }
    .btn-danger:hover {
      background-color: #c82333;
      border-color: #bd2130;
    }
     .btn-success {
      background-color: #28a745;
      color: #fff;
      border: 1px solid #28a745;
    }
    .btn-success:hover {
      background-color: #218838;
      border-color: #1e7e34;
    }
    .btn-sm {
      padding: 5px 10px;
      font-size: 0.875rem;
    }
    .form-control {
       display: block;
       width: 100%;
       padding: 0.375rem 0.75rem;
       font-size: 1rem;
       line-height: 1.5;
       color: #495057;
       background-color: #fff;
       background-clip: padding-box;
       border: 1px solid #ced4da;
       border-radius: 0.25rem;
       transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }
    .form-control:focus {
       border-color: #80bdff;
       outline: 0;
       box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
    @media (max-width: 900px) {
      table, thead, tbody, th, td, tr {
        display: block;
      }
      thead {
        display: none;
      }
      tr {
        margin-bottom: 15px;
        border: 1px solid #dee2e6;
        border-radius: 0.25rem;
        background: #fff;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      }
      td {
        text-align: right;
        position: relative;
        padding: 10px 15px;
      }
      td:before {
        content: attr(data-label);
        position: absolute;
        left: 15px;
        font-weight: 600;
        color: #495057;
        text-align: left;
      }
      td:last-child {
        text-align: right;
        border-top: 1px solid #dee2e6;
      }
      .btn-sm {
        padding: 6px 10px;
        font-size: 0.9rem;
      }
    }
  `]
})
export class BoxesComponent implements OnInit {
  boxes: Box[] = [];
  filteredBoxes: Box[] = [];
  currentFilter: string = 'ALL';
  box: Box = {
    id: '',
    code: '',
    type: '',
    installationDate: new Date(),
    observations: '',
    registrationDate: new Date(),
    status: 'active',
    userId: ''
  };
  editingBox: Box | null = null;
  showModal = false;
  showDetailsModal = false;
  selectedBox: Box | null = null;

  constructor(private boxService: BoxService) {}

  ngOnInit(): void {
    this.loadBoxes();
  }

  loadBoxes(): void {
    this.boxService.getBoxes().subscribe(
      (boxes: Box[]) => {
        this.boxes = boxes;
        this.filterBoxes(this.currentFilter);
      },
      (error: any) => console.error('Error loading boxes:', error)
    );
  }

  filterBoxes(status: string): void {
    console.log('Filtering by status:', status);
    this.currentFilter = status;
    
    if (status === 'ALL') {
      this.filteredBoxes = this.boxes;
    } else {
      this.filteredBoxes = this.boxes.filter(box => box.status === status.toLowerCase());
    }
    console.log('Filtered boxes:', this.filteredBoxes);
  }

  openModal(): void {
    this.showModal = true;
    this.resetForm();
    if (!this.editingBox) {
      this.box.code = this.getNextBoxCode();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.editingBox = null;
    this.resetForm();
  }

  onSubmit(): void {
    if (this.editingBox) {
      this.boxService.updateBox(this.editingBox.id, this.box).subscribe({
        next: () => {
          this.loadBoxes();
          this.closeModal();
          Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'La caja ha sido actualizada correctamente',
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: 'rounded-xl',
              title: 'text-xl font-bold text-gray-800',
              htmlContainer: 'text-gray-600'
            }
          });
        },
        error: (error) => {
          console.error('Error updating box:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al actualizar la caja',
            confirmButtonColor: '#3085d6',
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
    } else {
      this.boxService.createBox(this.box).subscribe({
        next: () => {
          this.loadBoxes();
          this.closeModal();
          Swal.fire({
            icon: 'success',
            title: '¡Creado!',
            text: 'La caja ha sido creada correctamente',
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: 'rounded-xl',
              title: 'text-xl font-bold text-gray-800',
              htmlContainer: 'text-gray-600'
            }
          });
        },
        error: (error) => {
          console.error('Error creating box:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al crear la caja',
            confirmButtonColor: '#3085d6',
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
  }

  editBox(box: Box): void {
    console.log('Editing box:', box);
    const boxId = box.id;
    this.editingBox = { ...box };
    this.box = { 
      ...box,
      id: boxId
    };
    this.showModal = true;
  }

  deleteBox(id: string): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: "La caja será marcada como inactiva",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-xl',
        title: 'text-xl font-bold text-gray-800',
        htmlContainer: 'text-gray-600',
        confirmButton: 'btn btn-primary px-6 py-2 rounded-lg',
        cancelButton: 'btn btn-secondary px-6 py-2 rounded-lg'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.boxService.deleteBox(id).subscribe({
          next: () => {
            this.loadBoxes();
            this.filterBoxes(this.currentFilter);
            Swal.fire({
              icon: 'success',
              title: '¡Desactivada!',
              text: 'La caja ha sido marcada como inactiva',
              showConfirmButton: false,
              timer: 1500,
              customClass: {
                popup: 'rounded-xl',
                title: 'text-xl font-bold text-gray-800',
                htmlContainer: 'text-gray-600'
              }
            });
          },
          error: (error) => {
            console.error('Error deactivating box:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al desactivar la caja',
              confirmButtonColor: '#3085d6',
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
    });
  }

  restoreBox(id: string): void {
    Swal.fire({
      title: '¿Restaurar caja?',
      text: "La caja volverá a estar activa",
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
        this.boxService.restoreBox(id).subscribe({
          next: () => {
            this.loadBoxes();
            this.filterBoxes(this.currentFilter);
            Swal.fire({
              icon: 'success',
              title: '¡Restaurada!',
              text: 'La caja ha sido restaurada correctamente',
              showConfirmButton: false,
              timer: 1500,
              customClass: {
                popup: 'rounded-xl',
                title: 'text-xl font-bold text-gray-800',
                htmlContainer: 'text-gray-600'
              }
            });
          },
          error: (error) => {
            console.error('Error restoring box:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al restaurar la caja',
              confirmButtonColor: '#3085d6',
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
    });
  }

  private resetForm(): void {
    this.box = {
      id: '',
      code: '',
      type: '',
      installationDate: new Date(),
      observations: '',
      registrationDate: new Date(),
      status: 'active',
      userId: ''
    };
  }

  private getNextBoxCode(): string {
    const boxCodes = this.boxes.map(box => box.code);
    const lastCode = boxCodes.reduce((maxCode, currentCode) => {
      if (!currentCode || !maxCode) return currentCode || maxCode;
      const currentNum = parseInt(currentCode.replace('BOX-', ''), 10);
      const maxNum = parseInt(maxCode.replace('BOX-', ''), 10);
      return currentNum > maxNum ? currentCode : maxCode;
    }, 'BOX-000'); // Default to 'BOX-000' if no codes exist

    const lastNumber = parseInt(lastCode.replace('BOX-', ''), 10);
    const nextNumber = lastNumber + 1;
    const nextCode = 'BOX-' + nextNumber.toString().padStart(3, '0');
    return nextCode;
  }

  viewBoxDetails(box: Box): void {
    this.selectedBox = box;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedBox = null;
  }
} 