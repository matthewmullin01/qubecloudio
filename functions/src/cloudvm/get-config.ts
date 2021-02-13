// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';

// // @ts-ignore
// import Compute = require('@google-cloud/compute');
// import { IServer, IVMConfig } from '../../../src/shared/models/server.model';
// import { IPlan } from '../../../src/shared/models/plan.model';

// //
// export const getConfig = functions.https.onRequest(async (req, res) => {
//   // .https.onRequest(async (request, response) => {

//   const server: IServer = snap.data() as IServer;

//   try {
//     const vmName = `mc-server-${server.uid.toLocaleLowerCase()}`; // Must be lowercase
// TODO make the hash the same as the FS Collection
//     const vmConfig: IVMConfig = {
//       vmName,
//       zone: `${server.location}-b`,
//       region: server.location,
//       machineType: getMachineTypeFromPlan(server.planId),
//       publicIP: '',
//       diskName: `${vmName}-disk`,
//       addressName: `${vmName}-ip`,
//       minecraftServerJarURL: server.jarUrl
//     };

//     // sudo mount /dev/disk/by-id/google-mc-server-dfg1237ys-disk /home/minecraft

//     // echo "UUID=$DISKUUID /mnt/disks/home/minecraft ext4 discard,defaults,nofail 0 2" >> /etc/fstab

//     const compute = new Compute() as any;
//     const computeRegion = compute.region(vmConfig.region);
//     const publicIP = await createPublicIP(vmConfig, computeRegion);
//     vmConfig.publicIP = publicIP;
//     const computeZone = compute.zone(vmConfig.zone);
//     const vm = computeZone.vm(vmName);
//     const [, operation] = await vm.create(createVmConfig(vmConfig));
//     await operation.promise();

//     const updatedServerDetails: IServer = { ...server, ...{ vmInfo: vmConfig } };
//     await updateDatabase(updatedServerDetails);

//     return `Success! You can access your server using this IP - ${vmConfig.publicIP}`;
//   } catch (e) {
//     throw e;
//   }
// });

// const createVmConfig = (vmConfig: IVMConfig): any => {
//   return {
//     kind: 'compute#instance',
//     name: vmConfig.vmName,
//     zone: `projects/minecraft-63461/zones/${vmConfig.zone}`,
//     machineType: `projects/minecraft-63461/zones/${vmConfig.zone}/machineTypes/${vmConfig.machineType}`,
//     displayDevice: {
//       enableDisplay: false
//     },
//     metadata: {
//       kind: 'compute#metadata',
//       items: [
//         {
//           key: 'startup-script',
//           value: `
//             #!/bin/sh

//             if [ -f "/alreadyStartedIndicator" ]; then
//                 # If server.jar exists then just start it up (probably a restart)
//                 echo "alreadyStartedIndicator file already exists"
//                 # sudo mkdir -p /home/minecraft
//                 # sudo mount /dev/disk/by-id/google-${vmConfig.diskName} /home/minecraft
//                 sudo su
//                 cd /home/minecraft
//                 screen -L logfile.log -dmS mcs java -Xms1G -Xmx3G -d64 -jar server.jar nogui
//             else
//                 sudo touch /alreadyStartedIndicator

//                 # Else probably a new deploy
//                 echo "alreadyStartedIndicator file doesnt exist. Creating new server"
//                 # install JRE
//                 sudo apt-get update
//                 sudo apt-get install -y default-jre-headless

//                 # Make /minecraft folder, then format and mount disk
//                 sudo mkdir -p /home/minecraft
//                 sudo mkfs.ext4 -F -E lazy_itable_init=0,lazy_journal_init=0,discard /dev/disk/by-id/google-${vmConfig.diskName}
//                 sudo mount -o discard,defaults /dev/disk/by-id/google-${vmConfig.diskName} /home/minecraft

//                 # Persist the mounted disk
//                 sudo su
//                 DISKUUID=$(sudo blkid /dev/disk/by-id/google-${vmConfig.diskName} | cut -d'"' -f 2)
//                 echo "UUID=$DISKUUID /home/minecraft ext4 discard,defaults,nofail 0 2" >> /etc/fstab

//                 # Download and configure server
//                 cd /home/minecraft
//                 wget ${vmConfig.minecraftServerJarURL}
//                 java -Xms1G -Xmx3G -d64 -jar server.jar nogui
//                 sed 's/eula=false/eula=true/g' eula.txt > eula2.txt; mv eula2.txt eula.txt
//                 # can update server properties file here to configure more

//                 # Runs server in background process
//                 apt-get install -y screen
//                 screen -L logfile.log -dmS mcs java -Xms1G -Xmx3G -d64 -jar server.jar nogui
//             fi

//             EOF
//             `
//         }
//       ]
//     },
//     tags: {
//       items: ['minecraft-server']
//     },
//     disks: [
//       {
//         kind: 'compute#attachedDisk',
//         type: 'PERSISTENT',
//         boot: true,
//         mode: 'READ_WRITE',
//         autoDelete: true,
//         deviceName: vmConfig.vmName,
//         initializeParams: {
//           sourceImage: 'projects/debian-cloud/global/images/debian-9-stretch-v20200309',
//           diskType: `projects/minecraft-63461/zones/${vmConfig.zone}/diskTypes/pd-ssd`,
//           diskSizeGb: '10'
//         },
//         diskEncryptionKey: {}
//       },
//       {
//         kind: 'compute#attachedDisk',
//         mode: 'READ_WRITE',
//         autoDelete: false,
//         type: 'PERSISTENT',
//         deviceName: vmConfig.diskName,
//         initializeParams: {
//           diskName: vmConfig.diskName,
//           diskType: `projects/minecraft-63461/zones/${vmConfig.zone}/diskTypes/pd-ssd`,
//           diskSizeGb: '10'
//         }
//       }
//     ],
//     canIpForward: false,
//     networkInterfaces: [
//       {
//         kind: 'compute#networkInterface',
//         subnetwork: `projects/minecraft-63461/regions/${vmConfig.region}/subnetworks/default`,
//         accessConfigs: [
//           {
//             kind: 'compute#accessConfig',
//             name: 'External NAT',
//             type: 'ONE_TO_ONE_NAT',
//             natIP: vmConfig.publicIP,
//             networkTier: 'PREMIUM'
//           }
//         ],
//         aliasIpRanges: []
//       }
//     ],
//     description: '',
//     labels: {},
//     scheduling: {
//       preemptible: false,
//       onHostMaintenance: 'MIGRATE',
//       automaticRestart: true,
//       nodeAffinities: []
//     },
//     deletionProtection: false,
//     reservationAffinity: {
//       consumeReservationType: 'ANY_RESERVATION'
//     },
//     serviceAccounts: [
//       {
//         email: '962302234098-compute@developer.gserviceaccount.com',
//         scopes: [
//           'https://www.googleapis.com/auth/servicecontrol',
//           'https://www.googleapis.com/auth/service.management.readonly',
//           'https://www.googleapis.com/auth/logging.write',
//           'https://www.googleapis.com/auth/monitoring.write',
//           'https://www.googleapis.com/auth/trace.append',
//           'https://www.googleapis.com/auth/devstorage.read_write'
//         ]
//       }
//     ]
//   };
// };

// const createPublicIP = async (vmConfig: IVMConfig, computeRegion: any): Promise<string> => {
//   const computeAddress = computeRegion.address(vmConfig.addressName);
//   await computeAddress.create({ networkTier: 'PREMIUM' });
//   // TODO poll or find a better way to return IP. When reading result immediately there is no address
//   await new Promise(_ => setTimeout(_, 3000));
//   const [, addressResult] = await computeAddress.get();
//   const externalIP = addressResult.address;

//   if (!externalIP) {
//     throw new Error('externalIP not returned. Maybe increase timeout');
//   }

//   return externalIP;
// };

// const getMachineTypeFromPlan = (planId: IPlan['id']): string => {
//   switch (planId) {
//     case 'starter':
//       return 'f1-micro';
//     case 'regular':
//       return 'g1-small';
//     case 'pro':
//       return 'n1-standard-1';
//     case 'super':
//       return 'n1-standard-1';
//     case 'ultra':
//       return 'n1-standard-2';
//   }
// };

// const updateDatabase = async (updatedServerDetails: IServer) => {
//   await admin
//     .firestore()
//     .doc(`/servers/${updatedServerDetails.uid}`)
//     .update(updatedServerDetails);
// };
