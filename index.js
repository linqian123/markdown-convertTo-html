const path = require('path');
const fs = require('fs');
const marked = require('marked');
var target = path.join(__dirname,process.argv[2]);
var filename = target.replace(path.extname(target),'.html');
const browserSync = require('browser-sync');
browserSync({
    browser: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    server:path.dirname(target),
    index:path.basename(filename),
    notify:false
});
var cssFile = path.join(__dirname,'./github-markdown.css');
fs.watchFile(target,{persistent:true,interval:200},(curr,prev)=>{
    if(curr.mtime === prev.mtime){
        return false;
    };
    fs.readFile(target,'utf8',(err,data)=>{
        if(err) throw err;
        var html = marked(data);
        fs.readFile(cssFile,'utf8',(err,cssdata)=>{
            if(err) throw err;
            var allHtml = template.replace('{{{content}}}',html).replace('{{{style}}}',cssdata);
            fs.writeFile(filename,allHtml,'utf8',(err)=>{
                if(err) throw err;
                console.log('写入成功！');
                browserSync.reload(path.basename(filename));
            });
        });
    });
});

var template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title></title>
        <style>
            .markdown-body {
                box-sizing: border-box;
                min-width: 200px;
                max-width: 980px;
                margin: 0 auto;
                padding: 45px;
            }
            @media (max-width: 767px) {
                .markdown-body {
                    padding: 15px;
                }
            }
            {{{style}}}
        </style>
    </head>
    <body>
        <div class="markdown-body">
            {{{content}}}
        </div>
    </body>
    </html>
`;