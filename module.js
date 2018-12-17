var fs = require('fs');
var path =require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs/lib/phantomjs');
var binPath = phantomjs.path

function evaluate(options) {
    var engine  = options.engine;      //Eg htmlcs, chrome, axe        default:htmlcs
    var output = options.output;       // Eg. json, string         default: string
    var level = options.level;         //E.g. WCAG2AA, WCAG2A, WCAG2AAA, Section508    default:WCAG2AA
    var errLevel = options.errLevel;   // Eg. 1,2,3   1 means Error, 2 means Warning, 3 means Notice   default:1,2,3
    var source = options.source;
    var tempFilename = 'tmp/'+ new Date().getTime() + '.html';

    if(typeof engine === 'undefined' || engine ==='') engine = 'htmlcs';
    if(typeof output === 'undefined' || output ==='') output = 'string';
    if(typeof level === 'undefined' || level ==='') level = 'WCAG2AA';
    if(typeof errLevel === 'undefined' || errLevel ==='') errLevel = '1';

    source = source.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,'');  //replaces script tags

    return new Promise(resolve => {
        fs.writeFile(tempFilename, source , function (err,data) {
            if (err) throw err;
            if(engine === 'htmlcs'){
                var childArgs = ['--config=config/config.json', path.join(__dirname, 'src/HTMLCS_Run.js'), tempFilename, level, errLevel, output];
            }
            if(engine === 'axe'){
                var childArgs = ['--config=config/config.json', path.join(__dirname, 'src/axe_url.js'),  tempFilename, output];
            }
            if(engine === 'chrome'){
                var childArgs = ['--config=config/config.json', path.join(__dirname, 'src/chrome_url.js'), tempFilename, output]
            }
            console.log('E N G I N E ' , engine, childArgs);

            childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
                stdout = stdout.replace('done','');

                resolve(stdout);

                fs.unlink(tempFilename, (err) => {
                    if (err) {
                        console.log("failed to delete : "+ err);
                    } else {
                        console.log('successfully deleted ' + tempFilename);
                    }
                });
            })
        })
    });
}

module.exports = { evaluate };
