/**
 * 用来指定商品详情的富文本编辑器组件
 */
import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import PropTypes from "prop-types";
import { BASE_URL } from "../../../../utils/constants";

const propTypes = {
  detail: PropTypes.string
};

export class RichTextEditor extends Component {
  
  constructor (props) {
    super(props);
    const html = this.props.detail;
    if (html) { //如果有值，则根据html格式字符串创建一个对应的编辑对象
      const contentBlock = htmlToDraft(html);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState
      };
    } else {
      this.state = {
        editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
      };
    }
  };
  
  // 输入过程中实时的回调
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState
    });
  };
  
  // 实时返回输入的细节
  getDetail = () => {
    //返回输入数据对应的html格式的文本
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
  };

  uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${BASE_URL}/manage/img/upload`);
      const data = new FormData();
      data.append("image", file);
      xhr.send(data);
      xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText);
        let url = response.data.url; //图片地址
        // url = url.replace("localhost", "120.55.193.14"); //替换本地地址成服务器地址
        resolve({ data: { link: url } });
      });
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={this.onEditorStateChange}
        editorStyle={{
          border: "1px solid black",
          minHeight: 200,
          paddingLeft: 10,
        }}
        toolbar={{
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
          image: {
            uploadCallback: this.uploadImageCallBack,
            alt: { present: true, mandatory: true },
          },
        }}
      />
      // <div>
        
        /* <textarea 
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */
      // </div>
    )
  }
}

RichTextEditor.propTypes = propTypes;

export default RichTextEditor
