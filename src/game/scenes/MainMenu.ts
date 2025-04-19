import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    instructions: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(512, 384, 'background');

        this.logo = this.add.image(512, 200, 'logo').setDepth(100);

        this.title = this.add.text(512, 300, 'Start', {
            fontFamily: 'Helvetica', fontSize: 38, color: '#111111',
            align: 'center'
        }).setOrigin(0.5).setDepth(100).setInteractive({ cursor: 'pointer' });

        this.title.on('pointerdown', () => {
            this.scene.start('Game');
        }, this);

        this.instructions = this.add.text(512, 350, 'When the wind blows, use left and right arrow keys to stay balanced', {
            fontFamily: 'Helvetica', fontSize: 18, color: '#555555',
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }

}
