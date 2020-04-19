import * as functions from 'firebase-functions';

// @ts-ignore
import Compute = require('@google-cloud/compute');

export const deleteServer = functions.https.onRequest(async (request, response) => {
  try {
    const vmName = 'mc-server-qwerty324'; // Must be lowercase // TODO make the hash the same as the FS Collection
    const deleteRequest: DeleteRequest = {
      vmName,
      zone: 'europe-west1-b'
    };

    const deleteRequestFull: DeleteRequestFull = {
      ...deleteRequest,
      ...{
        region: deleteRequest.zone
          .split('-')
          .filter((_, index) => index < 2)
          .join('-'),
        diskName: `${deleteRequest.vmName}-disk`,
        publicIP: `${deleteRequest.vmName}-ip`
      }
    };

    const compute = new Compute();
    const computeZone = compute.zone(deleteRequestFull.zone);
    const computeRegion = compute.region(deleteRequestFull.region);

    // Delete External Disk
    // TODO get disks from vm and either move to long term cold storage HDD or delete it

    // Delete Address
    const computeAddress = computeRegion.address(deleteRequestFull.publicIP);

    const [, deleteAddressRes] = await computeAddress.delete();
    console.log('deleteAddressRes: ' + JSON.stringify(deleteAddressRes));

    // Delete VM
    const computeVM = computeZone.vm(deleteRequestFull.vmName);

    const [, deleteVmRes] = await computeVM.delete();
    console.log('deleteVmRes: ' + JSON.stringify(deleteVmRes));

    response.send(`Success! The VM and IP have been removed`);
  } catch (e) {
    response.status(400).send('Error! ' + JSON.stringify(e));
  }
});

interface DeleteRequest {
  vmName: string;
  zone: string;
}

interface DeleteRequestFull extends DeleteRequest {
  region: string;
  diskName: string;
  publicIP: string;
}
