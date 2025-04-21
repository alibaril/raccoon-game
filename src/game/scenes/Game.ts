import { centerX, centerY } from '../constants';
import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

const gameDuration = 100000;

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
    raccoon: Phaser.GameObjects.Sprite;

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

        this.raccoon = this.physics.add.sprite(centerX, centerY - 100, 'raccoon').setScale(2).refreshBody();

        this.anims.create({
            key: 'left',
            frames: [ { key: 'raccoon', frame: 0 } ],
            frameRate: 1
        });

        this.anims.create({
            key: 'right',
            frames: [ { key: 'raccoon', frame: 1 } ],
            frameRate: 1
        });

        this.anims.create({
            key: 'center',
            frames: [ { key: 'raccoon', frame: 2 } ],
            frameRate: 1
        });

        this.raccoon.anims.play('center', true);

        let leftKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

        let rightKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        rightKey?.on('down', () => {
            this.rightKeyDown = true;
            this.raccoon.anims.play('right');
        });

        leftKey?.on('down', () => {
            this.leftKeyDown = true;
            this.raccoon.anims.play('left');
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
        const delay = remainingSec > 50 ? Phaser.Math.Between(1000, 1800) : Phaser.Math.Between(800, 1600);

        if (remainingSec > 2) {
            setTimeout(() => {
                if ((isRight && !this.rightKeyDown) || (!isRight && !this.leftKeyDown)) {
                    this.scene.start('GameOver', { win: false });
                } else {
                    background.setVisible(false);
                    this.raccoon.anims.play('center');
                    this.triggerTimer = this.time.addEvent({
                        callback: this.timerEvent,
                        callbackScope: this,
                        delay,
                        loop: false
                    });
                }
            }, 600);
        }
        
    }

    changeScene() {
        this.scene.start('GameOver', { win: true });
    }
}
