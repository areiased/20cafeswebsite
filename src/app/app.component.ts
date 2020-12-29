import { Component, Input, Renderer2 } from '@angular/core';
import { HostListener } from '@angular/core';
import { AuthService } from './auth.service';
import { pJSDom } from 'ng-particles';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'cafespage';
    gameFullscreenMode: boolean = false;
    @Input() gameFullscreen;

    id = 'tsparticles';

    particlesOptions = {
        background: {
            color: {
                value: '#000',
            },
            opacity: 0,
        },
        fpsLimit: 30,
        interactivity: {
            detectsOn: 'window',
            events: {
                onClick: {
                    enable: true,
                    mode: 'push',
                },
                onHover: {
                    enable: false,
                    mode: 'grab',
                },
                resize: true,
            },
            modes: {
                bubble: {
                    distance: 200,
                    duration: 5,
                    opacity: 0.8,
                    size: 10,
                },
                push: {
                    quantity: 1,
                },
                repulse: {
                    distance: 200,
                    duration: 0.4,
                },
                grab: {
                    distance: 200,
                    line_linked: {
                        opacity: 0.8,
                    },
                },
            },
        },
        particles: {
            color: {
                value: '#000',
            },
            links: {
                color: '#000',
                distance: 300,
                enable: true,
                opacity: 0.2,
                width: 1,
            },
            collisions: {
                enable: false,
            },
            move: {
                direction: 'none',
                enable: true,
                outMode: 'out',
                random: true,
                speed: 1,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    value_area: 300,
                },
                value: 10,
            },
            opacity: {
                value: 0.9,
            },
            shape: {
                type: 'circle',
            },
            size: {
                random: true,
                value: 4,
            },
        },
        detectRetina: true,
    };

    constructor(public authService: AuthService, private renderer: Renderer2, private toastr: ToastrService) {}

    openMenu() {
        const element: HTMLElement = document.getElementById(
            'hamburger-menu-div'
        );
        this.renderer.setStyle(element, 'top', '0');
    }

    closeMenu() {
        const element: HTMLElement = document.getElementById(
            'hamburger-menu-div'
        );
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

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        document.addEventListener(
            "visibilitychange"
            , () => { 
              if (document.hidden) { 
                pJSDom[0].pause();
                
              }else{
                pJSDom[0].play();
                
              }
            }
          );

        setTimeout(() => {
            this.showInfoToaster('Estamos no Reddit! Junta-te! ☕️', 'NOVIDADE!', 5000);
        }, 4000);
    }

    showInfoToaster(message: string, title: string, timeoutms: number) {
        this.toastr.warning(message, title, {
            timeOut: timeoutms,
            progressBar: true,
            closeButton: true,
            extendedTimeOut: 2000,
        });
    }

    gameIsFullscreen(status: boolean) {
        if (status === true) {
            this.gameFullscreenMode = true;
            this.showInfoToaster('Estamos no Reddit! Comunidade de Gaming e Tecnologia portuguesa. Junta-te!', 'TRUE!', 10000);
            console.log('true');
            
        } else if (status === false) {
            this.gameFullscreenMode = false;
            this.showInfoToaster('Estamos no Reddit! Comunidade de Gaming e Tecnologia portuguesa. Junta-te!', 'false!', 10000);
            console.log('false');
            
        }
    }
}
