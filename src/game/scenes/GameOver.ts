import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText : Phaser.GameObjects.Text;
    playAgainText : Phaser.GameObjects.Text;
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
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff0000);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.gameOverText = this.add.text(512, 284, this.win ? 'Good job!' : 'Game Over', {
            fontFamily: 'Helvetica', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.playAgainText = this.add.text(512, 400, 'Play Again', {
            fontFamily: 'Helvetica', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center',
        }).setOrigin(0.5).setDepth(100).setInteractive({ cursor: 'pointer' });

        this.playAgainText.on('pointerdown', () => {
            this.scene.start('MainMenu');
        }, this);
        
        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}
