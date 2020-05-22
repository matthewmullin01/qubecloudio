import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { IServer } from '../../../src/shared/models/server.model';
import Compute = require('@google-cloud/compute');

// export const auditCron = functions.pubsub.schedule('0 0/6 * * *').onRun(async (context) => {
export const auditCron = functions.https.onRequest(async (req, res) => {
  const compute = new Compute() as any;

  const servers = (await admin.firestore().collection(`/servers`).get()).docs.map((a) => a.data()) as IServer[];

  const [vms] = (await compute.getVMs()) as [{ metadata: IVMMetadata }[]];

  // Ensure all VMS running
  const nonRunningVMs = vms.filter((vm) => vm.metadata.status !== 'RUNNING');

  if (nonRunningVMs.length > 0) {
    console.error(`The Following VMs are not running - ${nonRunningVMs.map((vm) => vm.metadata.name).join(', ')}`);
  }

  // Ensure all running Firebase Servers have a corresponding VM and vice versa
  const activeServers = servers.filter((a) => a.status === 'active');
  const activeServersVMName = activeServers.map((a) => a.vmInfo.vmName);

  const activeVms = vms.filter((vm) => vm.metadata.status === 'RUNNING');
  const activeVMsName = activeVms.map((a) => a.metadata.name);

  const differenceServers = activeServersVMName.filter((x) => !activeVMsName.includes(x));
  if (differenceServers.length > 0) {
    console.error(`The Following active FB Servers don't have a corresponding VM - ${differenceServers.join(', ')}`);
  }

  const differenceVMs = activeVMsName.filter((x) => !activeServersVMName.includes(x));
  if (differenceVMs.length > 0) {
    console.error(`The Following RUNNING VMS don't have a corresponding FB Server - ${differenceVMs.join(', ')}`);
  }

  // TODO add check for External IPs and Disks matching each VM (so we don't have any hanging IPs/Disks)

  return res.status(200).send();
  //   return 'Done';
});

interface IVMMetadata {
  id: string;
  creationTimestamp: Date;
  name: string;
  description: string;
  tags: any;
  machineType: string;
  status: string | 'RUNNING';
  zone: string;
  canIpForward: boolean;
  networkInterfaces: any[];
  disks: any[];
  metadata: any;
  serviceAccounts: any[];
  selfLink: string;
  scheduling: any;
  cpuPlatform: string;
  labelFingerprint: string;
  startRestricted: boolean;
  deletionProtection: boolean;
  reservationAffinity: any;
  displayDevice: any;
  shieldedInstanceConfig: any;
  shieldedInstanceIntegrityPolicy: any;
  fingerprint: string;
  kind: string;
}
