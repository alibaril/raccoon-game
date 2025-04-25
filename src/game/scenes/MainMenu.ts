import { GameObjects, Scene } from 'phaser';
import { centerX, centerY } from '../constants';

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
        this.background = this.add.image(centerX, centerY, 'background');

        this.logo = this.add.image(centerX, centerY, 'start').setDepth(100).setInteractive({ cursor: 'pointer' });

        this.logo.on('pointerdown', () => {
            this.scene.start('Game');
        }, this);

        EventBus.emit('current-scene-ready', this);
    }

}
