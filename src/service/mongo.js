const Mongolass = require('mongolass')
// const fs = require("fs");
// const ipfs = require('../eth-ipfs/ipfs');
const config = require('../config')
const Rx = require('rxjs/Rx');

// const mongolass = new Mongolass
// mongolass.connect(config.mongodb)

let self
class Mongo {
    constructor() {
        self = this
        self.download$ = new Rx.Subject()
        self.storeInMongo$ = new Rx.Subject()
        this.mongolass = new Mongolass(config.db.url)
        this.file = this.mongolass.model('ipfsfiles', {
            userName: { type: 'string'},
            name: { type: 'string' },
            hash: { type: 'string' },
            blockNum: {type: 'string'},
            txhash: {type: 'string'}
        })    
    }

    storgeFile( uname_, name_, hash_ , blockNumber_, txhash_,) {
        this.file
            .insertOne({ userName: uname_, name: name_, hash: hash_, blockNum: blockNumber_, txhash:txhash_})
            .exec()
            .then( () => {
                //console.log("data saved"),
                self.storeInMongo$.next("data saved")
            })
            .catch(function (e) {
              console.error(e)
              console.error(e.stack)
            })
    }

    deleteOneFile(name_) {
        this.file.deleteOne({ name: name_ })
            .exec()
            .then(() => console.log("success"))
    }

    searchFile (para) {
        console.log("searching...", para);
        if (para.length === 46 && para.indexOf("Qm") === 0) {            
            return (this.file
                .find({'hash': eval("/"+para+"/i")})
                .exec())

        } else {
            return (this.file
                .find({'name': eval("/"+para+"/i")})
                .exec())
        }  
    }

    searchByUser (uname) {
        console.log("searching user file ...", uname);
        return (this.file
            .find({'userName': uname})
            .exec()
        )
    }
    searchByfileHash (fileHash) {
        console.log("searching fileHash ...", fileHash);
        return (this.file
            .find({'hash': fileHash})
            .exec()
        )
        if (err){
            console.log("查找错误"+err)
        }
    }


/*
    async downloadFile (cid, fileName) {
        console.log("download file ",cid,fileName)
        await ipfs.files.get(cid, function (err, files) {
            if (err) console.log("ipfsGetErr", err);
            files.forEach((file) => {
                console.log("downloading file0 :",file.path)
                //console.log(file.content.toString('utf8'))
                fs.writeFile("./download/" + fileName, file.content.toString('utf8'), err => {
                    if(err) console.log("fs.write Err:",err);
                    console.log("downloading finished")
                })
            })
        })
    }
*/
}

module.exports = Mongo;

