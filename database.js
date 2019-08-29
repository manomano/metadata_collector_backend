let mongoose = require('mongoose');


const server = process.env.MONGO_SERVER;
const database = process.env.MONGO_DATABASE;


//mongoose.connect('mongodb://root:Li_ughah9ahb@mongo3.napr.gov.ge:27017,mongo4.napr.gov.ge:27017,mongo3.napr.gov.ge:27017/metadataeditor');
const options = {
    //ssl: true,
    //sslValidate: true,
    //poolSize: 5,
    //reconnectTries: 5,
    //useNewUrlParser: true,
    dbName: 'metadataeditor',
    //replicaSet:'napr'
}





class Database {
    constructor() {
        this._connect()
    }

    _connect() {
        //mongoose.connect(`mongodb://${server}/${database}`,{ useNewUrlParser: true/*,  autoIndex: false*/ } )
        mongoose.connect('mongodb://root:Li_ughah9ahb@mongo3.napr.gov.ge:27017,mongo4.napr.gov.ge:27017,mongo5.napr.gov.ge:27017/?replicaSet=napr&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-256&3t.uriVersion=3', options)
            .then(() => {
                console.log('Database connection successful')
            })
            .catch(err => {
                console.error('Database connection error '+err)
            })
    }
}

module.exports = new Database()
