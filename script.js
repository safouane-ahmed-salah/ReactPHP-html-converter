var htmlDom = document.getElementById('html');
var buttonDom = document.getElementById('convert');
var nameDom = document.getElementById('name');
var resultNode = document.getElementById('result');

buttonDom.onclick = function(){
    var el = document.createElement('res');
    el.innerHTML = htmlDom.value.trim();
    var component = nameDom.value || 'newComponent';
    resultNode.innerText = `<?php
        namespace React\\Tag;
    
        use React\\Component;

        class `+ component +` extends Component{
            function render(){
                return `+ toPhpReact(el.childNodes) +`
            }
        }
    `;
}

function toPhpReact(domList){
    var doms = [];
    var html = domList.length > 1 ? '[\n' : '';
    for(var node of domList){
        if(node.nodeType==3) doms.push("'" + node.data.trim() + "'");
        else{
            var attributes = [];
            for(var att of node.attributes){
                attributes.push("'" + att.name + "' => '" + att.value + "'" )
            }
            doms.push('new ' + node.tagName.toLowerCase() + '( ' + toPhpReact(node.childNodes)  + ', [' +  attributes.join(', ') +'])');
        }
    }
    html += doms.join(',\n');
    html += domList.length > 1 ? ']' : '';
    return html;
}