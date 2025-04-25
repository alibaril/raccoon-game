import { centerX, centerY } from '../constants';
import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    logo: Phaser.GameObjects.Image;
    playAgainText : Phaser.GameObjects.Text;
    winSound: Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound;
    loseSound: Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound;
    win: boolean;

    constructor ()
    {
        super('GameOver');
    }

    init (data: any) {
        this.win = data.win;
    }

    create ()
    {
        this.camera = this.cameras.main;

        this.background = this.add.image(centerX, centerY, 'background');

        this.logo = this.add.image(centerX, centerY, this.win ? 'win' : 'lose').setDepth(100).setInteractive({ cursor: 'pointer' });

        this.logo.on('pointerdown', () => {
            this.scene.start('MainMenu');
        }, this);

        this.winSound = this.sound.add('yay');
        this.loseSound = this.sound.add('fall');

        if (this.win) {
            this.winSound.play();
        } else {
            this.loseSound.play();
        }
        
        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}
