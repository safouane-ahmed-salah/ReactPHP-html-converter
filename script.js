var htmlDom = document.getElementById('html');
var buttonDom = document.getElementById('convert');
var nameDom = document.getElementById('name');
var resultNode = document.getElementById('result');
var hasNoChild = ['img', 'link', 'input', 'meta'];

buttonDom.onclick = function(){
    var el = document.createElement('res');
    el.innerHTML = htmlDom.value.trim();
    var component = nameDom.value || 'newComponent';
    resultNode.innerText = `<?php
namespace React\\Tag;    
use React\\Component;

class `+ component +` extends Component{
    function render(){
        return `+ toPhpReact(el.childNodes) +`;
    }
}`;
}

function toPhpReact(domList, tabs = 0){
    var doms = [], isList = domList.length > 1, space = isList ? '    '.repeat(tabs) : ''; 
    var html = isList ? '[\n' : '';
    for(var node of domList){
        if(node.nodeType==3) doms.push(space +  "'" + node.data.trim() + "'");
        else{
            var attributes = [], tag = node.tagName.toLowerCase();
            for(var att of node.attributes){
                attributes.push("'" + att.name + "' => '" + att.value + "'" )
            }

            doms.push(space + 'new ' + tag + '('+ (hasNoChild.includes(tag) ? '' : toPhpReact(node.childNodes, tabs+1)  + ', ') + '[' +  attributes.join(', ') +'])');
        }
    }
    html += doms.join(',\n');
    html += isList ? ']' : '';
    return html;
}