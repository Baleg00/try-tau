const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const stylesDir = path.join(__dirname, '../style');

fs.readdir(stylesDir, (err, files) => {
  if (err) {
    console.error('Failed to read styles directory:', err);
    process.exit(1);
  }

  files
    .filter(file => file.endsWith('.tailwind.css'))
    .forEach(file => {
      const inputPath = path.join(stylesDir, file);
      const outputPath = inputPath.replace(/\.tailwind\.css$/, '.css');

      const cmd = 'npx';
      const args = ['@tailwindcss/cli', '-i', `"${inputPath}"`, '-o', `"${outputPath}"`, '--watch'];
      const proc = spawn(cmd, args, { stdio: 'inherit', shell: true });

      console.log(`Watching ${file}...`);

      proc.on('close', code => {
        if (code !== 0) {
          console.error(`Tailwind process for ${file} exited with code ${code}`);
        }
      });
    });
});
