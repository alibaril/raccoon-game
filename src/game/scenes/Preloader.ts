import { Scene } from 'phaser';
import { centerY, centerX } from '../constants';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(centerX, centerY, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(centerX, centerY, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(centerX-230, centerY, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('win', 'win.png');
        this.load.image('lose', 'lose.png');
        this.load.image('sun', 'sun.png');
        this.load.image('start', 'start.png');
        this.load.image('bgleft', 'bgL.png');
        this.load.image('bgright', 'bgR.png');

        this.load.audio('wind', [ 'windSound.wav' ]);
        this.load.audio('chickadees', [ 'chickadees.flac' ]);
        this.load.audio('fall', [ 'fall.mp3' ]);
        this.load.audio('yay', [ 'yay.mp3' ]);

        this.load.spritesheet('raccoon', 
            'spritesheet.png',
            { frameWidth: 200, frameHeight: 350 }
        );
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
