import React, { Component } from 'react';
import './App.css';
var JSZip = require("jszip");

class App extends Component {

  showFile = async (e: any) => {
    e.preventDefault()
    const reader = new FileReader();
    reader.onload = async (e1) => {
      const zip = new JSZip();
      if (!e1.target) {
        return
      }
      let t: Promise<any>[] = await zip.loadAsync(e1.target.result)
        .then(async (e: any) => Object.keys(e.files).filter((a) => a.startsWith("ppt/slides/slide"))
          .map((e1) => e.files[e1])
          .map(async (elem) => await elem.async("string"))
        )
        .catch((err: any) => {
          console.log("err");
          let fontflag = document.querySelector("#font_flag");
          if (fontflag) {
            fontflag.textContent = "Can't detect slides."
          };
          let elem = document.querySelector("#font");
          if (elem) {
            elem.innerHTML = "";
          }
        })
      new Promise<void>((res) => {
        let elem = document.querySelector("#font");
        if (elem) {
          elem.innerHTML = "";
        }
        res();
      }).then(() => {
        const parser = new DOMParser();
        let fonts: string[] = []
        for (let page of t) {
          page.then((page_: string) => {
            const dom = parser.parseFromString(page_, "application/xml");
            let data = dom.children[0].children[0].children[0];
            let data2 = Array.from(data.getElementsByTagNameNS("http://schemas.openxmlformats.org/presentationml/2006/main", "sp"));
            for (let d of data2) {
              d = d.getElementsByTagNameNS("http://schemas.openxmlformats.org/presentationml/2006/main", "txBody")[0];
              d = d.getElementsByTagNameNS("http://schemas.openxmlformats.org/drawingml/2006/main", "p")[0];
              d = d.getElementsByTagNameNS("http://schemas.openxmlformats.org/drawingml/2006/main", "r")[0];
              if (!d) {
                continue
              }
              d = d.getElementsByTagNameNS("http://schemas.openxmlformats.org/drawingml/2006/main", "rPr")[0];
              d = d.getElementsByTagNameNS("http://schemas.openxmlformats.org/drawingml/2006/main", "latin")[0];
              let d2;
              if (!d) {
                d2 = "default";
              } else {
                d2 = d.getAttribute("typeface");
              }
              console.log(d2);
              let elem2 = document.createElement("p");
              if (elem2) {
                elem2.textContent = d2;
              }
              let font = document.querySelector("#font");
              if (font) {
                font.appendChild(elem2);
              }
            }
          });
        }
        let fontflag = document.querySelector("#font_flag");
        if (fontflag) {
          if (fonts.every((val, i, arr) => val === arr[0])) {
            fontflag.textContent = 'All fonts are the same.';
          } else {
            fontflag.textContent = 'Differents fonts are used.';
          }
        }
      }
      )
    };
    reader.readAsBinaryString(e.target.files[0]);
  }

  render = () => {
    return (
      <div className='container'>
        <h1>PowerPoint Font Checker</h1>
        <p>It probes the pptx file you upload and extract the fonts used in it. </p>
        <p><b> The analysis is done in the browser. This webside doesn't save your file to servers.</b></p>
        <input type="file" onChange={(e) => this.showFile(e)} />
        <div id="font_flag"></div>
        <div id="font"> </div>
      </div>
    )
  }
}

export default App;
