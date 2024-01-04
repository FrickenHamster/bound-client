import { Assets } from 'pixi.js';

export const preloadGame = async () => {
  const manifest = {
    bundles: [
      {
        name: 'bounders',
        assets: [
          {
            name: 'usagibobo',
            srcs: 'images/army/dansu-bobo.png',
          },
        ],
      },
    ],
  };

  await Assets.init({ manifest });
  await Assets.loadBundle('game-ui');
};
