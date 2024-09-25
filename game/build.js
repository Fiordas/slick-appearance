const esbuild = require('esbuild');
const Q3Rcon = require('quake3-rcon');
const pack = require('./package.json');
require('dotenv').config({ path: '../.env' });

const IS_WATCH_MODE = process.env.IS_WATCH_MODE;

const rcon = new Q3Rcon({
  address: process.env.ADDRESS,
  port: process.env.PORT,
  password: process.env.PASSWORD,
});

const buildBundle = async () => {
  try {
    const buildOptions = {
      entryPoints: ['src/client/index.ts'],
      bundle: true,
      minify: true,
      absWorkingDir: process.cwd(),
      external: ['./node_modules/*'],
      outdir: 'dist',
    };

    if (IS_WATCH_MODE) {
      buildOptions.watch = {
        onRebuild(error) {
          if (error)
            console.error(
              `[ESBuild Watch] (${buildOptions.entryPoints[0]}) Failed to rebuild bundle`,
            );
          else
            console.log(
              `[ESBuild Watch] (${buildOptions.entryPoints[0]}) Sucessfully rebuilt bundle`,
            );
          rcon.send(`restart ${pack.name}`, () => {
            console.log(`Resource ${pack.name} restarted`);
          });
        },
      };
    }

    const { errors } = await esbuild.build(buildOptions);

    if (errors.length) {
      console.error(`[ESBuild] Bundle failed with ${errors.length} errors`);
      process.exit(1);
    }
  } catch (e) {
    console.log('[ESBuild] Build failed with error');
    console.error(e);
    process.exit(1);
  }
};

buildBundle().catch(() => process.exit(1));
