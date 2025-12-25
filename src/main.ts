
import * as monaco from 'monaco-editor';
import { fromJSON, /*toJSON,*/ toHTML } from './citeme.ts';

const editor = monaco.editor.create(document.getElementById('jsoncontent')!, {
  value: `{
"authorsmap": [
{
"first": "Yu",
"last": "Zhai",
"itsme": true,
"id": "me"
},
{
"first": "Hui",
"last": "Li",
"id": "huili"
},
{
"first": "Robert J.",
"last": "Le Roy",
"id": "rjleroy"
}

],
"articles": [
{
"authors": [
{
"meta": "me"
},
{
"meta": "huili",
"cocor": true
}
],
"title": "Basis sets dependency in constructing spectroscopy-accuracy ab initio global electric dipole moment functions",
"journal": "Chinese Journal of Chemical Physics",
"volume": "35",
"pages": "52-57",
"year": 2022,
"doi": "10.1063/1674-0068/cjcp2112047",
"selected": false
},
{
"authors": [
{
"meta": "me"
},
{
"meta": "huili",
"cocor": true
},
{
"meta": "rjleroy",
"cocor": true
}
],
"title": "Constructing high-accuracy intermolecular potential energy surface with multi-dimension Morse/Long-Range model",
"journal": "Molecular Physics",
"volume": "116",
"pages": "843-853",
"year": 2018,
"doi": "10.1080/00268976.2018.1441856",
"selected": false
}
]
}
`,
  language: 'json',
  theme: 'vs-light',
  lineNumbers: 'on',
  automaticLayout: true
});


export function updatecontent() {
  const jsoncontent = editor.getValue();
  console.log(jsoncontent)
  fromJSON(jsoncontent)
  document.getElementById("renderhtml")!.innerHTML = toHTML()
}

export function savejson() {
  // 1. 获取编辑器纯文本内容
  const jsonText = editor.getValue();

  const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8' });

  // 4. 创建下载链接并触发下载
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json'; // 下载后的文件名（可自定义）
  document.body.appendChild(a);
  a.click(); // 触发下载

  // 5. 清理临时资源
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  alert('Download it.');
}

updatecontent();

editor.onDidChangeModelContent((_) => {
  updatecontent();
});

document.getElementById("refresh-button")!.addEventListener("click", updatecontent);
document.getElementById("save-button")!.addEventListener("click", savejson);
document.getElementById("enable_marks")!.addEventListener("click", updatecontent);
