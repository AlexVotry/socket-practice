const os = require('os');
const io = require('socket.io-client');
const { clearInterval } = require('timers');
let socket = io('http://127.0.0.1:8181');

socket.on('connect', () => {
  // we need a way to identify this machine to whoemever concerned.
  const networkInterfaces = os.networkInterfaces();
  let macA;
  // loop through all the network interfaces for this machine and find the non-internal MAC
  for(let key in networkInterfaces) {
    if(!networkInterfaces[key][0].internal) {
      macA = networkInterfaces[key][0].mac;
      break;
    }
  }
  socket.emit('clientAuth', 'authKey');
  performanceData().then(allPerformanceData => {
    allPerformanceData.macA = macA;
    socket.emit('initPerfData',allPerformanceData);
  });
  
  // start sending over
  let perfDataInterval = setInterval(() => {
    performanceData().then(allPerformanceData => {
      allPerformanceData.macA = macA;
      socket.emit('perfData',allPerformanceData)
    });
  }, 1000);

  socket.on('disconnect', () => {
    clearInterval(perfDataInterval);
  });

});

function performanceData() {
  return new Promise(async(resolve, reject) => {
    const upTime = os.uptime();
    const cpus = os.cpus() || 'no data';
    const freemem = os.freemem() || 'no data';
    const totalmem = os.totalmem() || 'no data';
    const usedMem = totalmem - freemem;
    const memUseage = Math.floor(usedMem/totalmem * 100) / 100;
    const osType = os.type() || 'no data';
    const cpuModel = cpus[0].model;
    const numCores = cpus.length;
    const cpuSpeed = cpus[0].speed;
    const cpuLoad = await getCpuLoad();
    resolve({
      freemem,
      totalmem,
      usedMem,
      memUseage,
      osType,
      upTime,
      cpuModel,
      numCores,
      cpuSpeed,
      cpuLoad
    })
  })
}


// cpus is all cores. we need the average o f all cores which will give us the cpu average.

function cpuAverage() {
  const cpus = os.cpus();

  // get ms in each mode, BUT this number is since reboot.
  // so get it now, and get it in 100ms and compare.
  let idleMs = 0;
  let totalMs = 0;
  // loo through each core
  cpus.forEach((aCore)=> {
    // loop through each property of the current core
    for(type in aCore.times) {
      totalMs += aCore.times[type];
    }
    idleMs += aCore.times.idle;
  });
  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length
  }
}

function getCpuLoad() {
  return new Promise((resolve, reject) => {
    const start = cpuAverage();
    setTimeout(() => {
      const end = cpuAverage();
      const idleDifference = end.idle - start.idle;
      const totalDiff = end.total - start.total;
      const percentageCpu = 100 - Math.floor(100 * idleDifference / totalDiff)
      resolve(percentageCpu);
    }, 100)
  })
}

// setInterval(() => {
//   performanceData().then(allPerformanceData => console.log('perfData', allPerformanceData))
// }, 1000);

