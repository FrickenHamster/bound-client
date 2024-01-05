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
      {
        name: 'traps',
        assets: [
          {
            name: 'explosion',
            srcs: 'images/traps/explosion.json',
          },
        ],
      },
    ],
  };

  await Assets.init({ manifest });
  await Assets.loadBundle('bounders');
  await Assets.loadBundle('traps');
};
