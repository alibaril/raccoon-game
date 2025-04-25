import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { centerX, centerY } from '../constants';

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
    raccoon: Phaser.GameObjects.Sprite;
    wind: Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound;
    chickadees: Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x000000);

        this.background = this.add.image(centerX, centerY, 'background');
        this.backgroundLeft = this.add.image(centerX, centerY, 'bgright').setVisible(false);
        this.backgroundRight = this.add.image(centerX, centerY, 'bgleft').setVisible(false);

        this.wind = this.sound.add('wind');
        this.wind.loop = true;
        this.chickadees = this.sound.add('chickadees');
        this.chickadees.loop = true;
        this.chickadees.play();

        this.raccoon = this.physics.add.sprite(centerX + 50, centerY, 'raccoon').refreshBody();
        
        // Possible future improvement: animated raccoon with windy fur?
        this.anims.create({
            key: 'left',
            frames: [ { key: 'raccoon', frame: 1 } ],
            frameRate: 1
        });

        this.anims.create({
            key: 'right',
            frames: [ { key: 'raccoon', frame: 2 } ],
            frameRate: 1
        });

        this.anims.create({
            key: 'center',
            frames: [ { key: 'raccoon', frame: 0 } ],
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

        const p0 = new Phaser.Math.Vector2(100, 550);
        const p1 = new Phaser.Math.Vector2(100, 400);
        const p2 = new Phaser.Math.Vector2(300, 400);
        const p3 = new Phaser.Math.Vector2(300, 550);

        const curve = new Phaser.Curves.CubicBezier(p0, p1, p2, p3);

        graphics.lineStyle(2, 0xffffff, 1);
        curve.draw(graphics, 64);

        const sun = this.add.follower(curve, 100, 550, 'sun');
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
        this.wind.play();
        background.setVisible(true);
        this.rightKeyDown = false;
        this.leftKeyDown = false;
        const remainingSec = this.gameTimer.getOverallRemainingSeconds();

        // Add some toughness as the game progresses: make the delay between wind shorter
        // These are hardcoded times, maybe as a future feature, difficulty could be set by the user?
        const delay = remainingSec > 50 ? Phaser.Math.Between(1800, 2600) : Phaser.Math.Between(1600, 2400);

        // If there's little game time left, dont end or add new event
        if (remainingSec > 3) {
            setTimeout(() => {
                this.wind.pause();
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
            }, 800);
        }
        
    }

    changeScene() {
        this.chickadees.stop();
        this.wind.stop();
        this.scene.start('GameOver', { win: true });
    }
}
