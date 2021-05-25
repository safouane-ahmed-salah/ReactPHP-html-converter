var buttonDom = document.getElementById('convert');
var nameDom = document.getElementById('name');
var mirrorHtml = CodeMirror.fromTextArea(document.getElementById('html'), {mode:  "text/html", lineNumbers: true, lineWrapping: true, styleActiveLine: true, theme: 'vscode-dark' });
var mirrorPhp = CodeMirror(document.getElementById('result'), {mode:  "application/x-httpd-php", lineNumbers: true, readOnly:true, lineWrapping: true, theme: 'vscode-dark'});
var hasNoChild = ['img', 'link', 'input', 'meta'];

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
            if(txt || !isList) doms.push(space +  `"${txt}"`);
        }else if(node.tagName){
            var attributes = [], tag = node.tagName.toLowerCase(), content = toPhpReact(node.childNodes, tabs+1), comma = '', atts = '';
            for(var att of node.attributes){
                attributes.push(`"${att.name}" => "${att.value}"`);
            }
            if(!content) content='null';
            if(attributes.length){
                atts = '[' +  attributes.join(', ') + ']'; comma =  ', ';
            }
            doms.push(space + 'new ' + tag + '('+ (hasNoChild.includes(tag) ? '' : content  + comma) + atts +')');
        }
    }
    html += doms.join(',\n');
    html += isList ? `\n${space}]` : '';
    return html;
}