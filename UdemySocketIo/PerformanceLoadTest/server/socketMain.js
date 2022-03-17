const mongoose = require('mongoose');
// const {mongoClient} = require('mongodb');
const uri = "mongodb+srv://alexPerfLoadTest:Udemy$ocket@cluster0.dtqza.mongodb.net/perfData?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
// mongodb keys
// public: CFCITKQM
// private: a3098648-2093-41df-a404-9c31c9c3db58
// https://cloud.mongodb.com/v2/5fc2a205f0269321ec02be8f#metrics/replicaSet/5fc2a40d7e55a97096087960/explorer/perfData/machines/find

const Machine = require('./models/Machine');

function socketMain(io, socket) {
  let macA;
  socket.on('clientAuth', (key) => {
    if (key === 'authKey') {
      socket.join('clients');
    } else if(key === "something else") {
      socket.join('ui');
      console.log('a react client has joined')
    } else {
      // invalid client
      console.log('invalid client key')
      socket.disconnect(true);
    }
  })
  // a machine has connected, if new, add it.
  socket.on('initPerfData', async data => {
    console.log('initPerfData')
    macA = data.macA;
    const mongooseResponse = await checkAndAdd(data);
    console.log('mongooseRespone:', mongooseResponse);
  })
  
  socket.on('perfData', data => io.to('ui').emit('data', data));
}

function checkAndAdd(data) {
  return new Promise((resolve, reject) => {
    Machine.findOne(
      {macA: data.macA},
      (err, doc) => {
        if(err) {
          throw err;
          reject(err);
        } else if(doc === null) {
          let newMachine = new Machine(data);
          newMachine.save();
          resolve('added');
        }else {
          resolve('found');
        }
      }
    )
  })
}

module.exports = socketMain;