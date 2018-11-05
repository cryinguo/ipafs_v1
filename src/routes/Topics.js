// export default Topics;
import React, { Component } from 'react'
import { Table, Button, FormGroup, ControlLabel, FormControl, Modal } from 'react-bootstrap';
import './Topics.css'
import config from '../config'
import ipfs from '../eth-ipfs/ipfs'
//import { AsyncParallelBailHook } from 'tapable';

class Topics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileName: '',
            fileHash: '',
            blockNum: '',
            txHash: '',
            owner: '',
            needLogin: false,
            show: false,
            detailshow: false
        }
    }

    getDetails(filehash_) {
        fetch(config.express.url + config.express.port + "/search?filePara=" + filehash_)
            .then(res => res.text())
            .then(res => {
                console.log("file111 :", JSON.parse(res));
                var file = JSON.parse(res)[0]
                console.log(file.hash)
                this.setState({ fileHash: file.hash });
                this.setState({ blockNum: file.blockNum });
                this.setState({ txHash: file.txhash });
                this.setState({ owner: file.userName });
            })
    }

    getDataRow(h) {
        let row = document.createElement('tr'); //创建行
        var link = "http://120.78.71.240:8000/ipfs/" + h.hash;
        var fileName = document.createElement('td');//创建第一列fileName
        var Hyperlink = document.createElement('a');//创建a标签
        fileName.innerHTML = h.name;

        Hyperlink.appendChild(fileName);
        Hyperlink.setAttribute('href', link);
        Hyperlink.setAttribute('class', 'topicsLink')
        Hyperlink.setAttribute('target', '_blank')
        console.log(fileName);
        row.appendChild(Hyperlink);

        // var fileHash = document.createElement('td');//创建第二列fileHash
        // fileHash.innerHTML = h.hash;
        // row.appendChild(fileHash);
        // var fileOwner = document.createElement('td');//创建第三列fileOwner
        // fileOwner.innerHTML = h.userName;
        // row.appendChild(fileOwner);
        var detailsCell = document.createElement('td');//创建第二列，详情列
        row.appendChild(detailsCell);
        var details = document.createElement('input'); //创建一个input控件
        details.setAttribute('type', 'button'); //type="button"
        details.setAttribute('value', '详情');
        var downloadCell = document.createElement('td');//创建第三列，操作列
        row.appendChild(downloadCell);
        var btnDownload = document.createElement('input'); //创建一个input控件
        btnDownload.setAttribute('type', 'button'); //type="button"
        btnDownload.setAttribute('value', '下载');

        //查看详情
        details.onclick = async () => {
            await this.getDetails(h.hash)
            await this.detailopen();
        }


        //下载操作
        btnDownload.onclick = async () => {
            let fileName = h.name;
            let down = this.downFile;
            await ipfs.get(h.hash, function (err, files) {
                if (err) console.log("ipfsGetErr", err);
                files.forEach((file) => {
                    //console.log(typeof(file.content))
                    //console.log(file.content)
                    let blob = new Blob([file.content], { type: '' });
                    //console.log(blob);
                    down(blob, fileName)

                })

            })
        };
        downloadCell.appendChild(btnDownload);  //把下载按钮加入td
        detailsCell.appendChild(details);  //把下载按钮加入td
        return row;
    }

    searchFile = () => {
        if (!sessionStorage.getItem('un')) {
            this.needLoginOpen();
            //alert("请先登录账号！");
            return;
        }
        if (document.getElementById('filePara').value === '') {
            this.open();
            return;
        }
        console.log("search file : ", document.getElementById('filePara').value);
        fetch(config.express.url + config.express.port + "/search?filePara=" + document.getElementById('filePara').value)
            .then(res => res.text())
            .then(res => {
                console.log("file :", JSON.parse(res));
                var file = JSON.parse(res)
                var tbody = document.getElementById('tbMain');

                //this.detailopen()
                if (file.length > 0) {

                    console.log("lll",tbody.childNodes.length)
                    let len = tbody.childNodes.length;
                    if (len !== 1) {
                        for (let i = len-1; i > 0; i--) {
                            console.log("l",i,tbody.childNodes[i])
                            tbody.removeChild(tbody.childNodes[i])
                        }
                    }

                    for (var i = 0; i < file.length; i++) { //遍历一下json数据
                        
                        var trow = this.getDataRow(file[i]); //定义一个方法,返回tr数据
                        console.log('--------')
                        tbody.appendChild(trow);

                    }
                }
                else {
                    this.open()
                }
            })
    }

    downFile(blob, fileName) {
        // if (!window.navigator.msSaveOrOpenBlob) {
        //     navigator.msSaveBlob(blob, fileName);
        // } else {
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(link.href);
        // }
    }
    /*
        download = async() => {
            let fileName = this.state.fileName;
            let down = this.downFile;
            await ipfs.get(this.state.fileHash, function (err, files) {
                if (err) console.log("ipfsGetErr", err);
                files.forEach((file) => {
                    //console.log(typeof(file.content))
                    //console.log(file.content)
                    let blob = new Blob([file.content], { type: '' });
                    //console.log(blob);
                    down(blob, fileName)
                })
            }) 
        } 
        */
    //开启找结果弹窗
    close = () => this.setState({ show: false });
    open = () => this.setState({ show: true });

    //文件详情弹窗
    detailclose = () => this.setState({ detailshow: false });
    detailopen = () => this.setState({ detailshow: true });

    needLoginOpen = () => this.setState({ needLogin: true });
    needLoginClose = () => this.setState({ needLogin: false });

    handleKey = (e) => {
        let self = this;
        if (e.keyCode === 13) self.searchFile();
      }

    render() {
        return (

            <div className='Topics'>
                <header className='Topics-Header'>

                    <h2>Topics</h2>
                </header>
                <hr />
                <div className='TopicBody'>
                    <div onKeyDown={this.handleKey} >
                        <FormGroup>
                            <ControlLabel>fileName or fileHash</ControlLabel>{' '}
                            <FormControl id="filePara"
                                placeholder="example:'keyworld'or 'fullname' or 'QmcFc6EPhavNSfdjG8byaxxV6KtHZvnDwYXLHvyJQPp3uN'" />
                        </FormGroup>{' '}
                        <Button
                            id="button_press"
                            onClick={this.searchFile}>
                            Search
                        </Button>
                    </div>
                    <Table  striped bordered condensed hover>
                        <thead>
                            <tr>
                                <th>File Name</th>
                                <th>Details</th>
                                <th>Operation</th>
                            </tr>
                        </thead>
                        <tbody id="tbMain">
                            <tr>
                            </tr>
                        </tbody>
                    </Table>
                    {/*<Button onClick = {this.downloadFile}>Download</Button>*/}
                </div>



                {/*查找结果 */}
                <Modal show={this.state.show} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>查找结果</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Search result</p>

                        <hr />

                        <center><h4>未找到相关文件！</h4></center>
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

                <Modal show={this.state.detailshow} onHide={this.detailclose}>
                    <Modal.Header closeButton>
                        <Modal.Title>文件存储详情</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Details of the files</p>

                        <hr />
                        <p>作者: {this.state.owner}</p>
                        <p>文件Hash: {this.state.fileHash}</p>
                        <p>交易hash: {this.state.txHash} </p>
                        <p>区块号：    {this.state.blockNum}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.detailclose}>取消</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default Topics;