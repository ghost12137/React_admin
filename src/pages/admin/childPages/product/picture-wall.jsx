import React from 'react';
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { BASE_URL } from "../../../../utils/constants";
import { DeleteImg } from "../../../../api/admin";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const propTypes = {
  imgs: PropTypes.array
};

class PicturesWall extends React.Component {
  /* state = {
    previewVisible: false,  // 标识是否显示大图预览的Modal
    previewImage: '', // 大图的url
    previewTitle: '',
    fileList: [
      {
        uid: '-1',  //每个file文件的id
        name: 'image.png',  //图片文件名
        status: 'done', //图片的状态  done：已上传；uploading：正在上传；removed：已删除
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',  //图片地址
      }
    ],
  }; */
  
  constructor (props) {
    super(props);
    const fileList = [];
    const { imgs } = this.props;
    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => (
        img ? {
          uid: -index,
          name: img.name,
          status: 'done',
          url: img.url
        } : {}));
    }
    //初始状态
    this.state = {
      previewVisible: false,  // 标识是否显示大图预览的Modal
      previewImage: '', // 大图的url
      previewTitle: '',
    };
  };

  handleCancel = () => this.setState({ previewVisible: false });

  //显示file指定的大图
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  /**
   * file: 当前操作的图片文件(上传/删除)
   * fileList:所有已上传图片文件对象的数组
   */
  handleChange = async ({file, fileList }) => {
    //一旦上传成功，将当前上传的file的信息修正(name, url)
    if (file.status === 'done') {
      const result = file.response; // {status: 0, data: {name: 'xxx.jpg, url: 'address'}}
      if (result.status === 0) {
        message.success('上传成功');
        const { name, url } = result.data;
        file = fileList[fileList.length - 1]
        file.name = name;
        file.url = url;
      } else {
        message.error('上传失败');
      }
    } else if (file.status === 'removed') {// 删除图片
      const result = await DeleteImg(file.name)
      if (result.status === 0) {
        message.success('删除图片成功');
      } else {
        message.error('删除图片失败');
      }
    }

    //在操作(上传/删除)过程中更新filelist状态
    this.setState({ fileList });
  };
  
  // 获取所有已上传图片文件名的数组
  getImgs = () => {
    return this.state.fileList.map(file => file.name);
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action={`${BASE_URL}/manage/img/upload`}  //上传图片的接口地址
          accept="image/*"  //只接收图片格式
          name="image"  //请求参数名
          listType="picture-card" //卡片格式
          fileList={fileList} // 所以已上传图片文件对象的数组
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

PicturesWall.propTypes = propTypes;

ReactDOM.render(<PicturesWall />, mountNode);
