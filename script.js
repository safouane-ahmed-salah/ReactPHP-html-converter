var buttonDom = document.getElementById('convert');
var nameDom = document.getElementById('name');
var mirrorHtml = CodeMirror.fromTextArea(document.getElementById('html'), {mode:  "text/html", lineNumbers: true, lineWrapping: true, styleActiveLine: true, theme: 'vscode-dark' });
var mirrorPhp = CodeMirror(document.getElementById('result'), {mode:  "application/x-httpd-php", lineNumbers: true, readOnly:true, lineWrapping: true, theme: 'vscode-dark'});

buttonDom.onclick = function(){
    var el = document.createElement('res');
    el.innerHTML = mirrorHtml.getValue().trim();
    var component = (nameDom.value || 'newComponent').replace(/\W/g,'');
    nameDom.value = component;
    mirrorPhp.setValue(`<?php
namespace React\\Tag;    
use React\\Component;

class `+ component +` extends Component{
    function render(){
        return `+ toPhpReact(el.childNodes).trim() +`;
    }
}`);
}

function toPhpReact(domList, tabs = 2){
    var doms = [], isList = domList.length > 1, space = isList ? '    '.repeat(tabs) : ''; 
    var html = isList ? '[\n' : '';
    for(var node of domList){
        if(node.nodeType==3){ 
            var txt = node.data.trim();
            if(txt || !isList) doms.push(space +  `"${txt.replace(/"/g,'\\"')}"`);
        }else if(node.tagName){
            var attributes = [], tag = node.tagName.toLowerCase(), content = toPhpReact(node.childNodes, tabs+1), 
            comma = '', atts = '', bracketOpen = '', bracketClose = '';
            for(var att of node.attributes){
                attributes.push(`"${att.name.replace(/"/g,'\\"')}" => "${att.value.replace(/"/g,'\\"')}"`);
            }
            if(attributes.length){
                atts = '[' +  attributes.join(', ') + ']';
            }
            if(attributes.length || content){
                bracketOpen = '(';
                bracketClose = ')';
            }
            if(attributes.length && content) comma =  ', ';

            doms.push(space + 'new ' + tag + bracketOpen + (!atts ? '' : atts + comma) + content + bracketClose);
        }
    }
    html += doms.join(',\n');
    html += isList ? `\n${space}]` : '';
    return html;
}