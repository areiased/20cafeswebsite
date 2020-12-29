import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-clickergame',
    templateUrl: './clickergame.component.html',
    styleUrls: ['./clickergame.component.scss'],
})
export class ClickergameComponent implements OnInit {
    title = 'clickergame';
    gamedivHTML = null;
    @Output() gameIsLoadedEvent = new EventEmitter();

    constructor(
        private sanitizer: DomSanitizer,
    ) {}

    ngOnInit() {
        if (!this.gamedivHTML) {
            this.gamedivHTML = this.sanitizer.bypassSecurityTrustHtml(
                `<iframe class="gameiframe" [ngClass]="{'gameiframe-fullscreen': gameFullscreenMode}" (load)="gameiframeLoaded()" src="../../assets/games_files/20clicker/index.html" frameborder="0" scrolling="no" allowfullscreen></iframe>`,
              );
        } else {
            this.gamedivHTML = 'Algo correu mal ao dar load do jogo!';
            console.log('Erro ao carregar o componente do jogo. gamedivHTML já existia?');
        }
    }

    //funcao chamada pelo iframe aqui em cima na ngoninit
    gameiframeLoaded() {
        this.gameIsLoadedEvent.emit('gameIsLoaded');
        console.log('game iframe loaded');
        
    }

    ngOnDestroy(): void {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.gamedivHTML = null;
    }
}
