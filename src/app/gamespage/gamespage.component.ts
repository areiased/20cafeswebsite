import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { pJSDom } from 'ng-particles';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gamespage',
  templateUrl: './gamespage.component.html',
  styleUrls: ['./gamespage.component.scss']
})
export class GamespageComponent implements OnInit, OnDestroy {

  @Output() gameIsFullscreen: EventEmitter<any> = new EventEmitter();

  @HostListener('pagehide') visibilityChange() {
    
  }

  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
      if (document.hidden){
        this.closeGame();
        this.showInfoToaster('Por teres saído desta janela, qualquer jogo aberto foi fechado para poupar energia do teu dispositivo.');
      }
  }

  pageId = '/games'; // for disqus identifier
  isPageVisible: boolean = true;
  loadingScreen: boolean = false;
  gameButtonError: string = null;
  buttonMessage: string = null;
  closeButtonError: string = null;
  gameIsLoading: boolean = false;
  gameFullscreen: boolean = false;
  currentGameId: number = null;
  gameName = {
    1: '20Clicker',
    2: '',
  };
  gameDirectory = {
    '1' : '../../assets/games_files/20clicker/index.html',
  };

  @Input() gameIsLoaded;

  constructor(private toastr: ToastrService) {
   }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    pJSDom[0].play(); // resumes the animation of tsparticles
  }

  openGame(gameNumber) {
    // 1 - 20Clicker Game
    if (gameNumber === 1) {
      pJSDom[0].pause(); // pauses the tsparticles
      this.loadingScreen = true;
      this.currentGameId = gameNumber;
      this.gameIsLoading = true;

      this.showSuccessToaster('O jogo foi iniciado. Diverte-te!');

      setTimeout(() => {
        this.loadingScreen = false;
      }, 2000);

    } else {
      this.showErrorToaster('O jogo escolhido não foi encontrado, ou algo correu mal! :(');
    }
  }

        // this.buttonMessage = 'A carregar o jogo, por favor aguarda...';
      // setTimeout(() => {
      //   if (this.gameButton !== 0 && this.gameIsLoading === true) {
      //     this.gameButtonError = 'Se demorar demais, verifica se está tudo bem com a tua internet.'
      //   }
      // }, 5000);

  gameIsLoadedTrue () {
    if (this.currentGameId !== 0) {
      this.gameButtonError = null;
      this.gameIsLoading = false;
      this.loadingScreen = false;
      console.log('iframe do jogo aberto com sucesso');
    }
  }

  @ViewChild('gameElement') gameElement;

  gameGoFullscreen(state: boolean) {
    
    if (state === true) {
      
      const elem = this.gameElement.nativeElement;
      // Use this.divRef.nativeElement here to request fullscreen
    
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
      this.gameFullscreen = true;
      this.gameIsFullscreen.emit(1);
      
    }
    if (state === false) {
      this.gameExitFullscreen();
      this.gameIsFullscreen.emit(this.gameIsFullscreen);
    }
  }

  gameExitFullscreen () {
    if (document['exitFullscreen']) {
      document['exitFullscreen']();
   } else if (document['webkitExitFullscreen']) {
      document['webkitExitFullscreen']();
   } else if (document['mozCancelFullScreen']) {
      document['mozCancelFullScreen']();
   } else if (document['msExitFullscreen']) {
      document['msExitFullscreen']();
   }
    this.gameFullscreen = false;
    this.gameIsFullscreen.emit(this.gameIsFullscreen);
  }

  closeGame() {
    if (this.currentGameId) {
      pJSDom[0].play();
      this.currentGameId = null;
      this.buttonMessage = null;
      this.gameButtonError = null;
      this.closeButtonError = null;
      this.gameIsLoading = false;
      this.gameExitFullscreen();
      this.showInfoToaster('O jogo foi fechado.');
    } else {
      // this.closeButtonError = 'Não há nenhum jogo aberto! What? Ou algo correu mal aqui...';
    }
  }

  popupGame(currentGame) {
    let gameFilesPath = this.gameDirectory[currentGame];
    window.open(gameFilesPath, this.gameName[currentGame] + ' um jogo da equipa 20Cafés/dia - 20cafes.com', "resizable=yes, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no");
    this.closeGame();
  }

  showSuccessToaster(message: string) {
    this.toastr.success(message);
  }

  showErrorToaster(message: string) {
    this.toastr.error(message);
  }

  showInfoToaster(message: string) {
    this.toastr.info(message);
  }

}
