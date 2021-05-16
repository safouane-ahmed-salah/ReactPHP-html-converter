var buttonDom = document.getElementById('convert');
var nameDom = document.getElementById('name');
var mirrorHtml = CodeMirror.fromTextArea(document.getElementById('html'), {mode:  "text/html", lineNumbers: true, lineWrapping: true });
var mirrorPhp = CodeMirror(document.getElementById('result'), {mode:  "application/x-httpd-php", lineNumbers: true, readOnly:true, lineWrapping: true });
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
        return `+ toPhpReact(el.childNodes) +`;
    }
}`);
}

function toPhpReact(domList, tabs = 0){
    var doms = [], isList = domList.length > 1, space = isList ? '    '.repeat(tabs) : ''; 
    var html = isList ? '[\n' : '';
    for(var node of domList){
        if(node.nodeType==3){ 
            var txt = node.data.trim();
            if(txt || !isList) doms.push(space +  '"' + txt + '"');
        }else{
            var attributes = [], tag = node.tagName.toLowerCase();
            for(var att of node.attributes){
                attributes.push('"' + att.name + '" => "' + att.value + '"')
            }

            doms.push(space + 'new ' + tag + '('+ (hasNoChild.includes(tag) ? '' : toPhpReact(node.childNodes, tabs+1)  + ', ') + '[' +  attributes.join(', ') +'])');
        }
    }
    html += doms.join(',\n');
    html += isList ? ']' : '';
    return html;
}