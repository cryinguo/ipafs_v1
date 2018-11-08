import React, { Component } from 'react'
import { Button, OverlayTrigger, Tooltip, DropdownButton, MenuItem, Modal } from 'react-bootstrap';

import './User.css'
import ipfs from '../eth-ipfs/ipfs'
import config from '../config'

class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            filestate: {},
            showModal: false,
            needLogin: false,
            fileshow: false

        }
        this.showMore = this.showMore.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
    }


    getFileList = async () => {

        console.log("uname:", sessionStorage.getItem('un'));
        if (!sessionStorage.getItem('un')) {
            this.needLoginOpen();
            // alert("请先登录账号！");
            return;
        }
        await ipfs.files.ls('/' + sessionStorage.getItem('un'), (err, files) => {
            this.setState({ files })
            files.map(file => console.log(file.name))

            // files.forEach((file) => {
            //   //console.log(file)

            //   this.setState((prevState) => ({
            //     counter: prevState.files.push(file)
            //   }));
            // })
        })
    }

    //后台获取文件
    // getFileList = async () => {
    //     fetch(config.express.url + config.express.port + "/searchByUser?userName=" + sessionStorage.getItem('un'))
    //     .then(res => res.text())
    //         .then(res => {
    //         console.log("file :", JSON.parse(res));
    //         var files = JSON.parse(res)
    //         if (files.length===0){
    //             this.noFileopen()
    //         }
    //         else{
    //             this.setState({files})
    //             //console.log("this.files:", this.files );
    //             files.map(file => console.log(file.name))

    //             // files.forEach((file) => {
    //             // this.setState((prevState) => ({
    //             //         counter: prevState.files.push(file)
    //             //     }))
    //             //     })
    //             }
    //     })
    // }

    showMore(file) {
        ipfs.files.stat('/' + sessionStorage.getItem('un') + '/' + file, (err, stats) => {
            console.log(stats)
            this.setState({ filestate: stats })
        })
    }

    deleteFile(file) {
        ipfs.files.rm('/' + sessionStorage.getItem('un') + '/' + file, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                //console.log("delete result: success");
            }
        })
        this.getFileList();

        fetch(config.express.url + config.express.port + "/deleteOne?name=" + file)
            .then(res => res.text())
            .then(res => {
                console.log(res)
            })
    }

    close = () => this.setState({ showModal: false });

    open = () => this.setState({ showModal: true });

    noFileclose = () => this.setState({ fileshow: false });

    noFileopen = () => this.setState({ fileshow: true });

    needLoginOpen = () => this.setState({ needLogin: true });
    needLoginClose = () => this.setState({ needLogin: false });

    render() {

        // const popover = (
        //     <Popover id="modal-popover" title="popover">
        //       very popover. such engagement
        //     </Popover>
        //   );
        //   const othertip = (
        //     <Tooltip id="modal-tooltip">
        //       wow.
        //     </Tooltip>
        //   );

        const tooltip = (
            <Tooltip id="tooltip"><strong>点击</strong> 删除该文件。</Tooltip>
        );

        const Detailtip = (
            <Tooltip id="tooltip"><strong>点击</strong> 查看文件详情。</Tooltip>
        );

        const Displaytip = (
            <Tooltip id="tooltip"><strong>点击</strong> 显示用户上传文件列表。</Tooltip>
        );

        return (
            <div id="userFileList" >
                <h2 >
                    User File
                    <OverlayTrigger placement="bottom" overlay={Displaytip}>
                        <Button className='display' bsStyle="primary" onClick={this.getFileList} style={{ "marginLeft": "100px" }}> Display </Button>
                    </OverlayTrigger>
                </h2>
                <h3>
                    <center style={{ color: 'black' }}>用户文件上传列表</center>
                </h3>
                <hr />

                <ul>
                    <div style={{ width: "50%", float: "left" }}>
                        {this.state.files.map(file =>
                            <li key={file.name}>
                                {file.name}
                                <DropdownButton className='dropBtn' bsSize="small" bsStyle={"default"} title={"选择"}>
                                    <OverlayTrigger placement="bottom" overlay={Detailtip}>
                                        <MenuItem eventKey="2" onSelect={this.open} onClick={this.showMore.bind(this, file.name)}>详情</MenuItem>
                                    </OverlayTrigger>
                                    <MenuItem divider />
                                    <OverlayTrigger placement="bottom" overlay={tooltip}>
                                        <MenuItem eventKey="1" onSelect={this.deleteFile.bind(this, file.name)}>删除</MenuItem>
                                    </OverlayTrigger>


                                </DropdownButton>
                                <hr />
                            </li>)}
                    </div>
                </ul>

                {/* <div style={{width:"45%", float:"right"}}>
                    <h4>类型： {this.state.filestate.type}</h4>
                    <h4>大小： {this.state.filestate.size}</h4>
                    <h4>Hash： {this.state.filestate.hash}</h4>

                </div>  */}
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>文件详情</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Details of the files</p>

                        <hr />

                        <p>类型： {this.state.filestate.type}</p>
                        <p>大小： {this.state.filestate.size} </p>
                        <p>Hash： {this.state.filestate.hash}</p>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.close}>取消</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.needLogin} onHide={this.needLoginClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>提示：</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <h4>请先登录账号！</h4>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.needLoginClose}>确定</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.fileshow} onHide={this.noFileclose}>
                    <Modal.Header closeButton>
                        <Modal.Title>提示</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <h4>您还没有上传文件，请上传后重试！</h4>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.noFileclose}>取消</Button>
                    </Modal.Footer>
                </Modal>

            </div>

        )
    }

}

export default User;