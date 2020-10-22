import { Component, Renderer2 } from '@angular/core';
import { HostListener } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'cafespage';
  

  constructor(
    public authService: AuthService,
    private renderer: Renderer2,
  ) { }

  openMenu() {
    const element: HTMLElement = document.getElementById('hamburger-menu-div');
    this.renderer.setStyle(element, 'top', '0');
  }

  closeMenu() {
    const element: HTMLElement = document.getElementById('hamburger-menu-div');
    this.renderer.setStyle(element, 'top', '-100vh');
  }

  @HostListener('window:scroll', ['$event'])

  onWindowScroll(e) {
    let element = document.querySelector('.navbar-div');
    let contentscrolled = document.querySelector('.logo');
    if (window.pageYOffset > contentscrolled.clientHeight - 100) {
      element.classList.add('navbar-div-scrolledcolor');
    } else {
      element.classList.remove('navbar-div-scrolledcolor');
    }
  }

}


