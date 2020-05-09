import * as functions from 'firebase-functions';

// @ts-ignore
import Compute = require('@google-cloud/compute');
import { IServer } from '../../../src/shared/models/server.model';

export const serverListener = functions.firestore.document('/servers/{serverUid}').onUpdate(async (snap, context) => {
  const before: IServer = snap.before.data() as IServer;
  const after: IServer = snap.after.data() as IServer;

  if (before.status === 'active' && after.status === 'deleted') {
    return await deleteServer(after);
  }

  return 'Not a delete so not handled';
});

const deleteServer = async (server: IServer) => {
  try {
    const vmName = server.vmInfo.vmName; // Must be lowercase // TODO make the hash the same as the FS Collection
    const deleteRequestFull: IDeleteRequest = {
      vmName,
      zone: server.vmInfo.zone,
      region: server.vmInfo.region,
      diskName: server.vmInfo.diskName,
      addressName: server.vmInfo.addressName
    };

    const compute = new Compute();
    const computeZone = compute.zone(deleteRequestFull.zone);
    const computeRegion = compute.region(deleteRequestFull.region);

    // Delete External Disk
    // TODO get disks from vm and either move to long term cold storage HDD or delete it

    // Delete Address
    const computeAddress = computeRegion.address(deleteRequestFull.addressName);

    const [, deleteAddressRes] = await computeAddress.delete();
    console.log('deleteAddressRes: ' + JSON.stringify(deleteAddressRes));

    // Delete VM
    const computeVM = computeZone.vm(deleteRequestFull.vmName);

    const [, deleteVmRes] = await computeVM.delete();
    console.log('deleteVmRes: ' + JSON.stringify(deleteVmRes));

    return `Success! The VM and IP have been removed`;
  } catch (e) {
    throw e;
  }
};

interface IDeleteRequest {
  vmName: string;
  zone: string;
  region: string;
  diskName: string;
  addressName: string;
}
