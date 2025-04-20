import { centerX, centerY } from '../constants';
import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

const gameDuration = 80000;

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    triggerTimer: Phaser.Time.TimerEvent;
    gameTimer: Phaser.Time.TimerEvent;
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

        this.background = this.add.image(centerX, centerY, 'background');
        this.backgroundLeft = this.add.image(centerX, centerY, 'bgleft').setVisible(false);
        this.backgroundRight = this.add.image(centerX, centerY, 'bgright').setVisible(false);

        let leftKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

        let rightKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        rightKey?.on('down', () => {
            this.rightKeyDown = true;
        });

        leftKey?.on('down', () => {
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
            delay: gameDuration,
            loop: false
        });

        // This code below sets up our "sun dial" path and sun
        const graphics = this.add.graphics();

        const p0 = new Phaser.Math.Vector2(700, 550);
        const p1 = new Phaser.Math.Vector2(700, 400);
        const p2 = new Phaser.Math.Vector2(900, 400);
        const p3 = new Phaser.Math.Vector2(900, 550);

        const curve = new Phaser.Curves.CubicBezier(p0, p1, p2, p3);

        graphics.lineStyle(2, 0xffffff, 1);
        curve.draw(graphics, 64);

        const sun = this.add.follower(curve, 700, 550, 'star');
        sun.startFollow(gameDuration);

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

        // Add some toughness as the game progresses: make the delay between wind shorter
        const delay = remainingSec > 30 ? Phaser.Math.Between(1200, 2000) : Phaser.Math.Between(1000, 1800);

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
            }, 800);
        }
        
    }

    changeScene() {
        this.scene.start('GameOver', { win: true });
    }
}
