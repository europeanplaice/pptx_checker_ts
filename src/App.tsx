import React, { Component } from 'react';
import './App.css';
import { VscPass, VscError } from "react-icons/vsc";
var JSZip = require("jszip");

type ObjInfo = {
  page: number,
  name: string,
  font: string,
  font_color: string,
}

type FontProps = {
  shape: ObjInfo,
  key: number,
}

export function get_name_and_font(pptx_elem: Element, index: number): ObjInfo | null {
  let name = pptx_elem.getElementsByTagNameNS("http://schemas.openxmlformats.org/presentationml/2006/main", "nvSpPr")[0];
  name = name.getElementsByTagNameNS("http://schemas.openxmlformats.org/presentationml/2006/main", "cNvPr")[0];
  let name_string_null: string | null = name.getAttribute("name");
  let name_string: string;
  if (name_string_null) {
    name_string = name_string_null
  } else {
    name_string = "no name";
  }
  let font_elem = pptx_elem.getElementsByTagNameNS("http://schemas.openxmlformats.org/presentationml/2006/main", "txBody")[0];
  font_elem = font_elem.getElementsByTagNameNS("http://schemas.openxmlformats.org/drawingml/2006/main", "p")[0];
  font_elem = font_elem.getElementsByTagNameNS("http://schemas.openxmlformats.org/drawingml/2006/main", "r")[0];
  if (!font_elem) {
    return null
  }
  font_elem = font_elem.getElementsByTagNameNS("http://schemas.openxmlformats.org/drawingml/2006/main", "rPr")[0];
  let fontname_elem = font_elem.getElementsByTagNameNS("http://schemas.openxmlformats.org/drawingml/2006/main", "latin")[0];
  let fontcolor_elem: Element | null = font_elem.getElementsByTagNameNS("http://schemas.openxmlformats.org/drawingml/2006/main", "solidFill")[0];
  
  let fontcolor: string;
  if (!fontcolor_elem) {
    fontcolor = "default";
  } else {
    let srgbClr: Element | null = fontcolor_elem.getElementsByTagNameNS("http://schemas.openxmlformats.org/drawingml/2006/main", "srgbClr")[0];
    if (srgbClr){
      let val = srgbClr.getAttribute("val");
      if (val) {
        fontcolor = val;
      } else {
        fontcolor = "default";
      }
    } else {
      fontcolor = "default";
    }
  }

  let fontname: string;
  if (!fontname_elem) {
    fontname = "default";
  } else {
    let typeface = fontname_elem.getAttribute("typeface");
    if (typeface) {
      fontname = typeface;
    } else {
      fontname = "error";
    }
  }
  return { name: name_string, font: fontname, page: index + 1, font_color: fontcolor}
}

class Font extends Component<FontProps, {}> {
  render() {
    return (
      <div className="fonts">
        <div className="fontelem">{this.props.shape["page"]}</div>
        <div className="fontelem">{this.props.shape["font"]}</div>
        <div className="fontelem">{this.props.shape["font_color"]}</div>
        <div className="fontelem">{this.props.shape["name"]}</div>
      </div>
    )
  }
}

type appstate = {
  fonts: JSX.Element[], font_check_result: boolean | null,
  show_fonts: boolean, finish: boolean, 
  error: boolean,
  color_check_result: boolean | null,
}

class App extends Component<any, appstate> {

  constructor(props: any) {
    super(props);
    this.state = { fonts: [], font_check_result: null, show_fonts: false, finish: false, color_check_result: null, error: true};
  }

  showFile = async (e: any) => {
    e.preventDefault()
    const reader = new FileReader();
    reader.onload = async (e1) => {
      const zip = new JSZip();
      let t: Promise<any>[];
      // await clear_font();
      if (!e1.target) {
        return
      }
      t = await zip.loadAsync(e1.target.result)
        .then(async (e: any) => Object.keys(e.files).filter((a) => a.startsWith("ppt/slides/slide"))
          .map((e1) => e.files[e1])
          .map(async (elem) => await elem.async("string"))
        )
        .catch((err: any) => {
          console.log("err");
          this.setState((prev) => ({ ...prev, error: true, finish: true}))
          return
        })
      if (t.length === 0) {
        this.setState((prev) => ({ ...prev, error: true, finish: true}))
        return
      }
      const parser = new DOMParser();
      let shapes: ObjInfo[] = []
      t.forEach((page, index) => {
        page.then((page_: string) => {
          const dom = parser.parseFromString(page_, "application/xml");
          let data = dom.children[0].children[0].children[0];
          let data_array = Array.from(data.getElementsByTagNameNS("http://schemas.openxmlformats.org/presentationml/2006/main", "sp"));
          for (let pptx_elem of data_array) {
            let obj = get_name_and_font(pptx_elem, index);
            if (!obj) continue;
            shapes.push(obj);
          }
        });
      })
      Promise.all(t).then(async () => {
        shapes.sort((a, b) => a["page"] - b["page"])
        new Promise<JSX.Element[]>((res) => {
          let fonts = shapes.map((shape, index) => {
            return (<Font shape={shape} key={index} />)
          })
          res(fonts);
        }).then((fonts: JSX.Element[]) => {
          if (shapes.every((val, i, arr) => val["font"] === arr[0]["font"])) {
            this.setState((prev) => ({ ...prev, font_check_result: true, finish: true, fonts: fonts, error: false }))
          } else {
            this.setState((prev) => ({ ...prev, font_check_result: false, finish: true, fonts: fonts, error: false }))
          }
          let color_count = new Set(shapes.map((shape) => shape["font_color"])).size;
          console.log(color_count);
          if (color_count <= 4) {
            this.setState((prev) => ({ ...prev, color_check_result: true, finish: true, fonts: fonts, error: false }))
          } else {
            this.setState((prev) => ({ ...prev, color_check_result: false, finish: true, fonts: fonts, error: false }))
          }
        })
      })
    };
    reader.readAsBinaryString(e.target.files[0]);
  }

  render = () => {
    return (
      <div className='container'>
        <h1>Check Your PowerPoint Before You Publish</h1>
        <div className='description'>
          <p>It examines the pptx file you upload and extracts the fonts used in it. Currently, it only can inspect font information and the results of the analysis may not be correct.</p>
        </div>
        <p><b> The analysis is done in the browser. This website doesn't save your file to servers.</b></p>
        <input type="file" onChange={(e) => this.showFile(e)} />
        {this.state.error && this.state.finish ? 
        <div className="results">
          An error occurred. The file may not be pptx.
        </div>
        : null}
        {this.state.finish && !this.state.error ?
          <div className="results">
            <div className="flag">
              <div>
                {this.state.font_check_result ?
                  <div style={{ display: "flex", alignItems: "center" }}><VscPass style={{ marginRight: "0.2em" }} color={"#008000"} /> All the fonts are the same. </div> :
                  <div style={{ display: "flex", alignItems: "center" }}><VscError style={{ marginRight: "0.2em" }} color={"#ff0000"} /> Differents fonts are used. </div>
                }
              </div>
            </div>
            <div className="flag">
              <div>
                {this.state.color_check_result ?
                  <div style={{ display: "flex", alignItems: "center" }}><VscPass style={{ marginRight: "0.2em" }} color={"#008000"} /> The number of the font colors is below 4. </div> :
                  <div style={{ display: "flex", alignItems: "center" }}><VscError style={{ marginRight: "0.2em" }} color={"#ff0000"} /> The number of the font colors is above 4. </div>
                }
              </div>
            </div>
            <button onClick={() => this.setState((prev) => ({ ...prev, show_fonts: prev.show_fonts ? false : true }))}>{this.state.show_fonts ? "- Hide Detail" : "+ Show Detail"}</button>
            {this.state.show_fonts ?
              <div id="font">
                <div className="fonts">
                  <div className="fontelem">Page</div>
                  <div className="fontelem">Font</div>
                  <div className="fontelem">Font Color</div>
                  <div className="fontelem">Name</div>
                </div>
                {this.state.fonts}
              </div> : null
            }
          </div>
          : null
        }
      </div>
    )
  }
}

export default App;
