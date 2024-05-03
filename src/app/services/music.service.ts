import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  audio: HTMLAudioElement = new Audio();
  isPlaying: boolean = false;

  constructor() { }

  playMusic() {
    this.audio.src = '../../assets/music/mario-music.mp3' // Substitua 'sua_musica.mp3' pelo nome do seu arquivo de áudio
    this.audio.load();
    this.audio.loop = true; // Reprodução contínua da música
    this.audio.play();
    this.isPlaying = true;
  }

  stopMusic() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
  }
}
