import { Component, ElementRef } from '@angular/core';
import { MusicService } from '../../app/services/music.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  player: HTMLElement | null = null;
  pipe: HTMLElement | null = null;
  cloud: HTMLElement | null = null;
  restartButton: HTMLElement | null = null;
  gameOverImageUrl: string = '../../assets/icon/game-over.png'; //  jogador em estado de "game over"
  loop: any; // Variável para armazenar o loop

  constructor(private elementRef: ElementRef, private musicService: MusicService, private alertController: AlertController) {
    this.musicService.playMusic(); 
  }

  ionViewWillEnter() {
    this.player = this.elementRef.nativeElement.querySelector('.player');
    this.pipe = this.elementRef.nativeElement.querySelector('.pipe');
    this.cloud = this.elementRef.nativeElement.querySelector('.cloud');
    this.restartButton = this.elementRef.nativeElement.querySelector('.restart');
    
    // Iniciar o loop de detecção de colisão
    this.startCollisionDetectionLoop();
  }

  startCollisionDetectionLoop() {
    this.loop = setInterval(() => {
      this.detectCollision();
    }, 10);
  }

  stopCollisionDetectionLoop() {
    clearInterval(this.loop);
  }

  jump() {
    if (this.player) {
      this.player.classList.add('jump');

      setTimeout(() => {
          this.player!.classList.remove('jump');
      }, 500);
    }
  }

  async gameOverAlert() {

    this.stopCollisionDetectionLoop(); // Pare o loop ao exibir o alerta
    const alert = await this.alertController.create({
        header: 'Game Over',
        message: 'Deseja reiniciar o jogo?',
        buttons: [
            {
                text: 'Reiniciar',
                handler: () => {
                    console.log('Jogo reiniciado');
                    // Reiniciar o jogo aqui
                    window.location.reload();
                    this.startCollisionDetectionLoop(); // Reinicie o loop após reiniciar o jogo
                }
            }
        ]
    });

    await alert.present();
}


  detectCollision() {
    if (this.pipe && this.player && this.cloud) {
      const pipePosition = this.pipe.offsetLeft;
      const playerPosition = +window.getComputedStyle(this.player).bottom.replace('px', '');
      const cloudPosition = +window.getComputedStyle(this.cloud).left.replace('px', '');
      
      if (pipePosition <= 100 && pipePosition > 0 && playerPosition < 60) {
        this.pipe.style.animation = 'none';
        this.pipe.style.left = `${pipePosition}px`;
        
        this.player.style.animation = 'none';
        this.player.style.bottom = `${playerPosition}px`;
         

        // Altera a fonte da imagem do jogador para a URL da imagem de "game over"
        if (this.player instanceof HTMLImageElement) {
          this.player.src = this.gameOverImageUrl;
          this.player.style.width = '70px';
          this.player.style.marginLeft = '35px';
        }

        this.cloud.style.animation = 'cloud 20s infinite linear';
        this.cloud.style.left = `${cloudPosition}px`;
        this.musicService.stopMusic();
        // Exibe o alerta "Game Over"
        this.gameOverAlert();
      }
    }
  }
}
