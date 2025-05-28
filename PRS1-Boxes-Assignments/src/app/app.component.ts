import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="wrapper">
      <!-- Sidebar -->
      <nav id="sidebar" class="sidebar">
        <div class="sidebar-header">
          <h3>Water Boxes</h3>
        </div>

        <ul class="list-unstyled components">
          <li>
            <a routerLink="/boxes" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class="fas fa-box"></i>
              Cajas
            </a>
          </li>
          <li>
            <a routerLink="/assignments" routerLinkActive="active">
              <i class="fas fa-tasks"></i>
              Asignaciones
            </a>
          </li>
        </ul>
      </nav>

      <!-- Page Content -->
      <div id="content">
        <!-- Top Navbar -->
        <nav class="navbar navbar-expand-lg navbar-light bg-white custom-navbar">
          <div class="container-fluid d-flex align-items-center">
            <button type="button" id="sidebarToggle" class="btn btn-outline-primary me-3 custom-toggle-btn">
              <span id="arrowIcon">&#8592;</span>
            </button>
            <span class="navbar-title">
              Sistema de Gestión de <span class="highlight">Cajas de Agua</span>
            </span>
          </div>
        </nav>

        <!-- Main Content -->
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wrapper {
      display: flex;
      width: 100%;
      align-items: stretch;
    }

    .sidebar {
      min-width: 280px;
      max-width: 280px;
      background: #ffffff;
      color: #2c3e50;
      transition: all 0.3s ease;
      height: 100vh;
      position: fixed;
      box-shadow: 2px 0 10px rgba(0,0,0,0.1);
      z-index: 1000;
    }

    .sidebar.active {
      margin-left: -280px;
    }

    .sidebar .sidebar-header {
      padding: 25px 20px;
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
    }

    .sidebar .sidebar-header h3 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .sidebar ul.components {
      padding: 20px 0;
    }

    .sidebar ul li {
      margin: 5px 15px;
      border-radius: 8px;
    }

    .sidebar ul li a {
      padding: 12px 20px;
      font-size: 1rem;
      display: flex;
      align-items: center;
      color: #6c757d;
      text-decoration: none;
      transition: all 0.3s ease;
      border-radius: 8px;
    }

    .sidebar ul li a:hover {
      background: #f8f9fa;
      color: #2c3e50;
    }

    .sidebar ul li a.active {
      background: #e9ecef;
      color: #2c3e50;
      font-weight: 500;
    }

    .sidebar ul li a i {
      margin-right: 12px;
      font-size: 1.1rem;
      width: 20px;
      text-align: center;
    }

    #content {
      width: 100%;
      min-height: 100vh;
      margin-left: 280px;
      transition: all 0.3s ease;
      background: #f8f9fa;
    }

    #content.active {
      margin-left: 0;
    }

    .custom-navbar {
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      padding: 18px 30px;
      display: flex;
      align-items: center;
    }

    .custom-toggle-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      border-radius: 8px;
      border: none;
      background: #fff;
      box-shadow: 0 1px 3px rgba(44,62,80,0.07);
      transition: background 0.2s;
    }

    .custom-toggle-btn:hover {
      background: #f0f4fa;
    }

    .navbar-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2c3e50;
      letter-spacing: 0.5px;
      margin-left: 10px;
      display: flex;
      align-items: center;
    }

    .navbar-title .highlight {
      color: #1976d2;
      font-weight: 800;
      margin-left: 5px;
    }

    .content-wrapper {
      padding: 25px;
    }

    @media (max-width: 768px) {
      .sidebar {
        margin-left: -280px;
      }
      .sidebar.active {
        margin-left: 0;
      }
      #content {
        margin-left: 0;
      }
      #content.active {
        margin-left: 280px;
      }
      .navbar-title {
        font-size: 1.1rem;
      }
    }
  `]
})
export class AppComponent {
  title = 'Water Boxes Management';

  ngAfterViewInit() {
    // Add click event listener for sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const arrowIcon = document.getElementById('arrowIcon');
    if (sidebarToggle && sidebar && content && arrowIcon) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        content.classList.toggle('active');
        // Cambia la flecha según el estado
        if (sidebar.classList.contains('active')) {
          arrowIcon.innerHTML = '&#8594;'; // Flecha a la derecha
        } else {
          arrowIcon.innerHTML = '&#8592;'; // Flecha a la izquierda
        }
      });
    }
  }
}
