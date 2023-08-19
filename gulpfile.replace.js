const fs = require("fs");
const replace = require('gulp-replace-task');
const Applause = require('applause');

module.exports = (options = { SITE_DIR: '/', SITE_TEMPLATE_PATH: '/.', }) => {
  // С `/` на конце
  const SITE_DIR = options.SITE_DIR || '/';
  // Без `/` на конце
  const SITE_TEMPLATE_PATH = options.SITE_TEMPLATE_PATH || '/.';

  const replacerOpts = {
    patterns: [
      {
        match: /([\t ]+)?(?:<!-- ?)?@@INC:\((?<args>.+)\) ?(?:-->)?/g,
        replacement: (...args) => {
          const [, spaces, incArgs] = args;
          const [filePath, incOpts] = incArgs.split(',').map(e => e.trim());

          try {
            const applause = Applause.create(replacerOpts);
            let content = fs.readFileSync(`./source/include/${filePath}`, 'utf8');
            // fix tabs
            content = content.split('\n').map(e => spaces + e).join('\n');
            return applause.replace(content).content || content;
          } catch {
            return `<font color="red">`
              + `<b>Fail import!</b> File: <code>${filePath}</code>;<br />`
              + (incOpts ? `Options: <pre>${JSON.stringify(incOpts)}</pre>` : ``)
              + `</font>`;
          }
        }
      },
      {
        match: /<\?= (\\?)XTZ::getSvgSprite\('(?<spriteName>[a-z\-_]+)'(, ?(?<width>([0-9]+|null)))?(, ?(?<height>([0-9]+|null)))?(, ?'(?<_class>[a-z\-_]+)')?\) \?>/g,
        replacement: (...args) => {
          const groups = args[args.length - 1];
          if (!groups) {
            return '<!-- svg sprites fail 1 -->';
          }

          try {

            let {
              spriteName,
              width,
              height,
              _class: className,
            } = groups

            width = !width || width === 'null' ? 24 : width;
            height = !height || height === 'null' ? 24 : height;

            let classAttr = className ? 'class="' + className + '" ' : '';
            let widthAttr = width ? 'width="' + width + '" ' : '';
            let heightAttr = height ? 'height="' + height + '" ' : '';

            let content = '<svg ' + classAttr + widthAttr + heightAttr + '>' +
              '<use xlink:href="' + SITE_TEMPLATE_PATH + '/assets/img/sprite.svg#' + spriteName + '"></use>' +
              '</svg>';
            return content;
          } catch (err) {
            return `<!-- svg sprites fail 2 (${err.message}) -->`;
          }
        }
      },
      {
        match: /<\?= ?(SITE_DIR|SITE_TEMPLATE_PATH) ?\?>/g,
        replacement: (...args) => {
          const [, constName] = args;
          switch (constName) {
            case 'SITE_DIR':
              return SITE_DIR;
            case 'SITE_TEMPLATE_PATH':
              return SITE_TEMPLATE_PATH;

            default:
              return '';
          }
        },
      },
    ]
  };
  return replace(replacerOpts);
};
