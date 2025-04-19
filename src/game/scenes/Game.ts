import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    triggerTimer: Phaser.Time.TimerEvent;
    gameTimer: Phaser.Time.TimerEvent;
    windSprite: Phaser.GameObjects.Sprite;
    leftKeyDown: boolean;
    rightKeyDown: boolean;
    backgroundLeft: Phaser.GameObjects.Image;
    backgroundRight: Phaser.GameObjects.Image;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.backgroundLeft = this.add.image(512, 384, 'bgleft').setVisible(false);
        this.backgroundRight = this.add.image(512, 384, 'bgright').setVisible(false);

        this.windSprite = this.physics.add.sprite(512, 384, 'star').setVisible(false);

        let leftKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

        let rightKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        rightKey?.on('down', () => {
            console.log(' right!!');
            this.rightKeyDown = true;
        });

        leftKey?.on('down', () => {
            console.log(' left!!');
            this.leftKeyDown = true;
        });

        this.triggerTimer = this.time.addEvent({
            callback: this.timerEvent,
            callbackScope: this,
            delay: 2000,
            loop: false
        });

        this.gameTimer = this.time.addEvent({
            callback: this.changeScene,
            callbackScope: this,
            delay: 80000,
            loop: false
        });

        EventBus.emit('current-scene-ready', this);
    }

    timerEvent() {
        if (Math.random() > 0.5) {
            this.setWind(this.backgroundLeft, false);
        } else {
            this.setWind(this.backgroundRight, true);
        }
    }

    setWind(background: Phaser.GameObjects.Image, isRight: boolean) {
        background.setVisible(true);
        this.rightKeyDown = false;
        this.leftKeyDown = false;
        const remainingSec = this.gameTimer.getOverallRemainingSeconds();
        const delay = remainingSec > 30 ? Phaser.Math.Between(3000, 5000) : Phaser.Math.Between(2000, 4000);

        if (remainingSec > 4) {
            setTimeout(() => {
                if ((isRight && !this.rightKeyDown) || (!isRight && !this.leftKeyDown)) {
                    this.scene.start('GameOver', { win: false });
                } else {
                    background.setVisible(false);
                    this.triggerTimer = this.time.addEvent({
                        callback: this.timerEvent,
                        callbackScope: this,
                        delay,
                        loop: false
                    });
                }
            }, 1000);
        }
        
    }

    changeScene() {
        console.log(' hello!!');
        this.scene.start('GameOver', { win: true });
    }
}
